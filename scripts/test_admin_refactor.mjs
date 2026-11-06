import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createAdminApi } from '../src/site-pages/admin/api.js';

const require = createRequire(import.meta.url);
const babel = require('next/dist/compiled/babel/core');
const adminRoot = fileURLToPath(new URL('../src/site-pages/admin/', import.meta.url));

// Compile the actual source with the Babel already supplied by Next. No server,
// database, credentials, browser installation, or additional dependencies needed.
function createLoader(react = React, overrides = {}) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const { code } = babel.transformSync(readFileSync(filename, 'utf8'), {
      filename,
      babelrc: false,
      configFile: false,
      presets: [require('next/dist/compiled/babel/preset-react')],
      plugins: [require('next/dist/compiled/babel/plugin-transform-modules-commonjs')]
    });
    const localRequire = name => {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name === 'react') return react;
      if (name === 'axios') throw new Error('Tests must supply a fake API; network access is forbidden.');
      if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), name));
      return require(name);
    };
    new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
    return module.exports;
  }
  return relativePath => load(path.join(adminRoot, relativePath)).default;
}

// A deterministic runner for these small state/effect hooks. This verifies their
// handlers and effect cleanup, not React's concurrent scheduling or browser DOM.
function createHookHarness(relativePath, getArgs, overrides) {
  const slots = [];
  let cursor = 0;
  let dirty = true;
  let value;
  let pendingEffects = [];
  const sameDeps = (a, b) => a && b && a.length === b.length && a.every((item, index) => Object.is(item, b[index]));
  const react = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], next => {
        const result = typeof next === 'function' ? next(slots[index]) : next;
        if (!Object.is(result, slots[index])) { slots[index] = result; dirty = true; }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ||= { current: initial };
    },
    useMemo(factory, deps) {
      const index = cursor++;
      if (!sameDeps(slots[index]?.deps, deps)) slots[index] = { deps, value: factory() };
      return slots[index].value;
    },
    useCallback(callback, deps) { return react.useMemo(() => callback, deps); },
    useEffect(effect, deps) {
      const index = cursor++;
      if (!sameDeps(slots[index]?.deps, deps)) {
        const previous = slots[index];
        slots[index] = { deps };
        pendingEffects.push(() => {
          previous?.cleanup?.();
          slots[index].cleanup = effect();
        });
      }
    }
  };
  const useHook = createLoader(react, overrides)(relativePath);
  function render() {
    for (let attempts = 0; dirty; attempts++) {
      assert.ok(attempts < 20, 'Hook render/effect loop must settle');
      cursor = 0;
      dirty = false;
      value = useHook(...getArgs());
      const effects = pendingEffects;
      pendingEffects = [];
      effects.forEach(effect => effect());
    }
    return value;
  }
  render();
  return {
    get value() { return render(); },
    rerender() { dirty = true; return render(); },
    async act(action) {
      await action(render());
      for (let turn = 0; turn < 6; turn++) { await Promise.resolve(); render(); }
      return value;
    },
    unmount() { slots.forEach(slot => slot?.cleanup?.()); }
  };
}

const submitEvent = { preventDefault() {} };
const storageAvailable = { persistenceAvailable: true, uploadsAvailable: true };
const sampleProduct = {
  slug: 'stone/panel', name: '  Stone Panel  ', description: '  Natural finish  ',
  category: 'wall-products', images: ['https://images.test/a.webp', 'https://images.test/b.webp'],
  inStock: true, isFeatured: false
};

function fakeApi() {
  const calls = [];
  const api = Object.fromEntries(['get', 'post', 'put', 'delete'].map(method => [method, async (...args) => {
    calls.push({ method, args });
    return { data: method === 'get' ? [] : {} };
  }]));
  return { api, calls };
}

function setGlobal(t, name, value) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, { configurable: true, value });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, name, previous);
    else delete globalThis[name];
  });
}

test('shared API uses the configured base URL and isolates bearer headers between sessions', async t => {
  const previousBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  t.after(() => {
    if (previousBase === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = previousBase;
  });
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test/catalog/';
  const authenticated = createAdminApi('test-session-token');
  assert.equal(authenticated.defaults.baseURL, 'https://api.example.test/catalog/');
  assert.equal(authenticated.getUri({ url: '/products' }), 'https://api.example.test/catalog/products');
  const requests = [];
  const adapter = async config => {
    requests.push(config);
    return { data: [], status: 200, statusText: 'OK', headers: {}, config };
  };
  authenticated.defaults.adapter = adapter;
  await authenticated.get('/products');
  assert.equal(requests[0].headers.get('Authorization'), 'Bearer test-session-token');

  const anonymous = createAdminApi();
  anonymous.defaults.adapter = adapter;
  await anonymous.get('/products');
  assert.equal(requests[1].headers.get('Authorization'), undefined);
  await authenticated.get('/products');
  assert.equal(requests[2].headers.get('Authorization'), 'Bearer test-session-token');

  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  const defaultClient = createAdminApi('');
  assert.equal(defaultClient.defaults.baseURL, '/api');
  assert.equal(defaultClient.getUri({ url: '/products' }), '/api/products');
  defaultClient.defaults.adapter = adapter;
  await defaultClient.get('/products');
  assert.equal(requests[3].headers.get('Authorization'), undefined);
});

test('product edits preserve ordered multipart images, IDs, defaults and reset after saving', async () => {
  const { api, calls } = fakeApi();
  const hook = createHookHarness('hooks/useProducts.js', () => [api, false, storageAvailable]);
  await hook.act(state => state.editProduct(sampleProduct));
  assert.equal(hook.value.selectedProductId, 'stone/panel');
  await hook.act(state => state.setAsThumbnail(sampleProduct.images[1]));
  assert.equal(hook.value.productForm.thumbnail, sampleProduct.images[1]);
  assert.deepEqual(hook.value.existingImageUrls, [...sampleProduct.images].reverse());
  await hook.act(state => state.submitProduct(submitEvent));
  const update = calls.find(call => call.method === 'put');
  assert.equal(update.args[0], '/products/stone%2Fpanel');
  const payload = update.args[1];
  assert.equal(payload.get('name'), 'Stone Panel');
  assert.equal(payload.get('description'), 'Natural finish');
  assert.equal(payload.get('thickness'), 'Standard');
  assert.equal(payload.get('inStock'), 'true');
  assert.equal(payload.get('isFeatured'), 'false');
  assert.deepEqual(JSON.parse(payload.get('imageUrls')), [...sampleProduct.images].reverse());
  assert.equal(payload.get('thumbnail'), sampleProduct.images[1]);
  assert.equal(hook.value.selectedProductId, '');
  assert.equal(hook.value.productForm.name, '');
  assert.equal(hook.value.savingProduct, false);
  assert.match(hook.value.productMsg, /updated successfully/);
  assert.equal(calls.filter(call => call.method === 'get').length, 1);
  hook.unmount();
});

test('removing or moving the primary image keeps the final thumbnail consistent', async () => {
  const { api } = fakeApi();
  const hook = createHookHarness('hooks/useProducts.js', () => [api, false, storageAvailable]);
  await hook.act(state => state.editProduct(sampleProduct));
  await hook.act(state => state.moveExistingImage(1, -1));
  assert.equal(hook.value.productForm.thumbnail, sampleProduct.images[1]);
  await hook.act(state => state.removeExistingImage(sampleProduct.images[1]));
  assert.equal(hook.value.productForm.thumbnail, sampleProduct.images[0]);
  assert.deepEqual(hook.value.existingImageUrls, [sampleProduct.images[0]]);
  await hook.act(state => state.removeExistingImage(sampleProduct.images[0]));
  assert.equal(hook.value.productForm.thumbnail, '');
  assert.deepEqual(hook.value.existingImageUrls, []);
  hook.unmount();
});

test('uploads validate, append, reorder and release every preview URL', async t => {
  const created = [];
  const revoked = [];
  t.mock.method(URL, 'createObjectURL', file => {
    const url = `blob:${created.length}-${file.name}`;
    created.push(url);
    return url;
  });
  t.mock.method(URL, 'revokeObjectURL', url => revoked.push(url));
  const { api, calls } = fakeApi();
  const hook = createHookHarness('hooks/useProducts.js', () => [api, false, storageAvailable]);
  const first = new File(['first'], 'first.webp', { type: 'image/webp' });
  const second = new File(['second'], 'second.png', { type: 'image/png' });
  const select = files => hook.act(state => state.selectUploadFiles({ target: { files, value: 'selected' } }));
  await hook.act(state => state.editProduct(sampleProduct));
  await select([first]);
  await select([second]);
  assert.deepEqual(hook.value.uploadFiles, [first, second]);
  await select([{ type: 'image/gif', size: 10 }]);
  assert.match(hook.value.productError, /JPG, PNG or WebP/);
  await select([{ type: 'image/webp', size: 8 * 1024 * 1024 + 1 }]);
  assert.match(hook.value.productError, /8 MB/);
  await select(Array(11).fill(first));
  assert.match(hook.value.productError, /maximum of 12/);
  assert.deepEqual(hook.value.uploadFiles, [first, second]);
  await hook.act(state => state.moveUpload(1, -1));
  assert.deepEqual(hook.value.uploadPreviews.map(preview => preview.file), [second, first]);
  await hook.act(state => state.submitProduct(submitEvent));
  assert.deepEqual(calls.find(call => call.method === 'put').args[1].getAll('images').map(file => file.name), ['second.png', 'first.webp']);
  assert.deepEqual(hook.value.uploadFiles, []);
  await select([first]);
  await hook.act(state => state.removeUploadFile(first));
  assert.deepEqual(hook.value.uploadPreviews, []);
  await select([second]);
  hook.unmount();
  assert.deepEqual([...revoked].sort(), [...created].sort());
});

test('catalog reads happen on enable, not on form edits; failed saves retain the draft', async () => {
  const { api, calls } = fakeApi();
  let enabled = false;
  let status = null;
  const hook = createHookHarness('hooks/useProducts.js', () => [api, enabled, status]);
  await hook.act(state => state.submitProduct(submitEvent));
  assert.match(hook.value.productError, /read-only/);
  assert.equal(calls.length, 0);
  enabled = true;
  status = storageAvailable;
  hook.rerender();
  await hook.act(state => state.editProduct(sampleProduct));
  await hook.act(state => state.handleProductFieldChange('name', 'Draft title'));
  assert.equal(calls.filter(call => call.method === 'get').length, 1);
  api.put = async () => { throw { response: { data: { message: 'Save unavailable' } } }; };
  await hook.act(state => state.submitProduct(submitEvent));
  assert.equal(hook.value.productError, 'Save unavailable');
  assert.equal(hook.value.productForm.name, 'Draft title');
  assert.equal(hook.value.selectedProductId, sampleProduct.slug);
  assert.equal(hook.value.savingProduct, false);
  hook.unmount();
});

test('category creation and editing preserve payloads and refresh after success', async () => {
  const { api, calls } = fakeApi();
  const hook = createHookHarness('hooks/useCategories.js', () => [api, false]);
  await hook.act(state => state.submitCategory(submitEvent));
  assert.equal(calls.length, 0);
  assert.match(hook.value.categoryError, /name is required/);
  await hook.act(state => {
    state.handleCategoryFieldChange('name', '  Wall Panels  ');
    state.handleCategoryFieldChange('description', '  Architectural panels  ');
  });
  await hook.act(state => state.submitCategory(submitEvent));
  assert.deepEqual(calls[0], { method: 'post', args: ['/categories', { name: 'Wall Panels', slug: 'Wall Panels', description: 'Architectural panels' }] });
  assert.equal(hook.value.categoryForm.name, '');
  await hook.act(state => state.editCategory({ _id: 'category-1', slug: 'wall', name: 'Walls' }));
  await hook.act(state => state.submitCategory(submitEvent));
  assert.equal(calls.find(call => call.method === 'put').args[0], '/categories/category-1');
  assert.equal(hook.value.selectedCategoryId, '');
  assert.equal(calls.filter(call => call.method === 'get').length, 2);
  hook.unmount();
});

test('hero replacement validates before uploading and updates only the chosen slide', async () => {
  const { api, calls } = fakeApi();
  const hook = createHookHarness('hooks/useHeroImages.js', () => [api, false]);
  const slide = { file: 'stone/hero', title: 'Natural Stone' };
  const invalidInput = { files: [{ type: 'image/gif', size: 1 }], value: 'selected' };
  await hook.act(state => state.handleHeroImageSelection(slide, { currentTarget: invalidInput }));
  assert.equal(invalidInput.value, '');
  assert.equal(calls.length, 0);
  assert.match(hook.value.heroError, /JPG, PNG or WebP/);
  let finishUpload;
  api.post = async (url, payload) => {
    calls.push({ method: 'post', args: [url, payload] });
    return new Promise(resolve => { finishUpload = resolve; });
  };
  const file = new File(['image'], 'hero.webp', { type: 'image/webp' });
  const input = { files: [file], value: 'selected' };
  const upload = hook.value.handleHeroImageSelection(slide, { currentTarget: input });
  assert.equal(input.value, '');
  assert.equal(hook.value.heroSavingKey, slide.file);
  assert.equal(calls[0].args[0], '/hero-slides/stone%2Fhero');
  assert.equal(calls[0].args[1].get('image').name, 'hero.webp');
  finishUpload({ data: { imageUrl: 'https://images.test/replacement.webp', cleanupWarning: 'Cleanup pending.' } });
  await hook.act(() => upload);
  assert.deepEqual(hook.value.heroImages, { [slide.file]: 'https://images.test/replacement.webp' });
  assert.equal(hook.value.heroSavingKey, '');
  assert.match(hook.value.heroMessage, /Cleanup pending\./);
  hook.unmount();
});

test('logout clears catalog capability and ignores a previous session response', async () => {
  let enabled = true;
  let finishRead;
  const api = { get: () => new Promise(resolve => { finishRead = resolve; }) };
  const hook = createHookHarness('hooks/useCatalogStatus.js', () => [api, enabled]);
  enabled = false;
  hook.rerender();
  finishRead({ data: storageAvailable });
  await hook.act(() => {});
  assert.equal(hook.value, null);
  hook.unmount();
});

test('authentication restores sessions, handles failed/successful login, and clears secrets on logout', async t => {
  const stored = new Map([['dst_admin_token', 'fake-token'], ['dst_admin_email', 'admin@example.test']]);
  const session = {
    getItem: key => stored.get(key) || null,
    setItem: (key, value) => stored.set(key, value),
    removeItem: key => stored.delete(key)
  };
  setGlobal(t, 'sessionStorage', session);
  setGlobal(t, 'localStorage', { getItem: () => '', removeItem() {} });
  const { api, calls } = fakeApi();
  const hook = createHookHarness('hooks/useAdminAuth.js', () => [], { '../api.js': { createAdminApi: () => api } });
  assert.equal(hook.value.token, 'fake-token');
  assert.equal(hook.value.adminUser, 'admin@example.test');
  await hook.act(state => state.setLoginPassword('test-only-password'));
  await hook.act(state => state.handleLogout());
  assert.equal(hook.value.token, '');
  assert.equal(hook.value.adminUser, '');
  assert.equal(hook.value.loginPassword, '');
  assert.equal(stored.size, 0);

  let loginFailure = { response: { status: 401 } };
  api.post = async (...args) => {
    calls.push({ method: 'post', args });
    if (loginFailure) throw loginFailure;
    return { data: { token: 'replacement-test-token', email: 'new-admin@example.test' } };
  };
  await hook.act(state => {
    state.setLoginEmail('  new-admin@example.test  ');
    state.setLoginPassword('new-test-only-password');
  });
  await hook.act(state => state.handleLogin(submitEvent));
  assert.deepEqual(calls[0].args, ['/auth/login', { email: 'new-admin@example.test', password: 'new-test-only-password' }]);
  assert.match(hook.value.loginError, /Email or password is incorrect/);
  assert.equal(hook.value.loginLoading, false);
  assert.equal(hook.value.token, '');
  assert.equal(stored.size, 0);

  loginFailure = { response: { status: 503, data: { message: 'Try again shortly.' } } };
  await hook.act(state => state.handleLogin(submitEvent));
  assert.equal(hook.value.loginError, 'Try again shortly.');
  assert.equal(hook.value.loginLoading, false);

  loginFailure = null;
  await hook.act(state => state.handleLogin(submitEvent));
  assert.equal(hook.value.token, 'replacement-test-token');
  assert.equal(hook.value.adminUser, 'new-admin@example.test');
  assert.equal(hook.value.loginError, '');
  assert.equal(hook.value.loginLoading, false);
  assert.equal(stored.get('dst_admin_token'), 'replacement-test-token');
  assert.equal(stored.get('dst_admin_email'), 'new-admin@example.test');
  await hook.act(state => state.handleLogout());
  assert.equal(hook.value.token, '');
  assert.equal(hook.value.loginPassword, '');
  assert.equal(stored.size, 0);
  hook.unmount();
});

function descendants(element, predicate) {
  if (!React.isValidElement(element)) return [];
  return [
    ...(predicate(element) ? [element] : []),
    ...React.Children.toArray(element.props.children).flatMap(child => descendants(child, predicate))
  ];
}

test('image controls use supplied previews and the validated selection handler', () => {
  const ProductImageManager = createLoader()('components/ProductImageManager.jsx');
  const file = { name: 'finish.webp', lastModified: 1 };
  const selectUploadFiles = () => {};
  const productManager = {
    productForm: { imageUrls: '' },
    selectedProductId: '',
    existingImageUrls: [],
    uploadFiles: [file],
    uploadPreviews: [{ file, url: 'blob:managed-preview' }],
    selectUploadFiles
  };
  const element = ProductImageManager({ productManager });
  const fileInput = descendants(element, node => node.type === 'input' && node.props.type === 'file')[0];
  assert.equal(fileInput.props.onChange, selectUploadFiles);
  const html = renderToStaticMarkup(element);
  assert.match(html, /src="blob:managed-preview"/);
  assert.match(html, /finish\.webp/);
});

test('hero upload controls require both persistence and upload storage', () => {
  const HeroImagesPanel = createLoader()('components/HeroImagesPanel.jsx');
  const heroManager = { heroImages: {}, heroSavingKey: '', heroError: '', heroMessage: '' };
  for (const catalogStatus of [null, { persistenceAvailable: true }, { uploadsAvailable: true }]) {
    const tree = HeroImagesPanel({ heroManager, catalogStatus });
    const inputs = descendants(tree, node => node.type === 'input');
    assert.ok(inputs.length > 0);
    assert.ok(inputs.every(input => input.props.disabled));
  }
  const tree = HeroImagesPanel({ heroManager, catalogStatus: { persistenceAvailable: true, uploadsAvailable: true } });
  assert.ok(descendants(tree, node => node.type === 'input').every(input => !input.props.disabled));
});
