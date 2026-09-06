# TestFlight requests and private review

The public `/testflight/?app=…` form uses the same protected `/submit` endpoint as support. Every request requires consent, an app, a first name, an invitation email, device details and a testing message. Turnstile, input limits, origin checks and submission limits run before storage or email. The static website contains no owner inbox, Apple credential or review secret.

A new request is saved in D1 as `pending`, then a private review link is emailed to the configured owner inbox. Opening the link only displays the request. Explicitly choosing **Approve access** or **Decline** records a decision once, for that request and app. Decisions must be made within 14 days. The link remains usable to read status for up to 90 days. Its secret is carried in a URL fragment, removed from browser history when opened, and sent only in an HTTPS POST body. Do not forward review emails. There is no public request list.

The Worker runs every 15 minutes independently of a local computer. It processes at most five approved requests per run. Requests waiting for a build are checked again after one hour. It will only use a group named **Website testers — approved requests**, belonging to the requested app, with external testing enabled and public links disabled. There must be exactly one matching group and an assigned, valid, unexpired build whose external state is `IN_BETA_TESTING`.

As of 6 September 2026, all ten apps have this separate external group, but no eligible external build. The existing builds require external Beta App Review. In App Store Connect, choose the app → TestFlight → **Website testers — approved requests**, assign the intended build, complete the required test information and submit it for Apple's external review. Once Apple approves it, start external testing / notify testers as required by Apple. This service never submits builds for review, enables public links or creates internal App Store Connect users. Approved website requests wait until these prerequisites are complete.

For an approved request with a ready build, the service finds or creates the Apple beta tester and adds only the requested app's group. Apple handles the invitation. The service checks group membership and emails the owner the outcome. A recorded `invited` state confirms group assignment; it does not prove email delivery, acceptance or installation. There is no automatic invitation resend. Existing members do not get repeatedly added.

## Deployment and secrets

The checked-in Wrangler config binds `TESTFLIGHT_DB` and a `*/15 * * * *` cron. Apply `wrangler d1 migrations apply lets-build-testflight-requests --remote` before deploying this version. Preserve the support service's existing email, Turnstile and rate-limit bindings.

Configure these additional Worker secrets through Wrangler, never through public files:

- `TESTFLIGHT_REVIEW_SECRET`: a cryptographically random secret of at least 32 bytes. Rotating it invalidates outstanding private links.
- `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`: the App Store Connect API credential used for this account's TestFlight management. Keep the private key in Worker secrets.

`GET /health` reports support readiness and TestFlight configuration readiness. It checks presence of bindings and secrets, not Apple authorization, group readiness or mailbox delivery. The App Store Connect key must remain valid. D1 contains personal request details and must remain accessible only to the operator. Never expose D1 through a public admin endpoint.

## Failures, duplicates and retention

D1 leases serialize overlapping background runs. Read failures and Apple rate limits retry after an hour. An uncertain Apple write, interrupted onboarding, missing API permission or unexpected response stops that request as `needs_attention` and emails the owner. It does not automatically resend an invitation.

For `needs_attention`, inspect the private request and its recorded tester/group/build IDs, then verify actual membership in App Store Connect before deciding on recovery. Do not reset a request or resend an invitation without checking whether Apple already completed the operation. Any recovery must preserve the original explicit approval and its selected app. An intentionally declined request must never be moved into onboarding.

Repeated submissions for the same app and case-insensitive email reuse the original request for its retention period. They do not create additional owner emails or undo a decision. A person needing a correction can use support. Pending requests expire after 14 days; request data and audit events are removed after 90 days by the next cron run. Mailbox retention and Apple's tester membership are separate. Deleting D1 data does not revoke TestFlight access; removal requests require removing the Apple group membership as well.

## Validation

Run `npm test` from the repository root, and `npm run check` here. Tests use an in-memory SQLite database, fake email bindings and a fake Apple API. They cover explicit approval, link expiry, cross-origin and invalid-token rejection, duplicates, overlapping runs, build eligibility, uncertain writes and retention. They send no emails and create no real testers. Live rejection checks must leave D1 empty and never call Apple. A genuine end-to-end test needs an actual request, an explicit owner approval and an Apple-approved external build.
