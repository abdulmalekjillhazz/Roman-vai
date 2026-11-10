# Classical Decor ID — brand consistency audit

Date: 10 November 2026 (Asia/Dhaka). Scope: the current local working tree, including existing uncommitted changes.

The core color and font definitions agree, but branding is inconsistent across wordmarks, inquiry buttons, font weights, public metadata, and supporting documents. Current icons use the correct house symbol; an older generator can overwrite them with a different logo.

This audit follows the 15 checks in the supplied `BRAND_CONSISTENCY_AUDIT_PROMPT.md`. Its guideline fields were blank. The baseline below is inferred from the application configuration, not an independently approved brand guide. Findings distinguish concrete inconsistencies from design variants that need a documented rule.

Application source and existing assets were not changed. Only this report and its color inventory were added.

## Provisional baseline

| Field | Current value | Source |
|---|---|---|
| Brand name | Classical Decor ID | `src/config/clientInfo.js:6` |
| Trade name | classicaldecorid | `src/config/clientInfo.js:7` |
| Tagline | DESIGN • DECOR • PERFECT | `src/config/clientInfo.js:8` |
| Logo | Architectural house monogram; inline SVG rather than a standalone header image | `src/components/public/BrandLogo.jsx:4` |
| Favicon SVG | `/icon.svg`, present in `app`, `public`, and `client/public` | `app/layout.jsx:37` |
| Primary structural color | Charcoal `#141414` | `src/config/clientInfo.js:27` |
| Main background | Cream `#FAF6EE` | `src/config/clientInfo.js:25` |
| Main accent / hover | Gold `#E5A924` / `#C48B12` | `src/config/clientInfo.js:29` |
| Supporting palette | Sand `#E6DEC8`, muted `#57534E`, bronze `#B38E46`, dark bronze `#8A6B36`, WhatsApp `#25D366` | `src/config/clientInfo.js:26`, `:28`, `:31`, `:32`, `:33` |
| Heading families | Outfit; Cormorant Garamond for serif treatments | `src/config/clientInfo.js:36` |
| Body family | Plus Jakarta Sans | `src/config/clientInfo.js:38` |
| Technical family | JetBrains Mono | `src/config/clientInfo.js:39` |

Public environment variables can override some identity fields. Deployment overrides were not inspected. Color roles above describe current usage; the configuration itself does not define fields named “primary” or “secondary.”

## All 15 checklist results

| # | Check | Result | Evidence and assessment |
|---|---|---|---|
| 1 | Tailwind palette matches brand values | ✅ Consistent internally | All nine colors at `tailwind.config.js:8` through `:16` exactly match `src/config/clientInfo.js:25` through `:33`. External approval of these values remains unverified. |
| 2 | Hardcoded colors bypass tokens | ❌ Mismatch | Existing palette colors are repeated in components, including `src/components/public/Navbar.jsx:45`, `src/components/public/ProductCard.jsx:49`, and `src/components/public/LeadFormModal.jsx:209`. A Tailwind palette change will not update these literals. Every scanned hex occurrence is recorded in the accompanying inventory. |
| 3 | Button/link/CTA accent consistency | ❌ Mismatch | Sample/inquiry actions use metallic gold at `src/site-pages/HomePage.jsx:291`, a separate champagne gradient at `src/site-pages/SiteImageGalleryPage.jsx:563`, and beige at `src/components/public/ProductModal.jsx:337`. See the CTA comparison below. |
| 4 | Dark and hover colors belong to the palette | ⚠️ Partially consistent | `src/App.jsx:118` uses canonical gold/goldHover. Other authored shades are outside the declared palette: `src/components/public/ProductModal.jsx:336`, `:337`; `src/components/public/OfficialArchiveVaultCard.jsx:49`; `src/index.css:213`, `:393`. These are identifiable design treatments, not proof of accidental color choices. |
| 5 | Same logo version across surfaces | ⚠️ Partially consistent | Navbar, footer, admin login, and admin header share the house symbol: `src/components/public/Navbar.jsx:45`, `src/App.jsx:54`, `src/site-pages/admin/components/AdminLogin.jsx:23`, `src/site-pages/admin/components/AdminHeader.jsx:38`. Wordmark typography differs, and `scripts/generate_favicons.js:37` still defines a competing CD monogram. |
| 6 | Logo alt/accessibility text matches brand | ✅ Consistent in source | The shared inline SVG has `aria-label="Classical Decor ID Architectural House Logo"` at `src/components/public/BrandLogo.jsx:11`. This is the relevant accessible-name declaration for this SVG implementation. Browser accessibility-tree behavior was not tested. |
| 7 | Logo proportions across breakpoints | ⚠️ Partially verified | Square viewBox at `src/components/public/BrandLogo.jsx:7`; square dimensions at `:43` and `src/components/public/Navbar.jsx:45`; square admin container at `src/site-pages/admin/components/AdminHeader.jsx:32`. No source-level stretching found. Wordmark is intentionally hidden below 360px at `src/components/public/Navbar.jsx:53`. Rendered overflow and sizing remain unverified. |
| 8 | Favicon matches actual logo | ⚠️ Partially consistent | Current SVG geometry matches the house component, and all six icon files are byte-identical across the three asset locations. The actual ICO contains only a 16×16 frame. A competing generator can replace the house with CD lettering. See icon evidence below. |
| 9 | Font-family tokens applied consistently | ⚠️ Partially consistent | Configured font families agree at `tailwind.config.js:20` and `src/config/clientInfo.js:36`. Global body/heading inheritance is correct at `src/index.css:13`, `:17`. The navbar wordmark uses Plus Jakarta Sans while the shared footer/login wordmark uses Outfit: `src/components/public/Navbar.jsx:49` versus `src/components/public/BrandLogo.jsx:46`. |
| 10 | Font loading and fallback | ❌ Mismatch | `app/layout.jsx:65` does not request all weights used in the UI: mono 600/700 and sans 800/900 are examples. This is a source-level font-face coverage issue; it does not prove that a live browser fell back to a system font. See the font table below. |
| 11 | Heading weight/size hierarchy | ⚠️ Partially consistent | Hero H1 is serif 600 at `src/components/public/MaterialHero.jsx:207`; gallery H1 is serif 600 at `src/site-pages/SiteImageGalleryPage.jsx:185`; product H1 is Outfit 700 at `src/site-pages/ProductDetailPage.jsx:161`. Sizes also vary. These may be valid page-role variants; no approved hierarchy establishes otherwise. |
| 12 | Brand spelling/name across source and documents | ❌ Mismatch | `README.md:1`, `:23`, `:43` retain DST Deco branding; `public/llms.txt:7` and `client/public/llms.txt:7` declare a trade name different from `src/config/clientInfo.js:7`; `server/src/app.js:77`, `:93` expose legacy naming. Internal package identifiers also remain legacy, but have lower public impact. |
| 13 | Open Graph and schema identity | ❌ Mismatch | `app/layout.jsx:43` sets `siteName` to `classicaldecorid`, while the brand name is `Classical Decor ID`. LocalBusiness name at `app/layout.jsx:6` and product Brand schema at `src/components/public/SEOHead.jsx:22` correctly use Classical Decor ID. Social image contact identity also differs from the main website contact. |
| 14 | Component radius and spacing | ⚠️ Partially consistent | Public CTAs mostly use 12px corners, but lead submit uses 16px at `src/components/public/LeadFormModal.jsx:209`. Admin Edit controls use 4px, 8px, and 12px at `src/site-pages/admin/components/CategoriesPanel.jsx:40`, `FAQPanel.jsx:106`, and `ProductInventory.jsx:232`. No documented component variants establish which differences are intentional. |
| 15 | Primary CTA color/padding/radius across pages | ❌ Mismatch | The shared lead-request flow has several independent button styles, with gold, champagne, beige, outline, and dark fills. `src/App.jsx:118`, `src/site-pages/HomePage.jsx:291`, `src/site-pages/SiteImageGalleryPage.jsx:563`, `src/components/public/ProductModal.jsx:337`, `src/site-pages/ProductDetailPage.jsx:213`, and `src/components/public/FAQSection.jsx:176`. |

## Concrete findings and recommended corrections

### 1. The wordmark has two independently defined appearances

`src/components/public/Navbar.jsx:49` uses Plus Jakarta Sans, weight 800, uppercase text, and its own letter spacing. Its text is hardcoded at `:53` and `:54`.

`src/components/public/BrandLogo.jsx:46` uses Outfit, weight 700, and the configured title-case brand name at `:47`. That component appears in the footer and admin login.

The house silhouette agrees, but the same brand name has different typefaces. Uppercase treatment alone is not a misspelling. Reuse one wordmark implementation with explicit compact/light variants, or document both as approved alternatives. Also route the rendered tagline through the configured value: `BrandLogo.jsx:52`, `:56`, and `:60` hardcode words while `src/config/clientInfo.js:8` allows a tagline override.

### 2. The font request does not cover the weights used

All font requests are in `app/layout.jsx:65`.

| Family | Requested weights | Examples requiring other weights |
|---|---|---|
| JetBrains Mono | 500 | 600 at `src/site-pages/ProductDetailPage.jsx:178`, `:182`; 700 at `src/site-pages/HomePage.jsx:136` |
| Plus Jakarta Sans | 400, 500, 600, 700 | 800 at `src/components/public/Navbar.jsx:49`; 900 at `src/site-pages/admin/components/ProductImageManager.jsx:92` |
| Cormorant Garamond | Upright 600/700; italic 600 | `src/components/public/ProductModal.jsx:186` selects serif without a weight utility, leaving an inherited normal weight |

The browser must select an available face or synthesize the requested appearance. Request the weights actually needed, or align component utilities with the loaded set. Missing an explicit font-family class on a heading is not itself a defect: the global heading rule at `src/index.css:16` supplies Outfit.

### 3. Inquiry buttons lack shared, documented variants

| Location/action | Current treatment |
|---|---|
| Footer quote, `src/App.jsx:118` | Solid brand gold; goldHover; 12px corners; `py-3` |
| Home sample box, `src/site-pages/HomePage.jsx:291` | Metallic `.btn-luxury-gold`; 12px corners; `px-6 py-3`; minimum 48px height |
| Gallery sample action, `src/site-pages/SiteImageGalleryPage.jsx:563` | Separate champagne gradient using `#e7d5b2`, `#f3e5cb`, and `#d4b77a` |
| Product-modal sample/booking, `src/components/public/ProductModal.jsx:337` | Beige `#ead8b0`; hover `#dfc596`; 12px corners; `px-3 py-3` |
| Product-detail quote, `src/site-pages/ProductDetailPage.jsx:213` | White fill, charcoal outline; cream hover; 12px corners; `px-4 py-3.5` |
| FAQ inquiry, `src/components/public/FAQSection.jsx:176` | Dark stone treatment |
| Lead submit, `src/components/public/LeadFormModal.jsx:209` | Solid gold; 16px corners |

Use shared primary/secondary variants and explicit size options. Context can justify a secondary outline button, but this rule is not represented in a shared component or brand guide.

WhatsApp should remain identifiable as a separate action. Its own styles also differ: dark green at `src/components/public/ProductModal.jsx:336`, `brand.whatsapp` with emerald hover at `src/site-pages/ProductDetailPage.jsx:221`, green/teal gradients at `src/App.jsx:137` and `src/components/public/MaterialHero.jsx:242`, and a separate green hover at `src/site-pages/SiteImageGalleryPage.jsx:683`.

Admin login uses emerald focus/submit accents at `src/site-pages/admin/components/AdminLogin.jsx:49`, `:64`, `:80`, while the public lead form uses gold. Document an admin accent variant or align it. Red errors, green success states, and amber warnings are semantic treatments and are not automatically branding defects.

### 4. Palette duplication prevents reliable updates

The declared palette is consistent. Its usage is not centralized: components and CSS repeat both canonical hex values and additional decorative colors.

The complete [hex inventory](BRAND_COLOR_INVENTORY_2026-11-10.md) records **225 occurrences across 23 files**, from **113 scanned code/configuration/vector files**. Of these, **191 occurrences** are in `app` and `src`; excluding `src/config/clientInfo.js` and `app/icon.svg` leaves **177**. These are literal counts, not defect counts. Repeated brand values, neutral white, generator templates, and required concrete metadata colors are included.

Replace literals that duplicate existing tokens in UI components. Give approved gradients and hover shades explicit names. Standalone SVG and metadata values can remain concrete if generated or derived from the same palette. RGB/RGBA shadows and built-in Tailwind colors also require review; they are not captured by a hex-only inventory. Examples include `src/index.css:159`, `:214`, and `:393`.

### 5. Public identity and supporting documents disagree

| Source | Difference |
|---|---|
| `app/layout.jsx:43` | Open Graph site name uses the handle/trade identifier instead of Classical Decor ID. |
| `public/llms.txt:7`, `client/public/llms.txt:7` | Trade name is DST Deco, while configuration says classicaldecorid. |
| `server/src/app.js:77`, `:93` | Express responses expose `CLASSICAL DECOR I D (DST Deco)` / `Classical Decor ID (DST Deco)`. The Next health route instead uses the current identity at `app/api/health/route.js:6`. |
| `google-sheets-script/Code.gs:138` | Webhook status message still says DST Deco. |
| `README.md:1`, `:23`, `:43` | Project description uses DST Deco; line 43 documents replacing a Classical Decor title with DST Deco. |
| `package.json:2`, `server/package.json:2` | Internal names retain `dst-deco-nextjs` / `dst-deco-server`. Low priority; package names are identifiers rather than display copy. |

Use the canonical display name for Open Graph site identity, and agree on the trade-name relationship before changing the public descriptions. Do not blindly rename `dst_deco` Cloudinary paths: `server/src/utils/catalogAssets.js:16` and upload code depend on those existing asset identifiers.

The product title at `src/site-pages/ProductDetailPage.jsx:80` does not append the brand, and `src/components/public/SEOHead.jsx:57` uses it for `og:title`. This is a missing site-wide title convention, not an incorrect brand spelling. An optional common title suffix would make titles more uniform.

### 6. The social image uses a different contact identity

`app/layout.jsx:49` selects `/assets/business-card-cream.jpeg`. Visual inspection confirms the image prints `dstdeco@gmail.com`, while the primary website email is `info@classicaldecorid.com` at `src/config/clientInfo.js:12`.

This does **not** prove that the Gmail address is obsolete: `public/llms.txt:12` calls it a trade-operations email. Decide whether social previews should carry that secondary address or match the main on-site contact. The stylized spaced lettering in the artwork is also an asset treatment, not by itself a text spelling defect.

### 7. Icon regeneration can restore a different logo

The current house icon is consistent with the shared mark. `scripts/generate_favicons.js:37` instead defines a CD letter monogram and writes all icon destinations at `:255` through `:261`. It is not invoked by the normal package scripts, so this is a future regeneration risk, not evidence that visitors currently see CD lettering.

Keep one canonical house-logo generator, or update the older generator to use it. Separately, `scripts/create_house_favicons.py:69` declares 16/32/48 sizes, but the current output contains only 16×16. Correct the save operation at `:76` and verify embedded frames after regeneration.

Verified evidence:

- `icon.svg`, `favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-icon.png`, and `apple-touch-icon.png` each have identical SHA-256 hashes across `app`, `public`, and `client/public`.
- PNG dimensions are 192×192, 512×512, and 180×180 for the Apple files.
- ICO header parsing confirms exactly one 16×16 entry in each copy. Larger ICO display sizes may therefore be less sharp; SVG-capable browser behavior was not tested.
- SVG house geometry at `public/icon.svg:20` through `:28` matches `src/components/public/BrandLogo.jsx:15` through `:23`.

### 8. Heading and component variants need a documented rule

Hero, gallery, product, and admin headings use different sizes and sometimes different families. Product cards use 16px/24px responsive corners at `src/components/public/ProductCard.jsx:49`, while gallery cards use 16px at `src/site-pages/SiteImageGalleryPage.jsx:404`. Admin Edit actions also vary as recorded in checklist item 14.

Define heading roles, button sizes, and card variants before treating every difference as a bug. The current evidence supports undocumented variation; it does not establish that marketing and admin pages must use identical typography or geometry.

## Verification and limits

Performed: source searches and targeted review of public/admin components, global CSS, Tailwind and identity configuration, metadata/schema declarations, backend/webhook branding, supporting documents, SVG geometry, image inspection, icon hashes, PNG dimensions, and ICO directory entries. The hex scan covers 113 source/configuration/vector files; dependencies, build output, secret/environment files, lockfiles, and the existing audit helpers were excluded. This was not a functional or security audit.

The existing `scripts/audit_brand.py` was inspected rather than trusted: its whitelist omits configured dark bronze, its brand-name loop ends in `pass`, and its heading check misses inherited font families. Its output is not a reliable count of brand defects.

Outstanding visual checks from the supplied manual checklist:

- Computed browser colors, hover states, and CSS cascade at desktop/mobile sizes.
- Actual font downloads, selected faces, synthetic weights, and cross-browser rendering.
- Browser-tab/favicon cache behavior and icon choice.
- Live WhatsApp/Facebook/LinkedIn previews and their caches.
- Authenticated admin layout on real viewports.
- Any separately supplied print, PDF, or email templates outside the scanned source.

No live deployment, external platform messages, or application tests were run. Findings describe this local working tree, not a verified production deployment.

## Suggested correction order

1. Unify wordmark typography and supply the requested font weights.
2. Resolve canonical public/trade naming and Open Graph identity; confirm the contact shown in the social image.
3. Consolidate inquiry and WhatsApp button variants, then replace duplicate palette literals.
4. Consolidate favicon generation and restore verified multi-size ICO output.
5. Document heading/card/admin variants, then perform the outstanding browser and social-preview checks.
