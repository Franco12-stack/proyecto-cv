// Genera los CV en PDF (ES/EN, desde src/data/cv.*.json) y la imagen Open Graph en /public.
// Requiere Playwright con Chromium disponible (`npm i -D playwright` o el que ya trae el entorno).
// Uso: npm run build && npm run assets
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { setTimeout as wait } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.env.BASE || '/proyecto-cv';
const port = 4399;
const origin = `http://localhost:${port}${base}`;

const server = spawn('npx', ['astro', 'preview', '--port', String(port)], { stdio: 'ignore' });
try {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(origin + '/')).ok) break; } catch {}
    await wait(250);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const l of ['es', 'en']) {
    await page.goto(`${origin}/cv/${l}/`, { waitUntil: 'networkidle' });
    await page.pdf({ path: `docs/cv-alternativos/cv-${l}.pdf`, format: 'A4', printBackground: true, preferCSSPageSize: true });
  }
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(`${origin}/og/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'public/og-image-v2.png' });
  await browser.close();
} finally { server.kill(); }
