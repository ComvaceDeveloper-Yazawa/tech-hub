# 技術スタック規約

## 技術選定一覧

| カテゴリ        | 技術                        | 使用範囲                 |
| --------------- | --------------------------- | ------------------------ |
| フレームワーク  | Next.js 15+ (App Router)    | UI層のみ                 |
| 言語            | TypeScript                  | 全レイヤー               |
| DB              | Supabase (Postgres)         | インフラ層のみ           |
| ORM             | Prisma                      | インフラ層のみ           |
| バリデーション  | Zod                         | プレゼンテーション層のみ |
| スタイリング    | Tailwind CSS v4 + shadcn/ui | UI層のみ                 |
| 単体/統合テスト | Vitest                      | 全レイヤー               |
| E2E             | Playwright                  | tests/e2e/ のみ          |
| Linter          | oxlint + ESLint             | 全体                     |
| Formatter       | Prettier                    | 全体                     |
| 認証            | Supabase Auth               | インフラ層のみ           |

## TypeScript 設定

### 必須設定

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**理由**:

- `strict: true`: 型安全性の最大化
- `noUncheckedIndexedAccess: true`: 配列・オブジェクトアクセス時の undefined チェック強制

**NG例**:

```typescript
// ❌ noUncheckedIndexedAccess がないと危険
const items = ["a", "b", "c"];
const item = items[10]; // undefined だが型は string
item.toUpperCase(); // 実行時エラー
```

**OK例**:

```typescript
// ✅ noUncheckedIndexedAccess: true の場合
const items = ["a", "b", "c"];
const item = items[10]; // 型は string | undefined
if (item) {
  item.toUpperCase(); // 安全
}
```

## Prisma × Vercel 必須設定

### 環境変数

**必須**: `.env` に以下を設定

```bash
# pgBouncer 経由 (Vercel Serverless Functions 用)
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true&connection_limit=1"

# 直接接続 (マイグレーション用)
DIRECT_URL="postgresql://user:pass@host:5432/db"
```

**理由**:

- Vercel の Serverless Functions は接続プールを持たない
- pgBouncer でコネクション数を制限しないと DB 接続枯渇
- マイグレーションは直接接続が必要

### Prisma スキーマ設定

**prisma/schema.prisma**:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### package.json スクリプト

**必須**:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

**理由**: Vercel ビルド時に Prisma Client を生成

### PrismaClient シングルトンパターン

**src/lib/prisma.ts**:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**理由**: 開発時の Hot Reload で接続が増え続けるのを防ぐ

**NG例**:

```typescript
// ❌ 毎回 new PrismaClient() すると接続枯渇
export class PrismaArticleRepository {
  async save(article: Article): Promise<void> {
    const prisma = new PrismaClient(); // NG!
    await prisma.article.create({...});
  }
}
```

**OK例**:

```typescript
// ✅ シングルトンを使用
import { prisma } from '@/lib/prisma';

export class PrismaArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(article: Article): Promise<void> {
    await this.prisma.article.create({...});
  }
}

// DI で注入
const repository = new PrismaArticleRepository(prisma);
```

## Supabase Auth 設定

### 使用ライブラリ

**OK**: `@supabase/ssr`
**NG**: `@supabase/auth-helpers-nextjs` (非推奨)

**理由**: `auth-helpers` は Next.js 15 App Router で非推奨

### クライアント作成

**src/lib/supabase/server.ts** (Server Components / Server Actions 用):

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component からは set できない場合がある
          }
        },
      },
    },
  );
}
```

**src/lib/supabase/client.ts** (Client Components 用):

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

### Middleware 設定

**middleware.ts**:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Supabase 使用制限

### 禁止: 自動生成 REST/GraphQL API の使用

**理由**: DDD アーキテクチャが崩壊する

**NG例**:

```typescript
// ❌ Supabase の自動生成 API を直接使用
const { data } = await supabase
  .from("articles")
  .select("*")
  .eq("status", "published"); // NG! ドメインロジックをバイパス
```

**OK例**:

```typescript
// ✅ リポジトリ経由でドメインオブジェクトを取得
const articles = await articleRepository.findByStatus(
  ArticleStatus.published(),
);
```

### 禁止: Database Functions / Triggers にビジネスロジック記述

**理由**: ドメイン層のロジックが DB に散在し、テスト不可能になる

**NG例**:

```sql
-- ❌ Trigger でビジネスロジック
CREATE TRIGGER check_article_publish
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION validate_article_publish(); -- NG!
```

**OK例**:

```typescript
// ✅ ドメイン層でビジネスロジック
export class Article {
  publish(): void {
    if (!this.canPublish()) {
      throw new DomainError("公開条件を満たしていません");
    }
    this.status = ArticleStatus.published();
  }
}
```

### RLS (Row Level Security) の使用方針

**用途**: 防御の最終ライン専用

**OK**: 万が一のデータ漏洩防止

```sql
-- ✅ テナント分離の最終防御
CREATE POLICY tenant_isolation ON articles
  USING (tenant_id = current_setting('app.current_tenant_id')::text);
```

**NG**: ビジネスロジックの実装

```sql
-- ❌ RLS でビジネスルール
CREATE POLICY can_publish ON articles
  USING (
    status = 'draft' AND
    length(title) > 0 AND
    length(content) > 100
  ); -- NG! ドメイン層でやるべき
```

## Vercel デプロイ設定

### Hobby プラン制限

**制約**:

- 商用利用不可
- 10秒タイムアウト
- 月間100GB帯域制限
- 同時ビルド1つまで

**対応**:

- 重い処理は Vercel Functions (Pro) または外部 API に分離
- 画像は Vercel Image Optimization または外部 CDN
- Pro プラン移行時期を見極める

### vercel.json 設定

**vercel.json**:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "DIRECT_URL": "@direct-url"
  }
}
```

**理由**:

- `regions: ["hnd1"]`: 東京リージョン (レイテンシ削減)
- 環境変数は Vercel Dashboard で設定

## Zod 使用範囲

### プレゼンテーション層のみ

**OK例**:

```typescript
// ✅ src/schemas/article.ts (プレゼンテーション層)
import { z } from "zod";

export const publishArticleInputSchema = z.object({
  articleId: z.string().length(26),
});

// ✅ src/presentation/actions/publishArticle.ts
export async function publishArticle(formData: FormData) {
  const input = publishArticleInputSchema.parse({
    articleId: formData.get("articleId"),
  });

  // ドメイン層の値オブジェクトに変換
  const articleId = ArticleId.fromString(input.articleId);

  const useCase = new PublishArticleUseCase(/* DI */);
  await useCase.execute({ articleId });
}
```

**NG例**:

```typescript
// ❌ domain 層で Zod を使用
import { z } from "zod";

export class ArticleTitle {
  constructor(value: string) {
    z.string().min(1).max(100).parse(value); // NG!
  }
}
```

## Linter / Formatter 設定

### oxlint (プライマリ)

**.oxlintrc.json**:

```json
{
  "rules": {
    "typescript/no-explicit-any": "error",
    "typescript/no-unused-vars": "error"
  }
}
```

**理由**: ESLint より高速 (10-100倍)

### ESLint (Next.js 公式ルールのみ)

**.eslintrc.json**:

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {}
}
```

**理由**: Next.js 固有のルール (next/image, next/link 等) のみ使用

### Prettier

**.prettierrc**:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**理由**: `prettier-plugin-tailwindcss` で class 順を自動整列

## セルフチェックリスト

- [ ] DATABASE_URL に `pgbouncer=true&connection_limit=1` があるか
- [ ] DIRECT_URL を設定しているか
- [ ] PrismaClient はシングルトンパターンか
- [ ] Supabase Auth は `@supabase/ssr` を使用しているか
- [ ] Supabase の自動生成 API を使用していないか
- [ ] Database Functions / Triggers にビジネスロジックがないか
- [ ] Zod はプレゼンテーション層のみで使用しているか
- [ ] domain 層に外部ライブラリの import がないか
