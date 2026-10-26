const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Ruta interna respetando `base` (GitHub Pages sirve bajo /proyecto-cv). */
export const url = (p = '/') => base + p;
export const abs = (p = '/') => new URL(url(p), import.meta.env.SITE).href;
