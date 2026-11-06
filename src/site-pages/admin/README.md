# Admin panel structure

`AdminDashboard.jsx` connects the feature hooks, handles tab navigation and logout,
and selects the visible panel. The existing `/admin` route still imports this file.

- `components/` contains the login, header, tabs, inventory, product editor,
  product image manager, categories, and hero image views.
- `hooks/` owns authentication, catalog availability, products, product images,
  categories, and hero images. API calls and form actions live with their feature.
- `api.js` creates the Axios client with the API base URL and session token.
- `formDefaults.js` contains the initial product and category form values.

Keep feature hooks in `AdminDashboard`, outside conditional tab rendering. This
preserves unfinished forms and selected files when switching tabs. Keep preview
URL creation and cleanup in `useProductImages`, outside the rendering code.

Run `node --test scripts/test_admin_refactor.mjs` from the repository root for
isolated regression checks, and `npm run build` for the Next.js production build.
The regression checks use fake APIs and do not change the live catalog.
