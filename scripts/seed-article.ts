import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

const prisma = new PrismaClient();

const TENANT_ID = '00000000000000000000000000';
const AUTHOR_ID = '00000000000000000000000001';

// ===== 記事の内容をここに記述 =====

const title =
  'このブログの技術構成と設計思想：DDD × Next.js で作るモダンな個人ブログ';

const slug = 'tech-stack-and-architecture';

const content = `# このブログの技術構成と設計思想：DDD × Next.js で作るモダンな個人ブログ

このブログがどのような技術で作られているか、そしてなぜその技術を選んだのかをまとめる。単なる技術紹介にとどまらず、設計上の意思決定とその背景まで踏み込んで解説する。

---

## 技術スタック一覧

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 15（App Router） |
| 言語 | TypeScript 5 |
| データベース | Supabase（PostgreSQL） |
| ORM | Prisma |
| 認証 | Supabase Auth |
| スタイリング | Tailwind CSS v4 + shadcn/ui |
| エディタ | CodeMirror 6 |
| AI 支援 | OpenAI API |
| テスト | Vitest + Playwright |
| デプロイ | Vercel |

---

## アーキテクチャ：ドメイン駆動設計（DDD）

このブログの最大の特徴は、個人ブログとしては珍しく **DDD（Domain-Driven Design）** を採用していることだ。

### なぜ個人ブログに DDD を使うのか

「個人ブログに DDD は過剰では？」という疑問は当然だ。しかし、このシステムには明確な理由がある。

1. **将来のマルチテナント化への備え** — 初期設計から \`tenantId\` を全エンティティに持たせており、将来的に複数ユーザーが使えるプラットフォームへの拡張が容易
2. **ビジネスロジックの保護** — 記事の公開条件、いいね・ブックマークの制約などをドメイン層に閉じ込め、UI や DB の変更に影響されない
3. **テスタビリティ** — ドメイン層は外部依存ゼロなので、高速な単体テストが書ける

### レイヤー構成

\`\`\`
src/contexts/publishing/
├── domain/          # ビジネスルール（外部依存ゼロ）
│   ├── article/     # Article 集約、値オブジェクト群
│   ├── bookmark/    # ブックマーク集約
│   └── like/        # いいね集約
├── application/     # ユースケース（domain のみに依存）
└── infrastructure/  # Prisma リポジトリ実装
\`\`\`

依存の方向は常に内側へ向かう。

\`\`\`
presentation → application → domain
                   ↑
            infrastructure
\`\`\`

### 値オブジェクトによる型安全性

タイトルや本文、スラッグなどはすべて値オブジェクトとして定義されている。

\`\`\`typescript
// 文字列をそのまま使わず、値オブジェクトでラップ
const title = ArticleTitle.fromString('記事タイトル');
// → 1〜100文字のバリデーションが自動で走る

const slug = Slug.fromString('my-article');
// → 英数字・ハイフンのみ許可するバリデーション
\`\`\`

プリミティブ型を直接使わないことで、不正な値がシステム内部に入り込む余地をなくしている。

### ドメインイベント

記事の公開・非公開・作成・削除といった重要な出来事は **ドメインイベント** として記録される。

\`\`\`typescript
article.publish();
// → ArticlePublished イベントが集約内に積まれる

const events = article.getDomainEvents();
// → イベントを取り出して外部に通知できる
\`\`\`

現時点ではイベントの外部通知は \`NoopDomainEventPublisher\`（何もしない実装）だが、将来的にメール通知や Webhook への拡張が容易な設計になっている。

---

## Next.js 15 App Router

### Server Components ファースト

このブログは **Server Components をデフォルト** として設計されている。記事一覧・記事詳細・管理画面のほとんどはサーバー上でレンダリングされ、クライアントに HTML として届く。

メリット：
- **SEO に強い** — JavaScript 実行前から内容が存在する
- **初期表示が速い** — クライアントへの JS 転送量が少ない
- **DB に直接アクセスできる** — API エンドポイントを介さずデータ取得が可能

### Server Actions

フォーム送信やデータ更新には Server Actions を使っている。

\`\`\`typescript
// 記事作成の Server Action
export async function createArticle(input: {
  title: string;
  content: string;
  slug: string;
}) {
  const validated = createArticleInputSchema.parse(input);
  const useCase = new CreateArticleUseCase(repository, eventPublisher);
  return await useCase.execute({ ... });
}
\`\`\`

API Routes を別途作る必要がなく、型安全なまま UI からサーバー処理を呼び出せる。

---

## Supabase：DB と認証を一元管理

### PostgreSQL as a Service

Supabase は PostgreSQL をホスティングしてくれるサービス。このブログでは **Prisma 経由でのみアクセス** し、Supabase の自動生成 REST API は使わない。

理由は明確で、自動生成 API を使うとドメイン層を完全にバイパスしてしまい、DDD の設計が崩壊するからだ。

### pgBouncer によるコネクション管理

Vercel の Serverless Functions は毎リクエストで新しいプロセスが起動するため、DB コネクションが枯渇しやすい。

\`\`\`
DATABASE_URL  → pgBouncer 経由（connection_limit=1）
DIRECT_URL    → 直接接続（マイグレーション専用）
\`\`\`

この2つの URL を使い分けることで、Vercel 環境でも安定した DB 接続を実現している。

### 認証

Supabase Auth を \`@supabase/ssr\` パッケージ経由で使用。Server Components・Server Actions・Middleware のすべてで一貫したセッション管理ができる。

---

## リッチなエディタ体験

### CodeMirror 6 ベースの Markdown エディタ

記事の執筆には CodeMirror 6 をベースにしたカスタムエディタを使っている。

主な機能：
- **Markdown シンタックスハイライト**
- **スラッシュコマンド**（\`/\` を入力すると見出し・リスト・コードブロックなどを挿入）
- **ペースト時の自動フォーマット**（URL をリンクに変換など）
- **画像のドラッグ&ドロップアップロード**
- **分割プレビュー**（エディタとプレビューを並べて表示）
- **自動保存**（ローカルストレージへの下書き保存）

### AI 執筆支援

OpenAI API を使った AI 支援機能も搭載している。選択したテキストに対して「続きを書く」「要約する」「校正する」などの操作が可能。

---

## テスト戦略

### Inside-Out アプローチ

テストは内側のレイヤーから書く。

\`\`\`
値オブジェクト → 集約 → ユースケース → リポジトリ（統合）→ E2E
\`\`\`

### レイヤー別のモック方針

| レイヤー | 方針 |
|---|---|
| domain | モック禁止（純粋な単体テスト） |
| application | Repository をモック |
| infrastructure | 実 DB を使用（統合テスト） |
| E2E | Playwright でブラウザテスト |

domain 層は外部依存がゼロなので、モックなしで高速に動く。

---

## Tailwind CSS v4 + shadcn/ui

スタイリングは Tailwind CSS v4 のみを使用。CSS Modules や CSS-in-JS は使わない。

shadcn/ui をベースコンポーネントとして採用しているが、これは「コンポーネントライブラリをインストールする」のではなく「コードをコピーして自分のプロジェクトに取り込む」アプローチ。カスタマイズの自由度が高く、バンドルサイズも最小限に抑えられる。

---

## ULID による ID 採番

エンティティの ID には UUID ではなく **ULID** を使っている。

\`\`\`
01ARZ3NDEKTSV4RRFFQ69G5FAV  ← ULID（26文字）
550e8400-e29b-41d4-a716-446655440000  ← UUID（36文字）
\`\`\`

ULID の利点：
- **ソート可能** — 先頭10文字がタイムスタンプなので、作成日時順に並ぶ
- **短い** — UUID より10文字短く、URL に使いやすい
- **衝突確率が極めて低い** — 同一ミリ秒内に 1.21 × 10^24 個生成しても衝突しない

---

## まとめ

このブログは「個人ブログ」という小さなスコープながら、エンタープライズレベルの設計原則を適用している。

- **DDD** でビジネスロジックを保護
- **Next.js App Router** で SEO と UX を両立
- **Supabase + Prisma** で型安全な DB アクセス
- **Vitest + Playwright** で品質を担保

過剰に見えるかもしれないが、この設計は「将来の拡張に耐えられるか」という問いへの答えでもある。小さく始めて、正しく育てる。それがこのシステムの設計思想だ。`;

// タグ名の配列（不要なら空配列）
const tagNames: string[] = [
  'Next.js',
  'DDD',
  'TypeScript',
  'Supabase',
  'アーキテクチャ',
];

// 'published' または 'draft'
const status: 'published' | 'draft' = 'published';

// ===================================

async function upsertTags(names: string[]): Promise<string[]> {
  if (names.length === 0) return [];

  const ids: string[] = [];
  for (const name of names) {
    const normalizedName = name.toLowerCase().trim();
    const existing = await prisma.tag.findFirst({
      where: { tenantId: TENANT_ID, normalizedName },
    });
    if (existing) {
      ids.push(existing.id);
    } else {
      const tag = await prisma.tag.create({
        data: {
          id: ulid(),
          tenantId: TENANT_ID,
          name,
          normalizedName,
        },
      });
      ids.push(tag.id);
    }
  }
  return ids;
}

async function main() {
  const articleId = ulid();
  const now = new Date();
  const tagIds = await upsertTags(tagNames);

  await prisma.article.create({
    data: {
      id: articleId,
      tenantId: TENANT_ID,
      title,
      content,
      status,
      slug,
      authorId: AUTHOR_ID,
      viewCount: 0,
      likeCount: 0,
      publishedAt: status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
      tags:
        tagIds.length > 0
          ? {
              create: tagIds.map((tagId) => ({
                tagId,
                tenantId: TENANT_ID,
              })),
            }
          : undefined,
    },
  });

  console.log(`✅ 記事を作成しました`);
  console.log(`   ID     : ${articleId}`);
  console.log(`   タイトル: ${title}`);
  console.log(`   スラッグ: ${slug}`);
  console.log(`   ステータス: ${status}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
