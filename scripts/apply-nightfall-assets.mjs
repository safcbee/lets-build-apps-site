import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

// Optimised derivatives are committed: publishing and ordinary builds need only Node.
const root = resolve('public');
const manifest = JSON.parse(await readFile('scripts/nightfall-assets.json', 'utf8'));
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
}
for (const file of (await walk(root)).filter(f => f.endsWith('.html'))) {
  let html = await readFile(file, 'utf8');
  let imageIndex = 0;
  const local = path => { const result = relative(dirname(file), resolve(root, path)); return result.startsWith('.') ? result : `./${result}`; };
  html = html.replace(/<img\b[^>]*>/g, tag => {
    imageIndex++;
    const source = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!source || /^(https?:|data:)/.test(source)) return tag;
    const asset = manifest[relative(root, resolve(dirname(file), source))];
    if (!asset) return tag;
    const { variants } = asset;
    const smallest = variants[0];
    const attributes = `src="${local(smallest.path)}" width="${smallest.width}" height="${smallest.height}"${variants.length > 1 ? ` srcset="${variants.map(v => `${local(v.path)} ${v.width}w`).join(', ')}" sizes="(max-width: 560px) 80vw, 480px"` : ''} loading="${imageIndex <= 2 ? 'eager' : 'lazy'}" decoding="async"`;
    return tag.replace(/\s(?:src|srcset|sizes|width|height|loading|decoding)="[^"]*"/g, '').replace('<img', `<img ${attributes}`);
  });
  html = html.replace(/"image":"([^"<>]+)"/g, (match, source) => {
    if (/^https?:/.test(source)) return match;
    const asset = manifest[relative(root, resolve(dirname(file), source))];
    return asset ? `"image":"${local(asset.variants[0].path)}"` : match;
  });
  await writeFile(file, html);
}
