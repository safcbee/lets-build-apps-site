# letsbuildappshq.com

Production static website for `letsbuildappshq.com`.

## Public repository contents

- `public/` — deployed website files.
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow.
- `tests/` — public safety checks for the deployed static site.
- `marketing/` — verified app catalogue, 90-day plan and automation rules.
- `.github/workflows/weekly-marketing-pack.yml` — creates an approval-gated weekly campaign issue and CSV artifact.
- `.github/workflows/app-store-monitor.yml` — checks Apple’s public storefront and opens one launch/status alert when needed.

## Deployment

Cloudflare Pages serves `letsbuildappshq.com` from the `letsbuildappshq` project (Production branch: `main`).

- **Automatic (GitHub Actions):** `.github/workflows/cloudflare-pages.yml` runs `npm test` on every push to `master` and deploys `public/` to Production (`--branch=main`) when `CLOUDFLARE_API_TOKEN` (scoped to `Account → Cloudflare Pages → Edit`) and `CLOUDFLARE_ACCOUNT_ID` are set in repository Actions secrets.
- **Direct CLI:** Run `npm test`, then `npx wrangler pages deploy public --project-name=letsbuildappshq --branch=main`.
- **Dashboard fallback:** Use Workers & Pages → `letsbuildappshq` → Create deployment to upload `public/` to Production. The `www` host redirects to the same path on the apex domain.

The GitHub Pages workflow (`.github/workflows/pages.yml`) also uploads `public/` as a fallback copy. The Cloudflare release uses the existing Web Analytics property and the support and TestFlight forms continue to use the support Worker.

## Local checks

```sh
npm test
```

## Marketing operations

```sh
npm run marketing:pack
npm run marketing:check
```

See `marketing/README.md` for storage, authentication and approval boundaries. The system has no customer database, visitor account or automatic social publishing. The public GitHub Pages site uses Cloudflare Web Analytics. The public beacon is maintained in `scripts/templates/web-analytics.html` and included once on each canonical HTML page. Private Sites builds strip the beacon.
