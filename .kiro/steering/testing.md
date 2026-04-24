# TDD 規約

## Red-Green-Refactor-Review サイクル

### 絶対ルール

**テストを書く前に実装を書くことを禁止**

### サイクルの流れ

1. **Red**: 失敗するテストを書く
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: DDD 原則に沿ってリファクタ
4. **Review**: 人間がレビュー完了するまで次に進まない

### Kiro への指示ルール

**実装前に必ずテストを先に生成し、人間のレビュー完了まで実装指示を出さない**

**OK例**:

```
1. テストコードを生成
2. 「テストを作成しました。レビュー後、実装に進みます」と停止
3. 人間の承認を待つ
4. 承認後、実装を開始
```

**NG例**:

```
1. テストと実装を同時に生成 ❌
2. テストなしで実装 ❌
3. 人間の承認なしで実装に進む ❌
```

## Inside-Out アプローチ

### 開発順序

1. **値オブジェクト** (最も内側)
2. **集約** (エンティティ)
3. **ユースケース** (アプリケーション層)
4. **リポジトリ実装** (インフラ層)
5. **Server Actions** (プレゼンテーション層)
6. **E2E テスト** (最も外側)

**理由**: 依存方向に沿って開発することで、依存の逆転を防ぐ

### 実装例

**ステップ1: 値オブジェクトのテスト**

```typescript
// src/contexts/publishing/domain/article/ArticleTitle.test.ts
import { describe, it, expect } from "vitest";
import { ArticleTitle } from "./ArticleTitle";

describe("ArticleTitle", () => {
  describe("正常系", () => {
    it("有効なタイトルで値オブジェクトを作成できる", () => {
      const title = ArticleTitle.fromString("技術ブログ記事");
      expect(title.toString()).toBe("技術ブログ記事");
    });
  });

  describe("異常系", () => {
    it("空文字の場合、エラーを投げる", () => {
      expect(() => ArticleTitle.fromString("")).toThrow("タイトルは必須です");
    });

    it("101文字以上の場合、エラーを投げる", () => {
      const longTitle = "a".repeat(101);
      expect(() => ArticleTitle.fromString(longTitle)).toThrow(
        "タイトルは100文字以内です",
      );
    });
  });

  describe("等価性", () => {
    it("同じ値の場合、等価と判定される", () => {
      const title1 = ArticleTitle.fromString("タイトル");
      const title2 = ArticleTitle.fromString("タイトル");
      expect(title1.equals(title2)).toBe(true);
    });

    it("異なる値の場合、非等価と判定される", () => {
      const title1 = ArticleTitle.fromString("タイトル1");
      const title2 = ArticleTitle.fromString("タイトル2");
      expect(title1.equals(title2)).toBe(false);
    });
  });

  describe("不変性", () => {
    it("値を変更しようとすると新しいインスタンスが返される", () => {
      const original = ArticleTitle.fromString("元のタイトル");
      const modified = original.changePrefix("[更新] ");

      expect(original.toString()).toBe("元のタイトル");
      expect(modified.toString()).toBe("[更新] 元のタイトル");
      expect(original).not.toBe(modified);
    });
  });
});
```

**ステップ2: 集約のテスト**

```typescript
// src/contexts/publishing/domain/article/Article.test.ts
import { describe, it, expect } from "vitest";
import { Article } from "./Article";
import { ArticleId } from "./ArticleId";
import { ArticleTitle } from "./ArticleTitle";
import { ArticleContent } from "./ArticleContent";
import { TenantId } from "@/contexts/shared-kernel/TenantId";

describe("Article", () => {
  describe("記事の作成", () => {
    it("下書き状態で記事を作成できる", () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString("タイトル"),
        ArticleContent.fromString("本文"),
      );

      expect(article.isDraft()).toBe(true);
      expect(article.isPublished()).toBe(false);
    });
  });

  describe("記事の公開", () => {
    it("下書き記事を公開できる", () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString("タイトル"),
        ArticleContent.fromString("本文"),
      );

      article.publish();

      expect(article.isPublished()).toBe(true);
      expect(article.getDomainEvents()).toHaveLength(1);
      expect(article.getDomainEvents()[0]).toBeInstanceOf(ArticlePublished);
    });

    it("タイトルが空の場合、公開できない", () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString(""), // 実際は値オブジェクトでエラー
        ArticleContent.fromString("本文"),
      );

      expect(() => article.publish()).toThrow("公開条件を満たしていません");
    });

    it("既に公開済みの記事は再公開できない", () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString("タイトル"),
        ArticleContent.fromString("本文"),
      );

      article.publish();

      expect(() => article.publish()).toThrow("既に公開済みです");
    });
  });

  describe("ドメインイベント", () => {
    it("公開時に ArticlePublished イベントが発行される", () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString("タイトル"),
        ArticleContent.fromString("本文"),
      );

      article.publish();

      const events = article.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ArticlePublished);
    });

    it("イベントをクリアできる", () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString("タイトル"),
        ArticleContent.fromString("本文"),
      );

      article.publish();
      article.clearDomainEvents();

      expect(article.getDomainEvents()).toHaveLength(0);
    });
  });
});
```

## 値オブジェクトの必須3テスト

すべての値オブジェクトに以下のテストを必ず含める:

1. **等価性テスト**: `equals()` メソッドの動作確認
2. **不変性テスト**: 値を変更しても元のインスタンスが変わらないことを確認
3. **バリデーションテスト**: 不正な値でエラーが投げられることを確認

## 集約の必須テスト

すべての集約に以下のテストを必ず含める:

1. **状態遷移テスト**: 正常な状態遷移が行われることを確認
2. **不変条件違反テスト**: 不正な状態遷移でエラーが投げられることを確認
3. **ドメインイベント発行テスト**: 重要な操作でイベントが発行されることを確認

## テスト命名規則

### 日本語で記述

**理由**: ビジネスルールを明確に表現するため

**OK例**:

```typescript
describe("Article", () => {
  describe("記事の公開", () => {
    it("下書き記事を公開できる", () => {
      // ...
    });

    it("タイトルが空の場合、公開できない", () => {
      // ...
    });
  });
});
```

**NG例**:

```typescript
describe("Article", () => {
  it("test publish", () => {
    // NG: 英語、曖昧
    // ...
  });

  it("should work", () => {
    // NG: 何をテストしているか不明
    // ...
  });
});
```

### 命名パターン

**形式**: 「〜のとき、〜する」

**例**:

- 「有効なタイトルで値オブジェクトを作成できる」
- 「空文字の場合、エラーを投げる」
- 「既に公開済みの記事は再公開できない」

## AAA パターン (Arrange-Act-Assert)

### 構造

```typescript
it("下書き記事を公開できる", () => {
  // Arrange: テストデータの準備
  const article = Article.create(
    ArticleId.generate(),
    TenantId.personal(),
    ArticleTitle.fromString("タイトル"),
    ArticleContent.fromString("本文"),
  );

  // Act: テスト対象の実行
  article.publish();

  // Assert: 結果の検証
  expect(article.isPublished()).toBe(true);
});
```

### ルール

- 各セクションを空行で区切る
- Act は1行のみ (複数の操作が必要な場合はテストを分割)
- Assert は関連する検証をまとめる

## モック方針

### レイヤー別のモック戦略

| レイヤー       | モック方針                    |
| -------------- | ----------------------------- |
| domain         | モック禁止 (純粋な単体テスト) |
| application    | Repository をモック           |
| infrastructure | 実 DB を使用 (統合テスト)     |

### domain 層: モック禁止

**理由**: ドメインロジックは外部依存がないため、モック不要

**OK例**:

```typescript
it("記事を公開できる", () => {
  const article = Article.create(/* ... */);
  article.publish();
  expect(article.isPublished()).toBe(true);
});
```

**NG例**:

```typescript
// ❌ domain 層でモックを使用
it("記事を公開できる", () => {
  const mockTitle = vi.fn(); // NG!
  const article = new Article(mockTitle);
  // ...
});
```

### application 層: Repository モック

**OK例**:

```typescript
// src/contexts/publishing/application/PublishArticleUseCase.test.ts
import { describe, it, expect, vi } from "vitest";
import { PublishArticleUseCase } from "./PublishArticleUseCase";
import { IArticleRepository } from "../domain/IArticleRepository";

describe("PublishArticleUseCase", () => {
  it("記事を公開し、リポジトリに保存する", async () => {
    // Arrange
    const article = Article.create(/* ... */);
    const mockRepository: IArticleRepository = {
      findById: vi.fn().mockResolvedValue(article),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      findByTenantId: vi.fn(),
    };
    const useCase = new PublishArticleUseCase(mockRepository);

    // Act
    await useCase.execute({ articleId: article.id });

    // Assert
    expect(mockRepository.save).toHaveBeenCalledWith(article);
    expect(article.isPublished()).toBe(true);
  });
});
```

### infrastructure 層: 実 DB 使用

**理由**: DB との統合を確認するため

**OK例**:

```typescript
// src/contexts/publishing/infrastructure/PrismaArticleRepository.integration.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { PrismaArticleRepository } from "./PrismaArticleRepository";

describe("PrismaArticleRepository (統合テスト)", () => {
  let prisma: PrismaClient;
  let repository: PrismaArticleRepository;

  beforeEach(async () => {
    prisma = new PrismaClient();
    repository = new PrismaArticleRepository(prisma);
    await prisma.$executeRaw`TRUNCATE TABLE articles CASCADE`;
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it("記事を保存し、取得できる", async () => {
    // Arrange
    const article = Article.create(/* ... */);

    // Act
    await repository.save(article);
    const found = await repository.findById(article.id);

    // Assert
    expect(found).not.toBeNull();
    expect(found!.id.equals(article.id)).toBe(true);
  });
});
```

## ファイル命名規則

| テスト種別 | ファイル名              | 配置                                    |
| ---------- | ----------------------- | --------------------------------------- |
| 単体テスト | `*.test.ts`             | コロケーション (実装と同じディレクトリ) |
| 統合テスト | `*.integration.test.ts` | コロケーション                          |
| E2E テスト | `*.spec.ts`             | `tests/e2e/`                            |

**例**:

```
src/contexts/publishing/domain/article/
├── Article.ts
├── Article.test.ts                    # 単体テスト
├── ArticleTitle.ts
└── ArticleTitle.test.ts

src/contexts/publishing/infrastructure/
├── PrismaArticleRepository.ts
└── PrismaArticleRepository.integration.test.ts  # 統合テスト

tests/e2e/
└── article-publish.spec.ts            # E2E テスト
```

## カバレッジ最低ライン

| レイヤー       | 最低カバレッジ |
| -------------- | -------------- |
| domain         | 95%            |
| application    | 85%            |
| infrastructure | 70%            |
| presentation   | 60%            |

**確認コマンド**:

```bash
npm run test:coverage
```

**vitest.config.ts**:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        "src/contexts/**/domain/**": {
          lines: 95,
          functions: 95,
          branches: 95,
          statements: 95,
        },
        "src/contexts/**/application/**": {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85,
        },
      },
    },
  },
});
```

## Playwright (E2E テスト)

### 実行環境

**GitHub Actions のみで実行、Vercel ビルドに含めない**

**理由**:

- Vercel の10秒タイムアウト制限
- ビルド時間の短縮
- CI/CD での品質保証

### playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
      },
});
```

### E2E テスト例

```typescript
// tests/e2e/article-publish.spec.ts
import { test, expect } from "@playwright/test";

test.describe("記事の公開", () => {
  test("下書き記事を公開できる", async ({ page }) => {
    // ログイン
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password");
    await page.click('button[type="submit"]');

    // 記事作成
    await page.goto("/admin/articles/new");
    await page.fill('input[name="title"]', "テスト記事");
    await page.fill('textarea[name="content"]', "本文");
    await page.click('button:has-text("下書き保存")');

    // 公開
    await page.click('button:has-text("公開")');
    await expect(page.locator("text=公開しました")).toBeVisible();

    // 公開ページで確認
    await page.goto("/articles");
    await expect(page.locator("text=テスト記事")).toBeVisible();
  });
});
```

### GitHub Actions 設定

**.github/workflows/test.yml**:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_TEST_BASE_URL: ${{ secrets.PREVIEW_URL }}
```

## セルフチェックリスト

- [ ] テストを実装より先に書いたか
- [ ] Red-Green-Refactor サイクルを守ったか
- [ ] 値オブジェクトに等価性・不変性・バリデーションのテストがあるか
- [ ] 集約に状態遷移・不変条件・ドメインイベントのテストがあるか
- [ ] テスト名は日本語で「〜のとき、〜する」形式か
- [ ] AAA パターンに従っているか
- [ ] domain 層でモックを使用していないか
- [ ] カバレッジが最低ラインを満たしているか
- [ ] E2E テストは GitHub Actions で実行されるか
- [ ] Vercel ビルドに E2E テストが含まれていないか
