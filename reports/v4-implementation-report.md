# V4 Implementation Report

Generated: 2026-06-18

## Summary

Updated the Let's Build Apps static site into a clearer product showcase with real evidence, availability status, TestFlight interest paths, and honest app-status language while preserving the existing Stitch visual system. No backend, analytics, cookies, auth, tracking, newsletter service, deployment, or GitHub push was added.

## App Status Model

| App | Status | App Store | TestFlight | Primary CTA | Secondary CTA | Screenshot treatment |
| --- | --- | --- | --- | --- | --- | --- |
| Let's Build Sentences | Available on App Store | Verified: https://apps.apple.com/gb/app/lets-build-sentences/id6761413051 | No public link verified | Download on App Store | Register interest in TestFlight | Real app screenshots |
| Let's Build Countdowns | Available on App Store | Verified: https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794 | No public link verified | Download on App Store | Register interest in TestFlight | Real app screenshots |
| Let's Build Travel Plans | In Development | Missing | No public link verified | Register interest in TestFlight | Contact Support | Visual preview only |
| Let's Build Good Habits | In Development | Missing | No public link verified | Register interest in TestFlight | Contact Support | Visual preview only |
| Let's Build Perfect Coffee | In Development | Missing | No public link verified | Register interest in TestFlight | Contact Support | Real coffee app screenshots from evidence set |

## Files Changed

| File | Change |
| --- | --- |
| `index.html` | Updated hero positioning, product availability groups, status pills, product-card CTAs, compact mobile card layout, trust copy, and horizontal overflow protection. |
| `sentences/index.html` | Added App Store status, real screenshots, availability block, verified features, why-built copy, TestFlight interest section, and TestFlight nav link. |
| `countdowns/index.html` | Added App Store status, real screenshots, availability block, verified features, why-built copy, TestFlight interest section, and TestFlight nav link. |
| `travel-plans/index.html` | Replaced unsupported collaboration/free/template language with trip-preparation language; added in-development status, visual-preview label, availability block, verified features, why-built copy, and TestFlight interest section. |
| `good-habits/index.html` | Replaced pressure-heavy habit language with calmer routine copy; added in-development status, visual-preview label, availability block, verified features, why-built copy, and TestFlight interest section. |
| `perfect-coffee/index.html` | Replaced generic Get Started CTAs with TestFlight/support CTAs; added in-development status, real screenshot evidence, coffee-native verified features, why-built copy, and TestFlight interest section. |
| `privacy/index.html` | Updated privacy copy to avoid outdated local-only claims while preserving no tracking/no analytics/no account positioning. |
| `assets/product-evidence-v4/` | Added copied evidence assets used by the site: real screenshots where available and visual previews where no verified screenshots exist. |
| `tests/countdowns-live.test.mjs` | Updated expectations for the V4 Available Now grouping and TestFlight section. |
| `tests/v4-readiness.test.mjs` | Added V4 assertions for status pills, TestFlight sections, app-specific mailto links, no dead Get Started CTAs, Portaflow redirect, @leary.cloud mailto links, and unsupported claim removal. |
| `reports/v4-product-evidence-audit.md` | Created and updated the evidence audit with current App Store evidence, statuses, claims to keep/remove, and screenshot gaps. |
| `reports/screenshots-v4/` | Added full-page rendered desktop and mobile screenshots for the required routes. |

## Notes

- No verified public TestFlight invite URL was found, so all TestFlight paths use app-specific `mailto:support@leary.cloud?subject=...` interest links.
- Portaflow remains only as a legacy redirect/migration route to Perfect Coffee.
- The website does not display fake ratings, fake reviews, fabricated user counts, or misleading social proof.
