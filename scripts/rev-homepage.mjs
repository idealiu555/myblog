#!/usr/bin/env node
/**
 * Generate content hash query params for homepage static assets (CSS & JS)
 * and update index.html references automatically.
 *
 * Usage: pnpm run homepage:rev
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'homepage');
const indexFile = resolve(root, 'index.html');

if (!existsSync(indexFile)) {
  console.error('[rev] Cannot find homepage/index.html');
  process.exit(1);
}

function fileHash(path) {
  const buf = readFileSync(path);
  return createHash('sha1').update(buf).digest('hex').slice(0, 10); // short hash
}

// Targets we want to revise
const assets = [
  { path: resolve(root, 'assets/css/style.css'), ref: 'assets/css/style.css', tag: 'css' },
  { path: resolve(root, 'assets/js/main.js'), ref: 'assets/js/main.js', tag: 'js' }
];

let html = readFileSync(indexFile, 'utf8');
let changed = false;

for (const a of assets) {
  if (!existsSync(a.path)) {
    console.warn(`[rev] Skip missing ${a.tag} asset: ${a.path}`);
    continue;
  }
  const h = fileHash(a.path);
  // Replace every matching reference (with or without ?v=)
  const refRegex = new RegExp(`((?:href|src)="${a.ref})(?:\\?v=[^"]*)?"`, 'g');
  let replacedCount = 0;
  html = html.replace(refRegex, (_m, prefix) => {
    replacedCount += 1;
    return `${prefix}?v=${h}"`;
  });

  if (replacedCount === 0) {
    console.warn(`[rev] Could not locate tag for ${a.tag} to update.`);
    continue;
  }
  changed = true;
  console.log(`[rev] Updated ${a.tag} version -> ${h} (${replacedCount} refs)`);
}

if (changed) {
  writeFileSync(indexFile, html, 'utf8');
  console.log('[rev] index.html updated successfully.');
} else {
  console.log('[rev] No changes applied.');
}
