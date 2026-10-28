# Portafolio · Franco Fernandez

Sitio estático en Astro, bilingüe (ES/EN), tema oscuro/claro. Sin frameworks de UI.

```bash
npm install
npm run dev        # desarrollo
npm run build      # genera dist/
npm run assets     # regenera og-image.png (requiere Playwright + Chromium)
```

- **Contenido**: `src/data/*.es.json` / `*.en.json` (y `stack.json`). El CV descargable es el PDF propio `public/cv-franco-fernandez.pdf` (sin teléfono ni referencias; solo en español por ahora).
- **Despliegue**: GitHub Pages con `.github/workflows/deploy.yml` (rama `main`; activar Pages → Source: GitHub Actions). Por defecto `site=https://franco12-stack.github.io`, `base=/proyecto-cv`. Para Vercel o dominio propio: `SITE=https://tudominio.com BASE=/ npm run build` (y actualizar `public/robots.txt`).

## Pendientes (los aporta Franco)
- Confirmar URL de LinkedIn (hoy `franco-fernández-00a9592ab`, la del prototipo) y sumar GitHub.
- WhatsApp de contacto (opcional) y dominio propio (opcional).
- Qué hizo exactamente en la app de logística con geolocalización y en la integración con plataformas de cobro → proyectos 7 y 8.
- Resultados concretos de Softtek.
- Analítica (Plausible u otra): no incluida.
