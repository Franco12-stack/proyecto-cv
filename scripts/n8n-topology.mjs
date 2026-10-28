// Extrae SOLO la estructura (nombres, tipos, posiciones, conexiones) de un export de n8n.
// No copia parámetros, prompts, URLs ni credenciales. Uso: node scripts/n8n-topology.mjs ruta/al/export.json > src/data/agente-flow.json
import { readFileSync } from 'node:fs';

const wf = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const kindOf = (t) => {
  const s = t.split('.').pop();
  if (/webhook|trigger|cron|schedule/i.test(s)) return 'trigger';
  if (s === 'agent') return 'agent';
  if (/^lmChat/.test(s)) return 'model';
  if (/^memory/.test(s)) return 'memory';
  if (/^tool/.test(s)) return 'tool';
  if (s === 'httpRequest') return 'http';
  if (s === 'code') return 'code';
  if (s === 'if' || s === 'filter' || s === 'switch') return 'logic';
  if (s === 'redis') return 'redis';
  if (s === 'wait') return 'wait';
  return 'other';
};
const clean = (s) => s.replace(/^[^\p{L}\p{N}¿¡]+/u, '').trim();
const real = wf.nodes.filter((n) => n.type !== 'n8n-nodes-base.stickyNote');
const nodes = real.map((n) => ({ name: n.name, kind: kindOf(n.type), x: n.position[0], y: n.position[1] }));
const names = new Set(nodes.map((n) => n.name));
const edges = [];
for (const [from, byType] of Object.entries(wf.connections)) {
  if (!names.has(from)) continue;
  for (const [type, outs] of Object.entries(byType)) {
    for (const list of outs) for (const c of list || []) if (names.has(c.node)) edges.push({ from, to: c.node, ai: type.startsWith('ai_') });
  }
}
const groups = wf.nodes
  .filter((n) => n.type === 'n8n-nodes-base.stickyNote' && /^\P{L}*\d\./u.test(n.name))
  .map((n) => ({ n: +n.name.match(/(\d)\./)[1], name: clean(n.name).replace(/^\d\.\s*/, ''), x: n.position[0], y: n.position[1] }))
  .sort((a, b) => a.n - b.n);
process.stdout.write(JSON.stringify({ nodes, edges, groups }, null, 1));
