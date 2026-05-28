# もう一首

なんちゃって AI 短歌ジェネレーター。 ブラウザだけで動く現代口語短歌の生成 web アプリ。

公開: https://mm-1989.github.io/mou-isshu/

## 体験コンセプト

- **TOP**: お気に入りに保存した「歌集」 を眺めて、 「詠 む」 で始める
- **テイスト指定**: 季節 / 気分 / 場所 のチップから雰囲気を選ぶ (おまかせ可)
- **短歌表示**: 1 文字ずつ筆で書かれるように現れる
  - ♥ で歌集に保存
  - 「もう一句詠む」で同じテイストでガチャをもう一回
  - 「設定を変えて詠む」 でテイスト変更
  - 「戻る」 で TOP

## 仕組み (なんちゃって AI)

LLM API は呼ばず、 ブラウザ完結。 テンプレ + 語彙 DB から 5-7-5-7-7 を組み立てる。

- `src/tanka/templates.ts` — 文法骨組み (5 行 × Slot)
- `src/tanka/vocab/` — 季語 / 感情 / モチーフ / 動詞 / 助詞 (各エントリに `reading` と `tags`)
- `src/tanka/mora.ts` — モーラカウント (拗音/長音/促音/助詞 reading 分離)
- `src/tanka/generator.ts` — テンプレ × 語彙 × タグ重み付け で抽選

## 開発

```sh
npm install
npm run dev       # http://localhost:5181/mou-isshu/
npm test          # vitest (mora 11 + generator 3 = 14 ケース)
npm run typecheck # tsc --noEmit
npm run build     # dist/ を出力
```

## スタック

- Vite 6 (Vite 8 は WSL でハング既知のため 6 固定)
- Preact + TypeScript
- vitest
- Noto Serif JP (Google Fonts)
- 外部 JS なし / バックエンドなし / API キーなし
