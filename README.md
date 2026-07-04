# Let's Build Apps Static Website

Static website for `apps.leary.cloud`.

## Repository Structure

- `public/` — **published website artifact only**. GitHub Pages should serve this folder via the Pages GitHub Actions workflow. Only production routes, `CNAME`, and required production assets belong here.
- `internal/` — non-published working material and notes. Do not copy this into `public/`.
- `tests/` — local validation scripts. Tests are not part of the published website.
- `reports/`, `stitch_bambino_app_dashboard/`, `v4/`, `v5/`, and root planning Markdown files are historical/internal working material and must stay out of `public/`.

## Published Pages

These are the intended public routes under `public/`:

- Home / app collection: `public/index.html`
- Let's Build Sentences: `public/sentences/index.html`
- Let's Build Countdowns: `public/countdowns/index.html`
- Let's Build Good Habits: `public/good-habits/index.html`
- Let's Build Better Coffee: `public/perfect-coffee/index.html`
- Let's Build Travel Plans: `public/travel-plans/index.html`
- General Privacy Policy: `public/privacy/index.html`
- Travel Plans Privacy Policy: `public/travel-plans/privacy/index.html`
- Legacy Portaflow migration: `public/portaflow/index.html`

## Local Preview

Preview the actual published artifact from `public/`:

```sh
cd public
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Tests

Run the publish-surface guard:

```sh
node tests/publish-surface.test.mjs
```

Run the existing static regression tests:

```sh
node tests/home-search.test.mjs
node tests/countdowns-live.test.mjs
node tests/no-fake-social-proof.test.mjs
node tests/site-integrity.test.mjs
```

## GitHub Pages Deployment

This repo now includes `.github/workflows/pages.yml`, which deploys the contents of `public/` as the GitHub Pages artifact.

Required GitHub repository setting before publishing:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Do **not** use branch-root publishing for this repo, because root contains internal working material.

Do not push/deploy without owner approval.

## Preservation Notes

- Production copy, privacy/legal wording, branding, and portfolio content were not intentionally rewritten for the publish-surface change.
- `public/` is a copied production artifact. Internal reports, Stitch exports, preview versions, tests, and planning notes must remain outside it.
- `CNAME` is included in `public/` so the GitHub Pages artifact keeps `apps.leary.cloud`.
