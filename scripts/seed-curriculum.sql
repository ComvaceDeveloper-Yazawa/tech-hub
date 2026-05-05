-- シードデータ: カリキュラム管理機能
-- 1. サンプルフロントエンド (slug: frontend) — 既存コンテンツのサンプル用に保持
-- 2. 第0章: 導入フェーズ (slug: cafe-chapter-0) — 全15ステージ
-- 3. 第1章: ホーム画面を作ろう (slug: cafe-chapter-1) — 全14ステージ

-- =============================================================================
-- カリキュラム
-- =============================================================================

INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'frontend',
  'サンプルフロントエンド',
  '動作確認用のサンプルカリキュラムです。',
  1,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'cafe-chapter-0',
  '第0章: 導入フェーズ',
  '開発環境の整備と、HTML/CSS の「書いたら動く」体験。GitHub で最初の Pull Request を出すところまで。',
  2,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'cafe-chapter-1',
  '第1章: ホーム画面を作ろう',
  'コーヒーショップECサイトのホーム画面（PC/SP対応）を完成させる。Webページ制作の基本スキルを一通り使えるようになる。',
  3,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- =============================================================================
-- サンプルフロントエンド: ステージ
-- =============================================================================

WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'frontend'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  ((SELECT id FROM curriculum), 1, 'HTML基礎', 'HTMLの基本構造とよく使うタグを学びます。')
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- =============================================================================
-- 第0章: 導入フェーズ — 15 ステージ
-- =============================================================================

WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'cafe-chapter-0'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  (
    (SELECT id FROM curriculum),
    1,
    'VS Code のセットアップ',
    $$## 学ぶこと
- VS Code のインストール (Windows / Mac)
- 日本語化

## 実習
- インストール後、VS Code を起動して日本語表示になっていることを確認する$$
  ),
  (
    (SELECT id FROM curriculum),
    2,
    'VS Code の使い方',
    $$## 学ぶこと
- フォルダを開く / 新規ファイル / 保存
- 拡張機能のインストール方法

## 実習
- フォルダを開き、ファイルを作って保存してみる$$
  ),
  (
    (SELECT id FROM curriculum),
    3,
    'Prettier を設定しよう',
    $$## 学ぶこと
- フォーマッターとは何か
- Prettier 拡張機能
- 保存時の自動整形

## 実習
- `.prettierrc` をコピペで配置 (設定内容をコメント付きで確認)
- 実際にコードが整形される体験

## 感動ポイント
「勝手にコードが綺麗になった」$$
  ),
  (
    (SELECT id FROM curriculum),
    4,
    'ターミナルに慣れよう',
    $$## 学ぶこと
- ターミナル (Mac) / コマンドプロンプト (Windows)
- 基本コマンド: `cd` / `ls` / `pwd` / `mkdir`

## 実習
- フォルダ移動・作成など、基本操作を試す$$
  ),
  (
    (SELECT id FROM curriculum),
    5,
    'はじめての HTML',
    $$## 学ぶこと
- HTML とは何か
- `.html` ファイルはブラウザで開ける

## 実習
- `hello.html` を作り `<h1>こんにちは</h1>` を表示する

## 感動ポイント
「自分の書いた文字がブラウザに出た」$$
  ),
  (
    (SELECT id FROM curriculum),
    6,
    '色んなタグを試そう',
    $$## 学ぶこと
- `h1`〜`h6` / `p` / `br` / `strong` / `em`
- `ul` / `ol` / `li` / `a` / `img`
- `div` / `span`

## 実習
- 自己紹介ページを作ってみる$$
  ),
  (
    (SELECT id FROM curriculum),
    7,
    'HTML の基本ルール',
    $$## 学ぶこと
- `<!DOCTYPE html>`
- `html` / `head` / `body` の役割
- `<meta charset="UTF-8">` / `lang="ja"`
- `<title>`
- `<meta name="viewport">`
- タグの入れ子ルール
- HTML コメント `<!-- -->`

## 実習
- 前回作った自己紹介ページを「ちゃんとした形」に整える$$
  ),
  (
    (SELECT id FROM curriculum),
    8,
    'Chrome の開発者ツールを使ってみよう',
    $$## 学ぶこと
- F12 で開発者ツールを開く
- Elements パネル / Console パネル
- デバイスモード

## 実習
- 自分の HTML を開発者ツールで調査してみる$$
  ),
  (
    (SELECT id FROM curriculum),
    9,
    'CSS で装飾してみよう',
    $$## 学ぶこと
- CSS とは / `style` 属性 / `<style>` タグ / 外部 CSS ファイル
- 要素セレクタ
- `color` / `background-color` / `font-size` / `font-weight` / `text-align` / `line-height` / `width` / `height` などの基本プロパティ

## 実習
- 自己紹介ページに色とフォントサイズをつける

## 感動ポイント
「文字が青くなった」$$
  ),
  (
    (SELECT id FROM curriculum),
    10,
    'クラスセレクタを使おう',
    $$## 学ぶこと
- `class` 属性
- クラスセレクタ
- クラス名のつけ方 (kebab-case)

## 実習
- 複数の要素に別々のスタイルをクラスで当て分ける$$
  ),
  (
    (SELECT id FROM curriculum),
    11,
    'リセット CSS を入れよう',
    $$## 学ぶこと
- ブラウザのデフォルトスタイル
- リセット CSS とは
- 教育用の簡易リセット CSS を自分で書く

## 実習
- リセット CSS を書いて適用し、素の状態を確認する$$
  ),
  (
    (SELECT id FROM curriculum),
    12,
    'メディアクエリって何？',
    $$## 学ぶこと
- PC 表示とスマホ表示の違い
- `@media` の基本
- DevTools のデバイスモードを再訪

## 実習
- 「画面幅が狭いと文字色が変わる」ミニ実験$$
  ),
  (
    (SELECT id FROM curriculum),
    13,
    'GitHub と Git を準備しよう',
    $$## 学ぶこと
- GitHub とは / Git とは
- GitHub アカウント作成
- Git のインストール (Windows / Mac)
- Git Credential Manager
- 初期設定 (`git config --global user.name` / `user.email`)

## 実習
- アカウント作成 + Git のインストール確認$$
  ),
  (
    (SELECT id FROM curriculum),
    14,
    '学習用リポジトリを準備しよう',
    $$## 学ぶこと
- テンプレートリポジトリ
- `clone`

## 実習
- テンプレートから自分のリポジトリを作成
- 手元に `clone` する

## 補足
- リポジトリ構成の詳細は README を参照$$
  ),
  (
    (SELECT id FROM curriculum),
    15,
    '最初の Pull Request',
    $$## 学ぶこと
- `branch` / `add` / `commit` / `push` / PR の超基本

## 実習
- 自己紹介ページを branch 切って commit → push → PR 作成

## 卒業 PR
- 第0章 修了 PR$$
  )
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- =============================================================================
-- 第1章: ホーム画面を作ろう — 14 ステージ
-- =============================================================================

WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'cafe-chapter-1'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  (
    (SELECT id FROM curriculum),
    1,
    'デザインを読み解こう',
    $$## 学ぶこと
- Figma の基本操作
- 画像のエクスポート方法 (SVG / PNG)
- 色・フォント・サイズの読み取り方

## 実習
- ホーム画面のデザインを観察
- 必要な画像を `assets/images/` にエクスポートする

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    2,
    'フォントを読み込んで使おう',
    $$## 学ぶこと
- `@import` でのフォント読み込み
- `font-family` / `font-weight` / `font-size`
- フォント系プロパティの基本

## 実習
- 指定フォントを読み込んでテキストに適用する

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    3,
    '画像を表示しよう',
    $$## 学ぶこと
- `<img>` タグ
- `object-fit` / `object-position`
- `background-image` / `background-size` / `background-position`
- `<img>` と `background-image` の使い分け

## 実習
- `picsum.photos` の画像で色々試す

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    4,
    'ボックスモデルを理解しよう',
    $$## 学ぶこと
- `margin` / `padding` / `border`
- `box-sizing: border-box`
- `display: block / inline / inline-block`

## 実習
- 同じ見た目を違うボックス設定で作り比べる

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    5,
    'コンテナで中央寄せしよう',
    $$## 学ぶこと
- `max-width` + `margin: 0 auto`
- `width` と `max-width` の使い分け

## 実習
- コンテナを作って中に要素を配置する

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    6,
    'Flexbox で横並びを作ろう',
    $$## 学ぶこと
- `display: flex`
- `justify-content` / `align-items` / `gap`
- `flex-direction`
- Flex の使いどころ (1 次元レイアウト)

## 実習
- 「左に見出し・右に要素」のバー状レイアウトを作る

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    7,
    'Grid で格子レイアウトを作ろう',
    $$## 学ぶこと
- `display: grid`
- `grid-template-columns` / `gap`
- `repeat()` / `1fr`
- Grid の使いどころ (2 次元レイアウト)
- Flex と Grid の使い分け指針

## 実習
- 4 列のカードグリッドを作る

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    8,
    'ホバーで動きをつけよう',
    $$## 学ぶこと
- `:hover`
- 色の変化

## 実習
- ボタンにホバーで色変化をつける

## 感動ポイント
「動いた」

## 補足
- トランジション等の高度な話はまだ扱わない

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    9,
    'フォーム要素をカスタマイズしよう',
    $$## 学ぶこと
- `<input type="text">` / `<button>` / `<select>` + `<option>`
- ブラウザデフォルトスタイルの問題点
- `appearance: none` でリセット
- padding / border / border-radius でのカスタマイズ
- `<button>` へのホバー適用
- `<select>` の矢印を SVG で差し替え (`background-image`)

## 実習
- 仮のフォーム (名前入力・カテゴリ選択・送信ボタン) を一からデザインする

## 補足
- `:focus` は扱わない

## Phase
Phase 1: スキル学習$$
  ),
  (
    (SELECT id FROM curriculum),
    10,
    'MainView を作ろう (PC 版)',
    $$## 実習
- 背景画像 + 中央に白い見出しボックスを重ねる

## 使う技術
- `background-image`
- 中央配置 (flex / position の両方を紹介)
- `border-radius` (ここで初登場)

## Phase
Phase 2: 実装$$
  ),
  (
    (SELECT id FROM curriculum),
    11,
    'ButtonBar を作ろう (PC 版)',
    $$## 実習
- 黒い帯に「商品一覧」見出しと並び替え `<select>` を配置する

## 使う技術
- `display: flex` + `justify-content: space-between`
- レッスン 9 で作った `<select>` カスタマイズの再利用

## Phase
Phase 2: 実装$$
  ),
  (
    (SELECT id FROM curriculum),
    12,
    'ProductLists を作ろう (PC 版)',
    $$## 実習
- 4 列 × 2 行の商品カードグリッド

## 使う技術
- `display: grid` + `repeat(4, 1fr)`
- カード内のレイアウト (画像 + 商品名 + 価格)
- `object-fit: cover` で画像を正方形に揃える

## レビュー依頼
- 第1章 Step1 PR

## Phase
Phase 2: 実装$$
  ),
  (
    (SELECT id FROM curriculum),
    13,
    'CTA ブロック + フッタープレースホルダーを作ろう (PC 版)',
    $$## 実習
- ダークグレー背景の CTA ブロック
- 白 pill 形の「カート一覧を見る」ボタン (ホバー付き)
- フッターのプレースホルダー (オレンジ背景にテキストのみ)

## 使う技術
- 中央寄せ
- `border-radius` で pill 形状
- ホバー

## Phase
Phase 2: 実装$$
  ),
  (
    (SELECT id FROM curriculum),
    14,
    'ホーム画面 SP 版を作ろう',
    $$## 学ぶこと
- メディアクエリの実戦活用
- ブレイクポイントの決め方
- Grid を 4 列 → 1 列に変更
- Flex の並び方向を変える

## 実習
- ホーム画面全体を SP 対応させる

## レビュー依頼
- 第1章 Step2 PR

## Phase
Phase 2: 実装$$
  )
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- =============================================================================
-- 参考記事 (既存のまま)
-- =============================================================================

INSERT INTO public.reference_articles (slug, title, icon, content, sort_order)
VALUES
  (
    'git-commands',
    'よく使うGitコマンド',
    '🌿',
    $$# よく使うGitコマンド

## 基本操作

```bash
git init          # リポジトリの初期化
git clone <url>   # リポジトリのクローン
git status        # 状態の確認
git add .         # 全ファイルをステージング
git commit -m ""  # コミット
```

## ブランチ操作

```bash
git branch            # ブランチ一覧
git branch <name>     # ブランチ作成
git checkout <name>   # ブランチ切り替え
git checkout -b <name> # 作成と切り替えを同時に
git merge <name>      # ブランチのマージ
```

## リモート操作

```bash
git push origin <branch>  # プッシュ
git pull origin <branch>  # プル
git fetch                 # フェッチ
```$$,
    1
  ),
  (
    'pull-request',
    'プルリクの作成方法',
    '🔀',
    $$# プルリクの作成方法

## 手順

1. 作業ブランチを作成する
2. 変更をコミットしてプッシュする
3. GitHub でプルリクエストを作成する
4. レビュアーを指定する
5. レビューを受けて修正する
6. マージする

## 良いプルリクのポイント

- 小さく保つ: 1 つの PR で 1 つの機能
- 説明を書く: 何を変更したか、なぜ変更したか
- スクリーンショット: UI 変更がある場合は添付する
- セルフレビュー: 提出前に自分でコードを確認する

## テンプレート例

```markdown
## 概要
この PR は〇〇機能を追加します。

## 変更内容
- ファイル A を追加
- ファイル B を修正

## テスト方法
1. ローカルで `npm run dev` を実行
2. /path にアクセス
3. 〇〇を確認
```$$,
    2
  ),
  (
    'vscode-shortcuts',
    'VSCodeショートカット',
    '⚡',
    $$# VSCodeショートカット

## 基本操作

| ショートカット | 動作 |
|---|---|
| `Cmd + P` | ファイル検索 |
| `Cmd + Shift + P` | コマンドパレット |
| `Cmd + B` | サイドバー表示切替 |
| `Cmd + J` | ターミナル表示切替 |

## 編集

| ショートカット | 動作 |
|---|---|
| `Cmd + D` | 同じ単語を選択 |
| `Cmd + Shift + K` | 行の削除 |
| `Alt + ↑/↓` | 行の移動 |
| `Cmd + /` | コメント切替 |
| `Cmd + Shift + F` | 全体検索 |

## マルチカーソル

| ショートカット | 動作 |
|---|---|
| `Alt + Click` | カーソル追加 |
| `Cmd + Alt + ↑/↓` | 上下にカーソル追加 |
| `Cmd + Shift + L` | 同じ単語を全選択 |$$,
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
