import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = resolve(repoRoot, 'marketing/apps.json');
const rotationAnchor = new Date('2026-08-10T12:00:00Z');
const liveRotation = ['sentences', 'my-world', 'countdowns', 'better-pictures'];
const tokenStems = {
  sentences: 'sent',
  'my-world': 'world',
  countdowns: 'count',
  'better-pictures': 'pics',
  'better-coffee': 'coffee',
  'family-trips': 'family',
  'travel-plans': 'travel',
  'paw-care': 'paw',
  weddings: 'wed',
};

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) continue;
    const key = argument.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) values[key] = true;
    else {
      values[key] = next;
      index += 1;
    }
  }
  return values;
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid date: ${value}`);
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid date: ${value}`);
  return date;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function nextMonday(date = new Date()) {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
  const day = copy.getUTCDay();
  const offset = day === 1 ? 0 : (8 - day) % 7;
  copy.setUTCDate(copy.getUTCDate() + offset);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function getRotatingApp(apps, monday) {
  const elapsedWeeks = Math.floor((monday - rotationAnchor) / (7 * 24 * 60 * 60 * 1000));
  const index = ((elapsedWeeks % liveRotation.length) + liveRotation.length) % liveRotation.length;
  const app = apps.find((candidate) => candidate.key === liveRotation[index]);
  if (!app) throw new Error(`Rotation app is missing: ${liveRotation[index]}`);
  return app;
}

function destinationFor(app, supportEmail) {
  if (app.stage === 'live') return app.appStoreUrl;
  if (app.key === 'weddings') return app.sitePath;
  const subject = app.stage === 'review'
    ? `${app.name} release`
    : `TestFlight interest — ${app.name}`;
  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}`;
}

function campaignToken(app, monday, channel) {
  const stem = tokenStems[app.key] ?? app.key.replace(/[^a-z0-9]/g, '').slice(0, 8);
  const compactDate = isoDate(monday).slice(2).replaceAll('-', '');
  return `${stem}_${compactDate}_${channel}`.slice(0, 30);
}

function trackedDestination(app, supportEmail, providerToken, monday, channel) {
  const fallback = destinationFor(app, supportEmail);
  if (app.stage !== 'live' || !providerToken) return { url: fallback, tracked: false, token: null };
  const url = new URL(app.appStoreUrl);
  const token = campaignToken(app, monday, channel);
  url.searchParams.set('pt', providerToken);
  url.searchParams.set('ct', token);
  url.searchParams.set('mt', '8');
  return { url: url.toString(), tracked: true, token };
}

function hashtags(app) {
  return app.hashtags.map((tag) => `#${tag}`).join(' ');
}

function buildCopy({ app, angle, links, brand }) {
  const commercial = app.commercialModel;
  const claim = app.claims[0];
  const secondClaim = app.claims[1];
  const tagLine = hashtags(app);
  const siteUrl = app.sitePath.startsWith('http')
    ? app.sitePath
    : new URL(app.sitePath, brand.siteUrl).toString();

  return {
    instagram: `${angle.hook}\n\n${angle.body}\n\n${secondClaim}\n\n${commercial}\n\n${app.ctaLabel}: ${links.instagram.url}\n\n${tagLine}`,
    x: `${angle.hook} ${angle.body} ${app.ctaLabel}: ${links.x.url}`,
    linkedin: `I built ${app.name} around one focused moment: ${app.promise.charAt(0).toLowerCase()}${app.promise.slice(1)}\n\nThat focus shaped the product: ${claim}\n\n${commercial}\n\nSee the current app and its privacy details: ${siteUrl}`,
    youtubeTitle: `${angle.hook} | ${app.name}`,
    youtubeDescription: `${angle.body}\n\n${claim}\n\n${commercial}\n\n${app.ctaLabel}: ${links.youtube.url}`,
    pinterestTitle: angle.hook,
    pinterestDescription: `${angle.body} ${commercial} ${links.pinterest.url}`,
    emailSubject: angle.hook,
    emailPreheader: app.promise,
    emailBody: `Hello,\n\n${angle.hook}\n\n${angle.body}\n\n${secondClaim}\n\n${commercial}\n\n${app.ctaLabel}: ${links.email.url}\n\nBrian\nLet’s Build Apps HQ`,
  };
}

function csvEscape(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function buildCsv(rows) {
  const columns = ['date', 'time', 'timezone', 'channel', 'format', 'status', 'copy', 'url', 'asset', 'alt_text'];
  return [
    columns.map(csvEscape).join(','),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column] ?? '')).join(',')),
  ].join('\n') + '\n';
}

export async function loadCatalog() {
  return JSON.parse(await readFile(catalogPath, 'utf8'));
}

export function createMarketingPack({ catalog, week, appKey, providerToken = '' }) {
  const monday = week ? parseDate(week) : nextMonday();
  if (monday.getUTCDay() !== 1) throw new Error(`Campaign week must be a Monday: ${isoDate(monday)}`);

  const app = appKey
    ? catalog.apps.find((candidate) => candidate.key === appKey)
    : getRotatingApp(catalog.apps, monday);
  if (!app) throw new Error(`Unknown app key: ${appKey}`);

  const weeksSinceAnchor = Math.floor((monday - rotationAnchor) / (7 * 24 * 60 * 60 * 1000));
  const angle = app.angles[((weeksSinceAnchor % app.angles.length) + app.angles.length) % app.angles.length];
  const supportEmail = catalog.brand.supportEmail;
  const links = {
    instagram: trackedDestination(app, supportEmail, providerToken, monday, 'ig'),
    x: trackedDestination(app, supportEmail, providerToken, monday, 'x'),
    youtube: trackedDestination(app, supportEmail, providerToken, monday, 'yt'),
    pinterest: trackedDestination(app, supportEmail, providerToken, monday, 'pin'),
    email: trackedDestination(app, supportEmail, providerToken, monday, 'email'),
  };
  const copy = buildCopy({ app, angle, links, brand: catalog.brand });
  const primaryAsset = app.approvedAssets[0];
  const secondaryAsset = app.approvedAssets[1] ?? primaryAsset;
  const assetUrl = (asset) => new URL(asset.path, catalog.brand.siteUrl).toString();

  const rows = [
    {
      date: isoDate(addDays(monday, 1)), time: '19:30', timezone: 'Europe/London',
      channel: 'Instagram', format: '20–30 second Reel', status: 'Needs approval',
      copy: copy.instagram, url: links.instagram.url, asset: assetUrl(primaryAsset), alt_text: primaryAsset.alt,
    },
    {
      date: isoDate(addDays(monday, 1)), time: '19:30', timezone: 'Europe/London',
      channel: 'YouTube', format: 'Short', status: 'Needs approval',
      copy: `${copy.youtubeTitle}\n${copy.youtubeDescription}`, url: links.youtube.url,
      asset: assetUrl(primaryAsset), alt_text: primaryAsset.alt,
    },
    {
      date: isoDate(addDays(monday, 2)), time: '08:30', timezone: 'Europe/London',
      channel: 'LinkedIn', format: 'Founder note', status: 'Needs approval',
      copy: copy.linkedin, url: new URL(app.sitePath, catalog.brand.siteUrl).toString(),
      asset: assetUrl(primaryAsset), alt_text: primaryAsset.alt,
    },
    {
      date: isoDate(addDays(monday, 3)), time: '19:30', timezone: 'Europe/London',
      channel: 'Instagram', format: 'Four-panel carousel', status: 'Needs approval',
      copy: copy.instagram, url: links.instagram.url, asset: assetUrl(secondaryAsset), alt_text: secondaryAsset.alt,
    },
    {
      date: isoDate(addDays(monday, 4)), time: '12:30', timezone: 'Europe/London',
      channel: 'X', format: 'Short post', status: 'Needs approval',
      copy: copy.x, url: links.x.url, asset: assetUrl(primaryAsset), alt_text: primaryAsset.alt,
    },
    {
      date: isoDate(addDays(monday, 5)), time: '10:30', timezone: 'Europe/London',
      channel: 'Pinterest', format: 'Pin', status: 'Needs approval',
      copy: `${copy.pinterestTitle}\n${copy.pinterestDescription}`, url: links.pinterest.url,
      asset: assetUrl(secondaryAsset), alt_text: secondaryAsset.alt,
    },
  ];

  const trackingReady = app.stage === 'live' && Boolean(providerToken);
  const title = `Marketing pack · ${formatDate(monday)} · ${app.name}`;
  const markdown = `# ${title}

Generated from the verified portfolio catalogue on ${catalog.updated}. Public posting is deliberately approval-gated.

## This week

| | |
|---|---|
| Focus | ${app.name} |
| Current stage | ${app.stageLabel} |
| Audience | ${app.audience} |
| Objective | ${app.stage === 'live' ? 'First-time App Store downloads' : app.ctaLabel} |
| Core promise | ${app.promise} |
| Purchase wording | ${app.commercialModel} |
| Apple campaign attribution | ${trackingReady ? 'Ready — provider token applied' : app.stage === 'live' ? 'Setup needed — using verified App Store fallback links' : 'Not applicable before public release'} |

## Approved truth boundary

${app.claims.map((claim) => `- ${claim}`).join('\n')}

Do not add awards, user counts, endorsements, testimonials, diagnostic or treatment claims, guaranteed outcomes, invented dates or manufactured urgency.

## Creative direction

- Lead overlay: **${angle.hook}**
- Visual style: use current in-app screens, warm editorial typography and restrained high-contrast overlays. No stock families, fake reviews or generic AI imagery.
- Primary screen: [${primaryAsset.alt}](${assetUrl(primaryAsset)})
- Supporting screen: [${secondaryAsset.alt}](${assetUrl(secondaryAsset)})
- Reel / Short: record one uninterrupted real workflow. Open on the current home screen, show the action described below, then end on the real result and CTA.
- 0–3 sec: “${angle.hook}”
- 3–18 sec: ${angle.body}
- 18–24 sec: ${app.claims[0]}
- 24–30 sec: ${app.commercialModel} ${app.ctaLabel}.

## Ready-to-review copy

### Instagram · ${catalog.brand.social.instagramHandle}

${copy.instagram}

### X · ${catalog.brand.social.xHandle}

${copy.x}

### LinkedIn founder note

${copy.linkedin}

### YouTube Short

**Title:** ${copy.youtubeTitle}

${copy.youtubeDescription}

### Pinterest

**Title:** ${copy.pinterestTitle}

${copy.pinterestDescription}

### Email draft

Only send to people who have explicitly asked for this app’s release/news; this repository does not create or store a mailing list.

**Subject:** ${copy.emailSubject}

**Preheader:** ${copy.emailPreheader}

${copy.emailBody}

## Suggested schedule

| Date | Time | Channel | Format |
|---|---:|---|---|
${rows.map((row) => `| ${row.date} | ${row.time} ${row.timezone} | ${row.channel} | ${row.format} |`).join('\n')}

## Approval checklist

- [ ] Current public stage and destination verified
- [ ] Screens match the current app build
- [ ] Purchase wording is correct for this app
- [ ] No invented proof, review, outcome or launch claim
- [ ] Overlay remains readable on a phone-sized preview
- [ ] Alt text is retained when publishing
- [ ] Apple campaign link is present, or the untracked fallback is consciously accepted
- [ ] A person has approved every post before scheduling

## Measure after seven days

Record App Store campaign product-page views, first-time downloads and conversion. For paid features, also record relevant purchases or subscriptions. Do not infer website clicks: the current site intentionally has no analytics.
`;

  return {
    app,
    monday,
    title,
    markdown,
    csv: buildCsv(rows),
    trackingReady,
  };
}

export async function writeMarketingPack({ catalog, week, appKey, providerToken, outDir }) {
  const pack = createMarketingPack({ catalog, week, appKey, providerToken });
  const directory = resolve(repoRoot, outDir ?? 'marketing/generated');
  await mkdir(directory, { recursive: true });
  const stem = `${isoDate(pack.monday)}-${pack.app.key}`;
  const markdownPath = resolve(directory, `${stem}.md`);
  const csvPath = resolve(directory, `${stem}.csv`);
  const manifestPath = resolve(directory, 'manifest.json');
  await writeFile(markdownPath, pack.markdown);
  await writeFile(csvPath, pack.csv);
  await writeFile(manifestPath, `${JSON.stringify({
    title: pack.title,
    appKey: pack.app.key,
    week: isoDate(pack.monday),
    markdownPath,
    csvPath,
    trackingReady: pack.trackingReady,
  }, null, 2)}\n`);
  return { ...pack, markdownPath, csvPath, manifestPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalog = await loadCatalog();
  const result = await writeMarketingPack({
    catalog,
    week: args.week,
    appKey: args.app,
    providerToken: process.env.APPLE_PROVIDER_TOKEN ?? '',
    outDir: args['out-dir'],
  });
  process.stdout.write(`${JSON.stringify({
    title: result.title,
    app: result.app.key,
    week: isoDate(result.monday),
    markdown: result.markdownPath,
    csv: result.csvPath,
    trackingReady: result.trackingReady,
  }, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
