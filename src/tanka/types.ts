export type VocabKind = 'season' | 'emotion' | 'motif' | 'verb' | 'particle' | 'onomatope';
export type ParticleCategory = 'kaku' | 'rentai' | 'fukujo';

export interface VocabEntry {
  display: string;
  reading: string;
  aliases: string[];
  tags: string[];
  kind: VocabKind;
  pos?: string;
  /** 抽選の相対重み (省略時 1)。 1 未満で出現を抑え、 1 超で出やすくする。 */
  weight?: number;
}

export interface Slot {
  kind: VocabKind;
  mora: number;
  constraint?: { tags?: string[]; pos?: string; particle?: ParticleCategory };
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
