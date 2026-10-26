// Retrato: foto que se enfoca al cargar (pixelado → nítido) y modo "Señal" (halftone con el color de acento).
export function initPortrait() {
  const cv = document.getElementById('pc');
  if (!cv) return;
  const $ = (i) => document.getElementById(i);
  const root = document.documentElement;
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, img = new Image();
  const tiny = document.createElement('canvas'), tctx = tiny.getContext('2d', { willReadFrequently: true });
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let mode = 'photo', ready = false, timer = null;
  const css = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  const isDark = () => { const m = getComputedStyle(document.body).backgroundColor.match(/\d+/g); return !m || (.299 * m[0] + .587 * m[1] + .114 * m[2]) < 128; };

  function photo(px) {
    ctx.imageSmoothingEnabled = px <= 1;
    if (px <= 1) { ctx.drawImage(img, 0, 0, W, H); return; }
    tiny.width = Math.ceil(W / px); tiny.height = Math.ceil(H / px);
    tctx.drawImage(img, 0, 0, tiny.width, tiny.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tiny, 0, 0, tiny.width * px, tiny.height * px);
  }
  function halftone() {
    const cell = 8, cols = Math.floor(W / cell), rows = Math.floor(H / cell);
    tiny.width = cols; tiny.height = rows; tctx.drawImage(img, 0, 0, cols, rows);
    const d = tctx.getImageData(0, 0, cols, rows).data, dark = isDark();
    ctx.fillStyle = css('--surface') || '#132026'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = css('--accent') || '#43D9BE';
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4, l = (.299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]) / 255;
      const v = dark ? l : 1 - l, r = Math.max(0, v - .08) * cell * .62;
      if (r > .3) { ctx.beginPath(); ctx.arc(x * cell + cell / 2 + (W - cols * cell) / 2, y * cell + cell / 2, r, 0, 6.2832); ctx.fill(); }
    }
  }
  function render() {
    if (!ready) return;
    $('pframe').classList.toggle('sig', mode === 'sig');
    mode === 'sig' ? halftone() : photo(1);
  }
  function focusIn() {
    if (timer) clearInterval(timer);
    if (reduce) { photo(1); return; }
    const steps = [28, 18, 12, 8, 5, 3, 2, 1]; let i = 0;
    photo(steps[0]);
    timer = setInterval(() => { i++; if (i >= steps.length) { clearInterval(timer); timer = null; render(); return; } photo(steps[i]); }, 110);
  }
  function setMode(m) {
    mode = m;
    $('m-photo').setAttribute('aria-pressed', String(m === 'photo'));
    $('m-sig').setAttribute('aria-pressed', String(m === 'sig'));
    if (m === 'photo') focusIn(); else { if (timer) { clearInterval(timer); timer = null; } render(); }
  }
  $('m-photo').addEventListener('click', () => setMode('photo'));
  $('m-sig').addEventListener('click', () => setMode('sig'));
  document.addEventListener('themechange', () => setTimeout(render, 0));
  img.onload = () => { ready = true; focusIn(); };
  img.src = cv.dataset.src;
}
