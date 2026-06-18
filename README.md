# Let's Build Apps Static Website

Static website assembled from the Google Stitch export in `stitch_bambino_app_dashboard/`.

## Pages

- Home / app collection: `index.html`
- Let's Build Sentences: `sentences/index.html`
- Let's Build Countdowns: `countdowns/index.html`
- Let's Build Good Habits: `good-habits/index.html`
- Let's Build Perfect Coffee: `perfect-coffee/index.html`
- Let's Build Travel Plans: `travel-plans/index.html`
- Privacy Policy: `privacy/index.html`

## Local Preview

From this folder:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Tests

Run the static regression tests:

```sh
node tests/home-search.test.mjs
node tests/countdowns-live.test.mjs
node tests/no-fake-social-proof.test.mjs
```

## GitHub Pages Deployment

1. Commit this folder to a GitHub repository.
2. In GitHub, open the repository configuration area and choose `Pages`.
3. Set `Source` to `Deploy from a branch`.
4. Choose the branch that contains these files.
5. Choose `/ (root)` as the publishing folder.
6. Save and wait for GitHub Pages to publish the site.

## Preservation Notes

- The generated Stitch `code.html` files were copied into static routes with their embedded Tailwind configuration and page-local styles intact.
- Supplied `screen.png` files were copied to `assets/stitch-screenshots/` for visual validation references.
- Changes were limited to route structure and navigation links.
- No backend, analytics, tracking, cookies, authentication, or server-side logic was added.
- External Google Fonts, Material Symbols, Tailwind CDN, and Stitch-generated image URLs remain as exported to preserve the rendered appearance.
