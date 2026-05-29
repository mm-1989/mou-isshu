import { allVocab } from '../src/tanka/vocab';
import { allTemplates } from '../src/tanka/generator';
import { countMora } from '../src/tanka/mora';
import { generate } from '../src/tanka/generator';

// 1. 「場面」 タグ持ち motif を探す
const sceneMotifs = allVocab.filter((e) => e.kind === 'motif' && e.tags.includes('場面'));
console.log(`場面 motif: ${sceneMotifs.length} 個`);
sceneMotifs.forEach((e) => console.log(`  ${e.display}: ${e.tags.join(',')}`));

// 2. motif-3 で !人 のもの
const m3NotHuman = allVocab.filter(
  (e) => e.kind === 'motif' && countMora(e.reading) === 3 && !e.tags.includes('人'),
);
console.log(`\nmotif-3 !人: ${m3NotHuman.length} 個`);
m3NotHuman.forEach((e) => console.log(`  ${e.display} (${e.reading}): ${e.tags.join(',')}`));

// 3. テンプレ別生成試行
console.log(`\n--- テンプレ別 30 回試行 ---`);
for (const tmpl of allTemplates) {
  let ok = 0, fail = 0;
  for (let i = 0; i < 30; i++) {
    try {
      generate({ template: tmpl });
      ok++;
    } catch {
      fail++;
    }
  }
  console.log(`  ${tmpl.id}: ${ok} 成功 / ${fail} 失敗`);
}
