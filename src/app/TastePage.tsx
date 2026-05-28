interface TasteOption {
  label: string;
  tag: string;
}

interface TasteCategory {
  title: string;
  options: TasteOption[];
}

const CATEGORIES: TasteCategory[] = [
  {
    title: '季 節',
    options: [
      { label: '春', tag: '春' },
      { label: '夏', tag: '夏' },
      { label: '秋', tag: '秋' },
      { label: '冬', tag: '冬' },
    ],
  },
  {
    title: '気 分',
    options: [
      { label: '寂しい', tag: '寂' },
      { label: '切ない', tag: '切' },
      { label: 'うれしい', tag: '喜' },
      { label: '悲しい', tag: '悲' },
      { label: '愛しい', tag: '愛' },
      { label: '優しい', tag: '優' },
      { label: '懐かしい', tag: '懐' },
      { label: '不安', tag: '不安' },
      { label: '安らぎ', tag: '安心' },
    ],
  },
  {
    title: '場 所',
    options: [
      { label: '街', tag: '街' },
      { label: '自然', tag: '自然' },
      { label: '夜', tag: '夜' },
      { label: '日常', tag: '日常' },
    ],
  },
];

interface Props {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClear: () => void;
  onCompose: () => void;
  onBack: () => void;
}

export function TastePage({ selectedTags, onToggleTag, onClear, onCompose, onBack }: Props) {
  return (
    <main>
      <header class="page-header">
        <button class="back-button" onClick={onBack} aria-label="TOP に戻る">
          ← 戻 る
        </button>
        <h1 class="page-title">テイスト指定</h1>
        <span class="header-spacer" />
      </header>

      <p class="page-subtitle">
        詠む歌の雰囲気を選んでください。 何も選ばなければ、 おまかせで詠みます。
      </p>

      <div class="taste-categories">
        {CATEGORIES.map((cat) => (
          <section class="taste-category" key={cat.title}>
            <h3 class="taste-category-title">{cat.title}</h3>
            <div class="chips">
              {cat.options.map((opt) => {
                const active = selectedTags.includes(opt.tag);
                return (
                  <button
                    class={`chip ${active ? 'selected' : ''}`}
                    key={opt.tag}
                    onClick={() => onToggleTag(opt.tag)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div class="taste-actions">
        {selectedTags.length > 0 && (
          <button class="link-button" onClick={onClear}>
            選択を全て解除
          </button>
        )}
        <button class="compose-button primary" onClick={onCompose}>
          {selectedTags.length === 0 ? 'お ま か せ で 詠 む' : '詠 む'}
        </button>
      </div>
    </main>
  );
}
