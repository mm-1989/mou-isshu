import { describe, it, expect } from 'vitest';
import { generate } from '../src/tanka/generator';

const TARGETS = [5, 7, 5, 7, 7];

describe('generate', () => {
  it('1 首生成して 5-7-5-7-7 ± 1 に収まる', () => {
    const { tanka } = generate();
    expect(tanka.lines).toHaveLength(5);
    tanka.lines.forEach((line, i) => {
      const diff = Math.abs(line.mora - TARGETS[i]);
      expect(diff, `L${i + 1} mora=${line.mora} target=${TARGETS[i]} (${line.display})`).toBeLessThanOrEqual(1);
    });
  });

  it('10 連続生成して全て成功し、 多様性がある', () => {
    const tankas = Array.from({ length: 10 }, () => generate().tanka);
    expect(tankas).toHaveLength(10);

    const uniqueDisplays = new Set(tankas.map((t) => t.lines.map((l) => l.display).join('|')));
    expect(uniqueDisplays.size, '10 連続で全て同じはありえない').toBeGreaterThan(1);
  });

  it('全行が 5-7-5-7-7 ± 1 を守る (50 サンプル)', () => {
    for (let s = 0; s < 50; s++) {
      const { tanka } = generate();
      tanka.lines.forEach((line, i) => {
        const diff = Math.abs(line.mora - TARGETS[i]);
        expect(diff, `sample ${s} L${i + 1} (${line.display}=${line.reading})`).toBeLessThanOrEqual(1);
      });
    }
  });
});
