import { useEffect, useState } from 'preact/hooks';
import type { Tanka } from '../tanka/types';
import { generate } from '../tanka/generator';
import {
  isFavorited,
  loadFavorites,
  saveFavorites,
  toggleFavorite as toggleFavoriteOp,
} from '../ui/favorites';
import { TopPage } from './TopPage';
import { TastePage } from './TastePage';
import { TankaPage } from './TankaPage';

type Screen = 'top' | 'taste' | 'tanka';

export function App() {
  const [screen, setScreen] = useState<Screen>('top');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTanka, setCurrentTanka] = useState<Tanka | null>(null);
  const [favorites, setFavorites] = useState<Tanka[]>([]);
  const [showDebug, _setShowDebug] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const persistFavorites = (next: Tanka[]) => {
    setFavorites(next);
    saveFavorites(next);
  };

  const goCompose = () => setScreen('taste');

  const composeTanka = () => {
    try {
      const { tanka } = generate({ selectedTags });
      setCurrentTanka(tanka);
      setScreen('tanka');
    } catch (err) {
      console.error(err);
    }
  };

  const recompose = () => {
    // 「もう一句詠む」: 同じテイストで完全新規 (ガチャ的)
    composeTanka();
  };

  const changeTaste = () => setScreen('taste');
  const backToTop = () => setScreen('top');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearTags = () => setSelectedTags([]);

  const toggleFavorite = (tanka: Tanka) => {
    persistFavorites(toggleFavoriteOp(favorites, tanka));
  };

  if (screen === 'top') {
    return (
      <TopPage
        favorites={favorites}
        onCompose={goCompose}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  if (screen === 'taste') {
    return (
      <TastePage
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onClear={clearTags}
        onCompose={composeTanka}
        onBack={backToTop}
      />
    );
  }

  if (currentTanka) {
    return (
      <TankaPage
        tanka={currentTanka}
        selectedTags={selectedTags}
        isFavorite={isFavorited(favorites, currentTanka.id)}
        showDebug={showDebug}
        onToggleFavorite={() => toggleFavorite(currentTanka)}
        onRecompose={recompose}
        onChangeTaste={changeTaste}
        onBack={backToTop}
      />
    );
  }

  // fallback: 想定外
  return (
    <main>
      <p class="empty-state">画面状態が壊れました。 リロードしてください。</p>
    </main>
  );
}
