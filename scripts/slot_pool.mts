import { buildVocabIndex, lookupVocab } from '../src/tanka/vocab';
import { allTemplates } from '../src/tanka/templates';
import type { Slot } from '../src/tanka/types';

const index = buildVocabIndex();

function matchesSlotTags(tags: string[], constraint?: string[]): boolean {
  if (!constraint || constraint.length === 0) return true;
  return constraint.every((t) => (t.startsWith('!') ? !tags.includes(t.slice(1)) : tags.includes(t)));
}

function poolSize(slot: Slot): number {
  const base = lookupVocab(index, slot.kind, slot.mora, slot.constraint?.pos, slot.constraint?.particle);
  return base.filter((e) => matchesSlotTags(e.tags, slot.constraint?.tags)).length;
}

const seen = new Set<string>();
for (const tpl of allTemplates) {
  console.log(`\n== ${tpl.id} (${tpl.frame}) ==`);
  tpl.lines.forEach((line, i) => {
    line.slots.forEach((slot) => {
      if (slot.kind === 'particle') return;
      const tagStr = slot.constraint?.tags ? `[${slot.constraint.tags.join(',')}]` : '';
      const posStr = slot.constraint?.pos ?? '';
      const n = poolSize(slot);
      const key = `${slot.kind}:${slot.mora}:${posStr}:${tagStr}`;
      const flag = n <= 4 ? '  ⚠️ 枯れ' : '';
      console.log(`  L${i + 1} ${slot.kind} mora=${slot.mora} ${posStr} ${tagStr} → ${n} 候補${flag}`);
      seen.add(`${key}\t${n}`);
    });
  });
}

console.log('\n\n=== 枯れスロット (候補 ≤ 5) 一覧 ===');
[...seen]
  .map((s) => s.split('\t'))
  .filter(([, n]) => Number(n) <= 5)
  .sort((a, b) => Number(a[1]) - Number(b[1]))
  .forEach(([key, n]) => console.log(`  ${n.padStart(2)} 候補  ${key}`));
