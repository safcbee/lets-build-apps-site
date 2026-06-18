CODEX GOAL — Website V4: Real Product Evidence + TestFlight Readiness

Mission

Upgrade apps.leary.cloud from a polished portfolio into a credible product showcase backed by real app evidence, clear availability, and a consistent TestFlight pathway for every app.

Do not focus on colour/layout polish unless required to support the product evidence work.

Core Objective

Every app page must answer:

1. What is this app?
2. Is it available now?
3. Can I download it?
4. Can I join TestFlight?
5. What real features exist?
6. What is still in development?
7. Why does this app exist?

Portfolio Apps

Update all five public apps:

* Let’s Build Sentences
* Let’s Build Countdowns
* Let’s Build Travel Plans
* Let’s Build Good Habits
* Let’s Build Perfect Coffee

Portaflow remains legacy only and should continue redirecting/migrating to Perfect Coffee.

Required Audit First

Before editing, audit available evidence for each app:

* Local app repo
* README
* product docs
* App Store links
* TestFlight links if present
* screenshots
* simulator screenshots
* existing website assets
* release/version metadata

Create:

reports/v4-product-evidence-audit.md

For each app, record:

* App status: Available Now / TestFlight / In Development / Coming Soon
* App Store URL if verified
* TestFlight URL if verified
* Real screenshots available
* Missing screenshots
* Claims that should be removed
* Claims that are safe to keep
* Recommended CTA

Availability Model

Use a consistent status model site-wide.

Allowed statuses:

* Available on App Store
* Join TestFlight
* In Development
* Coming Soon

Do not claim App Store availability unless verified.

Do not claim TestFlight availability unless a real TestFlight link exists.

If no TestFlight link exists yet, use:

Register interest in TestFlight

linking to:

mailto:support@leary.cloud?subject=TestFlight%20Interest%20-%20APP_NAME

Required CTA Rules

Each app page must have a clear CTA stack:

If App Store link exists

Primary CTA:

Download on App Store

Secondary CTA:

Join TestFlight if a verified TestFlight link exists, otherwise Register interest in TestFlight

If no App Store link exists

Primary CTA:

Register interest in TestFlight

Secondary CTA:

Contact Support

Homepage product cards

Each product card should show:

* Status pill
* Primary CTA
* Learn More link

Examples:

* Available on App Store
* TestFlight planned
* In Development
* Coming Soon

TestFlight Integration

Add a consistent TestFlight section to each app page.

Section title:

Help shape APP_NAME

Body:

Want to try upcoming versions before release? Register your interest in TestFlight and help improve the app before it reaches everyone.

CTA:

* Verified TestFlight link if available
* Otherwise mailto registration link

Use app-specific subject lines:

* TestFlight Interest - Let's Build Sentences
* TestFlight Interest - Let's Build Countdowns
* TestFlight Interest - Let's Build Travel Plans
* TestFlight Interest - Let's Build Good Habits
* TestFlight Interest - Let's Build Perfect Coffee

Homepage Changes

Replace the weak homepage hero with stronger positioning:

Simple apps for family life.

Supporting copy:

Learning, planning, habits, travel, countdowns, and coffee — each app is designed with one clear purpose.

Add product availability grouping:

Available Now

* Let’s Build Sentences
* Let’s Build Countdowns

Only include these if verified.

In Development

* Let’s Build Travel Plans
* Let’s Build Good Habits
* Let’s Build Perfect Coffee

Adjust if audit evidence says otherwise.

Add a portfolio trust section:

Real apps. Focused jobs.

Copy:

Every Let's Build app is designed around one useful job, with clear availability, transparent development status, and simple ways to try what is ready.

Product Page Changes

Each product page must include:

1. Hero with status pill
2. Real screenshot area
3. Availability block
4. Key verified features
5. Why we built this
6. TestFlight interest block
7. Privacy/support links

Screenshot Requirements

Use real app screenshots where available.

If real app screenshots are not available:

* Do not invent new mock screenshots.
* Keep existing concept visuals but label them as visual previews only if needed.
* Add a screenshot gap note to the audit report.
* Prefer a simple app-status block over fake product imagery.

Codex should not generate AI images.

Product-Specific Copy Direction

Let’s Build Sentences

Positioning:

Helping children build confidence with language through calm sentence-building practice.

Why we built this:

Learning apps can easily become noisy, distracting, or over-complicated. Sentences is designed to stay calm, focused, and child-friendly.

CTA priority:

* App Store if verified
* TestFlight interest for future versions

Let’s Build Countdowns

Positioning:

Make important moments feel closer.

Why we built this:

Families often have birthdays, holidays, trips, and milestones to look forward to. Countdowns gives those moments a simple, visual place to live.

CTA priority:

* App Store if verified
* TestFlight interest for upcoming versions

Let’s Build Travel Plans

Positioning:

The countdown gets you excited. Travel Plans gets you ready.

Why we built this:

Travel planning often gets scattered across notes, messages, screenshots, bookings, and packing lists. Travel Plans is intended to bring trip preparation into one calm place.

Important:

Remove or soften unsupported claims such as:

* Collaborative trips
* Live editors
* No-account group planning
* Free app claims
* Automatic routes

CTA priority:

* Register interest in TestFlight
* Contact Support

Let’s Build Good Habits

Positioning:

Build better routines without the noise.

Why we built this:

Many habit apps become pressure systems full of streak anxiety, notifications, and social comparison. Good Habits should feel calmer: a simple place to notice progress and build consistency.

Important:

Remove any remaining template/sample/Espresso wording.

CTA priority:

* Register interest in TestFlight
* Contact Support

Let’s Build Perfect Coffee

Positioning:

Every great coffee starts with a better recipe.

Why we built this:

Coffee improvement depends on remembering what changed: beans, grind, dose, time, method, and taste. Perfect Coffee is designed to make experiments easy to record and repeat.

Feature language should feel coffee-native:

* Brew recipes
* Coffee journal
* Grind notes
* Dose and timing notes
* Favourite beans
* Brewing experiments
* Taste notes

Avoid generic Portaflow/productivity language.

CTA priority:

* Register interest in TestFlight
* Contact Support

Mobile Improvements

Fix mobile homepage density.

Goal:

A mobile visitor should understand the full product family quickly.

Requirements:

* Compress product cards on mobile.
* Avoid giant vertical cards.
* Show at least three products within the first two mobile screens after the intro.
* Ensure CTAs are thumb-friendly.
* Avoid sticky elements covering content.
* Check mobile pages for repeated headers or duplicated sections.

Navigation Fixes

Ensure every page has:

* Home
* Features or Apps
* Privacy
* Support
* TestFlight/Register Interest where appropriate

Do not leave generic Get Started buttons unless they link to a meaningful destination.

Every CTA must either:

* Go to App Store
* Go to TestFlight
* Open mailto support/TestFlight interest
* Scroll to a real section

No dead buttons.

Reports Required

Create or update:

1. reports/v4-product-evidence-audit.md
2. reports/v4-implementation-report.md
3. reports/v4-validation-report.md
4. reports/screenshots-v4/

Screenshot Pack Required

Capture after implementation:

Desktop:

* /
* /sentences/
* /countdowns/
* /travel-plans/
* /good-habits/
* /perfect-coffee/

Mobile:

* /
* /sentences/
* /countdowns/
* /travel-plans/
* /good-habits/
* /perfect-coffee/

Validation Required

Run existing tests:

* home-search
* countdowns-live
* no-fake-social-proof
* site-integrity

Add or update tests to verify:

* Every product has a status pill
* Every product page has TestFlight section
* No dead Get Started links
* No unsupported collaborative trips claim unless verified
* Portaflow still redirects/migrates to Perfect Coffee
* All mailto links use @leary.cloud
* Mobile homepage does not overflow horizontally

Deliverables

Return:

* Audit summary
* Files changed
* Status assigned to each app
* App Store/TestFlight links found or missing
* Screenshot paths
* Validation commands and results
* Any manual follow-up needed

Safety Rules

Do not deploy unless explicitly asked.

Do not invent TestFlight links.

Do not invent App Store links.

Do not fabricate screenshots.

Do not reintroduce Portaflow as a public product.

Do not add analytics, cookies, tracking, backend code, or newsletter services.
