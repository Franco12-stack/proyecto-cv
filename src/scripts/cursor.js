// Cursor con anillo: solo con mouse y sin prefers-reduced-motion.
export function initCursor() {
  const ring = document.getElementById('ring');
  if (!ring || !matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let x = 0, y = 0, tx = 0, ty = 0, go = false;
  const loop = () => { x += (tx - x) * .18; y += (ty - y) * .18; ring.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); };
  addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; if (!go) { go = true; x = tx; y = ty; ring.classList.add('on'); loop(); } });
  document.addEventListener('mouseleave', () => ring.classList.remove('on'));
  document.addEventListener('mouseenter', () => ring.classList.add('on'));
  document.addEventListener('mouseover', (e) => ring.classList.toggle('big', !!e.target.closest('a,button,summary,.chips li')));
}
