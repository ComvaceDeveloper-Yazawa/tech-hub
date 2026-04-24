# アーキテクチャ規約

## レイヤー構成と責務

### Domain Layer (ドメイン層)

**配置**: `src/contexts/{context}/domain/`

**責務**:

- ビジネスルールの表現
- 値オブジェクト、エンティティ、集約の定義
- ドメインサービス、ドメインイベントの定義
- リポジトリインターフェースの定義

**依存**: **何にも依存しない** (外部ライブラリ一切禁止)

**禁止事項**:

- ❌ Prisma のインポート
- ❌ Next.js のインポート
- ❌ Zod のインポート
- ❌ 外部ライブラリの直接使用
- ❌ インフラ層への依存

**OK例**:

```typescript
// src/contexts/publishing/domain/article/Article.ts
export class Article {
  private constructor(
    private readonly id: ArticleId,
    private title: ArticleTitle,
    private status: ArticleStatus,
  ) {}

  publish(): void {
    if (!this.canPublish()) {
      throw new DomainError("公開条件を満たしていません");
    }
    this.status = ArticleStatus.published();
  }
}
```

**NG例**:

```typescript
// ❌ ドメイン層で Prisma を使用
import { PrismaClient } from '@prisma/client';

export class Article {
  async save() {
    const prisma = new PrismaClient();
    await prisma.article.create({...}); // NG!
  }
}
```

### Application Layer (アプリケーション層)

**配置**: `src/contexts/{context}/application/`

**責務**:

- ユースケースの実装
- トランザクション境界の定義
- ドメインオブジェクトの組み立て
- リポジトリの呼び出し

**依存**: domain のみ

**禁止事項**:

- ❌ infrastructure への直接依存
- ❌ presentation への依存
- ❌ ビジネスロジックの記述 (domain に委譲すること)

**OK例**:

```typescript
// src/contexts/publishing/application/PublishArticleUseCase.ts
export class PublishArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: PublishArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(input.articleId);
    article.publish(); // ビジネスロジックは domain に委譲
    await this.articleRepository.save(article);
    await this.eventPublisher.publish(article.domainEvents);
  }
}
```

### Infrastructure Layer (インフラ層)

**配置**: `src/contexts/{context}/infrastructure/`

**責務**:

- リポジトリの実装
- 外部サービスとの連携
- Prisma, Supabase などの技術的詳細

**依存**: domain, application

**OK例**:

```typescript
// src/contexts/publishing/infrastructure/PrismaArticleRepository.ts
import { PrismaClient } from "@prisma/client";
import { IArticleRepository } from "../domain/IArticleRepository";

export class PrismaArticleRepository implements IArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(article: Article): Promise<void> {
    await this.prisma.article.upsert({
      where: { id: article.id.value },
      update: { title: article.title.value },
      create: { id: article.id.value, title: article.title.value },
    });
  }
}
```

### Presentation Layer (プレゼンテーション層)

**配置**: `src/presentation/actions/`, `app/`

**責務**:

- Server Actions の実装
- UI コンポーネント
- リクエスト/レスポンスの変換
- バリデーション (Zod)

**依存**: application のみ

**禁止事項**:

- ❌ domain への直接依存
- ❌ ドメインオブジェクトの直接操作

**OK例**:

```typescript
// src/presentation/actions/publishArticle.ts
"use server";
import { publishArticleInputSchema } from "@/schemas/article";
import { PublishArticleUseCase } from "@/contexts/publishing/application/PublishArticleUseCase";

export async function publishArticle(formData: FormData) {
  const input = publishArticleInputSchema.parse({
    articleId: formData.get("articleId"),
  });

  const useCase = new PublishArticleUseCase(/* DI */);
  await useCase.execute(input);
}
```

## 依存方向の絶対ルール

```
presentation → application → domain
                ↑
         infrastructure
```

- domain は何にも依存しない
- application は domain のみに依存
- infrastructure は domain, application に依存
- presentation は application に依存

**違反検出方法**: 各レイヤーの import 文を確認し、上記ルールに反するものがあれば即座に修正

## 境界づけられたコンテキスト (Bounded Context)

### コンテキスト一覧

- `publishing`: 記事の執筆・公開
- `identity`: 認証・権限管理
- `taxonomy`: タグ・カテゴリ管理
- `shared-kernel`: コンテキスト共通の値オブジェクト

### コンテキスト間通信ルール

**禁止**: コンテキスト間の直接参照

```typescript
// ❌ NG: publishing から identity の domain を直接参照
import { User } from "@/contexts/identity/domain/User";
```

**OK**: shared-kernel 経由での参照

```typescript
// ✅ OK: shared-kernel の値オブジェクトを使用
import { UserId } from "@/contexts/shared-kernel/UserId";

export class Article {
  constructor(
    private readonly authorId: UserId, // shared-kernel の値オブジェクト
  ) {}
}
```

**OK**: アプリケーション層でのオーケストレーション

```typescript
// ✅ OK: application 層で複数コンテキストを調整
export class PublishArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly userRepository: IUserRepository, // identity context
  ) {}

  async execute(input: PublishArticleInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    const article = await this.articleRepository.findById(input.articleId);

    if (!user.canPublish()) {
      throw new ApplicationError("公開権限がありません");
    }

    article.publish();
    await this.articleRepository.save(article);
  }
}
```

## マルチテナント設計

### 全エンティティに tenantId を持たせる

**理由**: 将来の企業向け拡張に備え、初期段階からマルチテナント前提で設計

**実装ルール**:

- すべての集約ルートに `tenantId: TenantId` を持たせる
- 個人ブログ期間中は固定値 (例: `PERSONAL_TENANT_ID`) を使用
- すべてのクエリに `WHERE tenant_id = ?` を含める
- Prisma スキーマの全テーブルに `tenant_id` カラムを追加

**OK例**:

```typescript
// src/contexts/shared-kernel/TenantId.ts
export class TenantId {
  private constructor(private readonly value: string) {}

  static personal(): TenantId {
    return new TenantId("00000000000000000000000000");
  }

  static fromString(value: string): TenantId {
    if (value.length !== 26) throw new Error("Invalid tenant ID");
    return new TenantId(value);
  }
}

// src/contexts/publishing/domain/Article.ts
export class Article {
  constructor(
    private readonly id: ArticleId,
    private readonly tenantId: TenantId, // 必須
    private title: ArticleTitle,
  ) {}
}
```

**Prisma スキーマ例**:

```prisma
model Article {
  id        String   @id
  tenantId  String   @map("tenant_id")
  title     String

  @@index([tenantId])
  @@map("articles")
}
```

## ID 採番ルール

### ULID を値オブジェクトでラップ

**理由**:

- ソート可能 (作成日時順)
- UUID より短い (26文字)
- 衝突確率が極めて低い

**実装**:

```typescript
// src/contexts/shared-kernel/EntityId.ts
import { ulid } from "ulid";

export abstract class EntityId {
  protected constructor(protected readonly value: string) {
    if (!this.isValidUlid(value)) {
      throw new Error(`Invalid ULID: ${value}`);
    }
  }

  private isValidUlid(value: string): boolean {
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(value);
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

// src/contexts/publishing/domain/ArticleId.ts
export class ArticleId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static generate(): ArticleId {
    return new ArticleId(ulid());
  }

  static fromString(value: string): ArticleId {
    return new ArticleId(value);
  }
}
```

## ディレクトリ構造の厳守

```
src/contexts/{context}/
├── domain/
│   ├── {aggregate}/
│   │   ├── {Aggregate}.ts        # 集約ルート
│   │   ├── {ValueObject}.ts      # 値オブジェクト
│   │   └── {Aggregate}.test.ts   # テスト
│   ├── I{Aggregate}Repository.ts # リポジトリインターフェース
│   └── {Domain}Service.ts        # ドメインサービス
├── application/
│   ├── {UseCase}.ts
│   └── {UseCase}.test.ts
└── infrastructure/
    ├── Prisma{Aggregate}Repository.ts
    └── Prisma{Aggregate}Repository.integration.test.ts
```

## セルフチェックリスト

コード作成時、以下を必ず確認:

- [ ] domain 層に外部ライブラリの import がないか
- [ ] application 層が infrastructure に依存していないか
- [ ] presentation 層が domain を直接参照していないか
- [ ] コンテキスト間で直接参照していないか
- [ ] すべてのエンティティに tenantId があるか
- [ ] ID は ULID ベースの値オブジェクトか
- [ ] 依存方向が逆転していないか
