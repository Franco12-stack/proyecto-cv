// Showcase de proyectos: la sección queda fija y el scroll recorre las tarjetas (≥860px). En móvil es una lista normal.
export function initProjects() {
  const sec = document.getElementById('proyectos');
  const cards = [...document.querySelectorAll('.pcard')];
  const bars = [...document.querySelectorAll('.pbar')];
  const cur = document.getElementById('pcur');
  if (!sec || !cards.length) return;
  const mq = matchMedia('(min-width:860px)');
  const header = document.querySelector('header.top');
  let idx = 0;

  const hh = () => { const h = header ? header.offsetHeight : 96; sec.style.setProperty('--hh', h + 'px'); return h; };
  const apply = (i) => {
    idx = i;
    cards.forEach((c, j) => { c.classList.toggle('on', j === i); c.toggleAttribute('inert', mq.matches && j !== i); });
    bars.forEach((b, j) => { b.classList.toggle('on', j <= i); if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    cur.textContent = String(i + 1).padStart(2, '0');
  };
  const update = () => {
    if (!mq.matches) { cards.forEach((c) => { c.removeAttribute('inert'); c.classList.add('on'); }); return; }
    const h = hh();
    const top = sec.getBoundingClientRect().top - h;
    const span = sec.offsetHeight - (innerHeight - h);
    const p = Math.min(1, Math.max(0, -top / span));
    const i = Math.min(cards.length - 1, Math.floor(p * cards.length * 0.999));
    if (i !== idx || !cards[i].classList.contains('on') || cards.filter((c) => c.classList.contains('on')).length !== 1) apply(i);
  };
  bars.forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.i, h = hh();
    const span = sec.offsetHeight - (innerHeight - h);
    const y = scrollY + sec.getBoundingClientRect().top - h + span * ((i + 0.5) / cards.length);
    scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  }));
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  mq.addEventListener('change', update);
  hh(); update();
}
