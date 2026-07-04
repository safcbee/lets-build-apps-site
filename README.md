# apps.leary.cloud

Production static website for `apps.leary.cloud`.

## Public repository contents

- `public/` — deployed website files.
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow.
- `tests/` — public safety checks for the deployed static site.

## Deployment

GitHub Pages is configured to deploy through GitHub Actions. The workflow uploads `public/` as the Pages artifact.

## Local checks

```sh
for test in tests/*.test.mjs; do node "$test"; done
```
