import { useEffect, useRef, useState } from 'preact/hooks';
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

// 連続生成で同じ語が繰り返し出るのを抑えるため、 直近の出語を保持する窓のサイズ。
// 1 首あたり core 語は最大 8 前後なので ~3 首分。
const RECENT_CAP = 24;

/** 助詞を除いた core 語の display を集める。 */
function coreDisplays(tanka: Tanka): string[] {
  const out: string[] = [];
  for (const line of tanka.lines) {
    for (const e of line.entries) {
      if (e.kind !== 'particle') out.push(e.display);
    }
  }
  return out;
}

export function App() {
  const [screen, setScreen] = useState<Screen>('top');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentTanka, setCurrentTanka] = useState<Tanka | null>(null);
  const [pins, setPins] = useState<PinFlags>(NO_PINS);
  const [favorites, setFavorites] = useState<Tanka[]>([]);
  const [showDebug, _setShowDebug] = useState(false);
  // 直近の出語 (display) の窓。 連続生成での反復回避に使う。
  const recentRef = useRef<string[]>([]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const persistFavorites = (next: Tanka[]) => {
    setFavorites(next);
    saveFavorites(next);
  };

  const rememberRecent = (tanka: Tanka) => {
    const merged = [...recentRef.current, ...coreDisplays(tanka)];
    recentRef.current = merged.slice(-RECENT_CAP);
  };

  const composeFresh = () => {
    try {
      const { tanka } = generate({ selectedTags, recentDisplays: recentRef.current });
      rememberRecent(tanka);
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
      const { tanka } = generate({ selectedTags, pinnedLines, recentDisplays: recentRef.current });
      rememberRecent(tanka);
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
    recentRef.current = [];
    setScreen('taste');
  };
  const changeTaste = () => {
    setPins(NO_PINS);
    recentRef.current = [];
    setScreen('taste');
  };
  const backToTop = () => {
    setPins(NO_PINS);
    recentRef.current = [];
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
