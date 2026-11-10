import assert from 'node:assert/strict';
import test, { before, after } from 'node:test';
import mongoose from 'mongoose';

Object.assign(process.env, {
  NODE_ENV: 'test',
  MONGO_URI: '',
  JWT_SECRET: 'isolated-test-signing-secret-at-least-32-characters',
  ADMIN_EMAIL: 'admin@example.test',
  ADMIN_PASSWORD: 'isolated-test-password',
  GOOGLE_SHEETS_WEBHOOK_URL: '',
  GOOGLE_SHEETS_SECRET_TOKEN: '',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: ''
});

const { default: app } = await import('../src/app.js');
const { BusinessProfile } = await import('../src/models/BusinessProfile.js');
const { Service } = await import('../src/models/Service.js');
const { Project } = await import('../src/models/Project.js');
const { Review } = await import('../src/models/Review.js');

let server, origin, adminToken;

async function request(path, { method = 'GET', token, body, headers = {} } = {}) {
  const response = await fetch(origin + '/api' + path, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  return { status: response.status, data, headers: response.headers };
}

function databaseUp(t) {
  const previous = Object.getOwnPropertyDescriptor(mongoose.connection, 'readyState');
  Object.defineProperty(mongoose.connection, 'readyState', { configurable: true, value: 1 });
  t.after(() => {
    if (previous) Object.defineProperty(mongoose.connection, 'readyState', previous);
    else delete mongoose.connection.readyState;
  });
}

before(async () => {
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'ADMIN@example.test', password: process.env.ADMIN_PASSWORD }
  });
  assert.equal(loginRes.status, 200);
  adminToken = loginRes.data.token;
});

after(async () => {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});

test('BusinessProfile endpoints enforce auth on writes and serve public reads', async () => {
  const publicRead = await request('/business-profile');
  assert.equal(publicRead.status, 200);
  assert.equal(typeof publicRead.data, 'object');

  const unauthPut = await request('/business-profile', {
    method: 'PUT',
    body: { displayName: 'Hacked Name' }
  });
  assert.equal(unauthPut.status, 401);
});

test('Services endpoints enforce auth on writes and serve public reads', async () => {
  const publicRead = await request('/services');
  assert.equal(publicRead.status, 200);
  assert.ok(Array.isArray(publicRead.data));

  const unauthPost = await request('/services', {
    method: 'POST',
    body: { title: 'Service', description: 'Desc' }
  });
  assert.equal(unauthPost.status, 401);

  const unauthPut = await request('/services/test-slug', {
    method: 'PUT',
    body: { title: 'Updated' }
  });
  assert.equal(unauthPut.status, 401);

  const unauthDel = await request('/services/test-slug', {
    method: 'DELETE'
  });
  assert.equal(unauthDel.status, 401);
});

test('Projects endpoints enforce auth on writes and serve public reads', async () => {
  const publicRead = await request('/projects');
  assert.equal(publicRead.status, 200);
  assert.ok(Array.isArray(publicRead.data));

  const unauthPost = await request('/projects', {
    method: 'POST',
    body: { title: 'Project', description: 'Desc' }
  });
  assert.equal(unauthPost.status, 401);

  const unauthPut = await request('/projects/test-slug', {
    method: 'PUT',
    body: { title: 'Updated' }
  });
  assert.equal(unauthPut.status, 401);

  const unauthDel = await request('/projects/test-slug', {
    method: 'DELETE'
  });
  assert.equal(unauthDel.status, 401);
});

test('Reviews endpoints enforce mandatory consent, validation, and auth', async t => {
  databaseUp(t);

  // Missing consent
  const noConsent = await request('/reviews', {
    method: 'POST',
    body: {
      customerName: 'Client',
      rating: 5,
      feedback: 'Excellent materials supplied for our project in Dubai.',
      privacyConsent: false
    }
  });
  assert.equal(noConsent.status, 400);

  // Short feedback
  const shortFeedback = await request('/reviews', {
    method: 'POST',
    body: {
      customerName: 'Client',
      rating: 5,
      feedback: 'Good',
      privacyConsent: true
    }
  });
  assert.equal(shortFeedback.status, 400);

  // Links in feedback rejected
  const linkSpam = await request('/reviews', {
    method: 'POST',
    body: {
      customerName: 'Client',
      rating: 5,
      feedback: 'Visit https://spamsite.example for cheap deals on materials',
      privacyConsent: true
    }
  });
  assert.equal(linkSpam.status, 400);

  // Invalid rating
  const invalidRating = await request('/reviews', {
    method: 'POST',
    body: {
      customerName: 'Client',
      rating: 6,
      feedback: 'Excellent materials and services all around.',
      privacyConsent: true
    }
  });
  assert.equal(invalidRating.status, 400);

  // Valid submission forces pending status
  t.mock.method(Review, 'create', async (payload) => {
    assert.equal(payload.status, 'pending');
    assert.equal(payload.privacyConsent, true);
    assert.equal(payload.customerName, 'Genuine Client');
    return { _id: '507f1f77bcf86cd799439019', ...payload };
  });

  const validSubmission = await request('/reviews', {
    method: 'POST',
    body: {
      customerName: 'Genuine Client',
      rating: 5,
      feedback: 'Outstanding architectural finishes and prompt site delivery in Dubai.',
      privacyConsent: true,
      status: 'published' // attempting to bypass status
    }
  });
  assert.equal(validSubmission.status, 201);

  // Unauth admin update/delete
  const unauthPut = await request('/reviews/507f1f77bcf86cd799439019', {
    method: 'PUT',
    body: { status: 'published' }
  });
  assert.equal(unauthPut.status, 401);

  const unauthDel = await request('/reviews/507f1f77bcf86cd799439019', {
    method: 'DELETE'
  });
  assert.equal(unauthDel.status, 401);
});
