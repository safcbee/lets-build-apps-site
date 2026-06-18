# V4 Product Evidence Audit

Generated: 2026-06-18

Scope: `v4-goal.md`, current website files, Stitch export assets, sibling local app repositories under `/Users/bri/projects/Codex Projects/Apple/`, and verified Apple App Store pages where public App Store availability is claimed.

## Summary

| App | App status | Verified App Store URL | Verified TestFlight URL | Real screenshots available | Recommended CTA |
| --- | --- | --- | --- | --- | --- |
| Let's Build Sentences | Available on App Store | `https://apps.apple.com/gb/app/lets-build-sentences/id6761413051` | Missing | Yes | Download on App Store + Register interest in TestFlight |
| Let's Build Countdowns | Available on App Store | `https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794` | Missing | Yes | Download on App Store + Register interest in TestFlight |
| Let's Build Travel Plans | In Development | Missing | Missing | No final App Store screenshots found | Register interest in TestFlight + Contact Support |
| Let's Build Good Habits | In Development | Missing | Missing | No app screenshots found | Register interest in TestFlight + Contact Support |
| Let's Build Perfect Coffee | In Development | Missing | Missing | Yes, via legacy Portaflow app screenshots | Register interest in TestFlight + Contact Support |

## Evidence Details

### Let's Build Sentences

- Local repo: `/Users/bri/projects/Codex Projects/Apple/Sentences`
- Bundle ID: `com.SAFCMedia.LetsBuildSentences`
- Version metadata: `project.yml` contains `MARKETING_VERSION: 1.0.7` and `CURRENT_PROJECT_VERSION: 1`.
- App Store evidence: Apple App Store page verified at `https://apps.apple.com/gb/app/lets-build-sentences/id6761413051`.
- App Store page evidence verified on 2026-06-18: title `Let's Build Sentences`, subtitle `Sentence practice for kids`, category `Education`, developer `Brian Leary`, `Free · In-App Purchases`, iPhone/iPad support, and Data Not Collected privacy text.
- TestFlight evidence: local Fastlane beta lane exists, but no public TestFlight URL was found.
- Real screenshots available:
  - `/Users/bri/projects/Codex Projects/Apple/Sentences/marketing/app-store-screenshots/final/iphone-1-portrait-intro.png`
  - `/Users/bri/projects/Codex Projects/Apple/Sentences/marketing/app-store-screenshots/final/iphone-2-portrait-trace-off.png`
  - `/Users/bri/projects/Codex Projects/Apple/Sentences/marketing/app-store-screenshots/final/ipad-1-portrait-intro.png`
- Safe claims to keep:
  - Parent-led sentence setup.
  - One-tap sentence generation.
  - Child-friendly sentence board.
  - Letter sounds.
  - Type mode and writing mode.
  - Trace letters mode.
  - Parent voice recording.
  - iCloud sync for progress/settings.
- Claims to remove or avoid:
  - Fake ratings or review claims.
  - TestFlight availability without a verified TestFlight link.
- Screenshot gap notes: none for public marketing screenshots.

### Let's Build Countdowns

- Local repo: `/Users/bri/projects/Codex Projects/Apple/LetsBuildCountdowns`
- Bundle ID: `com.SAFCMedia.LetsBuildCountdowns`
- Version metadata: `project.yml` contains `MARKETING_VERSION: "1.1"` and `CURRENT_PROJECT_VERSION: "9"`.
- App Store evidence: Apple App Store page verified at `https://apps.apple.com/gb/app/lets-build-countdowns/id6777798794`.
- App Store page evidence verified on 2026-06-18: title `Let's Build Countdowns`, subtitle `Count down to special moments`, category `Lifestyle`, developer `Brian Leary`, free price, iPhone/iPad support, and Data Not Collected privacy text.
- Product status docs: `docs/PRODUCT_STATUS.md` states live App Store version `1.0`, TestFlight release candidate `1.1 (9)`, build status `VALID`, and TestFlight upload complete.
- TestFlight evidence: release candidate/upload evidence exists in local docs, but no public TestFlight URL was found.
- Real screenshots available:
  - `/Users/bri/projects/Codex Projects/Apple/LetsBuildCountdowns/docs/screenshots/appstore-6-9/01-hero-your-moments-next-up.png`
  - `/Users/bri/projects/Codex Projects/Apple/LetsBuildCountdowns/docs/screenshots/appstore-6-9/02-moments-list.png`
  - `/Users/bri/projects/Codex Projects/Apple/LetsBuildCountdowns/docs/screenshots/appstore-ipad/01-ipad-hero-your-moments-next-up.png`
- Safe claims to keep:
  - Create and edit Moments.
  - See Your Moments and Next Up.
  - Count down to future Moments.
  - Choose icons and colours.
  - Home Screen widgets and Lock Screen widgets.
  - Local-first design with no accounts required.
- Claims to remove or avoid:
  - Travel planning, itinerary, packing, or checklist ownership.
  - Public TestFlight access without a verified link.
- Screenshot gap notes: none for public marketing screenshots.

### Let's Build Travel Plans

- Local repo: `/Users/bri/projects/Codex Projects/Apple/FamilyTravelPlanner`
- Bundle ID: `com.SAFCMedia.FamilyTravelPlanner`
- Version metadata: Xcode project contains `MARKETING_VERSION = 1.0` and `CURRENT_PROJECT_VERSION = 12`.
- App Store evidence: no verified public App Store URL found in current website, local repo, or audit search.
- TestFlight evidence: Fastlane beta lane exists, and docs mention TestFlight/prototype workflows, but no verified public TestFlight URL was found.
- Product status docs: `docs/PRODUCT_STATUS.md` states release readiness is not TestFlight-ready until build, StoreKit, sync, archive, and migration validation are complete.
- Real screenshots available: no final App Store screenshot set found. Local `mockup.jpeg` exists but should be treated as a visual preview, not a verified product screenshot.
- Safe claims to keep:
  - Trip preparation.
  - Itineraries.
  - Booking records.
  - Document records.
  - Packing content.
  - Travel details.
  - Trip archive surfaces.
  - Local planning.
- Claims to remove or soften:
  - Collaborative trips as a release-ready/public claim.
  - Live editors.
  - No-account group planning.
  - Free app claims.
  - Automatic routes.
  - App Store availability.
  - TestFlight availability without a verified link.
- Screenshot gap notes: real public screenshots are missing.

### Let's Build Good Habits

- Local repo: `/Users/bri/projects/Codex Projects/Apple/LetsBuildGoodHabits`
- Bundle ID: `com.SAFCMedia.LetsBuildGoodHabits`
- Version metadata: `project.yml` contains `MARKETING_VERSION: 1.0` and `CURRENT_PROJECT_VERSION: 6`.
- App Store evidence: no verified public App Store URL found in current website, local repo, or audit search.
- TestFlight evidence: Fastlane beta lane exists, but no verified public TestFlight URL was found.
- README status: restamped as its own product; remaining product assets to replace before release include app icon, App Store screenshots, placeholder habit copy/static sample data, App Store Connect metadata, SKU, privacy details, and support URLs.
- Real screenshots available: no product screenshots found. Icon and splash assets exist but are not sufficient as app screenshots.
- Safe claims to keep:
  - In-development SwiftUI iPhone app identity.
  - Daily routines and habit-building positioning from the portfolio goal.
  - Calm, low-pressure routine copy.
- Claims to remove or soften:
  - App Store availability.
  - Download CTAs.
  - Android claims.
  - Template/sample/Espresso wording.
  - Nutrition/HealthKit claims on the public website unless the product direction explicitly changes.
- Screenshot gap notes: real public screenshots are missing.

### Let's Build Perfect Coffee

- Local repo: `/Users/bri/projects/Codex Projects/Apple/Portaflow`
- Legacy product: Portaflow remains legacy only and should continue migrating to Let's Build Perfect Coffee.
- Bundle ID: `com.SAFCMedia.Portaflow`
- Version metadata: `project.yml` contains `MARKETING_VERSION: 1.0` and `CURRENT_PROJECT_VERSION: 10`.
- App Store evidence: no verified public App Store URL found for Let's Build Perfect Coffee in current website, local repo, or audit search.
- TestFlight evidence: Fastlane beta lane exists for legacy Portaflow, but no verified public TestFlight URL was found.
- Real screenshots available:
  - `/Users/bri/projects/Codex Projects/Apple/Portaflow/AppStoreAssets/FinalScreenshots/dashboard.png`
  - `/Users/bri/projects/Codex Projects/Apple/Portaflow/AppStoreAssets/FinalScreenshots/newShot.png`
  - `/Users/bri/projects/Codex Projects/Apple/Portaflow/AppStoreAssets/FinalScreenshots/shotDetail.png`
  - `/Users/bri/projects/Codex Projects/Apple/Portaflow/AppStoreAssets/FinalScreenshots/beans.png`
- Safe claims to keep:
  - Brew recipes.
  - Coffee journal / shot history.
  - Grind notes.
  - Dose and timing notes.
  - Favourite beans / bean management.
  - Brewing experiments.
  - Taste notes.
  - Brew ratio and lightweight dial-in guidance.
- Claims to remove or soften:
  - App Store availability.
  - Generic productivity language.
  - Public Portaflow positioning as a primary product.
  - TestFlight availability without a verified link.
- Screenshot gap notes: real screenshots exist, but they are still under the legacy Portaflow repo and should be presented as Perfect Coffee evidence without reintroducing Portaflow as a public product.

## Site-Wide Audit Findings

- Only Sentences and Countdowns have verified public App Store links.
- No verified public TestFlight invite links were found for any app.
- TestFlight interest CTAs should use app-specific `mailto:support@leary.cloud?subject=...` links.
- The homepage needs a consistent status model and product-card CTA stack.
- Every product page needs a TestFlight interest section.
- Travel Plans, Good Habits, and Perfect Coffee should not claim public download availability yet.
- Portaflow should remain a legacy migration route only.
