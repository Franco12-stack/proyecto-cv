// Genera la imagen Open Graph en /public. (El CV es el PDF propio: public/cv-franco-fernandez.pdf.)
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
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(`${origin}/og/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'public/og-image.png' });
  await browser.close();
} finally { server.kill(); }
