# V4 Live Deployment Report

Generated: 2026-06-18, approximately 14:05 BST

## Deployment Summary

| Item | Result |
| --- | --- |
| Website commit verified live | `9f24f6f085de233f5586e5786f4554124352570d` |
| Branch pushed | `master` |
| Remote | `https://github.com/safcbee/lets-build-apps-site.git` |
| GitHub Pages source | `master` / root `/` |
| Custom domain | `apps.leary.cloud` |
| GitHub Pages status | `built` |
| GitHub Pages run | `pages build and deployment`, conclusion `success` |
| HTTPS | Enforced |

## Live Route Results

| Route | HTTP status | V4 content verified | Notes |
| --- | --- | --- | --- |
| `/` | 200 | Pass | Hero, status pills, TestFlight interest, App Store links, support/privacy emails verified. |
| `/sentences/` | 200 | Pass | Available status, App Store CTA, TestFlight interest, support email verified. |
| `/countdowns/` | 200 | Pass | Available status, App Store CTA, TestFlight interest, support email verified. |
| `/travel-plans/` | 200 | Pass | In-development status, TestFlight interest, support email verified. |
| `/good-habits/` | 200 | Pass | In-development status, TestFlight interest, support email verified. |
| `/perfect-coffee/` | 200 | Pass | Perfect Coffee branding, in-development status, TestFlight interest verified. |
| `/privacy/` | 200 | Pass | February 2026 effective date, support and privacy emails verified. |
| `/portaflow/` | 200 | Pass | Legacy page contains meta refresh to `../perfect-coffee/`. Browser screenshot lands on Perfect Coffee. |

## DNS Results

`dig apps.leary.cloud` returned:

```text
apps.leary.cloud. 300 IN CNAME safcbee.github.io.
safcbee.github.io. 3600 IN A 185.199.108.153
safcbee.github.io. 3600 IN A 185.199.109.153
safcbee.github.io. 3600 IN A 185.199.110.153
safcbee.github.io. 3600 IN A 185.199.111.153
```

`dig CNAME apps.leary.cloud` returned:

```text
apps.leary.cloud. 300 IN CNAME safcbee.github.io.
```

`nslookup apps.leary.cloud` returned:

```text
apps.leary.cloud canonical name = safcbee.github.io.
safcbee.github.io addresses:
185.199.111.153
185.199.110.153
185.199.109.153
185.199.108.153
```

## Live Content Checks

| Check | Result |
| --- | --- |
| Homepage V4 hero: `Simple apps for family life` | Pass |
| Status pills: `Available on App Store`, `In Development` | Pass |
| TestFlight interest links | Pass |
| Sentences App Store link | Pass |
| Countdowns App Store link | Pass |
| Perfect Coffee branding | Pass |
| Portaflow redirect/migration | Pass |
| `support@leary.cloud` | Pass |
| `privacy@leary.cloud` | Pass |
| No old support email | Pass |
| No generic `Get Started` CTAs | Pass |
| No fake social proof phrases | Pass |
| No stale tracking-section label | Pass |
| No unsupported `Collaborative Trips` claim | Pass |

## Screenshot Evidence

Screenshots were captured from `https://apps.leary.cloud/`, not localhost.

Desktop:

- `reports/screenshots-live-v4/desktop-home.jpg`
- `reports/screenshots-live-v4/desktop-sentences.jpg`
- `reports/screenshots-live-v4/desktop-countdowns.jpg`
- `reports/screenshots-live-v4/desktop-travel-plans.jpg`
- `reports/screenshots-live-v4/desktop-good-habits.jpg`
- `reports/screenshots-live-v4/desktop-perfect-coffee.jpg`
- `reports/screenshots-live-v4/desktop-privacy.jpg`
- `reports/screenshots-live-v4/desktop-portaflow.jpg`

Mobile:

- `reports/screenshots-live-v4/mobile-home.jpg`
- `reports/screenshots-live-v4/mobile-sentences.jpg`
- `reports/screenshots-live-v4/mobile-countdowns.jpg`
- `reports/screenshots-live-v4/mobile-travel-plans.jpg`
- `reports/screenshots-live-v4/mobile-good-habits.jpg`
- `reports/screenshots-live-v4/mobile-perfect-coffee.jpg`

## Remaining Issues

None found. V4 is pushed, GitHub Pages is built from `master` root, DNS points to GitHub Pages, HTTPS is enforced, and the public domain serves the V4 homepage and app routes.
