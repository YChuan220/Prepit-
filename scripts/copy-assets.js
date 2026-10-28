// Copies self-hosted fonts and the Lucide icon script from node_modules into public/.
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const copies = [
  ['node_modules/@fontsource-variable/host-grotesk/files/host-grotesk-latin-wght-normal.woff2', 'public/fonts/host-grotesk-latin.woff2'],
  ['node_modules/@fontsource-variable/host-grotesk/files/host-grotesk-latin-ext-wght-normal.woff2', 'public/fonts/host-grotesk-latin-ext.woff2'],
  ['node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2', 'public/fonts/instrument-sans-latin.woff2'],
  ['node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-ext-wght-normal.woff2', 'public/fonts/instrument-sans-latin-ext.woff2'],
  ['node_modules/lucide/dist/umd/lucide.min.js', 'public/vendor/lucide.min.js'],
];

for (const [from, to] of copies) {
  const src = path.join(root, from);
  const dest = path.join(root, to);
  if (!fs.existsSync(src)) {
    console.warn(`[assets] missing ${from} (run npm install)`);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
console.log('[assets] fonts and icons copied to public/');
