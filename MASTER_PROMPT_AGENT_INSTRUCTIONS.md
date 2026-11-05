# MASTER PROMPT & ARCHITECTURAL INSTRUCTIONS FOR AI CODING AGENT

> **Role & Identity**: You are an elite Senior Full-Stack MERN & Next.js Architect. You are tasked with constructing, optimizing, and deploying a high-speed, high-converting B2B luxury interior decor catalog website and admin dashboard for **DST Deco** (Dubai, UAE).

---

## 1. PROJECT OBJECTIVES & CORE BUSINESS LOGIC

1. **Client Identity & Market**:
   - Company: **DST Deco** (Interior Decor Materials Supplier, Dubai, UAE).
   - Target Audience: Contractors, Interior Designers, Real Estate Developers, and Luxury Homeowners across UAE and Gulf.
   - Core Value Props: Trade pricing, 100% water-resistant materials, fast UAE-wide delivery, free samples.
   - Contact Info: Phone / WhatsApp: `+971 54 353 2585`, Email: `info@dstdeco.com`.

2. **Design Language & Aesthetic (Inspired by dstdeco.com)**:
   - Palette: Soft warm cream background (`#FDFBF7`), Slate dark text (`#1C1917`), Luxury Gold accent (`#B38E46`), WhatsApp emerald green (`#25D366`).
   - Clean, clutter-free, responsive layout.

3. **Product Catalog & Specifications (Sourced from Google Sites catalog)**:
   - Must support rich categories:
     * **Wall Products**: Flexible Stone, Big PU Stone (Feather Stone), Small PU Stone, 5mm & 8mm WPC Chipboard Panels, PS Fluted Columns & Panels, PVC Marble (Glossy & Matte).
     * **Flooring Products**: SPC Straight Plank, SPC Herringbone, LVT STARO, PS Skirting Boards.
     * **Woodworking**: 3D Decorative Sheets.
     * **Fixing Materials**: STARO Hybrid Polymer Adhesive.
     * **Aluminum Profiles**: Architectural T-Profile MS Series.
   - Every product has thickness, dimensions, material composition, features list, and image gallery.

4. **1-Click Cloudinary Integration (Future-Proofed)**:
   - The user has **not yet** registered or set up their Cloudinary account.
   - **Do not break the app if Cloudinary keys are missing!**
   - The project includes `data/products_data.json` containing original high-res Google Sites image URLs (`w1280`).
   - **The 1-Click Sync Script (`scripts/sync_to_cloudinary.js`)**:
     * When the user later creates a Cloudinary account, they add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to `.env`.
     * Running `npm run sync:cloudinary` immediately uploads all images into organized Cloudinary folders (`dst_deco/<category>/...`) with `f_auto,q_auto` optimization.
     * The script saves `data/products_cloudinary.json` and updates the database with secure Cloudinary URLs and public IDs.
     * In the Admin Dashboard, implement drag-and-drop Cloudinary uploading using `multer` + Cloudinary SDK.

5. **Google Sheets Real-Time Lead Collection (Via Google Apps Script Webhook)**:
   - Every client inquiry or sample request submitted via the website's modal form must be sent directly to the client's Google Sheet using a Google Apps Script Web App URL (`VITE_GOOGLE_SHEETS_WEBHOOK_URL`).
   - No heavy lead database required — client's sales team manages leads directly in Google Sheets!
   - Script file provided in `google-sheets-script/Code.gs`.

6. **Dynamic WhatsApp Integration**:
   - Floating WhatsApp button on every page.
   - Each product card and modal features an "Inquire on WhatsApp" button that dynamically pre-fills:
     `https://wa.me/971543532585?text=Hello%20DST%20Deco,%20I%20am%20interested%20in%20[Product%20Name]%20under%20category%20[Category]`

---

## 2. SYSTEM ARCHITECTURE & FOLDER STRUCTURE

```text
dst-deco-mern/
├── .env.example
├── package.json
├── data/
│   ├── products_data.json        # Sourced catalog with high-res original URLs
│   └── products_cloudinary.json  # Auto-generated after Cloudinary sync
├── scripts/
│   ├── download_images.js        # Local category-wise image downloader
│   └── sync_to_cloudinary.js     # 1-Click Cloudinary uploader & data updater
├── google-sheets-script/
│   └── Code.gs                   # Google Apps Script for Google Sheet integration
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # MongoDB Mongoose connection
│   │   │   └── cloudinary.js     # Cloudinary SDK config
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   └── User.js           # Admin auth
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── app.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── public/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── CategoryFilter.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductModal.jsx
│   │   │   │   ├── WhatsAppButton.jsx
│   │   │   │   └── LeadFormModal.jsx
│   │   │   └── admin/
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── ProductManager.jsx
│   │   │       └── ImageUploader.jsx
│   │   ├── services/
│   │   │   └── leadService.js    # Google Sheets submission
│   │   └── utils/
│   │       └── whatsappHelper.js # WhatsApp message generator
```

---

## 3. STEP-BY-STEP EXECUTION RULES FOR THE AGENT

### Step 1: Initialize Database & Seed Catalog
1. When booting the backend, verify MongoDB connection in `server/src/config/db.js`.
2. Create a seeding script `server/src/seed.js` that checks if `data/products_cloudinary.json` exists. If not, seed from `data/products_data.json`.
3. Ensure schema has fields: `name`, `category`, `subCategory`, `description`, `specifications` (thickness, dimensions, material, features[]), `images` (array of strings), `inStock` (boolean), `isFeatured` (boolean).

### Step 2: Implement Public Storefront (Fast & Responsive)
1. **Category Filtering**: Implement a tabbed category bar (`All`, `Wall Products`, `Flooring`, `Woodworking`, `Fixing Materials`, `Aluminum Profiles`). Use client-side or React state for instantaneous filtering without page reload.
2. **Product Cards**: Display clean cards with optimized image, category badge, key spec badge (e.g. "Thickness: 5mm"), "View Specs" button, and "WhatsApp Inquire" button.
3. **Product Modal**: When clicking a card, open a modal with multi-image gallery, full specification breakdown table, stock badge, and sample request CTA.
4. **Lead Modal Form**: Capture Name, Phone/WhatsApp, Email, Project Details, and submit via `client/src/services/leadService.js` to Google Sheets.

### Step 3: Implement Cloudinary One-Click Workflow
1. Read `.env`. If Cloudinary credentials are empty, log a clear notice and fallback to serving images from `product.images[0]`.
2. When credentials are supplied, `scripts/sync_to_cloudinary.js` must upload every product image to `dst_deco/<category>/...` with transformation `{ quality: 'auto', fetch_format: 'auto' }`.
3. In the Admin Dashboard (`client/src/components/admin/ImageUploader.jsx`), allow uploading new files directly using Multer + Cloudinary storage.

### Step 4: Google Sheets Integration Verification
1. Ensure the form in `LeadFormModal.jsx` handles submission with `mode: 'no-cors'` so that CORS redirects from Google Apps Script do not trigger false frontend errors.
2. Show a clean success toast/modal: *"Thank you! Your inquiry has been sent to our sales team."*

---

## 4. CODE STYLE & PERFORMANCE STANDARDS
- **Framework**: Use modern ESM (`import/export`).
- **Styling**: Tailwind CSS with custom font and color variables.
- **Image Optimization**: Always pass `loading="lazy"` and specify `alt` attributes.
- **Error Handling**: Graceful fallbacks for all network requests.
