export type VocabKind = 'season' | 'emotion' | 'motif' | 'verb' | 'particle';

export interface VocabEntry {
  display: string;
  reading: string;
  aliases: string[];
  tags: string[];
  kind: VocabKind;
  pos?: string;
}

export interface Slot {
  kind: VocabKind;
  mora: number;
  constraint?: { tags?: string[]; pos?: string };
}

export interface Line {
  target: 5 | 7;
  slots: Slot[];
  allowJiamari?: boolean;
}

export interface Template {
  id: string;
  lines: [Line, Line, Line, Line, Line];
  frame?: string;
}

export interface TankaLine {
  display: string;
  reading: string;
  mora: number;
  entries: VocabEntry[];
}

export interface Tanka {
  id: string;
  templateId: string;
  lines: [TankaLine, TankaLine, TankaLine, TankaLine, TankaLine];
  selectedTags: string[];
  fallbackReason?: string;
  createdAt: number;
}
