# Audit Report

Source: `master-goal.md` and the current static site worktree.

## Existing Routes

| Route | Status | Notes |
| --- | --- | --- |
| `/` | Exists | Homepage for the Let's Build Apps portfolio. |
| `/sentences/` | Exists | Product page for Let's Build Sentences. |
| `/countdowns/` | Exists | Product page for Let's Build Countdowns. |
| `/good-habits/` | Exists | Product page for Let's Build Good Habits. |
| `/perfect-coffee/` | Exists | Product page for Let's Build Perfect Coffee. |
| `/travel-plans/` | Exists | Product page for Let's Build Travel Plans. |
| `/privacy/` | Exists | Privacy Policy route. |
| `/portaflow/` | Added | Legacy migration route to Let's Build Perfect Coffee. |

No dedicated support page exists. Support access is handled with `mailto:support@leary.cloud`.

## Existing Issues Found

| Issue | Evidence | Action |
| --- | --- | --- |
| Homepage used status buckets instead of portfolio ownership | Previous sections were "Available Now", "Coming Soon", and "Future Projects". | Reworked into product family and ecosystem sections. |
| Placeholder future products were public | Math Explorer, Digital Canvas, and Sound Builder appeared as concept cards. | Removed from the published homepage. |
| Some app pages had inert buttons | Good Habits, Perfect Coffee, and Travel Plans used unlinked `<button>` CTAs. | Converted to real anchors for features, support, or known App Store links. |
| Footer legal label was misleading | "Terms of Service" linked to the Privacy page. | Renamed those links to "Privacy". |
| Support access was not consistently available in page headers | App page headers had Home/Apps/Privacy but not Support. | Added Support links while preserving header styling. |
| Travel Plans overlapped Countdowns | Travel copy emphasized events and excitement rather than preparation. | Repositioned Travel Plans around itineraries, packing, places, and travel information. |
| Portaflow had no migration route | `/portaflow/` did not exist. | Added a static migration page with redirect to `/perfect-coffee/`. |
| Some feature claims were too specific for available evidence | Examples included sync dashboards, community streaks, automatic routes, no-account collaboration, TDS analysis, and hundreds of icons. | Softened or removed claims and kept broad product-purpose copy. |

## Feature Accuracy Review

Evidence available in this repo is limited to the Stitch export, the current static pages, supplied screenshots, and known App Store links for Sentences and Countdowns. No app source code is present, so broad product-purpose claims are preferred over detailed implementation claims.

| App | Current claimed features | Verified from project evidence | Lacking evidence or softened |
| --- | --- | --- | --- |
| Let's Build Sentences | Sentence building, handwriting practice, voice/speech support, child-friendly learning. | Stitch export and existing App Store link support the product page and app availability. | Detailed claims should stay broad unless app source or store copy is supplied. |
| Let's Build Countdowns | Visual countdowns, event icons, reminders, progress bars, App Store availability. | App Store URL is known and present. Stitch export supports the countdown positioning. | "Hundreds of icons" was softened to friendly event icons. |
| Let's Build Good Habits | Daily routines, consistency, calm habit tracking, simple routine overview. | Stitch export supports routine/habit positioning. | Sync, family dashboard, community streaks, and Android/iOS download claims were removed or softened. |
| Let's Build Perfect Coffee | Coffee recipes, brew notes, grind notes, timer, recipe comparisons, taste notes. | Stitch export and Portaflow rebrand goal support Perfect Coffee as the coffee product. | Water chemistry, TDS analysis, burr-specific mapping, and download claims were removed or softened. |
| Let's Build Travel Plans | Trip preparation, itineraries, packing/prep, saved places, travel details. | Stitch export and master goal support Travel Plans as preparation. | Automatic routes, no-account voting, live editors, templates, and free app claims were removed or softened. |

## Missing Navigation Before Fixes

Every app page already had a logo route back to the homepage, but header-level support access was missing and app-page "Home" labels often pointed to the local page top rather than the main site homepage. These were aligned so visitors have a clear path back to Let's Build Apps and to Privacy/Support.
