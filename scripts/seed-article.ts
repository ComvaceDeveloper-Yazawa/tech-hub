import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

const prisma = new PrismaClient();

const TENANT_ID = '00000000000000000000000000';
const AUTHOR_ID = '00000000000000000000000001';

const CB3 = '```';

const content = `# 達人のDB設計 — 未経験者が知っておくべき実務級データベース設計

## はじめに

シリーズのラストを飾るのは、**データベース設計**。エンジニアとしてのレベルを一段引き上げる重要領域です。

- **テーブルって、どう分ければいいの？**
- 正規化って聞くけど難しそう...
- **インデックスはどこに付ければいい？**
- 命名規則やデータ型選びに正解はあるの？
- 履歴を残すデータはどう設計する？

多くの入門書は「SELECT文の書き方」で終わってしまいますが、**現場で本当に求められるのは設計力**です。同じ機能でも、設計が良ければ10年保守でき、悪ければ半年で破綻します。

本記事では、**プログラミング完全未経験の人にも伝わる言葉**で、実務で通用する DB 設計の肝を、具体例満載で解説します。

> [!NOTE]
> 本記事はシリーズの集大成。前3本「データベースってなに？」「SQLって？」「ORMってなに？」の知識を前提にしています。まだの方は先にそちらを。

## TL;DR

- **設計はアプリの骨格**。後から直すのは10倍大変
- **正規化**で冗長を排除、**非正規化**で性能を上げるバランスが鍵
- **主キー / 外部キー / ユニーク制約** を適切に使う
- **インデックス**は「検索に使う列」に付ける。過剰は逆効果
- **命名規則**・**データ型選び**は一貫性が最重要
- **履歴・論理削除・監査ログ**の設計が実務で問われる

## 目次

- [DB設計の心構え](#db設計の心構え)
- [正規化: テーブル分割の理論](#正規化-テーブル分割の理論)
- [非正規化: 性能のための意図的な崩し](#非正規化-性能のための意図的な崩し)
- [主キー戦略: INT vs UUID vs ULID](#主キー戦略-int-vs-uuid-vs-ulid)
- [リレーションの設計](#リレーションの設計)
- [インデックス設計](#インデックス設計)
- [命名規則とデータ型選び](#命名規則とデータ型選び)
- [履歴・論理削除・監査ログ](#履歴論理削除監査ログ)
- [マルチテナント設計](#マルチテナント設計)
- [設計レビューのチェックリスト](#設計レビューのチェックリスト)

## DB設計の心構え

### 設計は未来への手紙

DB設計は、**未来の自分とチームへの手紙**です。

- 良い設計: 1年後の自分が感謝する
- 悪い設計: 3ヶ月後の自分が号泣する

**コードはいくらでも書き直せる**が、**本番DBのスキーマ変更は痛みを伴う**。データが入った後の変更はリスクが大きいからです。

### 3つの原則

実務で通用する設計は、以下3つを満たしています。

1. **正しさ**: データ矛盾が起きない
2. **速さ**: よく使うクエリが速い
3. **変化への耐性**: 要件変更で壊れない

「速さ」だけを追うと「正しさ」を損ね、「変化への耐性」を無視すると将来を縛ります。**このバランスを取れる人が達人**です。

### 設計の手順

${CB3}mermaid
graph TD
    A[業務を理解する<br/>ヒアリング] --> B[エンティティを抽出<br/>名詞を拾う]
    B --> C[関係を整理<br/>1対多 多対多]
    C --> D[正規化<br/>冗長排除]
    D --> E[非正規化検討<br/>性能のため戻す]
    E --> F[インデックス設計<br/>頻出クエリから]
    F --> G[レビュー・運用]
${CB3}

**いきなりテーブル図を書かない**。まずは業務理解から。

## 正規化: テーブル分割の理論

### 正規化とは

**データの冗長（無駄な重複）を排除し、整合性を保つためのテーブル分割ルール**。

### 正規化前の悪い例

${CB3}
| 注文ID | 顧客名 | 顧客電話 | 商品名 | 単価 | 数量 |
|--------|--------|----------|--------|------|------|
| 1      | Taro   | 090-xxx  | ペン   | 100  | 5    |
| 2      | Taro   | 090-xxx  | ノート | 300  | 2    |
| 3      | Hanako | 080-yyy  | ペン   | 100  | 3    |
${CB3}

問題点：

- **Taroの電話番号が複数行に重複**している（冗長）
- 電話番号を変えたい時、**全行を更新**する必要（更新異常）
- 注文がないと顧客情報が登録できない（**挿入異常**）
- 最後の注文を消すと顧客情報も消える（**削除異常**）

### 正規化後

${CB3}
customers テーブル
| id | name   | phone    |
|----|--------|----------|
| 1  | Taro   | 090-xxx  |
| 2  | Hanako | 080-yyy  |

products テーブル
| id | name   | price |
|----|--------|-------|
| 1  | ペン   | 100   |
| 2  | ノート | 300   |

orders テーブル
| id | customer_id | product_id | quantity |
|----|-------------|------------|----------|
| 1  | 1           | 1          | 5        |
| 2  | 1           | 2          | 2        |
| 3  | 2           | 1          | 3        |
${CB3}

**データが1箇所にしか存在しない**ため、矛盾が起きません。これが正規化の威力。

### 第1〜第3正規形（実務はここまでで十分）

#### 第1正規形（1NF）

**1セルに1つの値**。配列やカンマ区切りを入れない。

❌ NG:

${CB3}
| id | name  | tags                |
|----|-------|---------------------|
| 1  | 記事A | "Node.js,SQL,TS"    |
${CB3}

✅ OK: tags テーブルに分ける

${CB3}
article_tags テーブル
| article_id | tag   |
|------------|-------|
| 1          | Node.js |
| 1          | SQL     |
| 1          | TS      |
${CB3}

#### 第2正規形（2NF）

**主キーの一部だけで決まる列を分離**。

複合主キーを使う時に問題になるので、単一主キー（id）なら自動的に満たすことが多いです。

#### 第3正規形（3NF）

**主キー以外の列が、別の非主キー列で決まるなら分離**。

❌ NG:

${CB3}
users テーブル
| id | name | department_id | department_name |
|----|------|---------------|-----------------|
| 1  | Taro | 10            | 開発部          |
| 2  | Jiro | 10            | 開発部          |
${CB3}

department_id が分かれば department_name は決まる。それなら別テーブルに。

✅ OK:

${CB3}
users テーブル
| id | name | department_id |

departments テーブル
| id | name  |
${CB3}

### 実務では第3正規形まで

第4・第5正規形もありますが、**実務では第3正規形まで押さえれば9割OK**。

> [!TIP]
> 正規化の目的は「矛盾のないデータ」を保つこと。**理屈より、「同じデータが2箇所に書かれてないか？」を意識する**方が実戦では役立ちます。

## 非正規化: 性能のための意図的な崩し

### 非正規化とは

**正規化を意図的に崩して性能を稼ぐテクニック**。

### なぜ必要か

正規化された設計は**クリーン**ですが、**JOIN が多くなり遅くなる**ことがあります。

例: 投稿一覧に「投稿者名」を出したい。毎回 users テーブルと JOIN する？

### 非正規化の例

投稿に **author_name** を冗長に持たせる：

${CB3}
posts テーブル
| id | title   | author_id | author_name |
|----|---------|-----------|-------------|
| 1  | 記事A   | 1         | Taro        |
${CB3}

JOIN不要で投稿名を取れる。高速化。

### トレードオフ

- ✅ クエリが速い
- ❌ ユーザー名変更時、**posts も更新**する必要
- ❌ 冗長データの整合性を自分で管理

### いつ非正規化すべきか

**基本は「正規化してから、必要に応じて非正規化」**。

| シーン | 判断 |
|---|---|
| 新規開発 | まず正規化のみ |
| パフォーマンス問題発生 | 測定し、ボトルネックなら非正規化検討 |
| 大量の読み込みがある画面 | キャッシュ的な非正規化を検討 |
| 履歴として残したい情報 | 必ず非正規化（「その時点の名前」を残す） |

### 「その時点」を残すパターン（頻出）

注文時の商品価格は、**必ず orders テーブルに持たせる**。

${CB3}
orders テーブル
| id | product_id | quantity | price_at_order |
${CB3}

理由: 商品価格が後で変わっても、**注文時の金額を再現する必要**があるから。

**「過去の事実は変わらない」を設計で表現**するのが達人技。

## 主キー戦略: INT vs UUID vs ULID

### 主キーとは

**各レコードを一意に識別する列**。テーブルには必ず1つ。

### 3つの候補

#### 1. 連番（INT / BIGINT）

${CB3}
id: 1, 2, 3, 4, ...
${CB3}

**メリット**: 短い、高速、インデックスが効率的
**デメリット**: 推測しやすい（"/users/1" を "/users/2" と書き換えて他人情報に？）、分散システムで衝突

#### 2. UUID

${CB3}
id: "550e8400-e29b-41d4-a716-446655440000"
${CB3}

**メリット**: 衝突しない、推測不可能、分散生成可能
**デメリット**: 36文字と長い、**ソートで時系列にならない**、インデックス効率がやや劣る

#### 3. ULID（Universally Unique Lexicographically Sortable Identifier）

${CB3}
id: "01ARZ3NDEKTSV4RRFFQ69G5FAV"
${CB3}

**メリット**: UUID同様に衝突しない + **時系列ソート可能**
**デメリット**: UUIDほどの普及度ではない

### 推奨

| シーン | 選択 |
|---|---|
| 小〜中規模・単一DB | **BIGINT 連番** |
| 分散システム・マイクロサービス | **UUID** or **ULID** |
| 時系列ソートが重要 | **ULID** |
| URLに公開したくない | **UUID / ULID** |

**本シリーズでも ULID を採用**しています。理由はフロントに露出するIDを推測されたくない + 時系列ソート可能だから。

### サロゲートキー vs ナチュラルキー

- **サロゲートキー**: 人工的なID（連番、UUID）
- **ナチュラルキー**: 業務上の一意な値（メールアドレス、マイナンバー等）

**実務ではサロゲートキー推奨**。業務上の値は変わる可能性があり、主キーには不適。

## リレーションの設計

### 3種類のリレーション

#### 1対1

${CB3}
users ←→ user_profiles
${CB3}

片方に外部キーを持たせる（通常は子テーブル側）。

${CB3}sql
CREATE TABLE user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(255)
);
${CB3}

#### 1対多（最頻出）

${CB3}
users 1 ←→ * posts
${CB3}

「多」側が外部キーを持つ。

${CB3}sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(200)
);
${CB3}

#### 多対多

${CB3}
users * ←→ * tags（中間テーブル経由）
${CB3}

**中間テーブル**を作って1対多に分解。

${CB3}sql
CREATE TABLE user_tags (
  user_id INTEGER REFERENCES users(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (user_id, tag_id)
);
${CB3}

### 外部キー制約

**必ず付ける**。整合性が保たれる。

${CB3}sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ...
);
${CB3}

### ON DELETE の選択肢

親レコードが削除された時、子レコードをどうするか：

| オプション | 動作 |
|---|---|
| \`CASCADE\` | 子も削除 |
| \`SET NULL\` | 子の外部キーをNULL |
| \`RESTRICT\` | 子があれば親削除を拒否 |
| \`NO ACTION\` | 同上（標準のデフォルト） |

**CASCADE は慎重に**。親を1つ消したら大量の子が消える事故に注意。

## インデックス設計

### インデックスの効果

**検索対象の列にインデックスを張ると、数桁速くなる**ことがあります。

### 張るべき列

- **WHERE でよく使う列**
- **JOIN で結合条件になる列**（多くのDBで外部キーに自動で張られない）
- **ORDER BY でよく使う列**
- **UNIQUE 制約を付ける列**（自動で張られる）

### 張ってはいけない列

- **更新頻度が極めて高い列**
- **カーディナリティ（値の種類）が低い列**（true/false など2値のみ）
- **使われない列**

### 単一インデックス vs 複合インデックス

${CB3}sql
-- 単一
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- 複合（順序が重要）
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
${CB3}

**複合インデックスは列の順序が命**。

- \`(user_id, created_at)\` は \`WHERE user_id = ?\` と \`WHERE user_id = ? AND created_at > ?\` の両方に効く
- \`WHERE created_at > ?\` 単体には効かない

**頻出クエリのパターンを分析してから張る**。

### 部分インデックス（PostgreSQL）

条件付きのインデックス。

${CB3}sql
-- published = true の行にだけインデックス
CREATE INDEX idx_published_posts ON posts(created_at)
WHERE published = true;
${CB3}

**インデックスのサイズを小さく保てる**。

### インデックスは銀の弾丸ではない

- 書き込みが遅くなる
- 保存領域を使う
- **EXPLAIN で本当に効いているか確認必須**

### EXPLAIN で確認する

${CB3}sql
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 1;
${CB3}

- **Seq Scan**（全件スキャン）が出たらインデックス未使用
- **Index Scan** が出れば効いている

**張って終わりではなく、効いているかを必ず測定**。

## 命名規則とデータ型選び

### 命名規則（チームで統一）

#### テーブル名

- **複数形 snake_case**: \`users\`, \`blog_posts\`, \`order_items\`
- **省略しない**: \`usr\` ではなく \`users\`

#### カラム名

- **snake_case**: \`first_name\`, \`created_at\`
- **主キー**: \`id\`
- **外部キー**: \`{テーブル単数形}_id\` → \`user_id\`, \`post_id\`
- **日時**: \`_at\` で終える → \`created_at\`, \`updated_at\`, \`deleted_at\`
- **真偽値**: \`is_\` or \`has_\` で始める → \`is_active\`, \`has_verified\`

#### 避けるべき名前

- **予約語**: \`order\`, \`user\`, \`group\`
- **曖昧な名前**: \`data\`, \`info\`, \`temp\`
- **連番**: \`name1\`, \`name2\`

### データ型の選び方

#### 文字列

| 型 | 用途 |
|---|---|
| \`VARCHAR(n)\` | 最大長が決まっている |
| \`TEXT\` | 長文、制限不要 |

PostgreSQL では \`TEXT\` が事実上の推奨。

#### 数値

| 型 | 用途 |
|---|---|
| \`INTEGER\` | 一般的な整数 |
| \`BIGINT\` | 大きな数（主キーに推奨） |
| \`DECIMAL(p, s)\` | **金額** |
| \`REAL\` / \`DOUBLE\` | 科学計算（金額には使わない） |

> [!WARNING]
> **金額に \`FLOAT\` は絶対NG**。浮動小数点誤差で \`0.1 + 0.2 != 0.3\` のような問題が起きます。金額は必ず \`DECIMAL\` か、整数（円単位）で保存。

#### 日時

| 型 | 用途 |
|---|---|
| \`DATE\` | 日付のみ |
| \`TIME\` | 時刻のみ |
| \`TIMESTAMP\` | 日時 |
| \`TIMESTAMPTZ\` | **タイムゾーン付き日時**（推奨） |

**\`TIMESTAMPTZ\` で UTC 保存、表示時にローカル変換**。これが国際化対応の王道。

#### 真偽値

- \`BOOLEAN\` を使う（0/1ではなく）

#### 列挙

${CB3}sql
-- ENUM（PostgreSQL）
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped');

-- or VARCHAR + CHECK制約
status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'shipped'))
${CB3}

ENUMは後から値を追加しづらいので、**VARCHAR + CHECK 制約**を好む現場も。

## 履歴・論理削除・監査ログ

### 論理削除

**実際に DELETE せず、削除フラグを立てる**手法。

${CB3}sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
${CB3}

${CB3}sql
-- 削除
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- アクティブユーザー取得
SELECT * FROM users WHERE deleted_at IS NULL;
${CB3}

#### メリット

- 復旧可能
- 「いつ削除されたか」が残る
- 削除直後のバグ調査ができる

#### デメリット

- **クエリに必ず \`WHERE deleted_at IS NULL\` が必要**（忘れると削除済みも混じる）
- ユニーク制約と相性が悪い（同じメールで再登録したい時）
- データ量が減らない

### 監査ログ

**誰がいつ何をしたか**を記録する別テーブル。

${CB3}sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER,
  action VARCHAR(50),
  target_table VARCHAR(50),
  target_id INTEGER,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
${CB3}

**セキュリティ・コンプライアンス必須**のシステムでは外せません。

### 履歴テーブル

「過去どんな値だったか」を追える設計。

${CB3}sql
-- 現在のデータ
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(200),
  price DECIMAL(10, 2)
);

-- 履歴
CREATE TABLE product_history (
  id BIGSERIAL PRIMARY KEY,
  product_id INT,
  name VARCHAR(200),
  price DECIMAL(10, 2),
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ
);
${CB3}

**価格改定の履歴、過去の注文の金額再現**などで必須。

### 作成日時・更新日時は全テーブルに

${CB3}sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
${CB3}

**全テーブルに必ず入れる**。後からのデバッグ・分析で圧倒的に助かります。

## マルチテナント設計

SaaSを作る際に避けて通れない概念。**複数の顧客（テナント）で同じシステムを共有する**設計。

### 3つのアプローチ

#### 1. DB分離型

テナントごとに別のDBを用意。

- ✅ 完全に分離、セキュリティ最強
- ❌ 運用コスト高、テナント数に比例して増える

#### 2. スキーマ分離型

同じDB内で、テナントごとに別スキーマ。

- ✅ ある程度分離、コスト抑えめ
- ❌ 大量テナントで管理が大変

#### 3. 行分離型（最も一般的）

全テーブルに \`tenant_id\` を持たせる。

${CB3}sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  tenant_id VARCHAR(26) NOT NULL,
  email VARCHAR(255) NOT NULL,
  UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
${CB3}

- ✅ コスト最小、スケールしやすい
- ❌ **アプリ側で \`tenant_id\` を必ず付ける必要**（バグ=情報漏洩）

### Row Level Security（行単位セキュリティ）

PostgreSQLには**DB側でテナント分離を強制**する機能があります。

${CB3}sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant'));
${CB3}

**アプリのバグでも情報漏洩しない**強固な仕組み。SaaS 開発では推奨。

## 設計レビューのチェックリスト

実務で設計レビューに出す前に、以下を自己チェック。

### 基本

- [ ] すべてのテーブルに主キー
- [ ] 外部キーに制約がある
- [ ] \`created_at\`, \`updated_at\` がある
- [ ] テーブル・カラム名が規約に沿っている
- [ ] 予約語を避けている

### 正規化

- [ ] 第3正規形まで満たしている
- [ ] 意図的な非正規化は理由が明記されている
- [ ] 「その時点の値」を残すべき列は別途保存

### 型

- [ ] 金額は \`DECIMAL\`
- [ ] 日時は \`TIMESTAMPTZ\`
- [ ] 可変長文字列は適切なサイズ
- [ ] 真偽値は \`BOOLEAN\`

### インデックス

- [ ] 外部キー列にインデックス
- [ ] 頻出の WHERE/ORDER BY 条件にインデックス
- [ ] EXPLAIN で効果を確認

### セキュリティ

- [ ] パスワードは**絶対に平文で保存しない**（bcrypt等のハッシュ）
- [ ] 個人情報の暗号化検討
- [ ] \`tenant_id\` が全テーブルに入っているか（SaaSの場合）

### 運用

- [ ] 論理削除が必要か判断済み
- [ ] 監査ログが必要か判断済み
- [ ] バックアップ戦略がある

## 実例: ブログシステムの設計

本記事の総まとめとして、ブログシステムのテーブル設計を示します。

${CB3}sql
-- テナント（マルチテナント想定）
CREATE TABLE tenants (
  id VARCHAR(26) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ユーザー
CREATE TABLE users (
  id VARCHAR(26) PRIMARY KEY,
  tenant_id VARCHAR(26) NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);

-- 記事
CREATE TABLE articles (
  id VARCHAR(26) PRIMARY KEY,
  tenant_id VARCHAR(26) NOT NULL REFERENCES tenants(id),
  author_id VARCHAR(26) NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, slug)
);

CREATE INDEX idx_articles_tenant_status ON articles(tenant_id, status);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC)
  WHERE status = 'published';

-- タグ
CREATE TABLE tags (
  id VARCHAR(26) PRIMARY KEY,
  tenant_id VARCHAR(26) NOT NULL REFERENCES tenants(id),
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);

-- 記事タグ（多対多）
CREATE TABLE article_tags (
  article_id VARCHAR(26) NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id VARCHAR(26) NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);

-- コメント
CREATE TABLE comments (
  id VARCHAR(26) PRIMARY KEY,
  article_id VARCHAR(26) NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_id VARCHAR(26) REFERENCES users(id),
  author_name VARCHAR(100),
  content TEXT NOT NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_article ON comments(article_id, created_at DESC);

-- 監査ログ
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id VARCHAR(26),
  user_id VARCHAR(26),
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(26),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
${CB3}

**このレベルの設計ができれば、実務の初級〜中級レベルです**。

## 設計スキルを伸ばすには

### ステップ1: 既存サービスを分析

好きなサービス（Twitter、メルカリ、Qiita等）を「自分なら**どう設計するか**」考える。

### ステップ2: 設計を先に書く

コードを書く前に、**必ずテーブル設計を紙か Mermaid で図示**。これが習慣になると強い。

### ステップ3: 本を読む

- 『**SQLアンチパターン**』（オライリー）**必読**
- 『**達人に学ぶDB設計徹底指南書**』ミック 著 **必読**
- 『**理論から学ぶデータベース実践入門**』奥野幹也 著
- 『**楽々ERDレッスン**』羽生章洋 著

### ステップ4: レビューを受ける

自分の設計を**他人に見てもらう**。Qiita・Zenn に公開、先輩に見せる、ChatGPT に批評させる。

### ステップ5: 本番の痛みを経験する

**失敗から学ぶのが最短**。小さなプロジェクトで自由に失敗し、痛みを覚えましょう。

## よくあるアンチパターン

### アンチパターン1: 何でもJSON型に突っ込む

${CB3}
| id | data (JSONB)                           |
|----|----------------------------------------|
| 1  | {"name":"Taro","age":25,"tags":[...]}  |
${CB3}

- 柔軟に見えるが、**検索・集計で地獄**
- 必要な列は必ずカラムにする
- **JSONは本当に可変な部分**（設定値、メタデータ）に限定

### アンチパターン2: EAV（Entity-Attribute-Value）

${CB3}
| entity_id | attribute | value |
|-----------|-----------|-------|
| 1         | name      | Taro  |
| 1         | age       | 25    |
${CB3}

「何でも入れられる」設計だが、**クエリが悪夢になる**。RDBMSの強みを捨てている。

### アンチパターン3: 過度な多態性

1つのカラムで複数のテーブルを指す設計。

${CB3}
comments テーブル
| target_type | target_id |
|-------------|-----------|
| 'article'   | 1         |
| 'video'     | 5         |
${CB3}

**外部キー制約が効かない**ので整合性が崩れやすい。素直にテーブルを分けるか、テーブルごとにコメントテーブルを持つのが無難。

### アンチパターン4: マジックナンバーの直書き

${CB3}sql
WHERE status = 3  -- 3ってなに？
${CB3}

ENUM またはステータスマスタテーブルを使い、**意味のある名前**で管理。

## 最後に: 達人への道

### 未経験者へのメッセージ

DB設計は**一朝一夕に身につくものではありません**。本書で紹介した内容も、最初は全部理解できなくて当然。

大事なのは：

1. **アプリを作る前に設計する**習慣
2. **失敗を恐れず、経験を積む**
3. **先輩・書籍から学び続ける**

この3つを続ければ、3年後には**頼られる設計者**になれます。

### シリーズを終えるにあたって

本シリーズでは、フロントエンド・バックエンド・データベース と、**Web開発の全領域**を未経験者向けに横断してきました。

${CB3}mermaid
graph LR
    A[フロント編<br/>画面を作る] --> B[バック編<br/>APIを作る]
    B --> C[DB編<br/>データを設計する]
    C --> D[あなたは今<br/>Web開発の全体像を<br/>理解した]
${CB3}

**ここまで読んだあなたは、他の未経験者と圧倒的な差**をつけた状態です。あとは手を動かし、何かを作り、失敗し、学び、成長あるのみ。

> [!IMPORTANT]
> 知識は**使って初めて力**になります。本シリーズで学んだ知識を、ぜひ自分のポートフォリオ作成に活かしてください。完成したら世界に公開しましょう。**その一歩が、プロのエンジニアへの入り口**です。

### 参考リソース

- **『SQLアンチパターン』**（オライリー・ジャパン）
- **『達人に学ぶDB設計徹底指南書』**ミック 著（翔泳社）
- **『理論から学ぶデータベース実践入門』**奥野幹也 著（技術評論社）
- **『楽々ERDレッスン』**羽生章洋 著（翔泳社）
- **PostgreSQL 公式ドキュメント**: https://www.postgresql.jp/document/

### 謝辞

本シリーズを最後まで読んでくださった皆さま、本当にありがとうございました。皆さまのエンジニア人生が、最高のものになりますように。

**Happy Coding!** 🚀
`;

async function main() {
  const articleId = ulid();
  const now = new Date();

  await prisma.article.create({
    data: {
      id: articleId,
      tenantId: TENANT_ID,
      title: '達人のDB設計 — 未経験者が知っておくべき実務級データベース設計',
      content,
      status: 'published',
      slug: 'master-database-design-for-beginners',
      authorId: AUTHOR_ID,
      viewCount: 0,
      likeCount: 0,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log(`✅ 記事を作成しました: ${articleId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
