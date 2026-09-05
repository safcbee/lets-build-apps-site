# Private support delivery

The public form at `/support/` posts to this Cloudflare Worker. It delivers only to the existing verified support destination. The inbox address and Turnstile secret are not shipped to the browser or committed here.

## Configuration

Install the pinned tooling with `npm ci` in this directory. Configure three Worker secrets using `wrangler secret put`: `SUPPORT_TO` (the verified existing recipient), `SUPPORT_FROM` (a sender on the Email Routing domain), and `TURNSTILE_SECRET` (the production widget secret). Do not place real values in tracked files. `public/assets/support-config.json` contains only the public widget key and endpoint.

Run `npm run check`, then `npm run deploy`. Regenerate types after binding changes. Keep the allowed origins, widget hostname allowlist and frontend config consistent when changing domains. The support service must be ready before publishing the static form.

## Protection and privacy

Every delivery requires a server-validated Turnstile token with the expected action and hostname. The Worker checks origins, field lengths and types, total streamed request size, email header injection, and a honeypot. It allows 10 attempts and 3 verified deliveries per minute per hashed IP at each Cloudflare location. Distributed attacks may need additional Cloudflare rules. The recipient and subject are server-controlled; the customer's email is used only for Reply-To.

Delivery is awaited before returning a reference. If delivery cannot be confirmed, the frontend retains the message for retry. There is no separate ticket database or automatic customer acknowledgement. Application logs contain event names and successful request references, not message contents, reply addresses or tokens. Cloudflare and the destination mailbox process the request as described in the website privacy notice.

## Checks

From the repository root, `npm test` exercises success and failure cases using fake bindings; it does not send email. `GET /health` reports whether the required bindings and secrets are present; it does not prove mailbox delivery. Live invalid-token checks must return 403 without delivering.

For browser QA use Cloudflare's official dummy Turnstile keys only in a local preview, with a local mock endpoint. Never deploy dummy keys or a verification bypass. A real delivery check sends an email and requires explicit authorization. Browser access and mailbox delivery are separate checks and must not be reported as tested when unavailable.
