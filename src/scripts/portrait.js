// Retrato: foto que se enfoca al cargar (pixelado → nítido) y modo ASCII (caracteres con el color de acento).
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
  // ASCII: el retrato como caracteres; lo oscuro de la foto (pelo, rasgos, ropa) se dibuja más denso y el fondo claro queda vacío.
  const RAMP = ' .:-=+*#%@', CW = 6.6, CH = 10, FS = 11.5;
  let lum = null, cols = 0, rows = 0;
  function sample() {
    cols = Math.floor(W / CW); rows = Math.floor(H / CH);
    tiny.width = cols; tiny.height = rows; tctx.drawImage(img, 0, 0, cols, rows);
    const d = tctx.getImageData(0, 0, cols, rows).data, raw = [];
    for (let i = 0; i < cols * rows; i++) raw.push((.299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2]) / 255);
    const sorted = [...raw].sort((a, b) => a - b), lo = sorted[Math.floor(raw.length * .04)], hi = sorted[Math.floor(raw.length * .9)];
    lum = raw.map((l) => Math.min(1, Math.max(0, 1 - (l - lo) / (hi - lo || 1))));
  }
  function ascii(progress = 1) {
    if (!lum) sample();
    ctx.fillStyle = css('--surface') || '#132026'; ctx.fillRect(0, 0, W, H);
    ctx.font = `700 ${FS}px "JetBrains Mono", ui-monospace, monospace`; ctx.textBaseline = 'top';
    ctx.fillStyle = css('--accent') || '#43D9BE';
    const ox = (W - cols * CW) / 2, limit = Math.floor(rows * progress);
    for (let y = 0; y < rows; y++) {
      if (y > limit) break;
      for (let x = 0; x < cols; x++) {
        const v = Math.pow(lum[y * cols + x], 1.1), ch = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
        if (ch === ' ') continue;
        ctx.globalAlpha = (y > limit - 3 ? .4 : 1) * (.62 + .38 * v);
        ctx.fillText(ch, ox + x * CW, y * CH);
      }
    }
    ctx.globalAlpha = 1;
  }
  function sweep() {
    if (timer) clearInterval(timer);
    if (reduce) { ascii(1); return; }
    let t = 0; ascii(0);
    timer = setInterval(() => { t += 1 / 30; if (t >= 1) { clearInterval(timer); timer = null; ascii(1); return; } ascii(t); }, 30);
  }
  function render() {
    if (!ready) return;
    $('pframe').classList.toggle('sig', mode === 'sig');
    mode === 'sig' ? ascii(1) : photo(1);
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
    if (m === 'photo') focusIn(); else { $('pframe').classList.add('sig'); sweep(); }
  }
  $('m-photo').addEventListener('click', () => setMode('photo'));
  $('m-sig').addEventListener('click', () => setMode('sig'));
  $('m-redo')?.addEventListener('click', () => { if (mode !== 'sig') setMode('sig'); else sweep(); });
  document.addEventListener('themechange', () => setTimeout(render, 0));
  img.onload = () => { ready = true; focusIn(); };
  img.src = cv.dataset.src;
}
