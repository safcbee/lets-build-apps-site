import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const pages = {
  '/': 'public/index.html',
  '/sentences/': 'public/sentences/index.html',
  '/countdowns/': 'public/countdowns/index.html',
  '/paw-care/': 'public/paw-care/index.html',
  '/paw-care/privacy/': 'public/paw-care/privacy/index.html',
  '/perfect-coffee/': 'public/perfect-coffee/index.html',
  '/family-trips/': 'public/family-trips/index.html',
  '/travel-plans/': 'public/travel-plans/index.html',
  '/better-pics/': 'public/better-pics/index.html',
  '/better-pics/privacy/': 'public/better-pics/privacy/index.html',
  '/support/': 'public/support/index.html',
  '/privacy/': 'public/privacy/index.html',
  '/travel-plans/privacy/': 'public/travel-plans/privacy/index.html',
  '/family-trips/privacy/': 'public/family-trips/privacy/index.html',
};

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const css = await readFile('public/assets/site-v2.css', 'utf8');
const betterPicsSocialCard = await readFile('public/assets/site-v3/better-pics-social.jpg');
const sourcePages = Object.fromEntries(
  await Promise.all(
    Object.entries(pages).map(async ([route, file]) => [
      route,
      await readFile(file, 'utf8'),
    ]),
  ),
);
const referencedAssets = new Set();
for (const html of Object.values(sourcePages)) {
  for (const match of html.matchAll(/(?:(?:\.\.\/)+|\.\/)assets\/([^"'?#\s>]+)/g)) {
    if (!match[1].endsWith('.css')) referencedAssets.add(match[1]);
  }
}
const images = {};
for (const assetPath of referencedAssets) {
  const data = await readFile(`public/assets/${assetPath}`);
  const mime = assetPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
  images[assetPath] = `data:${mime};base64,${data.toString('base64')}`;
}

const builtPages = {};
for (const [route, sourceHTML] of Object.entries(sourcePages)) {
  let html = sourceHTML;
  html = html.replace(/<link rel="stylesheet" href="(?:(?:\.\.\/)+|\.\/)assets\/site-v2\.css">/g, `<style>${css}</style>`);
  for (const [assetPath, dataUrl] of Object.entries(images)) {
    html = html
      .replaceAll(`../../assets/${assetPath}`, dataUrl)
      .replaceAll(`../assets/${assetPath}`, dataUrl)
      .replaceAll(`./assets/${assetPath}`, dataUrl);
  }
  builtPages[route] = html;
}

const worker = `
const PAGES = ${JSON.stringify(builtPages)};
const BETTER_PICS_SOCIAL_CARD = ${JSON.stringify(betterPicsSocialCard.toString('base64'))};
const headers = {
  'content-type': 'text/html; charset=UTF-8',
  'cache-control': 'private, no-cache',
  'x-content-type-options': 'nosniff',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/assets/site-v3/better-pics-social.jpg') {
      const bytes = Uint8Array.from(atob(BETTER_PICS_SOCIAL_CARD), (character) => character.charCodeAt(0));
      return new Response(bytes, {
        status: 200,
        headers: {
          'content-type': 'image/jpeg',
          'cache-control': 'public, max-age=86400',
          'x-content-type-options': 'nosniff',
        },
      });
    }
    if (url.pathname === '/portaflow' || url.pathname === '/portaflow/') {
      return Response.redirect(new URL('/perfect-coffee/', url), 302);
    }
    const route = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
    const html = PAGES[route];
    if (html) return new Response(html, { status: 200, headers });
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=UTF-8' } });
  },
};
`;

await writeFile('dist/server/index.js', worker);
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
