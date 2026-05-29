import type { VocabEntry } from '../types';

/**
 * オノマトペ (擬音語・擬態語)。
 * すべて reading 4 モーラ。 後続の「と」(連用) を介して動詞・情景にかかる前提で、
 * 初句「○○○○と」(= 4+1=5) に置いて使う。
 * tags は taste 連動のため季節/気分/場所カテゴリに寄せてある。
 */
export const onomatopeVocab: VocabEntry[] = [
  { display: 'しんしん', reading: 'しんしん', aliases: ['しんしん'], tags: ['擬音', '冬', '夜', '静けさ', '雪'], kind: 'onomatope' },
  { display: 'きらきら', reading: 'きらきら', aliases: ['きらきら'], tags: ['擬音', '喜', '光', '高揚'], kind: 'onomatope' },
  { display: 'ざあざあ', reading: 'ざあざあ', aliases: ['ざあざあ'], tags: ['擬音', '夏', '街', '雨', '音'], kind: 'onomatope' },
  { display: 'ぽつぽつ', reading: 'ぽつぽつ', aliases: ['ぽつぽつ'], tags: ['擬音', '寂', '雨', '静けさ'], kind: 'onomatope' },
  { display: 'ゆらゆら', reading: 'ゆらゆら', aliases: ['ゆらゆら'], tags: ['擬音', '夜', '揺れ', '静けさ'], kind: 'onomatope' },
  { display: 'ふわふわ', reading: 'ふわふわ', aliases: ['ふわふわ'], tags: ['擬音', '優', '温かさ', '浮遊'], kind: 'onomatope' },
  { display: 'さらさら', reading: 'さらさら', aliases: ['さらさら'], tags: ['擬音', '自然', '風', '水'], kind: 'onomatope' },
  { display: 'ひらひら', reading: 'ひらひら', aliases: ['ひらひら'], tags: ['擬音', '春', '花', '舞い'], kind: 'onomatope' },
  { display: 'ちらちら', reading: 'ちらちら', aliases: ['ちらちら'], tags: ['擬音', '冬', '雪', '光'], kind: 'onomatope' },
  { display: 'しとしと', reading: 'しとしと', aliases: ['しとしと'], tags: ['擬音', '寂', '雨', '静けさ'], kind: 'onomatope' },
  { display: 'ことこと', reading: 'ことこと', aliases: ['ことこと'], tags: ['擬音', '日常', '温かさ', '台所'], kind: 'onomatope' },
  { display: 'どきどき', reading: 'どきどき', aliases: ['どきどき'], tags: ['擬音', '愛', '恋', '高揚', '胸'], kind: 'onomatope' },
  { display: 'そわそわ', reading: 'そわそわ', aliases: ['そわそわ'], tags: ['擬音', '不安', '恋', '揺れ'], kind: 'onomatope' },
  { display: 'ぐるぐる', reading: 'ぐるぐる', aliases: ['ぐるぐる'], tags: ['擬音', '不安', '夜', '迷い'], kind: 'onomatope' },
  { display: 'こんこん', reading: 'こんこん', aliases: ['こんこん'], tags: ['擬音', '冬', '雪', '夜'], kind: 'onomatope' },
  { display: 'うとうと', reading: 'うとうと', aliases: ['うとうと'], tags: ['擬音', '夜', '日常', '眠り'], kind: 'onomatope' },
  { display: 'ぱらぱら', reading: 'ぱらぱら', aliases: ['ぱらぱら'], tags: ['擬音', '街', '雨', '紙'], kind: 'onomatope' },
  { display: 'とぼとぼ', reading: 'とぼとぼ', aliases: ['とぼとぼ'], tags: ['擬音', '寂', '夜', '街', '移動'], kind: 'onomatope' },
];
