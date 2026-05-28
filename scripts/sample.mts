import { generate } from '../src/tanka/generator';

const TARGETS = [5, 7, 5, 7, 7];

for (let i = 0; i < 20; i++) {
  const { tanka } = generate();
  console.log(`--- 第 ${i + 1} 首 (template: ${tanka.templateId}) ---`);
  tanka.lines.forEach((line, j) => {
    const target = TARGETS[j];
    const diff = line.mora - target;
    const mark = diff === 0 ? '✓' : diff > 0 ? `+${diff}` : `${diff}`;
    console.log(`  L${j + 1} ${target}→${line.mora} ${mark}  ${line.display} (${line.reading})`);
  });
  console.log();
}
