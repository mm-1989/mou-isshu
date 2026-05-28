import type { Tanka, TankaLine, Template, Line, VocabEntry } from './types';
import { allTemplates, templateV0 } from './templates';
import { buildVocabIndex, lookupVocab, type VocabIndex } from './vocab';
import { countMora } from './mora';

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

function fillLine(
  line: Line,
  index: VocabIndex,
  rng: () => number,
  preferredTags?: string[],
): TankaLine | null {
  const entries: VocabEntry[] = [];
  for (const slot of line.slots) {
    let candidates = lookupVocab(index, slot.kind, slot.mora, slot.constraint?.pos);
    if (candidates.length === 0 && line.allowJiamari !== false) {
      candidates = [
        ...lookupVocab(index, slot.kind, slot.mora + 1, slot.constraint?.pos),
        ...lookupVocab(index, slot.kind, slot.mora - 1, slot.constraint?.pos),
      ];
    }
    // 助詞・動詞には taste 重み付けしない (タグ概念が薄いため)
    const usePref = slot.kind === 'season' || slot.kind === 'emotion' || slot.kind === 'motif';
    const picked = usePref
      ? pickRandomTagged(candidates, rng, preferredTags)
      : pickRandom(candidates, rng);
    if (!picked) return null;
    entries.push(picked);
  }
  const display = entries.map((e) => e.display).join('');
  const reading = entries.map((e) => e.reading).join('');
  return { display, reading, mora: countMora(reading), entries };
}

export function generate(opts: GenerateOptions = {}): GenerateResult {
  const template = opts.template ?? templateV0;
  const index = opts.vocabIndex ?? getIndex();
  const rng = opts.rng ?? Math.random;

  const filled = template.lines.map((line, i) => {
    const pinned = opts.pinnedLines?.[i];
    if (pinned) return pinned;
    return fillLine(line, index, rng, opts.selectedTags);
  });
  if (filled.some((l) => l === null)) {
    throw new Error('generate: failed to fill some line (DB too small?)');
  }
  const lines = filled as TankaLine[];
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
