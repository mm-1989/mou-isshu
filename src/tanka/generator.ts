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
 * preferredTags があれば、 タグ一致するエントリを優先抽選。
 * 一致無しなら全候補から抽選 (fallback)。
 */
function pickRandomTagged(
  arr: VocabEntry[],
  rng: () => number,
  preferredTags?: string[],
): VocabEntry | undefined {
  if (arr.length === 0) return undefined;
  if (preferredTags && preferredTags.length > 0) {
    const matched = arr.filter((e) =>
      e.tags?.some((t) => preferredTags.includes(t)),
    );
    if (matched.length > 0) return matched[Math.floor(rng() * matched.length)];
  }
  return arr[Math.floor(rng() * arr.length)];
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
    // 助詞・動詞には taste 重み付けしない (タグ概念が薄いため)
    const usePref = slot.kind === 'season' || slot.kind === 'emotion' || slot.kind === 'motif';
    const picked = usePref
      ? pickRandomTagged(candidates, rng, preferredTags)
      : pickRandom(candidates, rng);
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
      const result = fillLine(line, index, rng, opts.selectedTags, usedAcrossLines);
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
