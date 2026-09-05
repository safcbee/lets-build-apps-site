# Nightfall release — 5 September 2026

Selected direction A, applied to the main homepage and all 17 internal product, help, press and policy pages. The legacy Portaflow redirect stays in place.

The homepage introduces five available apps, supports category filtering, provides native dialog previews with focus return, and lets visitors change the featured screen. Native links and a details menu remain usable without JavaScript. Animation respects reduced motion, offers a homepage pause control and stops the orbit when offscreen.

The public catalogue now correctly includes Better Coffee as released. Existing app purchase, privacy and distribution boundaries remain intact, including the current local-only Travel Plans 2.0 and private Family Memories releases. No testimonials or usage numbers were invented.

## Validation

- Homepage at 320 and 390 px; product/help/policy/press layouts at 390 px; desktop layouts at 1143 and 1280 px.
- Mobile menu opens, follows its links and closes. App filtering returns the expected two learning/creative apps. Native product dialogs dismiss with Escape and return focus.
- The sentence activity completes with the expected success feedback.
- All existing content, purchase, privacy, SEO, marketing and publication tests pass. Release checks cover 18 themed pages, intrinsic image dimensions, preview destinations and a homepage image budget.
- Worker route responses, 404 and legacy redirect checked locally.
- Image derivatives for 41 displayed assets total about 1.10 MB at their smaller size, compared with 11.24 MB for their sources. Responsive variants and original editorial downloads are retained. This is an asset-weight comparison, not a measured Core Web Vitals result.

## Editing and publishing

`marketing/apps.json` supplies the catalogue. `scripts/build-nightfall-home.mjs` supplies the homepage layout; `scripts/templates/nightfall-hero.html` holds the selected hero composition. Shared styling lives in `public/assets/nightfall.css` and `nightfall-pages.css`, with progressive interactions in `nightfall.js`.

Run `npm run build` after catalogue or homepage template changes, then `npm test`. Optimised WebP variants and the two locally served font files are committed. `scripts/apply-nightfall-assets.mjs` applies the asset manifest deterministically without extra dependencies.

GitHub Pages publishes `public/` to letsbuildappshq.com. The same source supports the existing owner-private Sites copy through `dist/server/index.js`.
