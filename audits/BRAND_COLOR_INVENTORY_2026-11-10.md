# Classical Decor ID ? complete hex-color inventory

Date: 10 November 2026 (Asia/Dhaka). Current local working tree.

Companion to [the brand consistency audit](BRAND_CONSISTENCY_AUDIT_2026-11-10.md). Each row records one occurrence, including repeated values on the same line. Positions are one-based.

## Scope and interpretation

- 113 code/configuration/vector files scanned; 225 hex occurrences in 23 files; 46 distinct case-normalized values.
- `app` + `src`: 191 occurrences; excluding `app/icon.svg` and the palette definition: 177 occurrences.
- Extensions: `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.html`, `.json`, `.svg`, `.gs`, `.cjs`, `.mjs`, `.py`.
- Files discovered with `rg --files --hidden`; dependencies/builds, `.git`, `.codex`, `.agents`, `.aws`, audit outputs, package lockfiles, and the two existing audit helpers are excluded. Environment/secret files do not have included extensions and were not read.
- Palette-match means the numeric value agrees with a configured color; a literal in a component still bypasses the token. Definitions, metadata, vector assets, and generator templates are included for completeness.
- Outside-palette values are review candidates, not automatic defects. This inventory does not count built-in Tailwind color utilities, RGB/RGBA/HSL values, or colors embedded inside bitmap assets.
- Duplicate `app`, `public`, and `client/public` SVG copies are intentionally listed separately.

## Per-file totals

| File | Occurrences |
|---|---:|
| `app/icon.svg` | 5 |
| `app/layout.jsx` | 1 |
| `client/public/icon.svg` | 5 |
| `google-sheets-script/Code.gs` | 4 |
| `public/icon.svg` | 5 |
| `scripts/create_house_favicons.py` | 5 |
| `scripts/generate_favicons.js` | 6 |
| `src/App.jsx` | 4 |
| `src/components/public/BrandLogo.jsx` | 2 |
| `src/components/public/FAQSection.jsx` | 4 |
| `src/components/public/LeadFormModal.jsx` | 21 |
| `src/components/public/MaterialHero.jsx` | 14 |
| `src/components/public/Navbar.jsx` | 8 |
| `src/components/public/OfficialArchiveVaultCard.jsx` | 35 |
| `src/components/public/ProductCard.jsx` | 6 |
| `src/components/public/ProductModal.jsx` | 9 |
| `src/config/clientInfo.js` | 9 |
| `src/index.css` | 15 |
| `src/site-pages/admin/components/AdminHeader.jsx` | 1 |
| `src/site-pages/HomePage.jsx` | 8 |
| `src/site-pages/ProductDetailPage.jsx` | 3 |
| `src/site-pages/SiteImageGalleryPage.jsx` | 46 |
| `tailwind.config.js` | 9 |

## Every occurrence

### app/icon.svg

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 4 | 37 | `#FDE8A5` | Outside declared nine-color palette |
| 5 | 38 | `#E5A924` | Matches brand.gold |
| 6 | 38 | `#C58D17` | Outside declared nine-color palette |
| 7 | 39 | `#F2BE42` | Outside declared nine-color palette |
| 12 | 48 | `#141414` | Matches brand.charcoal |

### app/layout.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 26 | 16 | `#FAF6EE` | Matches brand.cream |

### client/public/icon.svg

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 4 | 37 | `#FDE8A5` | Outside declared nine-color palette |
| 5 | 38 | `#E5A924` | Matches brand.gold |
| 6 | 38 | `#C58D17` | Outside declared nine-color palette |
| 7 | 39 | `#F2BE42` | Outside declared nine-color palette |
| 12 | 48 | `#141414` | Matches brand.charcoal |

### google-sheets-script/Code.gs

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 55 | 24 | `#B38E46` | Matches brand.bronze |
| 56 | 23 | `#FFFFFF` | Neutral white |
| 111 | 47 | `#E6F4EA` | Outside declared nine-color palette |
| 111 | 71 | `#137333` | Outside declared nine-color palette |

### public/icon.svg

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 4 | 37 | `#FDE8A5` | Outside declared nine-color palette |
| 5 | 38 | `#E5A924` | Matches brand.gold |
| 6 | 38 | `#C58D17` | Outside declared nine-color palette |
| 7 | 39 | `#F2BE42` | Outside declared nine-color palette |
| 12 | 48 | `#141414` | Matches brand.charcoal |

### scripts/create_house_favicons.py

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 94 | 37 | `#FDE8A5` | Outside declared nine-color palette |
| 95 | 38 | `#E5A924` | Matches brand.gold |
| 96 | 38 | `#C58D17` | Outside declared nine-color palette |
| 97 | 39 | `#F2BE42` | Outside declared nine-color palette |
| 102 | 48 | `#141414` | Matches brand.charcoal |

### scripts/generate_favicons.js

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 14 | 37 | `#FDE8A5` | Outside declared nine-color palette |
| 15 | 38 | `#E5A924` | Matches brand.gold |
| 16 | 38 | `#C58D17` | Outside declared nine-color palette |
| 17 | 39 | `#F2BE42` | Outside declared nine-color palette |
| 22 | 48 | `#141414` | Matches brand.charcoal |
| 118 | 39 | `#141414` | Matches brand.charcoal |

### src/App.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 137 | 106 | `#25D366` | Matches brand.whatsapp |
| 137 | 119 | `#128C7E` | Outside declared nine-color palette |
| 137 | 140 | `#20ba59` | Outside declared nine-color palette |
| 137 | 159 | `#0e7467` | Outside declared nine-color palette |

### src/components/public/BrandLogo.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 4 | 65 | `#E5A924` | Matches brand.gold |
| 33 | 24 | `#E5A924` | Matches brand.gold |

### src/components/public/FAQSection.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 76 | 51 | `#FAF6EE` | Matches brand.cream |
| 82 | 48 | `#E5A924` | Matches brand.gold |
| 108 | 32 | `#E5A924` | Matches brand.gold |
| 185 | 203 | `#E5A924` | Matches brand.gold |

### src/components/public/LeadFormModal.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 72 | 92 | `#E5A924` | Matches brand.gold |
| 77 | 81 | `#141414` | Matches brand.charcoal |
| 84 | 44 | `#141414` | Matches brand.charcoal |
| 91 | 81 | `#141414` | Matches brand.charcoal |
| 92 | 51 | `#141414` | Matches brand.charcoal |
| 97 | 54 | `#141414` | Matches brand.charcoal |
| 112 | 70 | `#141414` | Matches brand.charcoal |
| 121 | 132 | `#141414` | Matches brand.charcoal |
| 127 | 70 | `#141414` | Matches brand.charcoal |
| 136 | 142 | `#141414` | Matches brand.charcoal |
| 142 | 70 | `#141414` | Matches brand.charcoal |
| 150 | 132 | `#141414` | Matches brand.charcoal |
| 157 | 72 | `#141414` | Matches brand.charcoal |
| 164 | 136 | `#141414` | Matches brand.charcoal |
| 178 | 72 | `#141414` | Matches brand.charcoal |
| 186 | 134 | `#141414` | Matches brand.charcoal |
| 193 | 70 | `#141414` | Matches brand.charcoal |
| 201 | 144 | `#141414` | Matches brand.charcoal |
| 209 | 54 | `#E5A924` | Matches brand.gold |
| 209 | 73 | `#c48b12` | Matches brand.goldHover |
| 209 | 137 | `#141414` | Matches brand.charcoal |

### src/components/public/MaterialHero.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 185 | 78 | `#E5A924` | Matches brand.gold |
| 186 | 106 | `#f5ebd7` | Outside declared nine-color palette |
| 201 | 114 | `#d4b77a` | Outside declared nine-color palette |
| 201 | 130 | `#d4b77a` | Outside declared nine-color palette |
| 201 | 260 | `#f5ebd7` | Outside declared nine-color palette |
| 202 | 72 | `#E5A924` | Matches brand.gold |
| 218 | 77 | `#eedec2` | Outside declared nine-color palette |
| 242 | 131 | `#25D366` | Matches brand.whatsapp |
| 242 | 144 | `#128C7E` | Outside declared nine-color palette |
| 242 | 348 | `#20ba59` | Outside declared nine-color palette |
| 242 | 367 | `#0e7467` | Outside declared nine-color palette |
| 287 | 68 | `#e7d5b2` | Outside declared nine-color palette |
| 287 | 82 | `#E5A924` | Matches brand.gold |
| 287 | 95 | `#f3e5cb` | Outside declared nine-color palette |

### src/components/public/Navbar.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 41 | 35 | `#E5A924` | Matches brand.gold |
| 45 | 69 | `#E5A924` | Matches brand.gold |
| 74 | 90 | `#E5A924` | Matches brand.gold |
| 75 | 98 | `#E5A924` | Matches brand.gold |
| 91 | 90 | `#E5A924` | Matches brand.gold |
| 92 | 102 | `#E5A924` | Matches brand.gold |
| 117 | 82 | `#E5A924` | Matches brand.gold |
| 121 | 69 | `#E5A924` | Matches brand.gold |

### src/components/public/OfficialArchiveVaultCard.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 21 | 141 | `#1a1714` | Outside declared nine-color palette |
| 24 | 48 | `#E5A924` | Matches brand.gold |
| 30 | 62 | `#E5A924` | Matches brand.gold |
| 30 | 87 | `#E5A924` | Matches brand.gold |
| 31 | 97 | `#E5A924` | Matches brand.gold |
| 36 | 82 | `#f5ebd7` | Outside declared nine-color palette |
| 41 | 91 | `#E5A924` | Matches brand.gold |
| 49 | 98 | `#E5A924` | Matches brand.gold |
| 49 | 133 | `#2a241c` | Outside declared nine-color palette |
| 49 | 146 | `#1c1813` | Outside declared nine-color palette |
| 49 | 216 | `#f5ebd7` | Outside declared nine-color palette |
| 49 | 277 | `#E5A924` | Matches brand.gold |
| 49 | 298 | `#3d3326` | Outside declared nine-color palette |
| 49 | 317 | `#251f18` | Outside declared nine-color palette |
| 51 | 55 | `#25D366` | Matches brand.whatsapp |
| 53 | 54 | `#E5A924` | Matches brand.gold |
| 67 | 177 | `#1c1813` | Outside declared nine-color palette |
| 67 | 237 | `#E5A924` | Matches brand.gold |
| 71 | 46 | `#E5A924` | Matches brand.gold |
| 77 | 60 | `#E5A924` | Matches brand.gold |
| 77 | 85 | `#E5A924` | Matches brand.gold |
| 78 | 95 | `#E5A924` | Matches brand.gold |
| 82 | 54 | `#E5A924` | Matches brand.gold |
| 82 | 117 | `#f5ebd7` | Outside declared nine-color palette |
| 87 | 100 | `#E5A924` | Matches brand.gold |
| 87 | 136 | `#2a231b` | Outside declared nine-color palette |
| 88 | 46 | `#E5A924` | Matches brand.gold |
| 91 | 79 | `#f5ebd7` | Outside declared nine-color palette |
| 96 | 130 | `#E5A924` | Matches brand.gold |
| 101 | 87 | `#E5A924` | Matches brand.gold |
| 102 | 114 | `#f5ebd7` | Outside declared nine-color palette |
| 103 | 55 | `#25D366` | Matches brand.whatsapp |
| 106 | 94 | `#E5A924` | Matches brand.gold |
| 106 | 225 | `#E5A924` | Matches brand.gold |
| 107 | 54 | `#E5A924` | Matches brand.gold |

### src/components/public/ProductCard.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 49 | 180 | `#E5A924` | Matches brand.gold |
| 73 | 126 | `#E5A924` | Matches brand.gold |
| 73 | 214 | `#E5A924` | Matches brand.gold |
| 74 | 54 | `#E5A924` | Matches brand.gold |
| 109 | 61 | `#E5A924` | Matches brand.gold |
| 112 | 124 | `#E5A924` | Matches brand.gold |

### src/components/public/ProductModal.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 130 | 50 | `#E5A924` | Matches brand.gold |
| 152 | 36 | `#E5A924` | Matches brand.gold |
| 152 | 58 | `#E5A924` | Matches brand.gold |
| 165 | 86 | `#E5A924` | Matches brand.gold |
| 234 | 85 | `#E5A924` | Matches brand.gold |
| 336 | 153 | `#176846` | Outside declared nine-color palette |
| 336 | 226 | `#125438` | Outside declared nine-color palette |
| 337 | 130 | `#ead8b0` | Outside declared nine-color palette |
| 337 | 207 | `#dfc596` | Outside declared nine-color palette |

### src/config/clientInfo.js

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 25 | 13 | `#FAF6EE` | Matches brand.cream |
| 26 | 12 | `#E6DEC8` | Matches brand.sand |
| 27 | 16 | `#141414` | Matches brand.charcoal |
| 28 | 13 | `#57534E` | Matches brand.muted |
| 29 | 12 | `#E5A924` | Matches brand.gold |
| 30 | 17 | `#C48B12` | Matches brand.goldHover |
| 31 | 14 | `#B38E46` | Matches brand.bronze |
| 32 | 18 | `#8A6B36` | Matches brand.bronzeDark |
| 33 | 16 | `#25D366` | Matches brand.whatsapp |

### src/index.css

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 11 | 23 | `#FAF6EE` | Matches brand.cream |
| 12 | 12 | `#141414` | Matches brand.charcoal |
| 27 | 21 | `#ffffff` | Neutral white |
| 49 | 21 | `#ffffff` | Neutral white |
| 161 | 10 | `#ffffff` | Neutral white |
| 168 | 17 | `#E5A924` | Matches brand.gold |
| 169 | 10 | `#ffffff` | Neutral white |
| 213 | 49 | `#24201b` | Outside declared nine-color palette |
| 213 | 61 | `#13110f` | Outside declared nine-color palette |
| 213 | 74 | `#080807` | Outside declared nine-color palette |
| 393 | 39 | `#f0dfb8` | Outside declared nine-color palette |
| 393 | 51 | `#E5A924` | Matches brand.gold |
| 393 | 64 | `#fff6e0` | Outside declared nine-color palette |
| 393 | 77 | `#d89b1b` | Outside declared nine-color palette |
| 393 | 90 | `#b38012` | Outside declared nine-color palette |

### src/site-pages/admin/components/AdminHeader.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 38 | 65 | `#E5A924` | Matches brand.gold |

### src/site-pages/HomePage.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 106 | 25 | `#FAF6EE` | Matches brand.cream |
| 125 | 173 | `#E5A924` | Matches brand.gold |
| 143 | 203 | `#E5A924` | Matches brand.gold |
| 157 | 50 | `#E5A924` | Matches brand.gold |
| 185 | 94 | `#E5A924` | Matches brand.gold |
| 276 | 107 | `#181818` | Outside declared nine-color palette |
| 278 | 96 | `#E5A924` | Matches brand.gold |
| 312 | 89 | `#eee9df` | Outside declared nine-color palette |

### src/site-pages/ProductDetailPage.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 143 | 38 | `#E5A924` | Matches brand.gold |
| 143 | 60 | `#E5A924` | Matches brand.gold |
| 276 | 208 | `#E5A924` | Matches brand.gold |

### src/site-pages/SiteImageGalleryPage.jsx

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 177 | 79 | `#f5ede0` | Outside declared nine-color palette |
| 182 | 52 | `#d4b77a` | Outside declared nine-color palette |
| 211 | 102 | `#d4b77a` | Outside declared nine-color palette |
| 211 | 116 | `#E5A924` | Matches brand.gold |
| 211 | 129 | `#f3e5cb` | Outside declared nine-color palette |
| 243 | 61 | `#8a6b36` | Matches brand.bronzeDark |
| 274 | 51 | `#292524` | Outside declared nine-color palette |
| 274 | 64 | `#1c1917` | Outside declared nine-color palette |
| 274 | 79 | `#e7d5b2` | Outside declared nine-color palette |
| 274 | 103 | `#d4b77a` | Outside declared nine-color palette |
| 278 | 64 | `#E5A924` | Matches brand.gold |
| 319 | 76 | `#E5A924` | Matches brand.gold |
| 343 | 32 | `#1c1917` | Outside declared nine-color palette |
| 343 | 47 | `#e7d5b2` | Outside declared nine-color palette |
| 343 | 85 | `#E5A924` | Matches brand.gold |
| 348 | 78 | `#E5A924` | Matches brand.gold |
| 351 | 127 | `#e7d5b2` | Outside declared nine-color palette |
| 391 | 58 | `#8a6b36` | Matches brand.bronzeDark |
| 492 | 127 | `#e7d5b2` | Outside declared nine-color palette |
| 493 | 62 | `#E5A924` | Matches brand.gold |
| 527 | 113 | `#1c1917` | Outside declared nine-color palette |
| 527 | 127 | `#292524` | Outside declared nine-color palette |
| 527 | 140 | `#141414` | Matches brand.charcoal |
| 530 | 92 | `#d4b77a` | Outside declared nine-color palette |
| 530 | 108 | `#d4b77a` | Outside declared nine-color palette |
| 530 | 191 | `#e6d5b2` | Outside declared nine-color palette |
| 531 | 58 | `#E5A924` | Matches brand.gold |
| 544 | 68 | `#e6d5b2` | Outside declared nine-color palette |
| 545 | 60 | `#E5A924` | Matches brand.gold |
| 548 | 68 | `#e6d5b2` | Outside declared nine-color palette |
| 549 | 60 | `#E5A924` | Matches brand.gold |
| 552 | 68 | `#e6d5b2` | Outside declared nine-color palette |
| 553 | 60 | `#E5A924` | Matches brand.gold |
| 563 | 132 | `#e7d5b2` | Outside declared nine-color palette |
| 563 | 146 | `#f3e5cb` | Outside declared nine-color palette |
| 563 | 159 | `#d4b77a` | Outside declared nine-color palette |
| 563 | 302 | `#e7d5b2` | Outside declared nine-color palette |
| 575 | 260 | `#25D366` | Matches brand.whatsapp |
| 575 | 279 | `#25D366` | Matches brand.whatsapp |
| 577 | 59 | `#25D366` | Matches brand.whatsapp |
| 599 | 161 | `#141414` | Matches brand.charcoal |
| 654 | 93 | `#E5A924` | Matches brand.gold |
| 673 | 119 | `#d4b77a` | Outside declared nine-color palette |
| 673 | 132 | `#E5A924` | Matches brand.gold |
| 683 | 100 | `#25D366` | Matches brand.whatsapp |
| 683 | 200 | `#20ba59` | Outside declared nine-color palette |

### tailwind.config.js

| Line | Column | Hex literal | Classification |
|---:|---:|---|---|
| 8 | 19 | `#FAF6EE` | Matches brand.cream |
| 9 | 18 | `#E6DEC8` | Matches brand.sand |
| 10 | 22 | `#141414` | Matches brand.charcoal |
| 11 | 19 | `#57534E` | Matches brand.muted |
| 12 | 18 | `#E5A924` | Matches brand.gold |
| 13 | 23 | `#C48B12` | Matches brand.goldHover |
| 14 | 20 | `#B38E46` | Matches brand.bronze |
| 15 | 24 | `#8A6B36` | Matches brand.bronzeDark |
| 16 | 22 | `#25D366` | Matches brand.whatsapp |

## Matching rule

The scan accepts 3-, 4-, 6-, and 8-digit hex literals and allows underscores around Tailwind arbitrary-value colors, including shadow syntax. It excludes fragments embedded in alphanumeric identifiers.

```regex
(?<![a-zA-Z0-9#])#(?:[a-fA-F0-9]{8}|[a-fA-F0-9]{6}|[a-fA-F0-9]{4}|[a-fA-F0-9]{3})(?![a-zA-Z0-9])
```
