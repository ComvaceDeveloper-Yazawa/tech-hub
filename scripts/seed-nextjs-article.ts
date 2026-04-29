import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

const prisma = new PrismaClient();

const TENANT_ID = '00000000000000000000000000';
const AUTHOR_ID = '00000000000000000000000001';

const title = 'Tech Hub で使用している Next.js の主要機能';

const slug = 'nextjs-features-used';

const content = `# Tech Hub で使用している Next.js の主要機能

本プロジェクトで活用している Next.js 15 (App Router) の機能を解説する。

---

## 1. App Router

Next.js 13 以降の新しいルーティングシステム。\`app/\` ディレクトリ配下のフォルダ構造がそのまま URL パスになる。

\`\`\`
app/
├── (public)/          # 公開ページグループ
│   ├── articles/
│   │   ├── page.tsx         # /articles
│   │   └── [slug]/
│   │       └── page.tsx     # /articles/my-article
│   └── curriculum/
│       ├── page.tsx         # /curriculum
│       └── [slug]/
│           └── page.tsx     # /curriculum/frontend
├── (admin)/           # 管理ページグループ
│   └── admin/
│       └── articles/
│           └── page.tsx     # /admin/articles
└── api/               # API Routes
    └── health/
        └── route.ts         # GET /api/health
\`\`\`

### Route Groups \`(public)\` / \`(admin)\`

括弧付きフォルダは URL に影響しない。レイアウトを分離するために使用。公開ページと管理ページで異なるレイアウト（ヘッダー・サイドバー）を適用している。

### Dynamic Routes \`[slug]\` / \`[id]\`

角括弧でパラメータを受け取る。記事詳細 (\`/articles/[slug]\`)、カリキュラム (\`/curriculum/[slug]\`)、学習ページ (\`/learn/[chapterId]\`) で使用。

---

## 2. Server Components (デフォルト)

App Router では全てのコンポーネントがデフォルトで Server Component。サーバー側でレンダリングされ、クライアントに HTML として送信される。

\`\`\`tsx
// app/(public)/articles/page.tsx — Server Component
export default async function ArticlesPage() {
  const articles = await listArticles({ status: 'published' });
  return <ArticleList articles={articles} />;
}
\`\`\`

データ取得を \`async/await\` で直接書ける。API エンドポイントを別途作る必要がない。

---

## 3. Client Components (\`'use client'\`)

ブラウザ側でインタラクティブに動作するコンポーネント。\`useState\`、\`useEffect\`、イベントハンドラが必要な場合に使用。

\`\`\`tsx
// src/components/features/LikeButton.tsx
'use client';

import { useState, useTransition } from 'react';

export function LikeButton({ articleId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();
  // ...
}
\`\`\`

本プロジェクトでの使用箇所:

- いいね/ブックマークボタン
- 記事フォーム (マークダウンエディタ)
- ステージマップ (Three.js)
- 学習ワークスペース (コードエディタ + プレビュー)
- モバイルナビゲーション

---

## 4. Server Actions

\`'use server'\` ディレクティブで定義するサーバー側関数。フォーム送信やボタンクリックからサーバー処理を直接呼び出せる。

\`\`\`tsx
// src/presentation/actions/article/createArticle.ts
'use server';

export async function createArticle(formData: FormData) {
  const input = createArticleInputSchema.parse({
    title: formData.get('title'),
    content: formData.get('content'),
    slug: formData.get('slug'),
  });

  const useCase = new CreateArticleUseCase(repository, eventPublisher);
  await useCase.execute(input);
  redirect('/admin/articles');
}
\`\`\`

本プロジェクトでの Server Actions:

- 記事 CRUD (createArticle, updateArticle, publishArticle, unpublishArticle, deleteArticle)
- エンゲージメント (recordView, toggleLike, toggleBookmark)
- 一覧取得 (listArticles, listBookmarks)
- カリキュラム (getCurriculums, getCurriculumBySlug, getStagesWithProgress, completeStage)
- プロフィール (getProfile, updateProfile)

---

## 5. Layout (\`layout.tsx\`)

ページ間で共有される UI 構造。ネストしたレイアウトが可能。

\`\`\`tsx
// app/(public)/layout.tsx — 公開ページ共通レイアウト
export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// app/(admin)/layout.tsx — 管理ページ共通レイアウト
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

---

## 6. Middleware (\`middleware.ts\`)

リクエストごとに実行される処理。認証セッションの更新に使用。

\`\`\`tsx
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  await supabase.auth.getUser(); // セッション更新
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
\`\`\`

静的ファイルや画像は除外し、ページリクエストのみで Supabase Auth のセッションを更新する。

---

## 7. API Routes (\`route.ts\`)

REST API エンドポイント。App Router では \`route.ts\` ファイルで定義。

\`\`\`tsx
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}

// app/api/ai/assist/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // AI処理...
  return Response.json({ result });
}
\`\`\`

本プロジェクトでは最小限の API Routes のみ使用し、大部分は Server Actions で処理している。

---

## 8. Dynamic Params (\`params\`)

Next.js 15 では \`params\` が Promise になった。\`await\` で取得する。

\`\`\`tsx
// app/(public)/articles/[slug]/page.tsx
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleDetail article={article} />;
}
\`\`\`

---

## 9. \`notFound()\` / \`redirect()\`

ページが見つからない場合や認証が必要な場合のナビゲーション。

\`\`\`tsx
import { notFound, redirect } from 'next/navigation';

// 記事が見つからない場合
const article = await getArticleBySlug(slug);
if (!article) notFound(); // 404 ページを表示

// 未認証の場合
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/login'); // ログインページへリダイレクト
\`\`\`

---

## 10. \`generateStaticParams()\`

ビルド時に静的生成するパスを指定。学習ページで使用。

\`\`\`tsx
// app/(public)/learn/[chapterId]/page.tsx
export function generateStaticParams() {
  return Object.keys(chapters).map((chapterId) => ({ chapterId }));
}
\`\`\`

\`background-image\` チャプターのページがビルド時に静的生成される。

---

## 11. Error Handling (\`error.tsx\` / \`global-error.tsx\`)

ページ単位のエラーバウンダリ。

\`\`\`tsx
// app/error.tsx — ページレベルのエラーハンドリング
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  );
}

// app/global-error.tsx — ルートレイアウトのエラーハンドリング
\`\`\`

---

## 12. \`useRouter\` / \`useSearchParams\`

クライアント側のナビゲーション。

\`\`\`tsx
'use client';
import { useRouter } from 'next/navigation';

function StageMapClient() {
  const router = useRouter();

  const handleStageClick = (stage) => {
    if (stage.stage_number === 1) {
      router.push('/learn/background-image');
    }
  };

  // router.refresh() でサーバーデータを再取得
  const handleComplete = async () => {
    await completeStage(stageId);
    router.refresh();
  };
}
\`\`\`

---

## まとめ

本プロジェクトでは Next.js 15 の App Router を中心に、Server Components でデータ取得、Client Components でインタラクティブ UI、Server Actions でサーバー処理という構成を採用している。API Routes は AI アシストやヘルスチェックなど最小限に留め、大部分の処理を Server Actions で完結させている。`;

const tagNames: string[] = ['Next.js', 'TypeScript', 'App Router'];

const status: 'published' | 'draft' = 'published';

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
  // 既存記事があればスキップ
  const existing = await prisma.article.findFirst({
    where: { tenantId: TENANT_ID, slug },
  });
  if (existing) {
    console.log('記事は既に存在します。スキップします。');
    return;
  }

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

  console.log('記事を作成しました');
  console.log(`  ID     : ${articleId}`);
  console.log(`  タイトル: ${title}`);
  console.log(`  スラッグ: ${slug}`);
  console.log(`  ステータス: ${status}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
