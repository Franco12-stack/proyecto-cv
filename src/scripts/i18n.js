// Idioma ES/EN. El HTML ya contiene ambos textos; acá solo se alterna <html lang> y se avisa al resto.
const root = document.documentElement;
const $ = (id) => document.getElementById(id);

export function getLang() { return root.lang === 'en' ? 'en' : 'es'; }

export function setLang(l, persist = true) {
  root.lang = l;
  $('l-es')?.setAttribute('aria-pressed', String(l === 'es'));
  $('l-en')?.setAttribute('aria-pressed', String(l === 'en'));
  const t = document.querySelector('[data-title-' + l + ']');
  if (t) document.title = t.getAttribute('data-title-' + l);
  if (persist) { try { localStorage.setItem('ff-lang', l); } catch (e) {} }
  document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
}

export function initLang() {
  $('l-es')?.addEventListener('click', () => setLang('es'));
  $('l-en')?.addEventListener('click', () => setLang('en'));
  setLang(getLang(), false);
}
