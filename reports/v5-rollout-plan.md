# V5 Rollout Plan

Generated: 2026-06-18

## Current State

V5 exists as a separate static preview at `v5/index.html`. V4 remains the production GitHub Pages site at the root and should not be replaced yet.

## Recommended Rollout

1. Preview locally at `http://127.0.0.1:8000/v5/`.
2. Review on real devices: Safari and Chrome on Mac, iPhone Safari, and at least one narrow mobile viewport.
3. Confirm product copy and statuses:
   - Sentences: live App Store.
   - Countdowns: live App Store.
   - Travel Plans: in development/TestFlight interest.
   - Good Habits: in development/TestFlight interest.
   - Perfect Coffee: in development/TestFlight interest.
4. Replace temporary visual previews for in-development apps when final screenshots are available.
5. Decide whether V5 should become:
   - a preview-only route at `/v5/`, or
   - the new production homepage at `/`.
6. If approved for production, copy the V5 experience into the root deliberately and keep a rollback branch or tag for the current V4 site.
7. Deploy through GitHub Pages.
8. Post-launch, manually verify:
   - homepage loads at `https://apps.leary.cloud/`;
   - App Store CTAs open the correct Apple pages;
   - Privacy links work;
   - no fake ratings/reviews or Analytics content returned;
   - no new console errors or broken images.

## Rollback Plan

Because V4 is untouched, rollback is simple: keep the root production files as the source of truth until V5 is explicitly promoted. If V5 is promoted later, preserve the current V4 commit hash in the deployment notes so the root can be restored quickly.

## Production Readiness Notes

V5 is technically ready as a static preview. It is not yet recommended as a production replacement until the user has reviewed the visual direction and confirmed whether the more premium product-marketing style should replace the Stitch-derived V4 experience.
