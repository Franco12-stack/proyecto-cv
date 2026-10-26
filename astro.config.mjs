import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages por defecto. Para Vercel o dominio propio: SITE=https://tudominio.com BASE=/ npm run build
const site = process.env.SITE || 'https://franco12-stack.github.io';
const base = process.env.BASE || '/proyecto-cv';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (p) => !/\/(cv|og)\//.test(p) })],
});
