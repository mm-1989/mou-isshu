import type { VocabEntry } from '../types';

/**
 * 動詞は活用済みの形を個別エントリで持つ。 pos:
 *   - 'verb-終止': 終止形 (例: 待つ)
 *   - 'verb-テ': テ形 (例: 待って)
 *   - 'verb-連用': 連用形 (例: 待ち)
 */
export const verbsVocab: VocabEntry[] = [
  { display: '待つ', reading: 'まつ', aliases: ['待つ', 'まつ'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '待って', reading: 'まって', aliases: ['待って', 'まって'], tags: ['動作'], kind: 'verb', pos: 'verb-テ' },
  { display: '待ちて', reading: 'まちて', aliases: ['待ちて'], tags: ['動作'], kind: 'verb', pos: 'verb-テ' },
  { display: '笑う', reading: 'わらう', aliases: ['笑う', 'わらう'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '泣く', reading: 'なく', aliases: ['泣く', 'なく'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '泣いて', reading: 'ないて', aliases: ['泣いて', 'ないて'], tags: ['動作'], kind: 'verb', pos: 'verb-テ' },
  { display: '見る', reading: 'みる', aliases: ['見る', 'みる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '見つめる', reading: 'みつめる', aliases: ['見つめる', 'みつめる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '思う', reading: 'おもう', aliases: ['思う', 'おもう'], tags: ['心情'], kind: 'verb', pos: 'verb-終止' },
  { display: '帰る', reading: 'かえる', aliases: ['帰る', 'かえる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '飲む', reading: 'のむ', aliases: ['飲む', 'のむ'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '飲んで', reading: 'のんで', aliases: ['飲んで', 'のんで'], tags: ['動作'], kind: 'verb', pos: 'verb-テ' },
  { display: '歩く', reading: 'あるく', aliases: ['歩く', 'あるく'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: 'すぎる', reading: 'すぎる', aliases: ['すぎる', '過ぎる'], tags: ['補助'], kind: 'verb', pos: 'verb-終止' },
  { display: '走る', reading: 'はしる', aliases: ['走る', 'はしる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '光る', reading: 'ひかる', aliases: ['光る', 'ひかる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '残る', reading: 'のこる', aliases: ['残る', 'のこる'], tags: ['存在'], kind: 'verb', pos: 'verb-終止' },
  { display: '消える', reading: 'きえる', aliases: ['消える', 'きえる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '揺れる', reading: 'ゆれる', aliases: ['揺れる', 'ゆれる'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
  { display: '響く', reading: 'ひびく', aliases: ['響く', 'ひびく'], tags: ['動作'], kind: 'verb', pos: 'verb-終止' },
];
