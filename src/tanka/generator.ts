import type { Tanka, TankaLine, Template, Line, VocabEntry } from './types';
import { allTemplates, templateV0 } from './templates';
import { buildVocabIndex, lookupVocab, type VocabIndex } from './vocab';
import { countMora } from './mora';
import { hasBadPattern } from './badPatterns';

export interface GenerateOptions {
  template?: Template;
  selectedTags?: string[];
  vocabIndex?: VocabIndex;
  rng?: () => number;
  /** length 5。 null/undefined の slot は再抽選、 TankaLine の slot はそのまま採用 */
  pinnedLines?: (TankaLine | null | undefined)[];
  /**
   * 直近の連続生成で出た語 (display)。 別候補があれば優先的に回避する (ソフト)。
   * 候補が全て既出なら従来通り全候補から抽選。 助詞は対象外。
   */
  recentDisplays?: Iterable<string>;
}

export interface GenerateResult {
  tanka: Tanka;
}

let cachedIndex: VocabIndex | null = null;
function getIndex(): VocabIndex {
  if (!cachedIndex) cachedIndex = buildVocabIndex();
  return cachedIndex;
}

function pickRandom<T>(arr: T[], rng: () => number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * 直近既出語を避ける (ソフト)。 別候補が残るなら既出を除外、
 * 全て既出なら全候補を返す。 助詞は反復しても自然なので対象外。
 */
function applyRecency(
  arr: VocabEntry[],
  recent?: Set<string>,
): VocabEntry[] {
  if (!recent || recent.size === 0) return arr;
  const fresh = arr.filter((e) => e.kind === 'particle' || !recent.has(e.display));
  return fresh.length > 0 ? fresh : arr;
}

/**
 * エントリ抽選。 順序は taste 優先 → 既出回避 → ランダム。
 * usePref が true のときだけ preferredTags でタグ一致を優先する。
 */
function pickEntry(
  arr: VocabEntry[],
  rng: () => number,
  usePref: boolean,
  preferredTags?: string[],
  recent?: Set<string>,
): VocabEntry | undefined {
  if (arr.length === 0) return undefined;
  let pool = arr;
  if (usePref && preferredTags && preferredTags.length > 0) {
    const matched = pool.filter((e) => e.tags?.some((t) => preferredTags.includes(t)));
    if (matched.length > 0) pool = matched;
  }
  pool = applyRecency(pool, recent);
  return pool[Math.floor(rng() * pool.length)];
}

function matchesSlotTags(entry: VocabEntry, tags?: string[]): boolean {
  if (!tags || tags.length === 0) return true;
  return tags.every((tag) => (
    tag.startsWith('!')
      ? !entry.tags.includes(tag.slice(1))
      : entry.tags.includes(tag)
  ));
}

function fillLine(
  line: Line,
  index: VocabIndex,
  rng: () => number,
  preferredTags?: string[],
  outerUsedDisplays?: Set<string>,
  recent?: Set<string>,
): TankaLine | null {
  const entries: VocabEntry[] = [];
  const lineUsed = new Set<string>();
  for (const slot of line.slots) {
    const dedupe = (arr: VocabEntry[]) =>
      arr.filter((e) => {
        if (e.kind === 'particle') return true;
        if (lineUsed.has(e.display)) return false;
        if (outerUsedDisplays?.has(e.display)) return false;
        return true;
      });

    let candidates = dedupe(
      lookupVocab(
        index,
        slot.kind,
        slot.mora,
        slot.constraint?.pos,
        slot.constraint?.particle,
      ).filter((entry) => matchesSlotTags(entry, slot.constraint?.tags)),
    );
    if (candidates.length === 0 && line.allowJiamari !== false) {
      candidates = dedupe(
        [
          ...lookupVocab(index, slot.kind, slot.mora + 1, slot.constraint?.pos, slot.constraint?.particle),
          ...lookupVocab(index, slot.kind, slot.mora - 1, slot.constraint?.pos, slot.constraint?.particle),
        ].filter((entry) => matchesSlotTags(entry, slot.constraint?.tags)),
      );
    }
    // 助詞・動詞には taste 重み付けしない (タグ概念が薄いため)。 オノマトペは taste 連動する。
    const usePref =
      slot.kind === 'season' ||
      slot.kind === 'emotion' ||
      slot.kind === 'motif' ||
      slot.kind === 'onomatope';
    const picked = pickEntry(candidates, rng, usePref, preferredTags, recent);
    if (!picked) return null;
    entries.push(picked);
    if (picked.kind !== 'particle') lineUsed.add(picked.display);
  }
  const display = entries.map((e) => e.display).join('');
  const reading = entries.map((e) => e.reading).join('');
  return { display, reading, mora: countMora(reading), entries };
}

export function generate(opts: GenerateOptions = {}): GenerateResult {
  const rng = opts.rng ?? Math.random;
  const template = opts.template ?? pickRandom(allTemplates, rng) ?? templateV0;
  const index = opts.vocabIndex ?? getIndex();
  const recent = opts.recentDisplays ? new Set(opts.recentDisplays) : undefined;

  let lines: TankaLine[] | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const usedAcrossLines = new Set<string>();
    if (opts.pinnedLines) {
      for (const pl of opts.pinnedLines) {
        if (!pl) continue;
        for (const e of pl.entries) {
          if (e.kind !== 'particle') usedAcrossLines.add(e.display);
        }
      }
    }
    const filled = template.lines.map((line, i) => {
      const pinned = opts.pinnedLines?.[i];
      if (pinned) return pinned;
      const result = fillLine(line, index, rng, opts.selectedTags, usedAcrossLines, recent);
      if (result) {
        for (const e of result.entries) {
          if (e.kind !== 'particle') usedAcrossLines.add(e.display);
        }
      }
      return result;
    });
    if (filled.some((l) => l === null)) {
      throw new Error('generate: failed to fill some line (DB too small?)');
    }
    const candidateLines = filled as TankaLine[];
    if (!hasBadPattern(candidateLines) || attempt === 7) {
      lines = candidateLines;
      break;
    }
  }
  if (!lines) throw new Error('generate: failed to draw valid lines');
  const tanka: Tanka = {
    id: `${Date.now()}-${Math.floor(rng() * 1e6)}`,
    templateId: template.id,
    lines: [lines[0], lines[1], lines[2], lines[3], lines[4]],
    selectedTags: opts.selectedTags ?? [],
    createdAt: Date.now(),
  };
  return { tanka };
}

export { allTemplates };
