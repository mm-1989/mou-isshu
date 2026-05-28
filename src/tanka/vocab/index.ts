import type { ParticleCategory, VocabEntry, VocabKind } from '../types';
import { countMora } from '../mora';
import { seasonVocab } from './season';
import { emotionVocab } from './emotion';
import { motifVocab } from './motif';
import { verbsVocab } from './verbs';
import { particlesVocab } from './particles';

export const allVocab: VocabEntry[] = [
  ...seasonVocab,
  ...emotionVocab,
  ...motifVocab,
  ...verbsVocab,
  ...particlesVocab,
];

export interface VocabIndex {
  byKindMora: Map<string, VocabEntry[]>;
  byKindMoraPos: Map<string, VocabEntry[]>;
}

function key2(kind: VocabKind, mora: number): string {
  return `${kind}:${mora}`;
}

function key3(kind: VocabKind, mora: number, pos: string): string {
  return `${kind}:${mora}:${pos}`;
}

export function buildVocabIndex(entries: VocabEntry[] = allVocab): VocabIndex {
  const byKindMora = new Map<string, VocabEntry[]>();
  const byKindMoraPos = new Map<string, VocabEntry[]>();

  for (const entry of entries) {
    const mora = countMora(entry.reading);
    const k2 = key2(entry.kind, mora);
    const bucket2 = byKindMora.get(k2) ?? [];
    bucket2.push(entry);
    byKindMora.set(k2, bucket2);

    if (entry.pos) {
      const k3 = key3(entry.kind, mora, entry.pos);
      const bucket3 = byKindMoraPos.get(k3) ?? [];
      bucket3.push(entry);
      byKindMoraPos.set(k3, bucket3);
    }
  }
  return { byKindMora, byKindMoraPos };
}

export function lookupVocab(
  index: VocabIndex,
  kind: VocabKind,
  mora: number,
  pos?: string,
  particle?: ParticleCategory,
): VocabEntry[] {
  const normalizedPos = particle ?? pos;
  if (normalizedPos) {
    return index.byKindMoraPos.get(key3(kind, mora, normalizedPos)) ?? [];
  }
  return index.byKindMora.get(key2(kind, mora)) ?? [];
}

export { seasonVocab, emotionVocab, motifVocab, verbsVocab, particlesVocab };
