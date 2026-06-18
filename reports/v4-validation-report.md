# V4 Validation Report

Generated: 2026-06-18
Local preview: `python3 -m http.server 8000` at `http://127.0.0.1:8000`

## Commands Run

| Command | Result |
| --- | --- |
| `node tests/home-search.test.mjs` | Pass |
| `node tests/countdowns-live.test.mjs` | Pass |
| `node tests/no-fake-social-proof.test.mjs` | Pass |
| `node tests/site-integrity.test.mjs` | Pass |
| `node tests/v4-readiness.test.mjs` | Pass |
| Python route check for `/`, `/sentences/`, `/countdowns/`, `/travel-plans/`, `/good-habits/`, `/perfect-coffee/`, `/privacy/`, `/portaflow/` | All returned HTTP 200 |
| Content scan for old support email, generic Get Started, unsupported Travel Plans claims, fake social proof phrases, Analytics | No matches in site HTML |

## Screenshot Index

| Mode | Page | Route | Screenshot | Viewport | Document | Image | Horizontal overflow |
| --- | --- | --- | --- | --- | --- | --- | --- |
| desktop | Home | `/` | `reports/screenshots-v4/desktop-home.jpg` | 1440x1200 | 1440x2622 | 1440x1200 | No |
| desktop | Let's Build Sentences | `/sentences/` | `reports/screenshots-v4/desktop-sentences.jpg` | 1440x1200 | 1440x5317 | 1440x1200 | No |
| desktop | Let's Build Countdowns | `/countdowns/` | `reports/screenshots-v4/desktop-countdowns.jpg` | 1440x1200 | 1440x4433 | 1440x1200 | No |
| desktop | Let's Build Travel Plans | `/travel-plans/` | `reports/screenshots-v4/desktop-travel-plans.jpg` | 1440x1200 | 1440x4568 | 1440x1200 | No |
| desktop | Let's Build Good Habits | `/good-habits/` | `reports/screenshots-v4/desktop-good-habits.jpg` | 1440x1200 | 1440x4820 | 1440x1200 | No |
| desktop | Let's Build Perfect Coffee | `/perfect-coffee/` | `reports/screenshots-v4/desktop-perfect-coffee.jpg` | 1440x1200 | 1440x5399 | 1440x1200 | No |
| mobile | Home | `/` | `reports/screenshots-v4/mobile-home.jpg` | 390x844 | 390x5043 | 390x844 | No |
| mobile | Let's Build Sentences | `/sentences/` | `reports/screenshots-v4/mobile-sentences.jpg` | 390x844 | 390x7854 | 390x844 | No |
| mobile | Let's Build Countdowns | `/countdowns/` | `reports/screenshots-v4/mobile-countdowns.jpg` | 390x844 | 390x6500 | 390x844 | No |
| mobile | Let's Build Travel Plans | `/travel-plans/` | `reports/screenshots-v4/mobile-travel-plans.jpg` | 390x844 | 390x7639 | 390x844 | No |
| mobile | Let's Build Good Habits | `/good-habits/` | `reports/screenshots-v4/mobile-good-habits.jpg` | 390x844 | 390x7638 | 390x844 | No |
| mobile | Let's Build Perfect Coffee | `/perfect-coffee/` | `reports/screenshots-v4/mobile-perfect-coffee.jpg` | 390x844 | 390x7709 | 390x844 | No |

## Navigation Notes

- **desktop Home**: 5 homepage link(s), 4 privacy link(s), 0 TestFlight section(s), status pills: Available on App Store, Available on App Store, In Development, In Development, In Development, nav: Let's Build Apps -> ./; Home -> ./; Apps -> ./; Privacy -> ./privacy/; Support -> mailto:support@leary.cloud; home Home -> ./; apps Apps -> ./; privacy_tip Privacy -> ./privacy/
- **desktop Let's Build Sentences**: 3 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: Available on App Store, Available on App Store, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; About -> #about; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Download on App Store -> https://apps.apple.com/gb/app/lets-build-sentences/id6761413051
- **desktop Let's Build Countdowns**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: Available on App Store, Available on App Store, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Download on App Store -> https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794
- **desktop Let's Build Travel Plans**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: In Development, In Development, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Register interest -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Travel%20Plans
- **desktop Let's Build Good Habits**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: In Development, In Development, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Register interest -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Good%20Habits
- **desktop Let's Build Perfect Coffee**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: In Development, In Development, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Register interest -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Perfect%20Coffee; Register interest in TestFlight -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Perfect%20Coffee; Contact Support -> mailto:support@leary.cloud
- **mobile Home**: 5 homepage link(s), 4 privacy link(s), 0 TestFlight section(s), status pills: Available on App Store, Available on App Store, In Development, In Development, In Development, nav: Let's Build Apps -> ./; Home -> ./; Apps -> ./; Privacy -> ./privacy/; Support -> mailto:support@leary.cloud; home Home -> ./; apps Apps -> ./; privacy_tip Privacy -> ./privacy/
- **mobile Let's Build Sentences**: 3 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: Available on App Store, Available on App Store, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; About -> #about; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Download on App Store -> https://apps.apple.com/gb/app/lets-build-sentences/id6761413051
- **mobile Let's Build Countdowns**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: Available on App Store, Available on App Store, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Download on App Store -> https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794
- **mobile Let's Build Travel Plans**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: In Development, In Development, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Register interest -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Travel%20Plans
- **mobile Let's Build Good Habits**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: In Development, In Development, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Register interest -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Good%20Habits
- **mobile Let's Build Perfect Coffee**: 2 homepage link(s), 2 privacy link(s), 1 TestFlight section(s), status pills: In Development, In Development, nav: Let's Build Apps -> ../; Home -> ../; Features -> #features; Privacy -> ../privacy/; TestFlight -> #testflight; Support -> mailto:support@leary.cloud; Register interest -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Perfect%20Coffee; Register interest in TestFlight -> mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20Let%27s%20Build%20Perfect%20Coffee; Contact Support -> mailto:support@leary.cloud

## Mobile Homepage Density

- Mobile viewport checked: 390x844.
- Intro bottom: 327.75 px.
- Two-screen threshold after intro: 2015.75 px.
- Product headings visible within that range: Let's Build Sentences, Let's Build Countdowns, Let's Build Good Habits.
- Horizontal overflow detected: No.

## Link And Status Checks

- Homepage status pills render as: Available on App Store, Available on App Store, In Development, In Development, In Development.
- Every product page has a homepage link, Privacy link, Support link, TestFlight nav/section, status pill, availability block, verified-features block, and why-built section.
- App Store CTAs are present only for Sentences and Countdowns.
- No public TestFlight invite links are claimed; all TestFlight actions use interest mailto links.
- Portaflow legacy page still contains a meta refresh to `../perfect-coffee/`.

## Remaining Manual Follow-Up

- Publish real public TestFlight URLs later if Apple/TestFlight links are created.
- Replace Travel Plans and Good Habits visual previews with real app screenshots once final public screenshot sets exist.
