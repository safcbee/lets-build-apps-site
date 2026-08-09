import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

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

function normaliseName(value) {
  return value
    .normalize('NFKD')
    .replace(/[‘’]/g, "'")
    .replace(/[^a-zA-Z0-9']+/g, ' ')
    .trim()
    .toLowerCase();
}

async function lookupApp(appleId, storefront = 'gb') {
  const url = new URL('https://itunes.apple.com/lookup');
  url.searchParams.set('id', appleId);
  url.searchParams.set('country', storefront);
  const response = await fetch(url, {
    headers: { 'user-agent': 'LetsBuildAppsHQ-AppStoreMonitor/1.0' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Apple lookup failed for ${appleId}: HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.resultCount === 0) return null;
  const result = payload.results[0];
  return {
    name: result.trackName,
    version: result.version,
    url: result.trackViewUrl,
    price: result.formattedPrice,
  };
}

export function evaluateStatuses(catalog, observations) {
  const alerts = [];
  const statuses = catalog.apps.map((app) => {
    const observation = observations[app.appleId] ?? null;
    const expectedPublic = app.stage === 'live';
    const isPublic = Boolean(observation);

    if (expectedPublic && !isPublic) {
      alerts.push({
        type: 'live-listing-missing',
        severity: 'urgent',
        appKey: app.key,
        appName: app.name,
        message: `${app.name} is marked live but Apple’s GB storefront lookup did not return a listing.`,
      });
    }

    if (!expectedPublic && isPublic) {
      alerts.push({
        type: 'launch-detected',
        severity: 'launch',
        appKey: app.key,
        appName: app.name,
        message: `${app.name} now has a public GB App Store listing: ${observation.url}`,
      });
    }

    if (
      expectedPublic &&
      isPublic &&
      normaliseName(app.storefrontName) !== normaliseName(observation.name)
    ) {
      alerts.push({
        type: 'storefront-name-changed',
        severity: 'review',
        appKey: app.key,
        appName: app.name,
        message: `${app.name} is listed by Apple as “${observation.name}”; the catalogue expects “${app.storefrontName}”.`,
      });
    }

    return {
      appKey: app.key,
      appName: app.name,
      expectedStage: app.stageLabel,
      expectedPublic,
      isPublic,
      observedName: observation?.name ?? null,
      observedVersion: observation?.version ?? null,
      observedUrl: observation?.url ?? null,
      observedPrice: observation?.price ?? null,
    };
  });

  return { statuses, alerts };
}

function buildMarkdown({ generatedAt, storefront, statuses, alerts }) {
  const statusRows = statuses.map((status) => {
    const observed = status.isPublic
      ? `${status.observedName} · v${status.observedVersion} · ${status.observedPrice}`
      : 'Not public';
    const match = status.expectedPublic === status.isPublic ? 'Matches' : 'Action needed';
    return `| ${status.appName} | ${status.expectedStage} | ${observed} | ${match} |`;
  }).join('\n');

  const alertSection = alerts.length === 0
    ? 'No public-storefront differences need attention.'
    : alerts.map((alert) => `- **${alert.severity.toUpperCase()} — ${alert.appName}:** ${alert.message}`).join('\n');

  return `# App Store public-status report

Checked Apple’s ${storefront.toUpperCase()} public storefront at ${generatedAt}. The public lookup cannot see App Store review or TestFlight state.

## Alerts

${alertSection}

## Current public view

| App | Website catalogue | Apple lookup | Result |
|---|---|---|---|
${statusRows}

## Human launch checklist

If a new public listing is detected:

- [ ] Open the listing and verify its name, icon, screenshots, description and purchase wording
- [ ] Update marketing/apps.json with the live stage, verified URL and public version
- [ ] Replace pre-release wording and email CTAs on the website
- [ ] Run the full site and marketing tests
- [ ] Publish the verified site update
- [ ] Run the weekly marketing workflow with this app selected to create its launch pack

The monitor deliberately does not change the public site or announce a launch by itself.
`;
}

export async function checkAppStoreStatus({ catalog, storefront = 'gb', lookup = lookupApp }) {
  const observations = {};
  for (const app of catalog.apps) {
    observations[app.appleId] = await lookup(app.appleId, storefront);
  }
  const evaluated = evaluateStatuses(catalog, observations);
  const generatedAt = new Date().toISOString();
  return {
    generatedAt,
    storefront,
    ...evaluated,
    alertCount: evaluated.alerts.length,
    markdown: buildMarkdown({ generatedAt, storefront, ...evaluated }),
  };
}

async function writeResult(filePath, content) {
  const absolutePath = resolve(repoRoot, filePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
  return absolutePath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalog = JSON.parse(await readFile(resolve(repoRoot, 'marketing/apps.json'), 'utf8'));
  const result = await checkAppStoreStatus({ catalog, storefront: args.storefront ?? 'gb' });
  const jsonPath = await writeResult(
    args.json ?? 'marketing/generated/app-store-status.json',
    `${JSON.stringify({
      generatedAt: result.generatedAt,
      storefront: result.storefront,
      alertCount: result.alertCount,
      alerts: result.alerts,
      statuses: result.statuses,
    }, null, 2)}\n`,
  );
  const markdownPath = await writeResult(
    args.markdown ?? 'marketing/generated/app-store-status.md',
    result.markdown,
  );
  process.stdout.write(`${JSON.stringify({
    alertCount: result.alertCount,
    json: jsonPath,
    markdown: markdownPath,
  }, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.stack ?? error.message);
    process.exitCode = 1;
  });
}
