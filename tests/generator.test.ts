import { describe, it, expect } from 'vitest';
import { generate } from '../src/tanka/generator';
import { allTemplates } from '../src/tanka/templates';
import type { Tanka } from '../src/tanka/types';

const TARGETS = [5, 7, 5, 7, 7];

function coreDisplays(t: Tanka): string[] {
  const out: string[] = [];
  for (const line of t.lines) for (const e of line.entries) if (e.kind !== 'particle') out.push(e.display);
  return out;
}

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

  it('オノマトペ template が初句に擬音語を置き、 5-7-5-7-7 ± 1 を守る', () => {
    const onoTemplate = allTemplates.find((t) => t.id === 'v1-onomatope');
    expect(onoTemplate, 'v1-onomatope template が存在する').toBeTruthy();
    for (let s = 0; s < 30; s++) {
      const { tanka } = generate({ template: onoTemplate });
      expect(tanka.lines[0].entries[0].kind, `sample ${s} 初句は擬音語`).toBe('onomatope');
      tanka.lines.forEach((line, i) => {
        const diff = Math.abs(line.mora - TARGETS[i]);
        expect(diff, `sample ${s} L${i + 1} (${line.display}=${line.reading})`).toBeLessThanOrEqual(1);
      });
    }
  });

  it('recentDisplays で直近の語を回避する (連続生成の反復抑制)', () => {
    const RECENT_CAP = 24;
    const adjOverlap = (useRecent: boolean): number => {
      let recent: string[] = [];
      let prev: Set<string> | null = null;
      let sum = 0;
      let pairs = 0;
      for (let i = 0; i < 30; i++) {
        const { tanka } = generate({ recentDisplays: useRecent ? recent : undefined });
        const cur = coreDisplays(tanka);
        if (useRecent) recent = [...recent, ...cur].slice(-RECENT_CAP);
        const curSet = new Set(cur);
        if (prev) {
          let ov = 0;
          for (const w of curSet) if (prev.has(w)) ov++;
          sum += ov;
          pairs++;
        }
        prev = curSet;
      }
      return sum / pairs;
    };
    const TRIALS = 30;
    let off = 0;
    let on = 0;
    for (let t = 0; t < TRIALS; t++) {
      off += adjOverlap(false);
      on += adjOverlap(true);
    }
    const avgOff = off / TRIALS;
    const avgOn = on / TRIALS;
    // 回避 ON は OFF より明確に低い (実測 ~0.05 vs ~0.96)。 緩めの閾値で flake を避ける。
    expect(avgOn, `ON=${avgOn.toFixed(2)} < OFF=${avgOff.toFixed(2)}`).toBeLessThan(avgOff * 0.5);
    expect(avgOn).toBeLessThan(0.3);
  });
});
