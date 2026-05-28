import type { VocabEntry } from '../types';

/**
 * 助詞。 display と reading を分離する。
 *   - は (主題): display "は", reading "わ"
 *   - へ (方向): display "へ", reading "え"
 *   - を (目的格): display "を", reading "お"
 */
export const particlesVocab: VocabEntry[] = [
  { display: 'を', reading: 'お', aliases: ['を'], tags: ['助詞', '目的格'], kind: 'particle' },
  { display: 'に', reading: 'に', aliases: ['に'], tags: ['助詞', '格'], kind: 'particle' },
  { display: 'は', reading: 'わ', aliases: ['は'], tags: ['助詞', '主題'], kind: 'particle' },
  { display: 'の', reading: 'の', aliases: ['の'], tags: ['助詞', '連体'], kind: 'particle' },
  { display: 'へ', reading: 'え', aliases: ['へ'], tags: ['助詞', '方向'], kind: 'particle' },
  { display: 'が', reading: 'が', aliases: ['が'], tags: ['助詞', '主格'], kind: 'particle' },
  { display: 'と', reading: 'と', aliases: ['と'], tags: ['助詞', '並列'], kind: 'particle' },
  { display: 'も', reading: 'も', aliases: ['も'], tags: ['助詞', '並列'], kind: 'particle' },
];
