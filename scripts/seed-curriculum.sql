-- シードデータ: カリキュラム管理機能 (MVP)
-- フロントエンドカリキュラム1件 + 3ステージ + 参考記事3件

-- カリキュラム
INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'frontend',
  'フロントエンドカリキュラム',
  'HTML、CSS、JavaScriptの基礎を学ぶカリキュラムです。',
  1,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

-- ステージ（カリキュラムIDを参照）
WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'frontend'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  ((SELECT id FROM curriculum), 1, 'HTML基礎', 'HTMLの基本構造とよく使うタグを学びます')
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- ステージ2・3を削除
WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'frontend'
)
DELETE FROM public.stages
WHERE curriculum_id = (SELECT id FROM curriculum)
  AND stage_number IN (2, 3);

-- 参考記事
INSERT INTO public.reference_articles (slug, title, icon, content, sort_order)
VALUES
  (
    'git-commands',
    'よく使うGitコマンド',
    '🌿',
    '# よく使うGitコマンド

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
```',
    1
  ),
  (
    'pull-request',
    'プルリクの作成方法',
    '🔀',
    '# プルリクの作成方法

## 手順

1. 作業ブランチを作成する
2. 変更をコミットしてプッシュする
3. GitHub でプルリクエストを作成する
4. レビュアーを指定する
5. レビューを受けて修正する
6. マージする

## 良いプルリクのポイント

- **小さく保つ**: 1つのPRで1つの機能
- **説明を書く**: 何を変更したか、なぜ変更したか
- **スクリーンショット**: UI変更がある場合は添付する
- **セルフレビュー**: 提出前に自分でコードを確認する

## テンプレート例

```markdown
## 概要
この PR は〇〇機能を追加します。

## 変更内容
- ファイルAを追加
- ファイルBを修正

## テスト方法
1. ローカルで `npm run dev` を実行
2. /path にアクセス
3. 〇〇を確認
```',
    2
  ),
  (
    'vscode-shortcuts',
    'VSCodeショートカット',
    '⚡',
    '# VSCodeショートカット

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
| `Cmd + Shift + L` | 同じ単語を全選択 |',
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
