import type { Tanka } from '../tanka/types';
import { DebugPanel } from './DebugPanel';

const KANSUUJI = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
function toKanji(n: number): string {
  if (n <= 10) return KANSUUJI[n];
  if (n < 20) return `十${KANSUUJI[n - 10]}`;
  return String(n);
}

interface Props {
  tanka: Tanka;
  index?: number;
  showDebug?: boolean;
  animate?: boolean;
  variant?: 'focus' | 'compact';
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const CHAR_DELAY_MS = 55;
const LINE_GAP_MS = 220;

export function TankaCard({
  tanka,
  index,
  showDebug = false,
  animate = false,
  variant = 'focus',
  isFavorite,
  onToggleFavorite,
}: Props) {
  const createdAt = new Date(tanka.createdAt).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const indexLabel = index !== undefined ? `第 ${toKanji(index)} 首` : null;

  // 各句の開始 delay (累積)
  const lineStartDelays: number[] = [];
  let cursor = 0;
  for (const line of tanka.lines) {
    lineStartDelays.push(cursor);
    cursor += [...line.display].length * CHAR_DELAY_MS + LINE_GAP_MS;
  }

  return (
    <article class={`tanka-card variant-${variant} ${animate ? 'animating' : ''}`}>
      <div class="tanka-card-head">
        {indexLabel && <div class="tanka-index">{indexLabel}</div>}
        {onToggleFavorite && (
          <button
            class={`fav-button ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'お気に入りから外す' : 'お気に入りに入れる'}
            title={isFavorite ? 'お気に入りから外す' : 'お気に入りに入れる'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        )}
      </div>

      <ol class="tanka-lines">
        {tanka.lines.map((line, i) => {
          const chars = [...line.display];
          return (
            <li class="tanka-line" key={i}>
              {animate
                ? chars.map((ch, ci) => {
                    const delay = lineStartDelays[i] + ci * CHAR_DELAY_MS;
                    return (
                      <span
                        class="char"
                        key={ci}
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        {ch}
                      </span>
                    );
                  })
                : line.display}
            </li>
          );
        })}
      </ol>

      <div class="tanka-foot">
        <span class="tanka-time">{createdAt}</span>
      </div>

      {showDebug && <DebugPanel tanka={tanka} />}
    </article>
  );
}
