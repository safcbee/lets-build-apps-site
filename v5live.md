CODEX GOAL — Promote V5 to Production at apps.leary.cloud

Mission

Promote the approved V5 website experience from /v5/ to the production homepage at:

https://apps.leary.cloud/

V5 is now the preferred design direction. V4 was useful as a stable safety net, but V5 should become the public site.

Current State

* V4 is currently live at root /.
* V5 exists separately at v5/index.html.
* V5 has been reviewed and approved as much better.
* V5 is static, GitHub Pages compatible, and already validated.
* Production domain is apps.leary.cloud.

Safety First

Before changing root production files:

1. Record current production commit:

git rev-parse HEAD

2. Create rollback tag:

git tag pre-v5-production-$(date +%Y%m%d-%H%M%S)

3. Create report:

reports/v5-production-promotion-report.md

Include rollback commit/tag.

Promotion Work

Replace the root production homepage experience with V5.

Preferred approach:

* Promote v5/index.html to root index.html.
* Preserve existing product routes:
    * /sentences/
    * /countdowns/
    * /travel-plans/
    * /good-habits/
    * /perfect-coffee/
    * /privacy/
    * /portaflow/
* Ensure all links from the new root homepage work correctly from /, not /v5/.
* Remove or rewrite any ../privacy/ or ../sentences/ links that are wrong after promotion.
* Keep /v5/ as an optional preview/archive route only if it does not confuse navigation.
* Do not delete V4 unless required; archive it if useful.

Required Checks

After promotion, verify root homepage contains V5 experience:

* Premium hero
* Floating/iPhone screenshot visuals
* Product-led sections
* Sentences App Store CTA
* Countdowns App Store CTA
* TestFlight interest CTAs
* Privacy-first copy
* No fake ratings/reviews
* No analytics/tracking/cookies

Local Validation

Run:

node tests/home-search.test.mjs
node tests/countdowns-live.test.mjs
node tests/no-fake-social-proof.test.mjs
node tests/site-integrity.test.mjs
node tests/v4-readiness.test.mjs
node tests/v5-experience.test.mjs

Update tests if they only fail because root now intentionally uses V5.

Then run route checks:

/
 /sentences/
 /countdowns/
 /travel-plans/
 /good-habits/
 /perfect-coffee/
 /privacy/
 /portaflow/

All must return HTTP 200 locally.

Live Deployment

Commit:

git add .
git commit -m "Promote V5 website experience to production"
git push origin master

Then verify GitHub Pages build succeeds.

Live Verification

Check:

https://apps.leary.cloud/
https://apps.leary.cloud/sentences/
https://apps.leary.cloud/countdowns/
https://apps.leary.cloud/travel-plans/
https://apps.leary.cloud/good-habits/
https://apps.leary.cloud/perfect-coffee/
https://apps.leary.cloud/privacy/
https://apps.leary.cloud/portaflow/

Confirm root / is now V5, not V4.

Live Screenshot Pack

Capture screenshots from the live public domain, not localhost.

Save to:

reports/screenshots-live-v5/

Capture:

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

Final Report

Create/update:

reports/v5-production-promotion-report.md

Include:

* Previous production commit
* Rollback tag
* New production commit
* Files changed
* Tests run
* Live route results
* GitHub Pages deployment status
* Screenshot paths
* Any remaining issues

Rules

* Do not redesign.
* Do not create V6.
* Do not add analytics.
* Do not add backend services.
* Do not add cookies.
* Do not change DNS.
* Do not remove verified App Store links.
* Do not invent TestFlight public links.
* Do not claim complete until https://apps.leary.cloud/ is verified live with V5.

Success Criteria

This is complete only when:

* V5 is live at https://apps.leary.cloud/
* Existing product routes still work
* GitHub Pages deployment succeeds
* Live screenshots are captured
* Rollback point exists
* Promotion report exists
