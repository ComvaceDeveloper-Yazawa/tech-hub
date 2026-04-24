# DDD 実装ルール

## 値オブジェクト (Value Object)

### 必須要件

1. **不変性**: 一度作成したら変更不可
2. **等価性**: 値が同じなら同一とみなす
3. **自己検証**: コンストラクタでバリデーション

### 実装パターン

**OK例**:

```typescript
// src/contexts/publishing/domain/article/ArticleTitle.ts
export class ArticleTitle {
  private constructor(private readonly value: string) {
    if (value.length === 0) {
      throw new DomainError("タイトルは必須です");
    }
    if (value.length > 100) {
      throw new DomainError("タイトルは100文字以内です");
    }
  }

  static fromString(value: string): ArticleTitle {
    return new ArticleTitle(value.trim());
  }

  equals(other: ArticleTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  // 値オブジェクトは不変なので、変更は新しいインスタンスを返す
  changePrefix(prefix: string): ArticleTitle {
    return new ArticleTitle(`${prefix}${this.value}`);
  }
}
```

**NG例**:

```typescript
// ❌ setter がある (不変性違反)
export class ArticleTitle {
  constructor(private value: string) {}

  setValue(value: string): void {
    this.value = value; // NG!
  }
}

// ❌ バリデーションがない (自己検証違反)
export class ArticleTitle {
  constructor(public readonly value: string) {} // そのまま受け入れている
}

// ❌ プリミティブ型を直接使用
export class Article {
  constructor(private title: string) {} // NG! ArticleTitle を使うべき
}
```

### 値オブジェクトを使うべき場面

- メールアドレス、URL、電話番号
- 金額、数量
- 日付範囲
- ステータス、列挙型
- ID (ULID ラップ)

## エンティティ (Entity)

### 定義

- 同一性 (Identity) を持つオブジェクト
- ライフサイクルを通じて追跡される
- ID が同じなら同一とみなす

**OK例**:

```typescript
// src/contexts/publishing/domain/article/Article.ts
export class Article {
  private constructor(
    private readonly id: ArticleId,
    private readonly tenantId: TenantId,
    private title: ArticleTitle,
    private content: ArticleContent,
    private status: ArticleStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  // ファクトリメソッド
  static create(
    id: ArticleId,
    tenantId: TenantId,
    title: ArticleTitle,
    content: ArticleContent,
  ): Article {
    return new Article(
      id,
      tenantId,
      title,
      content,
      ArticleStatus.draft(),
      new Date(),
      new Date(),
    );
  }

  // 同一性の判定は ID で行う
  equals(other: Article): boolean {
    return this.id.equals(other.id);
  }

  // 状態変更メソッド
  updateTitle(newTitle: ArticleTitle): void {
    this.title = newTitle;
    this.updatedAt = new Date();
  }
}
```

## 集約 (Aggregate)

### 集約の境界

**集約ルート**: 集約の入り口となるエンティティ
**集約内エンティティ**: 集約ルート経由でのみアクセス可能

**ルール**:

1. 集約の外部から集約内のエンティティに直接アクセス禁止
2. 集約ルート経由でのみ状態変更
3. トランザクション境界 = 集約境界
4. 集約間の参照は ID のみ

**OK例**:

```typescript
// src/contexts/publishing/domain/article/Article.ts (集約ルート)
export class Article {
  private readonly comments: Comment[] = []; // 集約内エンティティ

  // ✅ 集約ルート経由でコメント追加
  addComment(content: CommentContent, authorId: UserId): void {
    if (this.status.isDraft()) {
      throw new DomainError("下書き記事にはコメントできません");
    }

    const comment = Comment.create(CommentId.generate(), content, authorId);

    this.comments.push(comment);
  }

  // ✅ 不変条件の保護
  deleteComment(commentId: CommentId): void {
    const index = this.comments.findIndex((c) => c.id.equals(commentId));
    if (index === -1) {
      throw new DomainError("コメントが見つかりません");
    }
    this.comments.splice(index, 1);
  }
}

// src/contexts/publishing/domain/article/Comment.ts (集約内エンティティ)
export class Comment {
  private constructor(
    private readonly id: CommentId,
    private content: CommentContent,
    private readonly authorId: UserId,
    private readonly createdAt: Date,
  ) {}

  static create(
    id: CommentId,
    content: CommentContent,
    authorId: UserId,
  ): Comment {
    return new Comment(id, content, authorId, new Date());
  }
}
```

**NG例**:

```typescript
// ❌ 集約外から直接操作
const article = await articleRepository.findById(articleId);
article.comments.push(new Comment(...)); // NG! 不変条件を破壊する可能性

// ❌ 集約を跨いだトランザクション
const article = await articleRepository.findById(articleId);
const user = await userRepository.findById(userId);
article.publish();
user.incrementArticleCount();
await articleRepository.save(article);
await userRepository.save(user); // NG! 2つの集約を同時に更新
```

### 集約サイズの目安

- 小さく保つ (1集約 = 1-3エンティティ)
- 大きすぎる場合は集約を分割
- パフォーマンスとトランザクション整合性のバランス

## リポジトリ (Repository)

### インターフェースと実装の分離

**ルール**:

- インターフェースは domain に配置
- 実装は infrastructure に配置
- 集約単位でリポジトリを作成

**OK例**:

```typescript
// src/contexts/publishing/domain/IArticleRepository.ts
export interface IArticleRepository {
  findById(id: ArticleId): Promise<Article | null>;
  findByTenantId(tenantId: TenantId): Promise<Article[]>;
  save(article: Article): Promise<void>;
  delete(id: ArticleId): Promise<void>;
}

// src/contexts/publishing/infrastructure/PrismaArticleRepository.ts
import { IArticleRepository } from "../domain/IArticleRepository";

export class PrismaArticleRepository implements IArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: ArticleId): Promise<Article | null> {
    const row = await this.prisma.article.findUnique({
      where: { id: id.toString() },
      include: { comments: true },
    });

    if (!row) return null;

    return this.toDomain(row);
  }

  async save(article: Article): Promise<void> {
    const data = this.toPersistence(article);
    await this.prisma.article.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  private toDomain(row: any): Article {
    // Prisma の結果をドメインオブジェクトに変換
  }

  private toPersistence(article: Article): any {
    // ドメインオブジェクトを Prisma 用データに変換
  }
}
```

**NG例**:

```typescript
// ❌ domain 層にリポジトリ実装を置く
// src/contexts/publishing/domain/ArticleRepository.ts
import { PrismaClient } from '@prisma/client'; // NG!

export class ArticleRepository {
  async save(article: Article): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.article.create({...}); // NG!
  }
}
```

### リポジトリメソッドの命名規則

- `findById(id)`: 単一取得
- `findBy{Condition}(...)`: 条件検索
- `save(entity)`: 作成/更新
- `delete(id)`: 削除
- `exists(id)`: 存在確認

## ドメインイベント (Domain Event)

### 定義

- 集約内で発生した重要な出来事
- 過去形で命名 (ArticlePublished, CommentAdded)
- 不変オブジェクト

**OK例**:

```typescript
// src/contexts/publishing/domain/article/ArticlePublished.ts
export class ArticlePublished {
  constructor(
    public readonly articleId: ArticleId,
    public readonly tenantId: TenantId,
    public readonly publishedAt: Date,
  ) {}
}

// src/contexts/publishing/domain/article/Article.ts
export class Article {
  private domainEvents: DomainEvent[] = [];

  publish(): void {
    if (!this.canPublish()) {
      throw new DomainError("公開条件を満たしていません");
    }

    this.status = ArticleStatus.published();
    this.publishedAt = new Date();

    // ドメインイベントを記録
    this.domainEvents.push(
      new ArticlePublished(this.id, this.tenantId, this.publishedAt),
    );
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
```

### イベントハンドリング

**application 層で処理**:

```typescript
// src/contexts/publishing/application/PublishArticleUseCase.ts
export class PublishArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: PublishArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(input.articleId);

    article.publish(); // イベント発行

    await this.articleRepository.save(article);

    // イベントを外部に通知
    const events = article.getDomainEvents();
    await this.eventPublisher.publishAll(events);
    article.clearDomainEvents();
  }
}
```

## ドメインサービス (Domain Service)

### 使用条件

- 複数の集約を跨ぐロジック
- どの集約にも属さないビジネスルール
- 値オブジェクトやエンティティに置くと不自然な処理

**OK例**:

```typescript
// src/contexts/publishing/domain/ArticleDuplicationCheckService.ts
export class ArticleDuplicationCheckService {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async isDuplicate(title: ArticleTitle, tenantId: TenantId): boolean {
    const articles = await this.articleRepository.findByTitle(title, tenantId);
    return articles.length > 0;
  }
}

// 使用例
const service = new ArticleDuplicationCheckService(articleRepository);
if (await service.isDuplicate(title, tenantId)) {
  throw new DomainError("同じタイトルの記事が既に存在します");
}
```

**NG例**:

```typescript
// ❌ 単一集約内で完結するロジックをサービスに置く
export class ArticlePublishService {
  publish(article: Article): void {
    article.publish(); // これは Article のメソッドにすべき
  }
}
```

## 禁止事項

### 1. ドメイン貧血症 (Anemic Domain Model)

**NG例**:

```typescript
// ❌ ロジックのないデータクラス
export class Article {
  id: string;
  title: string;
  status: string;
}

// ❌ ロジックがサービスに集中
export class ArticleService {
  publish(article: Article): void {
    if (article.title.length === 0) {
      throw new Error("タイトルが空です");
    }
    article.status = "published";
  }
}
```

**OK例**:

```typescript
// ✅ ロジックをドメインオブジェクトに配置
export class Article {
  publish(): void {
    if (!this.canPublish()) {
      throw new DomainError("公開条件を満たしていません");
    }
    this.status = ArticleStatus.published();
  }

  private canPublish(): boolean {
    return this.title.isValid() && this.content.isValid();
  }
}
```

### 2. Getter/Setter の濫用

**NG例**:

```typescript
// ❌ すべてのフィールドに getter/setter
export class Article {
  private status: string;

  getStatus(): string {
    return this.status;
  }

  setStatus(status: string): void {
    this.status = status; // 不変条件のチェックなし
  }
}
```

**OK例**:

```typescript
// ✅ 意味のあるメソッド名
export class Article {
  private status: ArticleStatus;

  publish(): void {
    if (!this.canPublish()) {
      throw new DomainError("公開できません");
    }
    this.status = ArticleStatus.published();
  }

  isPublished(): boolean {
    return this.status.isPublished();
  }
}
```

### 3. ドメイン層からの外部ライブラリ呼び出し

**NG例**:

```typescript
// ❌ domain 層で Prisma を使用
import { PrismaClient } from '@prisma/client';

export class Article {
  async save(): Promise<void> {
    const prisma = new PrismaClient();
    await prisma.article.create({...}); // NG!
  }
}

// ❌ domain 層で Zod を使用
import { z } from 'zod';

export class ArticleTitle {
  constructor(value: string) {
    z.string().min(1).max(100).parse(value); // NG!
  }
}
```

**OK例**:

```typescript
// ✅ domain 層は純粋な TypeScript のみ
export class ArticleTitle {
  private constructor(private readonly value: string) {
    if (value.length === 0 || value.length > 100) {
      throw new DomainError("タイトルは1-100文字です");
    }
  }
}
```

## セルフチェックリスト

- [ ] 値オブジェクトは不変か
- [ ] 値オブジェクトに等価性メソッドがあるか
- [ ] 値オブジェクトはコンストラクタでバリデーションしているか
- [ ] エンティティの同一性判定は ID で行っているか
- [ ] 集約外から集約内エンティティに直接アクセスしていないか
- [ ] リポジトリインターフェースは domain に、実装は infrastructure にあるか
- [ ] ドメインイベントは過去形で命名されているか
- [ ] ドメインサービスは本当に必要か (集約に置けないか)
- [ ] domain 層に外部ライブラリの import がないか
- [ ] getter/setter ではなく意味のあるメソッド名を使っているか
