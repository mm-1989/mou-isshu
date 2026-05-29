import type { Template } from './types';

export const templateV0: Template = {
  id: 'v1-verb-final',
  frame: '上句観察-下句感情',
  lines: [
    { target: 5, slots: [{ kind: 'season', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-テ', tags: ['人'] } }] },
    { target: 5, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'rentai' } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['!人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
    { target: 7, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
  ],
};

const templateTaigendome: Template = {
  id: 'v1-taigendome',
  frame: '連体-体言止め',
  lines: [
    { target: 5, slots: [{ kind: 'season', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-テ', tags: ['人'] } }] },
    { target: 5, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'kaku', tags: ['主格'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['場面'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'rentai' } }, { kind: 'motif', mora: 3, constraint: { tags: ['!人'] } }], allowJiamari: true },
    { target: 7, slots: [{ kind: 'season', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'rentai' } }, { kind: 'motif', mora: 2, constraint: { tags: ['!人'] } }] },
  ],
};

const templateInversion: Template = {
  id: 'v1-inversion',
  frame: '倒置法',
  lines: [
    { target: 5, slots: [{ kind: 'motif', mora: 2, constraint: { tags: ['人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 2, constraint: { pos: 'verb-終止', tags: ['心情'] } }] },
    { target: 7, slots: [{ kind: 'season', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'rentai' } }, { kind: 'motif', mora: 2, constraint: { tags: ['!人'] } }] },
    { target: 5, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 2, constraint: { tags: ['!人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 4, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
    { target: 7, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
  ],
};

const templateKugire: Template = {
  id: 'v1-kugire',
  frame: '三句切れ',
  lines: [
    { target: 5, slots: [{ kind: 'season', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 2, constraint: { tags: ['!人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 4, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
    { target: 5, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['場面'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'rentai' } }, { kind: 'motif', mora: 3, constraint: { tags: ['!人'] } }], allowJiamari: true },
    { target: 7, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
  ],
};

// 擬音導入: 初句を「○○○○と」(オノマトペ+様態の と) で起こし、 以降は V0 と同形。
// と が後続の動詞 (L2 テ形) にかかる連用修飾として読める。
const templateOnomatope: Template = {
  id: 'v1-onomatope',
  frame: '擬音導入',
  lines: [
    { target: 5, slots: [{ kind: 'onomatope', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['様態'] } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-テ', tags: ['人'] } }] },
    { target: 5, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'particle', mora: 1, constraint: { particle: 'rentai' } }] },
    { target: 7, slots: [{ kind: 'motif', mora: 3, constraint: { tags: ['!人'] } }, { kind: 'particle', mora: 1, constraint: { particle: 'fukujo', tags: ['主題'] } }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
    { target: 7, slots: [{ kind: 'emotion', mora: 4 }, { kind: 'verb', mora: 3, constraint: { pos: 'verb-終止', tags: ['非人'] } }] },
  ],
};

export const allTemplates: Template[] = [
  templateV0,
  templateTaigendome,
  templateInversion,
  templateKugire,
  templateOnomatope,
];
