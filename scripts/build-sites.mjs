import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const screenshotPath = 'public/assets/product-evidence-v4/sentences/iphone-1-portrait-intro.png';
const screenshotUrl = '../assets/product-evidence-v4/sentences/iphone-1-portrait-intro.png';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });

const screenshot = await readFile(screenshotPath);
const screenshotDataUrl = `data:image/png;base64,${screenshot.toString('base64')}`;

const mainHtml = (await readFile('public/sentences/index.html', 'utf8'))
  .replaceAll(screenshotUrl, screenshotDataUrl)
  .replaceAll('../privacy/', '/privacy/')
  .replaceAll('href="../"', 'href="/"');

const privacyHtml = (await readFile('public/privacy/index.html', 'utf8'))
  .replaceAll('href="../"', 'href="/"');

const worker = `
const MAIN_HTML = ${JSON.stringify(mainHtml)};
const PRIVACY_HTML = ${JSON.stringify(privacyHtml)};

const headers = {
  'content-type': 'text/html; charset=UTF-8',
  'cache-control': 'private, no-cache',
  'x-content-type-options': 'nosniff',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/sentences' || url.pathname === '/sentences/') {
      return new Response(MAIN_HTML, { status: 200, headers });
    }

    if (url.pathname === '/privacy' || url.pathname === '/privacy/') {
      return new Response(PRIVACY_HTML, { status: 200, headers });
    }

    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=UTF-8' } });
  },
};
`;

await writeFile('dist/server/index.js', worker);
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
