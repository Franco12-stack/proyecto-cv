// Tema oscuro por defecto; respeta prefers-color-scheme y guarda la elección.
const root = document.documentElement;

export function initTheme() {
  document.getElementById('theme')?.addEventListener('click', () => {
    let cur = root.getAttribute('data-theme');
    if (!cur) cur = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ff-theme', next); } catch (e) {}
    document.dispatchEvent(new CustomEvent('themechange'));
  });
}
