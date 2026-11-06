import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const babel = require('next/dist/compiled/babel/core');
const adminRoot = fileURLToPath(new URL('../src/site-pages/admin/', import.meta.url));

// Compile the actual source with the Babel already supplied by Next. No server,
// database, credentials, browser installation, or additional dependencies needed.
function createLoader(react = React) {
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
function createHookHarness(relativePath, getArgs) {
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
  const useHook = createLoader(react)(relativePath);
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
    async act(action) {
      await action(render());
      for (let turn = 0; turn < 6; turn++) { await Promise.resolve(); render(); }
      return value;
    },
    unmount() { slots.forEach(slot => slot?.cleanup?.()); }
  };
}

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
