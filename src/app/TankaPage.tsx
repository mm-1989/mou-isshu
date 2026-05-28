import type { Tanka } from '../tanka/types';
import { TankaCard } from './TankaCard';

type PinFlags = readonly [boolean, boolean, boolean, boolean, boolean];

interface Props {
  tanka: Tanka;
  selectedTags: string[];
  isFavorite: boolean;
  showDebug: boolean;
  pins: PinFlags;
  onTogglePin: (lineIdx: number) => void;
  onToggleFavorite: () => void;
  onRecompose: () => void;
  onReroll: () => void;
  onChangeTaste: () => void;
  onBack: () => void;
}

export function TankaPage({
  tanka,
  selectedTags,
  isFavorite,
  showDebug,
  pins,
  onTogglePin,
  onToggleFavorite,
  onRecompose,
  onReroll,
  onChangeTaste,
  onBack,
}: Props) {
  const pinnedCount = pins.filter((p) => p).length;
  const rerollCount = 5 - pinnedCount;
  const canReroll = rerollCount > 0;

  const rerollLabel =
    pinnedCount === 0
      ? '詠 み 直 す'
      : canReroll
        ? `${rerollCount} 句 を 詠 み 直 す`
        : '全 句 固 定 中';

  return (
    <main>
      <header class="page-header">
        <button class="back-button" onClick={onBack} aria-label="TOP に戻る">
          ← 戻 る
        </button>
        <h1 class="page-title">一 首</h1>
        <span class="header-spacer" />
      </header>

      {selectedTags.length > 0 && (
        <p class="taste-recap">
          {selectedTags.map((t, i) => (
            <>
              {i > 0 && ' ・ '}
              <span class="taste-recap-tag" key={t}>
                {t}
              </span>
            </>
          ))}
          <span class="taste-recap-suffix"> の趣で</span>
        </p>
      )}

      <p class="pin-hint">
        各句の <span class="pin-hint-icon">○</span> を押して固定すると、 「詠み直す」 で その句以外を引き直せます
      </p>

      <TankaCard
        key={tanka.id}
        tanka={tanka}
        animate
        variant="focus"
        showDebug={showDebug}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        pins={pins}
        onTogglePin={onTogglePin}
      />

      <div class="tanka-actions">
        <button
          class="compose-button primary"
          onClick={onReroll}
          disabled={!canReroll}
          title={
            canReroll
              ? pinnedCount > 0
                ? `${pinnedCount} 句固定中。 残り ${rerollCount} 句を引き直す`
                : '全句引き直し'
              : '全句固定中。 解除してから詠み直してください'
          }
        >
          {rerollLabel}
        </button>
        <button class="compose-button secondary" onClick={onRecompose}>
          も う 一 句 詠 む
        </button>
        <button class="compose-button secondary" onClick={onChangeTaste}>
          設 定 を 変 え て 詠 む
        </button>
      </div>
    </main>
  );
}
