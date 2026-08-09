# Marketing automation

This folder is the source of truth and approval layer for Let’s Build Apps HQ marketing.

## What is stored

- `apps.json` — current public stage, App Store IDs, purchase wording, approved claims and current asset allowlists for all nine apps.
- `PLAN.md` — the 90-day campaign strategy and measurement rules.
- GitHub Issues labelled `marketing-pack` — weekly review queues generated from the catalogue.
- GitHub Actions artifacts — the Markdown pack and scheduler-ready CSV for each run.
- One deduplicated GitHub Issue labelled `app-store-monitor` only when Apple’s public storefront differs from the catalogue.

The GitHub repository is public, so generated packs must contain public-safe marketing material only. No customer records, mailing lists, tokens or unpublished confidential material belong here.

## Authentication and services

Version 1 uses GitHub Actions and Apple’s public storefront lookup only. GitHub supplies a short-lived repository-scoped `GITHUB_TOKEN` to create issues; there is no new database, site account, paid service or visitor authentication.

The optional repository variable `APPLE_PROVIDER_TOKEN` is the public provider token used inside Apple campaign URLs. It is not an App Store Connect API credential. Without it, generated packs use the verified App Store listing and clearly flag that campaign attribution is not configured.

App Store Connect Analytics export, mailing-list storage and social auto-posting are intentionally not connected. Each would require new credentials, processors and approval rules.

The public brand profiles are `@letsbuildappshq` on X, Instagram and YouTube. Generated weekly packs currently include copy for X and Instagram; YouTube production is connected through the campaign plan. Publishing remains human-approved, and this repository stores no social login or access token.

## Commands

Generate the next scheduled live-app pack:

```sh
npm run marketing:pack
```

Generate a specific Monday and app:

```sh
node scripts/generate-marketing-pack.mjs --week 2026-08-10 --app sentences
```

Check Apple’s public GB storefront:

```sh
npm run marketing:check
```

Generated local files go to `marketing/generated/` and are ignored by Git. The scheduled workflow keeps its reviewable copy in a GitHub Issue and the CSV in the workflow artifact.
