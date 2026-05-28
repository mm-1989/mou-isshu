import type { Template } from './types';

/**
 * Phase 0 v0 テンプレ。 1 種類のみ。
 *
 * 構造:
 *   L1 (5): [season-4] [particle-1]                 例: 春風に
 *   L2 (7): [motif-3]  [particle-1] [verb-テ-3]      例: 写真を泣いて
 *   L3 (5): [emotion-4] [particle-1]                 例: 寂しさの
 *   L4 (7): [motif-3]  [particle-1] [verb-終止-3]    例: 電車に走る
 *   L5 (7): [emotion-4] [verb-終止-3]                 例: 切なさ残る
 */
export const templateV0: Template = {
  id: 'v0-static-1',
  frame: 'modern-basic',
  lines: [
    {
      target: 5,
      slots: [
        { kind: 'season', mora: 4 },
        { kind: 'particle', mora: 1 },
      ],
    },
    {
      target: 7,
      slots: [
        { kind: 'motif', mora: 3 },
        { kind: 'particle', mora: 1 },
        { kind: 'verb', mora: 3, constraint: { pos: 'verb-テ' } },
      ],
    },
    {
      target: 5,
      slots: [
        { kind: 'emotion', mora: 4 },
        { kind: 'particle', mora: 1 },
      ],
    },
    {
      target: 7,
      slots: [
        { kind: 'motif', mora: 3 },
        { kind: 'particle', mora: 1 },
        { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止' } },
      ],
    },
    {
      target: 7,
      slots: [
        { kind: 'emotion', mora: 4 },
        { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止' } },
      ],
    },
  ],
};

export const allTemplates: Template[] = [templateV0];
