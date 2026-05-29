import type { VocabEntry } from '../types';

/**
 * 助詞。 pos は Slot.constraint.particle と同じカテゴリを持つ。
 *   - は (主題): display "は", reading "わ"
 *   - へ (方向): display "へ", reading "え"
 *   - を (目的格): display "を", reading "お"
 */
export const particlesVocab: VocabEntry[] = [
  { display: 'を', reading: 'お', aliases: ['を'], tags: ['助詞', '目的格', '格助詞'], kind: 'particle', pos: 'kaku' },
  { display: 'に', reading: 'に', aliases: ['に'], tags: ['助詞', '格', '格助詞'], kind: 'particle', pos: 'kaku' },
  { display: 'へ', reading: 'え', aliases: ['へ'], tags: ['助詞', '方向', '格助詞'], kind: 'particle', pos: 'kaku' },
  { display: 'が', reading: 'が', aliases: ['が'], tags: ['助詞', '主格', '格助詞'], kind: 'particle', pos: 'kaku' },
  { display: 'の', reading: 'の', aliases: ['の'], tags: ['助詞', '連体'], kind: 'particle', pos: 'rentai' },
  { display: 'は', reading: 'わ', aliases: ['は'], tags: ['助詞', '主題', '副助詞'], kind: 'particle', pos: 'fukujo' },
  { display: 'も', reading: 'も', aliases: ['も'], tags: ['助詞', '並列', '副助詞'], kind: 'particle', pos: 'fukujo' },
  { display: 'と', reading: 'と', aliases: ['と'], tags: ['助詞', '並列', '様態', '副助詞'], kind: 'particle', pos: 'fukujo' },
];
