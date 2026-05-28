/**
 * モーラカウント
 *
 * ルール:
 * - 通常の仮名 = 1 モーラ
 * - 小書き仮名 (ぁぃぅぇぉゃゅょゎ + カタカナ対応) は前音に結合
 *   - ただし行頭で単独出現したら 1 モーラ扱い (フォールバック)
 * - 長音 ー = 1 モーラ (reading 上でのみ扱う)
 * - 撥音 ん / 促音 っ = 1 モーラ
 * - 句読点・空白・括弧・記号 = 0 モーラ
 * - 漢字・数字・英字は原則 DB の reading (ひらがな) で渡される前提
 *
 * 入力は基本ひらがなを想定。 カタカナ混在も許容 (内部で同等扱い)。
 */

const SMALL_KANA = new Set([
  'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'ゎ',
  'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ヮ',
]);

const SKIP_CHARS = new Set([
  ' ', '　', '、', '。', '・', '「', '」', '『', '』',
  '(', ')', '（', '）', '!', '?', '！', '?', '"', "'",
  '”', '“', '‘', '’', '/', '\\', '-',
]);

const HIRAGANA_RANGE = [0x3041, 0x3096] as const;
const KATAKANA_RANGE = [0x30a1, 0x30f6] as const;

function isHiraganaOrKatakana(ch: string): boolean {
  const code = ch.codePointAt(0);
  if (code === undefined) return false;
  return (
    (code >= HIRAGANA_RANGE[0] && code <= HIRAGANA_RANGE[1]) ||
    (code >= KATAKANA_RANGE[0] && code <= KATAKANA_RANGE[1]) ||
    ch === 'ー'
  );
}

export function countMora(reading: string): number {
  let mora = 0;
  for (let i = 0; i < reading.length; i++) {
    const ch = reading[i];

    if (SKIP_CHARS.has(ch)) continue;

    if (SMALL_KANA.has(ch)) {
      // 前音に結合 (= 0 加算)、 ただし行頭なら 1
      if (mora === 0) {
        mora += 1;
      }
      continue;
    }

    if (!isHiraganaOrKatakana(ch)) {
      // ひらがな・カタカナ・長音 以外は 0 (DB reading にこれらは入らない想定)
      continue;
    }

    mora += 1;
  }
  return mora;
}
