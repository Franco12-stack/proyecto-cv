// Reloj de Buenos Aires, barra de progreso, menú con sección activa y botón de copiar email.
import { getLang } from './i18n.js';

export function initClock() {
  const els = [...document.querySelectorAll('[data-clock]')];
  if (!els.length) return;
  const tick = () => {
    let t;
    try { t = new Date().toLocaleTimeString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false }); }
    catch (e) { t = new Date().toLocaleTimeString(); }
    els.forEach((e) => { e.textContent = t; });
  };
  tick(); setInterval(tick, 1000);
}

export function initProgress() {
  const bar = document.getElementById('progress');
  const upd = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + '%';
  };
  addEventListener('scroll', upd, { passive: true }); upd();
}

export function initActiveNav() {
  const links = [...document.querySelectorAll('nav a[data-sec]')];
  const secs = links.map((a) => document.getElementById(a.dataset.sec));
  if (!('IntersectionObserver' in window) || !secs.some(Boolean)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = secs.indexOf(e.target);
    links.forEach((a, j) => { a.classList.toggle('on', j === i); if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }), { rootMargin: '-35% 0px -60% 0px' });
  secs.forEach((s) => s && io.observe(s));
}

export function initCopy() {
  const m = document.getElementById('mail'), btn = document.getElementById('copy');
  if (!m || !btn) return;
  const labels = JSON.parse(btn.dataset.labels);
  const set = (k) => { btn.querySelector('.cl').textContent = labels[getLang()][k]; };
  const live = document.getElementById('copy-live');
  const select = () => { const r = document.createRange(); r.selectNodeContents(m); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  btn.addEventListener('click', () => {
    const t = m.textContent.trim();
    const done = () => { set('ok'); live.textContent = labels[getLang()].ok; setTimeout(() => { set('idle'); live.textContent = ''; }, 1800); };
    const fb = () => { select(); set('sel'); live.textContent = labels[getLang()].sel; };
    try { navigator.clipboard?.writeText ? navigator.clipboard.writeText(t).then(done, fb) : fb(); } catch (e) { fb(); }
  });
}
