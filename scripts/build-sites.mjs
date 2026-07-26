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
  '/privacy/': 'public/privacy/index.html',
  '/travel-plans/privacy/': 'public/travel-plans/privacy/index.html',
  '/family-trips/privacy/': 'public/family-trips/privacy/index.html',
};

const imageAssets = [
  'iphone-1-portrait-intro.jpg',
  'iphone-2-portrait-trace-off.jpg',
  '01-hero-your-moments-next-up.jpg',
  '02-moments-list.jpg',
  'trips.jpg',
  'costs.jpg',
  'itinerary.jpg',
  'chat.jpg',
  'dashboard.jpg',
  'new-shot.jpg',
].map((name) => ({ directory: 'site-v2', name, mime: 'image/jpeg' })).concat([
  'family-trips-trips.jpg',
  'family-trips-costs.jpg',
  'family-trips-itinerary.jpg',
  'family-trips-chat.jpg',
  'sentences-promo-1.jpg',
  'sentences-promo-2.jpg',
  'coffee-dashboard.jpg',
  'coffee-log.jpg',
  'coffee-history.jpg',
  'coffee-beans.jpg',
  'travel-plans-trips.jpg',
  'travel-plans-ready.jpg',
  'travel-plans-itinerary.jpg',
  'travel-plans-plus.jpg',
  'better-pics-home.jpg',
].map((name) => ({ directory: 'site-v3', name, mime: 'image/jpeg' }))).concat([
  'icon-sentences.png',
  'icon-countdowns.png',
  'icon-family-trips.png',
  'icon-coffee.png',
  'icon-travel-plans.png',
  'icon-better-pics.png',
].map((name) => ({ directory: 'site-v3', name, mime: 'image/png' })));

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const css = await readFile('public/assets/site-v2.css', 'utf8');
const betterPicsSocialCard = await readFile('public/assets/site-v3/better-pics-social.jpg');
const images = {};
for (const asset of imageAssets) {
  const data = await readFile(`public/assets/${asset.directory}/${asset.name}`);
  images[`${asset.directory}/${asset.name}`] = `data:${asset.mime};base64,${data.toString('base64')}`;
}

const builtPages = {};
for (const [route, file] of Object.entries(pages)) {
  let html = await readFile(file, 'utf8');
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
