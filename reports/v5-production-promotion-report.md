# V5 Production Promotion Report

Generated: 2026-06-18

## Summary

V5 is being promoted from `/v5/` to the production homepage at `https://apps.leary.cloud/`.

## Rollback Point

| Item | Value |
| --- | --- |
| Previous production commit | `9f24f6f085de233f5586e5786f4554124352570d` |
| Rollback tag | `pre-v5-production-20260618-143444` |

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

Pending commit, push, and GitHub Pages verification.

## Live Verification

Pending live route checks.

## Live Screenshot Pack

Pending capture to `reports/screenshots-live-v5/`.

## Remaining Issues

Pending final verification.
