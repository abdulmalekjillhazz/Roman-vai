# DST Deco — Production MERN Stack Catalog (Security & Audit Fixed v2.0)

This repository contains the complete, security-hardened MERN Stack codebase for **DST Deco (Dubai, UAE)** with all audit issues resolved:

## ✅ Audit Fixes Applied

1. **Formula Injection Prevention (`google-sheets-script/Code.gs` & `server/src/controllers/leadController.js`)**:
   - Every user input field (`name`, `phone`, `email`, `category`, `message`) is sanitized using OWASP rules (`sanitizeCell`): strings starting with `=`, `+`, `-`, `@`, `	`, or `` are prefixed with an apostrophe (`'`) so Google Sheets never executes malicious formulas like `=IMPORTXML(...)`.
2. **Webhook Shared Secret Authentication (`Code.gs` & `.env.example`)**:
   - Added `SECRET_TOKEN` verification in `Code.gs` (`PropertiesService.getScriptProperties().getProperty("SECRET_TOKEN")`) and `GOOGLE_SHEETS_SECRET_TOKEN` in the backend proxy (`server/src/controllers/leadController.js`), plus IP rate-limiting (`express-rate-limit`) to prevent webhook spam.
3. **Eliminated `mode: 'no-cors'` Silent Failures (`client/src/services/leadService.js`)**:
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
   - Dedicated category routes (`/category/:categorySlug`) and product routes (`/product/:slug`) with unique SEO titles, meta descriptions, `LocalBusiness` & `Product` JSON-LD schemas (`client/src/components/public/SEOHead.jsx`), and dynamic `/sitemap.xml` (`server/src/routes/sitemapRoutes.js`).

## Local image gallery

The `/gallery` page presents a manually reviewed set of 100 unique images in 12 product and project categories. Text-only and availability-status graphics are excluded and removed from the local image archive. Category image totals are logged to the browser developer console, not shown to visitors. Some source images could not be downloaded from Google Sites.
