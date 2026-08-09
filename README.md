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

GitHub Pages is configured to deploy through GitHub Actions. The workflow uploads `public/` as the Pages artifact.

## Local checks

```sh
npm test
```

## Marketing operations

```sh
npm run marketing:pack
npm run marketing:check
```

See `marketing/README.md` for storage, authentication and approval boundaries. The system has no customer database, visitor account, website analytics or automatic social publishing.
