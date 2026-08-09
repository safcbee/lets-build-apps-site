# Let’s Build Apps HQ — 90-day marketing plan

Start date: 10 August 2026  
Owner: Brian Leary  
Primary outcome: verified first-time App Store downloads and paid-feature conversion, app by app

## The strategy in one sentence

Market one useful moment at a time: show a real workflow from one current app, match the message to the first App Store screenshots, and measure the resulting App Store action.

The portfolio is broad, so the brand should provide trust while each app supplies the specific reason to act. A parent looking for calm handwriting practice should never have to decode a general “nine apps” campaign; a photographer should land directly on Better Pictures. The owned social profiles are [@letsbuildappshq on Instagram](https://www.instagram.com/letsbuildappshq/), [@letsbuildappshq on X](https://x.com/letsbuildappshq) and [@letsbuildappshq on YouTube](https://www.youtube.com/@letsbuildappshq).

## The operating rhythm

Every Monday, GitHub creates a review issue for one focus app. It contains verified claims, current approved screenshots, a short-video brief, ready-to-review captions, an email draft, alt text and a scheduler-ready CSV. A person approves the pack before anything is posted.

The weekly source material is deliberately small:

- One 20–30 second recording of a real workflow.
- One four-panel carousel: moment, action, result, exact purchase/privacy fact.
- One founder note explaining a real product decision.

Those three pieces are adapted into an Instagram Reel and carousel, a YouTube Short, an X post, a Pinterest pin where relevant and a LinkedIn founder post. Specialist communities are handled manually and helpfully; no bot posts to groups, Reddit, photography forums or coffee communities.

## Thirteen-week campaign calendar

| Week | Focus | Primary story | CTA |
|---|---|---|---|
| 10–16 Aug | Sentences | Hear, trace and write one complete sentence at a time | Download |
| 17–23 Aug | My World | Turn summer travel into routes, memories and stories | Download |
| 24–30 Aug | Countdowns | Make the next meaningful date visible | Download |
| 31 Aug–6 Sep | Better Pictures | Subject + lens + light becomes a practical starting setup | Download |
| 7–13 Sep | Sentences | Calm handwriting practice for a new routine | Download |
| 14–20 Sep | My World | A travel story is richer than a pin count | Download |
| 21–27 Sep | Countdowns | Move from Next Up and widgets into Memory Mode | Download |
| 28 Sep–4 Oct | Better Pictures | Plan for changing autumn light, then review the frame | Download |
| 5–11 Oct | Portfolio | Choose the app for the moment; explain purchase models app by app | Browse |
| 12–18 Oct | Family Trips | Recruit suitable testers for the invited family space | Register interest |
| 19–25 Oct | Travel Plans | Recruit testers for Plan, Pack, Pay, Paperwork and People | Register interest |
| 26 Oct–1 Nov | Paw Care + Weddings | Two separate progress stories with separate destinations | TestFlight / wedding site |
| 2–8 Nov | Data-led encore | Repeat the live-app story with the strongest measured conversion | Download |

Better Coffee is the interrupt. The public-status monitor checks Apple every six hours. When its public listing appears, it opens a launch alert; after the listing, screenshots and purchase terms are verified, a seven-day Better Coffee launch sprint replaces that week and the rotation moves back seven days.

## Better Coffee launch sprint

- Day 0: concise availability announcement with the verified App Store link.
- Day 1: bean shelf → guided pull → result screen recording.
- Day 3: successful same-bean history and one explainable next adjustment.
- Day 5: exact free essentials versus monthly, annual and lifetime Pro.
- Day 7: privacy and founder story: no account, advertising or analytics SDK.

Never publish a launch date before Apple makes the listing public. A detected listing is an alert, not permission to announce.

## Channel jobs

| Channel | Job |
|---|---|
| App Store | Primary conversion surface; first three screenshots must continue the campaign promise |
| Instagram · @letsbuildappshq | Show family, travel and everyday workflows clearly and visually |
| X · @letsbuildappshq | Share concise release notes, product details and independent-building context |
| [YouTube · @letsbuildappshq](https://www.youtube.com/@letsbuildappshq) | Demonstrate a complete app workflow through Shorts and longer walkthroughs |
| Pinterest | Capture planning and inspiration intent for Countdowns, My World, Sentences and Weddings |
| LinkedIn | Brian’s decisions on focus, privacy, pricing and independent product development |
| Photography / coffee communities | Participate manually with useful examples and respect each community’s promotion rules |

## Measurement

Use Apple App Analytics as the primary source of truth:

- Product-page views.
- First-time downloads.
- Product-page conversion.
- Campaign-attributed usage, sales and subscriptions where available.
- Pro or Plus conversion for apps with paid features.
- TestFlight interest emails and accepted invitations for pre-release apps.

Weeks 1–4 establish the baseline. No growth percentage is published until that baseline exists.

Apple campaign links require the provider token from App Store Connect. Add it once as the non-secret GitHub repository variable `APPLE_PROVIDER_TOKEN`; the weekly generator then creates a distinct campaign token for each app, week and channel. Without it, the system uses the verified App Store URL and labels it as an untracked fallback. Apple only shows campaign results after enough attributed first-time downloads, so quiet campaigns should be treated as inconclusive rather than failures.

The website intentionally has no analytics, cookies or tracking pixels. Do not imply website click counts. Adding site analytics, a mailing-list service or automated social posting is a separate privacy and credential decision.

## Optimisation loop

### Days 1–30: establish the baseline

- Run one clean message per live app.
- Verify App Store screenshots and campaign-message continuity.
- Record the same small KPI set for every campaign.
- Build a library of real screen recordings; do not use stock or fabricated social proof.

### Days 31–60: repeat what earns attention

- Reuse the strongest hook with a new current workflow.
- Create one App Store Custom Product Page for the strongest app and most distinct audience intent.
- Start with Sentences (guided first writing vs parent-created practice) or Better Pictures (starting setup vs private review), based on measured traffic.
- Keep one message and one destination per campaign.

### Days 61–90: test the conversion surface

- Run a Product Page Optimisation test only on an app with enough traffic to learn something.
- Test one hypothesis first, preferably screenshot order or the first-screen promise.
- Prepare an Apple featuring nomination for a genuine launch or substantial update, never a routine maintenance release.
- Use the final week for the best measured campaign, not the founder’s favourite.

## Non-negotiable truth rules

- Use only claims in `marketing/apps.json` or re-verify the product before adding one.
- Use only each app’s `approvedAssets`; old screenshot folders are not campaign sources.
- Keep Family Trips and Travel Plans separate in every message.
- State the exact commercial model for the app being promoted.
- Do not invent reviews, awards, users, endorsements, dates or urgency.
- Do not claim diagnosis, treatment, guaranteed learning, guaranteed photographs or guaranteed coffee results.
- Keep public posting approval-gated until social accounts, permissions and review rules are deliberately connected.

## Official operating references

- [Apple campaign links](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links)
- [Apple Custom Product Pages](https://developer.apple.com/app-store/custom-product-pages/)
- [Apple Product Page Optimisation](https://developer.apple.com/app-store/product-page-optimization/)
- [Apple featuring nominations](https://developer.apple.com/app-store/getting-featured/)
- [GitHub scheduled issue creation](https://docs.github.com/en/actions/tutorials/manage-your-work/schedule-issue-creation)
