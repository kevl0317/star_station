import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { BODIES, CARDS, planetSVG, cardHTML, bunnySVG } from '../src/astronomy.mjs';
import { signalSVG } from '../src/art.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
function files(dir) {
  return readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    const name = path.posix.join(dir, entry.name);
    return entry.isDirectory() ? files(name) : [name];
  });
}
const sourceFiles = [...files('src'), ...readdirSync(root).filter(name => name.endsWith('.html'))];
const rendered = BODIES.map(b => planetSVG(b.id)).join('') + CARDS.map(c => cardHTML(c.id, { narrated: true })).join('') + bunnySVG + signalSVG({ color: 'blue', shape: 'circle', halo: true });
const text = sourceFiles.map(name => readFileSync(path.join(root, name), 'utf8')).join('\n') + rendered;
const used = new Set([...text.matchAll(/(?:\.\/|\.\.\/)(assets\/[\w./-]+\.(?:png|webp|jpe?g|svg))/g)].map(match => match[1]));
const missing = [...used].filter(name => !existsSync(path.join(root, name)));
const unused = files('assets').filter(name => /\.(png|webp|jpe?g|svg)$/.test(name) && !used.has(name));
if (missing.length || unused.length) {
  console.error({ missing, unused });
  process.exitCode = 1;
} else console.log(`素材检查通过：${used.size} 个图片文件全部被引用，无缺失素材。`);
