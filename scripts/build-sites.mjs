import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const pages = {
  '/': 'public/index.html',
  '/sentences/': 'public/sentences/index.html',
  '/countdowns/': 'public/countdowns/index.html',
  '/good-habits/': 'public/good-habits/index.html',
  '/perfect-coffee/': 'public/perfect-coffee/index.html',
  '/travel-plans/': 'public/travel-plans/index.html',
  '/privacy/': 'public/privacy/index.html',
  '/travel-plans/privacy/': 'public/travel-plans/privacy/index.html',
  '/family-trips/privacy/': 'public/family-trips/privacy/index.html',
};

const imageNames = [
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
  'good-habits-preview.jpg',
];

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const css = await readFile('public/assets/site-v2.css', 'utf8');
const images = {};
for (const name of imageNames) {
  const data = await readFile(`public/assets/site-v2/${name}`);
  images[name] = `data:image/jpeg;base64,${data.toString('base64')}`;
}

const builtPages = {};
for (const [route, file] of Object.entries(pages)) {
  let html = await readFile(file, 'utf8');
  html = html.replace(/<link rel="stylesheet" href="(?:\.\.\/|\.\/)assets\/site-v2\.css">/g, `<style>${css}</style>`);
  for (const [name, dataUrl] of Object.entries(images)) {
    html = html.replaceAll(`../assets/site-v2/${name}`, dataUrl).replaceAll(`./assets/site-v2/${name}`, dataUrl);
  }
  builtPages[route] = html;
}

const worker = `
const PAGES = ${JSON.stringify(builtPages)};
const headers = {
  'content-type': 'text/html; charset=UTF-8',
  'cache-control': 'private, no-cache',
  'x-content-type-options': 'nosniff',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
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
