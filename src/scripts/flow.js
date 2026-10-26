// Diagrama de flujo interactivo + simulación con log tipo terminal.
import { getLang } from './i18n.js';

export function initFlow() {
  const flow = document.getElementById('flow');
  if (!flow) return;
  const data = JSON.parse(document.getElementById('flow-data').textContent);
  const nodes = [...flow.querySelectorAll('.node')];
  const detail = document.getElementById('detail');
  const term = document.getElementById('term');
  const runBtn = document.getElementById('run');
  let sel = 0, running = false, hasRun = false, timers = [];

  const showDetail = (k) => {
    sel = k;
    nodes.forEach((n, i) => { n.classList.toggle('sel', i === k); n.setAttribute('aria-pressed', String(i === k)); });
    detail.innerHTML = data[getLang()].steps[k].detail;
  };
  const idle = () => { if (!hasRun) term.innerHTML = data[getLang()].idle; };

  nodes.forEach((n) => n.addEventListener('click', () => { if (!running) showDetail(+n.dataset.k); }));

  const clearRun = () => {
    timers.forEach(clearTimeout); timers = [];
    nodes.forEach((n) => n.classList.remove('lit', 'pass'));
    running = false; runBtn.disabled = false;
  };

  runBtn.addEventListener('click', () => {
    if (running) return;
    clearRun(); running = true; hasRun = true; runBtn.disabled = true;
    const lines = data[getLang()].sim;
    term.innerHTML = '$ <b>run</b>';
    let i = 0;
    const step = () => {
      if (i >= lines.length) { running = false; runBtn.disabled = false; nodes.forEach((n) => n.classList.remove('lit')); return; }
      if (i < nodes.length) {
        nodes.forEach((n, j) => { n.classList.toggle('lit', j === i); n.classList.toggle('pass', j < i); });
        showDetail(i);
      } else {
        nodes.forEach((n) => { n.classList.remove('lit'); n.classList.add('pass'); });
      }
      term.innerHTML += '\n' + lines[i]; i++;
      timers.push(setTimeout(step, 900));
    };
    step();
  });

  document.addEventListener('langchange', () => { if (!running) { showDetail(sel); idle(); } });
  showDetail(0); idle();
}
