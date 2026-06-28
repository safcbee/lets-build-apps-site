# Design Polish Report

Date: 2026-06-23

## Summary

The site remains static and GitHub Pages friendly. Changes focused on production-safe polish: stronger product evidence, fewer generated/lifestyle visuals, more honest status framing, cleaner mobile behavior, and less decorative UI that implies unsupported functionality.

## Visual Improvements

| Area | Improvement |
| --- | --- |
| Homepage | Shifted the palette away from a cream/orange-only feel with a cleaner green-blue paper tone, softened grid texture, and tighter trust copy. |
| Homepage | Made reveal content visible by default so the hero is never blank if JavaScript is slow or unavailable. |
| Countdowns | Replaced fake timer card with real app screenshots in the hero. |
| Countdowns | Rebuilt the feature language and visuals around anticipation, milestones, icons, widgets, and visible progress. |
| Sentences | Replaced generated child/lifestyle imagery with actual app screenshots and a calm abstract practice panel. |
| Good Habits | Replaced generated parent/child and reward imagery with the existing product preview plus simple abstract UI. |
| Perfect Coffee | Replaced generated espresso photography and fake phone UI with actual product evidence screenshots. |
| Travel Plans | Replaced scenic/generated imagery and invented itinerary details with the existing product preview and abstract workflow cards. |
| Privacy | Removed cursor-follow glow decoration and made the top-right action a clear Home link. |
| Mobile | Fixed Countdowns mobile TestFlight button clipping by allowing wrapped text to use natural height. |

## Removed or Reduced

- Generated lifestyle/product-implying images on active app pages.
- Fake/invented event details such as named birthdays, named trips, specific dates, city/map art, and sample itinerary stops.
- Inactive notification/settings-style decoration.
- Cursor-follow decoration on Privacy.
- Broad claims not directly supported by the current product evidence.

## Evidence

Before full-page screenshots are in:

- `reports/screenshots-2026-audit/before/`

After full-page screenshots are in:

- `reports/screenshots-2026-audit/after/`

Clean first-viewport screenshots are in:

- `reports/screenshots-2026-audit/viewport/before/`
- `reports/screenshots-2026-audit/viewport/after/`

Screenshots were captured locally from `http://localhost:4173/` at:

- Desktop: `1440x1000`
- Mobile: `390x844`

## Validation

All active routes returned `200 text/html` locally, and the full Node validation suite in `tests/` passed after the content and design changes.
