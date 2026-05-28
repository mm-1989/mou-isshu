import { useEffect, useState } from 'preact/hooks';
import type { Tanka, TankaLine } from '../tanka/types';
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
type PinFlags = [boolean, boolean, boolean, boolean, boolean];
const NO_PINS: PinFlags = [false, false, false, false, false];

export function App() {
  const [screen, setScreen] = useState<Screen>('top');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTanka, setCurrentTanka] = useState<Tanka | null>(null);
  const [pins, setPins] = useState<PinFlags>(NO_PINS);
  const [favorites, setFavorites] = useState<Tanka[]>([]);
  const [showDebug, _setShowDebug] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const persistFavorites = (next: Tanka[]) => {
    setFavorites(next);
    saveFavorites(next);
  };

  const composeFresh = () => {
    try {
      const { tanka } = generate({ selectedTags });
      setCurrentTanka(tanka);
      setPins(NO_PINS); // 新規は固定解除
      setScreen('tanka');
    } catch (err) {
      console.error(err);
    }
  };

  const reroll = () => {
    if (!currentTanka) return;
    if (pins.every((p) => p)) return; // 全部固定なら何もしない
    try {
      const pinnedLines: (TankaLine | null)[] = currentTanka.lines.map((line, i) =>
        pins[i] ? line : null,
      );
      const { tanka } = generate({ selectedTags, pinnedLines });
      setCurrentTanka(tanka);
      // pins はそのまま (固定状態を引き継いで連続再抽選)
    } catch (err) {
      console.error(err);
    }
  };

  const togglePin = (lineIdx: number) => {
    setPins((prev) => {
      const next = [...prev] as PinFlags;
      next[lineIdx] = !prev[lineIdx];
      return next;
    });
  };

  const goCompose = () => {
    setPins(NO_PINS);
    setScreen('taste');
  };
  const changeTaste = () => {
    setPins(NO_PINS);
    setScreen('taste');
  };
  const backToTop = () => {
    setPins(NO_PINS);
    setScreen('top');
  };

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
        onCompose={composeFresh}
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
        pins={pins}
        onTogglePin={togglePin}
        onToggleFavorite={() => toggleFavorite(currentTanka)}
        onRecompose={composeFresh}
        onReroll={reroll}
        onChangeTaste={changeTaste}
        onBack={backToTop}
      />
    );
  }

  return (
    <main>
      <p class="empty-state">画面状態が壊れました。 リロードしてください。</p>
    </main>
  );
}
