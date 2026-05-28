import type { TankaLine, VocabEntry } from './types';

const CHECK_DUP_KINDS = new Set(['season', 'emotion', 'motif', 'verb']);
const SUBJECT_PARTICLES = new Set(['は', 'が', 'も', 'と']);

function hasAllTags(entry: VocabEntry, tags: string[]): boolean {
  return tags.every((tag) => entry.tags.includes(tag));
}

export function hasRepeatedCoreDisplay(lines: TankaLine[]): boolean {
  const seen = new Set<string>();
  for (const line of lines) {
    for (const entry of line.entries) {
      if (!CHECK_DUP_KINDS.has(entry.kind)) continue;
      const key = `${entry.kind}:${entry.display}`;
      if (seen.has(key)) return true;
      seen.add(key);
    }
  }
  return false;
}

export function hasBadPersonification(lines: TankaLine[]): boolean {
  return lines.some((line) => {
    for (let i = 0; i < line.entries.length - 2; i++) {
      const subject = line.entries[i];
      const particle = line.entries[i + 1];
      const verb = line.entries[i + 2];
      if (subject.kind !== 'motif' || particle.kind !== 'particle' || verb.kind !== 'verb') continue;
      if (!SUBJECT_PARTICLES.has(particle.display)) continue;
      if (!verb.tags.includes('心情')) continue;
      if (!hasAllTags(subject, ['人'])) return true;
    }
    return false;
  });
}

export function hasBadPattern(lines: TankaLine[]): boolean {
  return hasRepeatedCoreDisplay(lines) || hasBadPersonification(lines);
}
