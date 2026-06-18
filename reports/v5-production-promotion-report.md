# V5 Production Promotion Report

Generated: 2026-06-18

## Summary

V5 is being promoted from `/v5/` to the production homepage at `https://apps.leary.cloud/`.

## Rollback Point

| Item | Value |
| --- | --- |
| Previous production commit | `9f24f6f085de233f5586e5786f4554124352570d` |
| Rollback tag | `pre-v5-production-20260618-143444` |
| Promotion commit | `87286e05bf8468294dfa251c453f0d0df2ab8158` |
| Live production code commit | `6fd6627aaf964f69f0a9e77d81342e016318f9dd` |

Rollback command, if required:

```sh
git checkout pre-v5-production-20260618-143444
```

## Promotion Changes

- Promoted the approved V5 homepage experience to `index.html`.
- Archived the previous V4 homepage at `v4/index.html`.
- Preserved existing product and policy routes:
  - `/sentences/`
  - `/countdowns/`
  - `/travel-plans/`
  - `/good-habits/`
  - `/perfect-coffee/`
  - `/privacy/`
  - `/portaflow/`
- Rewrote promoted-root links/assets so they resolve from `/`.
- Removed preview-era production homepage labels such as `V5 experimental`, `Production V4`, and `View V4 page`.
- Kept App Store CTAs and TestFlight-interest mail links.
- Kept the site static with no backend, CMS, analytics, cookies, auth, or tracking.

## Local Validation

Passed before commit.

Commands run:

```sh
node tests/home-search.test.mjs
node tests/countdowns-live.test.mjs
node tests/no-fake-social-proof.test.mjs
node tests/site-integrity.test.mjs
node tests/v4-readiness.test.mjs
node tests/v5-experience.test.mjs
```

Local route checks against `http://127.0.0.1:8000`:

| Route | Result |
| --- | --- |
| `/` | 200 `text/html` |
| `/sentences/` | 200 `text/html` |
| `/countdowns/` | 200 `text/html` |
| `/travel-plans/` | 200 `text/html` |
| `/good-habits/` | 200 `text/html` |
| `/perfect-coffee/` | 200 `text/html` |
| `/privacy/` | 200 `text/html` |
| `/portaflow/` | 200 `text/html` |

Browser render checks:

| Check | Result |
| --- | --- |
| Desktop viewport | `1440x1200` |
| Desktop document size | `1440x6445` |
| Mobile viewport | `390x844` |
| Mobile document size | `390x9152` |
| Horizontal overflow | None detected |
| Broken images | None detected |
| Missing image alt text | None detected |
| Floating hero phone visuals | 4 detected |
| Product sections | `products`, `sentences`, `countdowns`, `travel-plans`, `good-habits`, `perfect-coffee`, `philosophy`, `testflight` present |
| Preview-era copy on root | None detected |

External CTA checks:

| URL | Result |
| --- | --- |
| `https://apps.apple.com/gb/app/lets-build-sentences/id6761413051` | 200 |
| `https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794` | 200 |

## Deployment

GitHub Pages deployment succeeded.

| Item | Result |
| --- | --- |
| Branch | `master` |
| Source | `/` |
| Domain | `apps.leary.cloud` |
| Pages status | `built` |
| Promotion run | `27763570016` succeeded for `87286e05bf8468294dfa251c453f0d0df2ab8158` |
| Accessibility fix run | `27763889742` succeeded for `6fd6627aaf964f69f0a9e77d81342e016318f9dd` |
| Rollback tag pushed | `pre-v5-production-20260618-143444` |

## Live Verification

Live checks were run against `https://apps.leary.cloud`.

| Route | Result |
| --- | --- |
| `/` | 200 `text/html`, V5 hero present |
| `/sentences/` | 200 `text/html` |
| `/countdowns/` | 200 `text/html` |
| `/travel-plans/` | 200 `text/html` |
| `/good-habits/` | 200 `text/html` |
| `/perfect-coffee/` | 200 `text/html` |
| `/privacy/` | 200 `text/html` |
| `/portaflow/` | 200 `text/html` |

Root homepage checks:

| Check | Result |
| --- | --- |
| V5 hero present | Yes: `Beautiful tools for real family life.` |
| Old V4 hero absent | Yes |
| Sentences App Store CTA | Present |
| Countdowns App Store CTA | Present |
| TestFlight interest CTAs | Present |
| Preview labels | Absent |
| Analytics text | Absent |
| Fake rating/review text | Not detected by test suite |
| Missing image alt text across live HTML routes | 0 |

## Live Screenshot Pack

Captured from the live public domain. Browser screenshots used a cache-busting query after deployment so the browser session could not reuse stale HTML; the underlying routes are the same public pages.

Desktop screenshots are `1440x1200`:

| Route | Path |
| --- | --- |
| `/` | `reports/screenshots-live-v5/desktop-home.jpg` |
| `/sentences/` | `reports/screenshots-live-v5/desktop-sentences.jpg` |
| `/countdowns/` | `reports/screenshots-live-v5/desktop-countdowns.jpg` |
| `/travel-plans/` | `reports/screenshots-live-v5/desktop-travel-plans.jpg` |
| `/good-habits/` | `reports/screenshots-live-v5/desktop-good-habits.jpg` |
| `/perfect-coffee/` | `reports/screenshots-live-v5/desktop-perfect-coffee.jpg` |

Mobile screenshots are `390x844`:

| Route | Path |
| --- | --- |
| `/` | `reports/screenshots-live-v5/mobile-home.jpg` |
| `/sentences/` | `reports/screenshots-live-v5/mobile-sentences.jpg` |
| `/countdowns/` | `reports/screenshots-live-v5/mobile-countdowns.jpg` |
| `/travel-plans/` | `reports/screenshots-live-v5/mobile-travel-plans.jpg` |
| `/good-habits/` | `reports/screenshots-live-v5/mobile-good-habits.jpg` |
| `/perfect-coffee/` | `reports/screenshots-live-v5/mobile-perfect-coffee.jpg` |

## Remaining Issues

No blocking issues remain. GitHub Actions reports a Node.js 20 deprecation annotation from GitHub Pages internals, but the Pages build and deploy completed successfully.
