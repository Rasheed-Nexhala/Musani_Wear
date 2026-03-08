# Lighthouse Audit Report — Task 5.4

**Project:** Musani Wear  
**Date:** March 2025  
**Phase 5 Target:** Performance ≥ 85, SEO ≥ 90, Accessibility ≥ 90

---

## 1. Audit Scores (Baseline — March 2025)

| Category        | Score | Target | Status   |
|----------------|-------|--------|----------|
| **Performance**   | 38  | ≥ 85  | Below    |
| **Accessibility** | 96  | ≥ 90  | Pass     |
| **SEO**           | 100 | ≥ 90  | Pass     |
| **Best Practices**| 96  | —     | Pass     |

**Note:** Lighthouse was run against `http://localhost:8080` (production build served via http-server) with mobile throttling. The page timed out waiting for Firestore connection, which impacted Performance metrics.

---

## 2. Findings & Fixes Applied

### 2.1 Performance (38)

**Findings:**
- **First Contentful Paint:** 5.4 s (target < 1.8 s)
- **Largest Contentful Paint:** 8.5 s (target < 2.5 s)
- **Cumulative Layout Shift:** 0.784 (target < 0.1)
- **Unused JavaScript:** ~277 KiB estimated savings
- **Initial bundle:** 730 KB (exceeds 500 KB budget — see PHASE_NOTES)
- **Run warning:** "The page loaded too slowly to finish within the time limit" (Firestore Listen channel)

**Fixes applied:**
- Added `preconnect` for Firebase/Firestore/Storage in `index.html` to reduce connection latency
- Fonts already use `font-display: swap` (via @fontsource packages)
- Images have `width`/`height` and `loading="lazy"` (Task 5.2)
- Tailwind purge handles unused CSS in production

**Recommendations (future):**
- Consider route-level code splitting for admin routes
- Enable Firestore persistence/caching
- Evaluate CDN for product images (Firebase CDN or Cloudinary)
- Reduce initial bundle (e.g. lazy-load NgRx DevTools in dev only)

### 2.2 SEO (100)

**Status:** All checks pass.

**Verified:**
- Meta description on all pages (SeoService + default in `index.html`)
- All images have `alt` text
- Semantic HTML (Task 5.6)
- Meta viewport set: `width=device-width, initial-scale=1`
- Document has `<title>` element
- Links are crawlable

**Fixes applied:**
- Added default `<meta name="description">` in `index.html` for initial load before Angular hydrates
- Updated default `<title>` to "Musani Wear - Exquisite Dress Collections"

### 2.3 Accessibility (96)

**Findings:**
- **Color contrast:** Gold (#d4af37) on white/cream ~2.8:1 — fails WCAG AA for small text (< 18px)

**Fixes applied:**
- Product detail category label: changed `text-sm text-gold` → `text-sm text-amber-800` (darker gold, passes contrast on white)
- Skip link, ARIA labels, form labels, focus indicators already in place (Task 5.6)

**Recommendations:**
- Avoid `text-gold` for body text smaller than 18px on white/cream backgrounds
- Use `text-amber-800` or `text-charcoal` for small secondary text

### 2.4 Best Practices (96)

**Findings:**
- Console errors (Firestore connection in headless environment)
- Back/forward cache (bf-cache) prevented — 2 failure reasons
- Cache lifetimes — ~78 KiB savings possible

---

## 3. Manual Audit Steps

If Lighthouse CLI is not available (e.g. Chrome/Chromium not installed):

1. **Build production:**
   ```bash
   cd musani-wear && npm run build:prod
   ```

2. **Serve the build:**
   ```bash
   npm run serve:prod
   ```
   (Runs http-server on port 8080)

3. **Run Lighthouse in Chrome DevTools:**
   - Open `http://localhost:8080` in Chrome
   - Open DevTools (F12) → Lighthouse tab
   - Select categories: Performance, Accessibility, SEO, Best Practices
   - Run audit (Desktop or Mobile)

4. **Alternative — Lighthouse CLI:**
   ```bash
   npx lighthouse http://localhost:8080 --output=html --output-path=./lighthouse-report.html --view
   ```

---

## 4. NPM Scripts

| Script        | Description                                                       |
|---------------|-------------------------------------------------------------------|
| `build:prod`  | Production build (`ng build --configuration production`)         |
| `serve:prod`  | Serve production build on port 8080 (http-server)                 |
| `audit`       | Build + run Lighthouse CLI (requires `serve:prod` in another terminal) |
| `lighthouse`  | Run Lighthouse with `--view` (opens report in browser)              |

**Full audit workflow:**
```bash
# Terminal 1: Serve production build
npm run serve:prod

# Terminal 2: Build and run Lighthouse (from musani-wear/)
npm run audit
# Report saved to lighthouse-report.html

# Or run Lighthouse with --view to open report in browser
npm run lighthouse
```

---

## 5. Files Modified (Task 5.4)

| File | Changes |
|------|---------|
| `index.html` | Default meta description, preconnect for Firebase/Firestore/Storage |
| `product-detail.component.html` | Category label: `text-gold` → `text-amber-800` (contrast) |
| `package.json` | Added `build:prod`, `serve:prod`, `audit` scripts |
| `Documents/LIGHTHOUSE_AUDIT.md` | This document |

---

## 6. Checklist

- [x] Lighthouse report generated (or manual steps documented)
- [x] Preconnect for Firebase added
- [x] Default meta description in index.html
- [x] Color contrast fix for small gold text
- [x] Font-display: swap (already present in @fontsource)
- [x] Images have width/height and alt (Task 5.2, 5.6)
- [x] LIGHTHOUSE_AUDIT.md created
- [x] NPM scripts added
