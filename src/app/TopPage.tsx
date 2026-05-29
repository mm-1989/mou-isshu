import type { Tanka } from '../tanka/types';
import { TankaCard } from './TankaCard';
import { BrushDivider } from './BrushDivider';

interface Props {
  favorites: Tanka[];
  onCompose: () => void;
  onToggleFavorite: (tanka: Tanka) => void;
}

export function TopPage({ favorites, onCompose, onToggleFavorite }: Props) {
  const count = favorites.length;
  return (
    <main>
      <header class="logo-area">
        <div class="logo-canvas">
          <div class="logo-sun-bg" />
          <div class="logo-text">
            <span class="calli logo-mou">も う</span>
            <span class="calli logo-ichi">一</span>
            <span class="calli logo-shu">首</span>
          </div>
          <span class="logo-seal">詠</span>
        </div>
        <p class="subtitle">な ん ち ゃ っ て A I 短 歌 ジ ェ ネ レ ー タ ー</p>
      </header>

      <BrushDivider />

      <div class="control-row">
        <button class="compose-button primary" onClick={onCompose}>
          詠 む
        </button>
      </div>

      <section class="collection-section">
        <h2 class="section-title">
          歌 集
          {count > 0 && <span class="section-count">— {count} 首</span>}
        </h2>

        {count === 0 ? (
          <p class="empty-state">
            まだ歌は記されていません。<br />
            「詠 む」 を押して、 ひとつ詠んでみてください。
          </p>
        ) : (
          <div class="tanka-list">
            {favorites.map((tanka, i) => (
              <TankaCard
                key={tanka.id}
                tanka={tanka}
                index={count - i}
                variant="compact"
                isFavorite
                onToggleFavorite={() => onToggleFavorite(tanka)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
