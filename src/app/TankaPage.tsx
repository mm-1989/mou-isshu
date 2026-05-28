import type { Tanka } from '../tanka/types';
import { TankaCard } from './TankaCard';

interface Props {
  tanka: Tanka;
  selectedTags: string[];
  isFavorite: boolean;
  showDebug: boolean;
  onToggleFavorite: () => void;
  onRecompose: () => void;
  onChangeTaste: () => void;
  onBack: () => void;
}

export function TankaPage({
  tanka,
  selectedTags,
  isFavorite,
  showDebug,
  onToggleFavorite,
  onRecompose,
  onChangeTaste,
  onBack,
}: Props) {
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

      <TankaCard
        key={tanka.id}
        tanka={tanka}
        animate
        variant="focus"
        showDebug={showDebug}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />

      <div class="tanka-actions">
        <button class="compose-button primary" onClick={onRecompose}>
          も う 一 句 詠 む
        </button>
        <button class="compose-button secondary" onClick={onChangeTaste}>
          設 定 を 変 え て 詠 む
        </button>
      </div>
    </main>
  );
}
