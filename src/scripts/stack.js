// Stack filtrable por categoría, con nota del rol al pasar el cursor o el foco.
import { getLang } from './i18n.js';

export function initStack() {
  const cats = [...document.querySelectorAll('#cats button')];
  const chips = [...document.querySelectorAll('#chips li')];
  const note = document.getElementById('note');
  if (!note) return;
  const hint = () => { note.textContent = note.dataset['hint' + (getLang() === 'en' ? 'En' : 'Es')]; };
  const show = (c) => { note.textContent = c.dataset[getLang() === 'en' ? 'roleEn' : 'roleEs']; };

  chips.forEach((c) => {
    c.addEventListener('mouseenter', () => show(c));
    c.addEventListener('focus', () => show(c));
    c.addEventListener('mouseleave', hint);
    c.addEventListener('blur', hint);
  });
  cats.forEach((b) => b.addEventListener('click', () => {
    const c = b.dataset.c;
    cats.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    chips.forEach((ch) => ch.classList.toggle('dim', c !== 'all' && ch.dataset.c !== c));
  }));
  document.addEventListener('langchange', hint);
  hint();
}
