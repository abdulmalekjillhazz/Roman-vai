import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import test, { before, after, beforeEach } from 'node:test';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Never load real deployment credentials or contact an external provider.
Object.assign(process.env, {
  NODE_ENV: 'test', MONGO_URI: '', JWT_SECRET: 'isolated-test-signing-secret-at-least-32-characters',
  ADMIN_EMAIL: 'admin@example.test', ADMIN_PASSWORD: 'isolated-test-password',
  GOOGLE_SHEETS_WEBHOOK_URL: '', GOOGLE_SHEETS_SECRET_TOKEN: '',
  CLOUDINARY_CLOUD_NAME: '', CLOUDINARY_API_KEY: '', CLOUDINARY_API_SECRET: ''
});
const { default: app } = await import('../src/app.js');
const { Product } = await import('../src/models/Product.js');
const { Category } = await import('../src/models/Category.js');
const { FAQ } = await import('../src/models/FAQ.js');
const { HeroSlide } = await import('../src/models/HeroSlide.js');
const { AdminSession } = await import('../src/models/AdminSession.js');
const { User } = await import('../src/models/User.js');
const { cloudinary } = await import('../src/config/cloudinary.js');
const { MATERIAL_HERO_SLIDES } = await import('../../src/config/materialHeroSlides.js');
const heroKey = MATERIAL_HERO_SLIDES[0].file;
const userId = '507f1f77bcf86cd799439011';
let server, origin, adminToken;

async function request(path, { method = 'GET', token, body, raw, headers = {} } = {}) {
  const response = await fetch(origin + '/api' + path, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
    body: raw ?? (body ? JSON.stringify(body) : undefined)
  });
  const data = await response.json();
  return { status: response.status, data, headers: response.headers };
}
function setEnv(t, key, value) {
  const previous = process.env[key];
  process.env[key] = value;
  t.after(() => {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  });
}
const login = () => request('/auth/login', { method: 'POST', body: { email: ' ADMIN@example.test ', password: process.env.ADMIN_PASSWORD } });
function databaseUp(t) {
  const previous = Object.getOwnPropertyDescriptor(mongoose.connection, 'readyState');
  Object.defineProperty(mongoose.connection, 'readyState', { configurable: true, value: 1 });
  t.after(() => {
    if (previous) Object.defineProperty(mongoose.connection, 'readyState', previous);
    else delete mongoose.connection.readyState;
  });
}
const productFields = {
  id: 'test-product', slug: 'test-product', name: 'Fixture product', category: 'wall-products', categoryName: 'Wall Panels',
  description: 'Fixture description', images: ['https://images.test/first.webp', 'https://images.test/second.webp'],
  thumbnail: 'https://images.test/first.webp'
};
function existingProduct(fields = {}) {
  const product = new Product({ ...productFields, ...fields });
  product.$isNew = false;
  return product;
}

before(async () => {
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  const result = await login();
  assert.equal(result.status, 200);
  adminToken = result.data.token;
});
after(async () => {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
});
beforeEach(t => {
  t.mock.method(axios, 'post', async () => { throw new Error('External network calls are forbidden in this test.'); });
});

test('every protected endpoint rejects missing credentials before database or upload work', async () => {
  const endpoints = [
    ['GET', '/products/admin/status'], ['POST', '/products'], ['PUT', '/products/test'], ['DELETE', '/products/test'],
    ['POST', '/categories'], ['PUT', '/categories/test'], ['DELETE', '/categories/test'],
    ['GET', '/faqs?all=true'], ['POST', '/faqs'], ['PUT', '/faqs/reorder'], ['PUT', '/faqs/test'], ['DELETE', '/faqs/test'],
    ['POST', `/hero-slides/${heroKey}`], ['PUT', `/hero-slides/${heroKey}`], ['POST', '/auth/logout']
  ];
  for (const [method, path] of endpoints) {
    const result = await request(path, { method });
    assert.equal(result.status, 401, `${method} ${path}`);
    assert.equal(typeof result.data.message, 'string');
  }
  const malformedUpload = await request('/products', { method: 'POST', raw: 'not a multipart body', headers: { 'Content-Type': 'multipart/form-data; boundary=broken' } });
  assert.equal(malformedUpload.status, 401);
});

test('invalid, expired, wrong-role and wrong-algorithm tokens are rejected consistently', async () => {
  const options = { issuer: 'classicaldecorid-admin', audience: 'classicaldecorid-admin', jwtid: 'test-session' };
  const sign = (payload, extra = {}) => jwt.sign(payload, process.env.JWT_SECRET, { ...options, ...extra });
  for (const token of ['invalid', sign({ role: 'admin' }, { expiresIn: -1 }), sign({ role: 'admin' }, { algorithm: 'HS384' })]) {
    assert.equal((await request('/products/admin/status', { token })).status, 401);
    assert.equal((await request('/faqs?all=true', { token })).status, 401);
  }
  assert.equal((await request('/products/admin/status', { token: sign({ role: 'user' }) })).status, 403);
});

test('login returns a one-hour HS256 session without credentials and logout prevents replay', async () => {
  const result = await login();
  assert.equal(result.status, 200);
  const decoded = jwt.decode(result.data.token, { complete: true });
  assert.equal(decoded.header.alg, 'HS256');
  assert.equal(decoded.payload.exp - decoded.payload.iat, 3600);
  assert.equal(decoded.payload.email, 'admin@example.test');
  assert.equal(decoded.payload.password, undefined);
  assert.equal(decoded.payload.passwordHash, undefined);
  assert.ok(decoded.payload.jti);
  assert.equal((await request('/auth/logout', { method: 'POST', token: result.data.token })).status, 200);
  assert.equal((await request('/products/admin/status', { token: result.data.token })).status, 401);
  assert.equal((await request('/faqs?all=true', { token: result.data.token })).status, 401);
});

test('database outage never switches a configured installation to environment-password authentication', async t => {
  setEnv(t, 'MONGO_URI', 'mongodb://127.0.0.1:1/isolated-test');
  t.mock.method(mongoose, 'connect', async () => { throw new Error('Simulated database outage'); });
  assert.equal((await login()).status, 503);
});

test('database sessions are persisted and revoked; a removed account cannot keep using a token', async t => {
  databaseUp(t);
  const user = { _id: userId, email: 'admin@example.test', role: 'admin', comparePassword: async () => true };
  t.mock.method(User, 'findOne', () => ({ select: async () => user }));
  let record;
  t.mock.method(AdminSession, 'create', async fields => { record = fields; return fields; });
  t.mock.method(AdminSession, 'findOne', () => ({ lean: async () => record }));
  let account = { role: 'admin' };
  t.mock.method(User, 'findById', () => ({ select: () => ({ lean: async () => account }) }));
  t.mock.method(AdminSession, 'deleteOne', async () => { record = null; return { deletedCount: 1 }; });
  const result = await login();
  assert.equal(result.status, 200);
  assert.equal(record.sessionIdHash.length, 64);
  assert.equal(record.userId, userId);
  assert.ok(record.expiresAt > new Date());
  assert.equal((await request('/products/admin/status', { token: result.data.token })).status, 200);
  account = null;
  assert.equal((await request('/products/admin/status', { token: result.data.token })).status, 403);
  account = { role: 'admin' };
  assert.equal((await request('/auth/logout', { method: 'POST', token: result.data.token })).status, 200);
  assert.equal((await request('/products/admin/status', { token: result.data.token })).status, 401);
});

test('read-only fallback works while all catalog mutations fail honestly with 503', async () => {
  const products = await request('/products');
  assert.equal(products.status, 200);
  assert.ok(Array.isArray(products.data) && products.data.length > 0);
  assert.equal((await request('/hero-slides')).status, 200);
  assert.deepEqual((await request('/hero-slides')).data, { slides: {}, content: {} });
  const categories = await request('/categories');
  assert.ok(categories.data.some(category => category.slug === 'details'));
  for (const path of ['/products', '/categories', '/faqs', `/hero-slides/${heroKey}`]) {
    assert.equal((await request(path, { method: 'POST', token: adminToken, body: {} })).status, 503, path);
  }
});

test('an empty connected FAQ collection stays empty for both public and admin reads', async t => {
  databaseUp(t);
  t.mock.method(FAQ, 'find', () => ({ sort: async () => [] }));
  assert.deepEqual((await request('/faqs')).data, []);
  assert.deepEqual((await request('/faqs?all=true', { token: adminToken })).data, []);
});

test('FAQ writes parse false correctly and reject invalid order and text types before writing', async t => {
  databaseUp(t);
  const writes = [];
  t.mock.method(FAQ, 'create', async fields => { writes.push(fields); return { _id: userId, ...fields }; });
  let result = await request('/faqs', { method: 'POST', token: adminToken, body: { question: 'Question?', answer: 'Answer.', order: 0, isActive: 'false' } });
  assert.equal(result.status, 201);
  assert.equal(result.data.isActive, false);
  for (const invalid of [{ order: 'Infinity' }, { order: -1 }, { order: 1.5 }, { question: {} }, { isActive: 'sometimes' }]) {
    result = await request('/faqs', { method: 'POST', token: adminToken, body: { question: 'Question?', answer: 'Answer.', order: 0, ...invalid } });
    assert.equal(result.status, 400);
  }
  assert.equal(writes.length, 1);
});

test('FAQ reorder rejects invalid IDs, duplicate IDs and non-finite orders without partial writes', async t => {
  databaseUp(t);
  const bulk = t.mock.method(FAQ, 'bulkWrite', async () => ({}));
  for (const items of [[{ id: 'faq-fallback-1', order: 1 }], [{ id: userId, order: 'Infinity' }], [{ id: userId, order: 1 }, { id: userId, order: 2 }], [null]]) {
    const result = await request('/faqs/reorder', { method: 'PUT', token: adminToken, body: { items } });
    assert.equal(result.status, 400);
  }
  assert.equal(bulk.mock.callCount(), 0);
  t.mock.method(FAQ, 'countDocuments', async () => 0);
  assert.equal((await request('/faqs/reorder', { method: 'PUT', token: adminToken, body: { items: [{ id: userId, order: 1 }] } })).status, 404);
  assert.equal(bulk.mock.callCount(), 0);
});

test('removing the primary or all product images does not silently restore the removed thumbnail', async t => {
  databaseUp(t);
  const existing = existingProduct();
  t.mock.method(Product, 'findOne', async () => existing);
  t.mock.method(Product, 'findOneAndUpdate', async (query, update) => existingProduct(update.$set));
  for (const images of [[productFields.images[1]], []]) {
    const result = await request('/products/test-product', { method: 'PUT', token: adminToken, body: { imageUrls: images, thumbnail: '' } });
    assert.equal(result.status, 200);
    assert.deepEqual(result.data.images, images);
    assert.equal(result.data.thumbnail, images[0] || '');
  }
});

test('invalid nested product payloads fail before database updates', async t => {
  databaseUp(t);
  t.mock.method(Product, 'findOne', async () => existingProduct());
  const update = t.mock.method(Product, 'findOneAndUpdate', async () => { throw new Error('Must not write'); });
  for (const body of [{ specifications: null }, { specifications: [] }, { specifications: { features: [{}] } }, { name: {} }, { inStock: 'maybe' }]) {
    assert.equal((await request('/products/test-product', { method: 'PUT', token: adminToken, body })).status, 400);
  }
  assert.equal(update.mock.callCount(), 0);
});

test('connected empty product/category results and product 404s do not restore bundled records', async t => {
  databaseUp(t);
  t.mock.method(Product, 'find', () => ({ sort: () => ({ limit: async () => [] }) }));
  t.mock.method(Product, 'findOne', async () => null);
  t.mock.method(Category, 'find', () => ({ sort: async () => [] }));
  assert.deepEqual((await request('/products')).data, []);
  assert.deepEqual((await request('/categories')).data, []);
  assert.equal((await request('/products/spc-flooring')).status, 404);
});

test('category delete and slug rename cannot orphan existing product assignments', async t => {
  databaseUp(t);
  t.mock.method(Category, 'findOne', async () => ({ _id: userId, slug: 'wall-products' }));
  t.mock.method(Product, 'exists', async () => ({ _id: userId }));
  const remove = t.mock.method(Category, 'deleteOne', async () => ({}));
  const update = t.mock.method(Category, 'findOneAndUpdate', async () => ({}));
  assert.equal((await request('/categories/wall-products', { method: 'DELETE', token: adminToken })).status, 409);
  assert.equal((await request('/categories/wall-products', { method: 'PUT', token: adminToken, body: { slug: 'different' } })).status, 409);
  assert.equal(remove.mock.callCount(), 0);
  assert.equal(update.mock.callCount(), 0);
});

test('hero multipart uploads reach the shared upload middleware without losing the file', async t => {
  databaseUp(t);
  setEnv(t, 'CLOUDINARY_CLOUD_NAME', 'isolated-test');
  setEnv(t, 'CLOUDINARY_API_KEY', 'isolated-key');
  setEnv(t, 'CLOUDINARY_API_SECRET', 'isolated-secret');
  let uploadedBytes;
  t.mock.method(cloudinary.uploader, 'upload_stream', (options, callback) => {
    const chunks = [];
    return new Writable({
      write(chunk, encoding, done) { chunks.push(chunk); done(); },
      final(done) {
        uploadedBytes = Buffer.concat(chunks).toString();
        callback(null, { secure_url: 'https://images.test/hero.webp', public_id: 'dst_deco/hero/fixture' });
        done();
      }
    });
  });
  t.mock.method(HeroSlide, 'findOne', () => ({ lean: async () => null }));
  t.mock.method(HeroSlide, 'findOneAndUpdate', async (query, update) => update.$set);
  const form = new FormData();
  form.append('image', new File(['fixture-image-bytes'], 'hero.webp', { type: 'image/webp' }));
  const result = await request(`/hero-slides/${heroKey}`, { method: 'POST', token: adminToken, raw: form });
  assert.equal(result.status, 200);
  assert.equal(result.data.imageUrl, 'https://images.test/hero.webp');
  assert.equal(uploadedBytes, 'fixture-image-bytes');
});

test('lead validation rejects whitespace and structured fields before calling the webhook', async t => {
  const post = t.mock.method(axios, 'post', async () => { throw new Error('Must not call webhook'); });
  for (const body of [{ name: ' ', phone: '123' }, { name: {}, phone: '123' }, { name: 'Name', phone: '123', message: {} }]) {
    assert.equal((await request('/leads', { method: 'POST', body })).status, 422);
  }
  assert.equal(post.mock.callCount(), 0);
});

test('lead proxy sanitizes formulas, confirms success and preserves provider outage status', async t => {
  setEnv(t, 'GOOGLE_SHEETS_WEBHOOK_URL', 'https://webhook.invalid/isolated-test');
  setEnv(t, 'GOOGLE_SHEETS_SECRET_TOKEN', 'isolated-webhook-token');
  let forwarded;
  let upstream = { status: 'success', row: 42 };
  t.mock.method(axios, 'post', async (url, payload) => { forwarded = payload; return { data: upstream }; });
  const body = { name: '=formula', phone: '+971123', message: '@formula' };
  const result = await request('/leads', { method: 'POST', body });
  assert.equal(result.status, 200);
  assert.equal(result.data.row, 42);
  assert.equal(forwarded.name, "'=formula");
  assert.equal(forwarded.phone, "'+971123");
  assert.equal(forwarded.token, 'isolated-webhook-token');
  upstream = { status: 'error', code: 503, message: 'Server busy' };
  assert.equal((await request('/leads', { method: 'POST', body })).status, 503);
  upstream = { status: 'error', code: 401, message: 'Private upstream configuration details' };
  const rejected = await request('/leads', { method: 'POST', body });
  assert.equal(rejected.status, 502);
  assert.ok(!rejected.data.message.includes('Private'));
});

test('malformed JSON and unknown API paths return JSON errors', async () => {
  const invalid = await request('/leads', { method: 'POST', raw: '{', headers: { 'Content-Type': 'application/json' } });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.data.status, 'error');
  assert.equal((await request('/not-an-endpoint')).status, 404);
});
