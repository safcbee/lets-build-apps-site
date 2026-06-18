# V5 Validation Report

Generated: 2026-06-18

V5 was built as a separate static preview at `v5/`. Production V4 remains untouched at the site root.

## Implementation Summary

| Area | Result |
| --- | --- |
| Hosting model | Static HTML/CSS/JS suitable for GitHub Pages |
| Location | `v5/index.html` |
| Backend/CMS | None |
| Analytics/tracking/cookies/auth | None |
| External page resources | None detected in the V5 document |
| Product evidence | Reuses existing real V4 product screenshots/assets |
| Social proof | No fake ratings, fake reviews, fake user counts, or invented testimonials |

## Local Route Checks

Checked with `python3` against `http://127.0.0.1:8000`:

| Route | Status |
| --- | --- |
| `/v5/` | 200 `text/html` |
| `/privacy/` | 200 `text/html` |
| `/sentences/` | 200 `text/html` |
| `/countdowns/` | 200 `text/html` |
| `/travel-plans/` | 200 `text/html` |
| `/good-habits/` | 200 `text/html` |
| `/perfect-coffee/` | 200 `text/html` |

## Browser Rendering Checks

| Viewport | Page dimensions | Result |
| --- | --- | --- |
| Desktop `1440x1200` | Document `1440x6445` | No horizontal overflow |
| Mobile `390x844` | Document `390x9020` | No horizontal overflow |

Browser DOM checks:

| Check | Result |
| --- | --- |
| Broken images | None |
| Images missing alt text | None |
| Product section anchors | `products`, `sentences`, `countdowns`, `travel-plans`, `good-habits`, `perfect-coffee`, `philosophy`, `testflight` all present |
| Reduced motion support | Present via `prefers-reduced-motion` |
| Scroll reveal fallback | Present for browsers without `IntersectionObserver` |

## Link Checks

| Link type | Result |
| --- | --- |
| Sentences App Store CTA | Verified live Apple App Store page: `https://apps.apple.com/gb/app/lets-build-sentences/id6761413051` |
| Countdowns App Store CTA | Verified live Apple App Store page: `https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794` |
| TestFlight interest CTAs | Use `mailto:support@leary.cloud` with product-specific subject lines |
| Privacy links | Point to `../privacy/` |
| Production fallback links | Point to existing V4 pages |

## Test Commands

All commands passed:

```sh
node tests/home-search.test.mjs
node tests/countdowns-live.test.mjs
node tests/no-fake-social-proof.test.mjs
node tests/site-integrity.test.mjs
node tests/v4-readiness.test.mjs
node tests/v5-experience.test.mjs
```

Additional searches passed:

```sh
rg -n "fonts\.google|gstatic|Plus Jakarta Sans|Be Vietnam Pro|font-size: clamp|font-size:[^;]*vw|\bAnalytics\b|support@letsbuildapps\.io|★★★★★|star rating|© 2023|\bSettings\b" v5 tests/v5-experience.test.mjs
```

Only expected test assertion text matched the search terms; no V5 page content matched.

## Screenshot Pack

Desktop screenshots are `1440x1200`:

| Page/section | Path |
| --- | --- |
| Homepage hero | `reports/screenshots-v5/desktop-home.jpg` |
| Sentences | `reports/screenshots-v5/desktop-sentences.jpg` |
| Countdowns | `reports/screenshots-v5/desktop-countdowns.jpg` |
| Travel Plans | `reports/screenshots-v5/desktop-travel-plans.jpg` |
| Good Habits | `reports/screenshots-v5/desktop-good-habits.jpg` |
| Perfect Coffee | `reports/screenshots-v5/desktop-perfect-coffee.jpg` |
| Philosophy | `reports/screenshots-v5/desktop-philosophy.jpg` |

Mobile screenshots are `390x844`:

| Page/section | Path |
| --- | --- |
| Homepage hero | `reports/screenshots-v5/mobile-home.jpg` |
| Sentences | `reports/screenshots-v5/mobile-sentences.jpg` |
| Countdowns | `reports/screenshots-v5/mobile-countdowns.jpg` |
| Travel Plans | `reports/screenshots-v5/mobile-travel-plans.jpg` |
| Good Habits | `reports/screenshots-v5/mobile-good-habits.jpg` |
| Perfect Coffee | `reports/screenshots-v5/mobile-perfect-coffee.jpg` |
| Philosophy | `reports/screenshots-v5/mobile-philosophy.jpg` |

## Notes

V5 is a preview experience, not a production replacement. The live App Store products are linked directly. In-development products use honest TestFlight-interest mail links rather than fake availability, ratings, or reviews.
