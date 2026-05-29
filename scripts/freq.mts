import { generate } from '../src/tanka/generator';

const N = 200;
const counts = new Map<string, number>();
const byKind = new Map<string, Map<string, number>>();

for (let i = 0; i < N; i++) {
  const { tanka } = generate();
  for (const line of tanka.lines) {
    for (const e of line.entries) {
      counts.set(e.display, (counts.get(e.display) ?? 0) + 1);
      const k = e.kind;
      const sub = byKind.get(k) ?? new Map();
      sub.set(e.display, (sub.get(e.display) ?? 0) + 1);
      byKind.set(k, sub);
    }
  }
}

const sortDesc = (m: Map<string, number>) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]);

console.log(`=== ${N} 首生成、 出現頻度 (上位 10 / 各 kind) ===\n`);
for (const [kind, sub] of byKind.entries()) {
  if (kind === 'particle') continue;
  console.log(`-- ${kind} (${sub.size} 種) --`);
  for (const [display, n] of sortDesc(sub).slice(0, 12)) {
    const pct = ((n / N) * 100).toFixed(1);
    console.log(`  ${display.padEnd(8)} ${n.toString().padStart(3)} 回 (${pct}%)`);
  }
  console.log();
}
