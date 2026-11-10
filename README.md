# DST Deco — Next.js Commerce Catalog

## Run the application

The website runs as a single Next.js app from the repository root. A Pages API catch-all at `pages/api/[...path].js` mounts the Express API, preserving its middleware, rate limits, and multipart uploads in development, production, and Vercel.
The `public/` assets are copied from `client/public/` automatically before development and production builds.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Configure private database, JWT, Cloudinary, and Google Sheets values in the root `.env`; only `NEXT_PUBLIC_*` values are exposed to the browser. After building, `npm start` runs the same API stack. `npm run start:hosting` remains the Passenger/cPanel entry point.

For Vercel, keep the project root at the repository root. The `vercel.json` config selects Next.js; no API rewrite is required. Set the required production secrets in Vercel Project Settings → Environment Variables, then deploy the latest commit.

Admin sessions expire after one hour and are revoked by `POST /api/auth/logout`. With MongoDB configured, sessions persist in its `AdminSession` collection and check the current account role. An unavailable configured database returns 503 rather than switching to environment-password authentication. With no database configured, environment credentials provide a single-process bootstrap mode; its sessions end on restart and are unsuitable for multi-instance hosting. Existing tokens issued before this change require a fresh sign-in.

Bundled catalog files are read-only outage defaults, not a replica of admin edits. MongoDB is authoritative when available, including empty results and deleted products. The seed command also initializes category records, but replaces product data; review it before running it on a live database.

Run `npm test` for isolated API and admin-hook regression checks. These tests use local HTTP and stub external storage/providers. For a trusted reverse proxy, configure `TRUST_PROXY_HOPS` to the verified hop count; leave it unset for direct connections. Multi-instance deployments should use shared rate-limit storage rather than the default process-local counters.

The application source lives in the root `src/` directory; `client/public/` is only the source location for existing catalog images.

---

The repository retains the security-hardened product, admin, Cloudinary, and Google Sheets functionality:

This repository contains the complete, security-hardened MERN Stack codebase for **DST Deco (Dubai, UAE)** with all audit issues resolved:

## ✅ Audit Fixes Applied

1. **Formula Injection Prevention (`google-sheets-script/Code.gs` & `server/src/controllers/leadController.js`)**:
   - Every user input field (`name`, `phone`, `email`, `category`, `message`) is sanitized using OWASP rules (`sanitizeCell`): strings starting with `=`, `+`, `-`, `@`, `	`, or `` are prefixed with an apostrophe (`'`) so Google Sheets never executes malicious formulas like `=IMPORTXML(...)`.
2. **Webhook Shared Secret Authentication (`Code.gs` & `.env.example`)**:
   - Added `SECRET_TOKEN` verification in `Code.gs` (`PropertiesService.getScriptProperties().getProperty("SECRET_TOKEN")`) and `GOOGLE_SHEETS_SECRET_TOKEN` in the backend proxy (`server/src/controllers/leadController.js`), plus IP rate-limiting (`express-rate-limit`) to prevent webhook spam.
3. **Eliminated `mode: 'no-cors'` Silent Failures (`src/services/leadService.js`)**:
   - Frontend now submits leads to `/api/leads` on the Express server, which makes a server-to-server POST request to Google Apps Script, follows 302 redirects, parses the real JSON status (`status: "success" | "error"`), and returns accurate HTTP status codes to the user.
4. **Hardened `.env.example`**:
   - Removed predictable default `JWT_SECRET` and included instructions to generate a 64-byte cryptographic random secret.
5. **Parallel & MIME-Aware Image Downloader (`scripts/download_images.js`)**:
   - Inspects HTTP `Content-Type` headers to save with the exact file extension (`.jpg`, `.png`, `.webp`).
   - Skips already-downloaded files (`fs.existsSync`).
   - Runs with bounded concurrency (`CONCURRENCY_LIMIT = 5`) instead of a slow sequential loop.
6. **Quota-Safe, Local-First Cloudinary Sync (`scripts/sync_to_cloudinary.js`)**:
   - Checks `data/products_cloudinary.json` and `cloudinary.api.resource()` before uploading so existing images are never re-uploaded.
   - Prefers local files from `downloaded_images/` over Google Sites hotlinks (`sitesv-images-rt`).
7. **Complete MERN Codebase (`server/` & `client/`) + Technical SEO**:
   - Replaced `"Classical Decor I D"` title mismatch with `"DST Deco | Luxury Interior Decor Materials Supplier in Dubai, UAE"`.
   - Dedicated category routes (`/category/:categorySlug`) and product routes (`/product/:slug`) with unique SEO titles, meta descriptions, `LocalBusiness` & `Product` JSON-LD schemas (`src/components/public/SEOHead.jsx`), and dynamic `/sitemap.xml` (`server/src/routes/sitemapRoutes.js`).

## Local image gallery

The `/gallery` page presents a manually reviewed set of 100 unique images in 12 product and project categories. Text-only and availability-status graphics are excluded and removed from the local image archive. Category image totals are logged to the browser developer console, not shown to visitors. Some source images could not be downloaded from Google Sites.
