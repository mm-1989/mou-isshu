import { describe, it, expect } from 'vitest';
import { countMora } from '../src/tanka/mora';

describe('countMora', () => {
  it.each([
    ['きょう', 2],          // 拗音
    ['コーヒー', 4],        // カタカナ + 長音
    ['ちょっと', 3],        // 拗音(ちょ=1) + 促音(っ=1) + と(1) = 3
    ['すきだった', 5],       // 「好きだった」 (DB reading 想定)
    ['きみわ', 3],          // 「君は」 (は→わ で reading 化済み)
    ['えきえ', 3],          // 「駅へ」 (へ→え で reading 化済み)
    ['えーあい', 4],        // 「AI」 (DB reading 想定: えーあい)
    ['こんびに', 4],        // 撥音含む
  ])('reading "%s" → %i mora', (reading, expected) => {
    expect(countMora(reading)).toBe(expected);
  });

  it('空文字列は 0', () => {
    expect(countMora('')).toBe(0);
  });

  it('句読点・空白は 0 モーラ', () => {
    expect(countMora('あ、い。う ')).toBe(3);
  });

  it('行頭の小書きは 1 モーラ扱い', () => {
    expect(countMora('ぃ')).toBe(1);
  });
});
