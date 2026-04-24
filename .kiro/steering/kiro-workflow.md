# Kiro ワークフロー — AIDLC × TDD

このファイルは、Kiro (私) が作業する際の標準手順を定義します。

## 機能追加時の進行フロー

### ステップ1: 仕様書の確認

**実行内容**:

- `.kiro/specs/` 配下の仕様書を確認
- 要件が曖昧な場合は人間に質問

**確認項目**:

- [ ] 機能の目的は明確か
- [ ] 受け入れ条件は定義されているか
- [ ] 境界づけられたコンテキストは特定されているか
- [ ] 依存する他の機能はあるか

**OK例**:

```
仕様書を確認しました。
- 機能: 記事の公開機能
- コンテキスト: publishing
- 受け入れ条件: 下書き記事を公開状態に変更できる
- 前提条件: 記事作成機能が実装済み

次のステップに進みます。
```

**NG例**:

```
仕様書を確認せずに実装を開始 ❌
```

### ステップ2: 対象コンテキストの特定

**実行内容**:

- 機能がどの境界づけられたコンテキストに属するか特定
- 複数コンテキストに跨る場合、調整方法を検討

**コンテキスト一覧**:

- `publishing`: 記事の執筆・公開
- `identity`: 認証・権限管理
- `taxonomy`: タグ・カテゴリ管理
- `shared-kernel`: コンテキスト共通の値オブジェクト

**OK例**:

```
対象コンテキスト: publishing
関連コンテキスト: identity (著者情報の参照)

publishing コンテキストで実装し、
identity コンテキストの UserId を shared-kernel 経由で参照します。
```

### ステップ3: ドメインモデルの洗い出し

**実行内容**:

- 必要な値オブジェクトをリストアップ
- 集約とエンティティを特定
- ユースケースを定義

**テンプレート**:

```
【値オブジェクト】
- ArticleId (ULID)
- ArticleTitle (1-100文字)
- ArticleContent (1文字以上)
- ArticleStatus (draft | published)

【集約】
- Article (集約ルート)
  - id: ArticleId
  - tenantId: TenantId
  - title: ArticleTitle
  - content: ArticleContent
  - status: ArticleStatus
  - authorId: UserId (shared-kernel)

【ユースケース】
- PublishArticleUseCase
  - 入力: articleId
  - 処理: 記事を公開状態に変更
  - 出力: void
  - イベント: ArticlePublished
```

### ステップ4: テストコードの生成 (Red 状態で停止)

**重要**: **実装より先にテストを書く**

**実行順序** (Inside-Out):

1. 値オブジェクトのテスト
2. 集約のテスト
3. ユースケースのテスト
4. リポジトリのテスト (統合)

**生成後の動作**:

```
テストコードを生成しました。

生成ファイル:
- src/contexts/publishing/domain/article/ArticleTitle.test.ts
- src/contexts/publishing/domain/article/ArticleStatus.test.ts
- src/contexts/publishing/domain/article/Article.test.ts
- src/contexts/publishing/application/PublishArticleUseCase.test.ts

現在、すべてのテストは Red (失敗) 状態です。
レビュー完了後、実装に進みます。

次のステップに進んでよろしいですか？
```

**禁止事項**:

- ❌ テストと実装を同時に生成
- ❌ 人間の承認なしで実装に進む
- ❌ テストなしで実装

### ステップ5: 人間の承認待ち

**実行内容**:

- テストコードのレビューを待つ
- 修正指示があれば対応
- 承認後、次のステップへ

**人間への確認事項**:

- テストケースは網羅的か
- テスト名は明確か
- AAA パターンに従っているか
- 必須テスト (等価性・不変性・バリデーション) が含まれているか

### ステップ6: 最小実装で Green にする

**実行内容**:

- テストを通す最小限の実装
- 過剰な実装は避ける

**実装順序** (Inside-Out):

1. 値オブジェクト
2. 集約
3. ユースケース
4. リポジトリ実装

**OK例**:

```typescript
// 最小実装
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
}
```

**NG例**:

```typescript
// ❌ 過剰な実装 (YAGNI 違反)
export class ArticleTitle {
  // ... 基本実装 ...

  // まだ必要ない機能
  toUpperCase(): ArticleTitle {
    /* ... */
  }
  toLowerCase(): ArticleTitle {
    /* ... */
  }
  truncate(length: number): ArticleTitle {
    /* ... */
  }
}
```

### ステップ7: DDD 原則に沿ったリファクタ

**実行内容**:

- コードの重複を排除
- 意図を明確にする命名
- 不変条件の保護を強化

**チェック項目**:

- [ ] domain 層に外部ライブラリの import がないか
- [ ] 値オブジェクトは不変か
- [ ] 集約ルート経由でのみ状態変更しているか
- [ ] ドメインイベントは適切に発行されているか
- [ ] リポジトリインターフェースは domain に、実装は infrastructure にあるか

**リファクタ例**:

```typescript
// Before
export class Article {
  publish(): void {
    if (this.title.toString().length === 0) {
      throw new DomainError("タイトルが空です");
    }
    if (this.content.toString().length === 0) {
      throw new DomainError("本文が空です");
    }
    this.status = ArticleStatus.published();
  }
}

// After (リファクタ)
export class Article {
  publish(): void {
    if (!this.canPublish()) {
      throw new DomainError("公開条件を満たしていません");
    }
    this.status = ArticleStatus.published();
    this.publishedAt = new Date();
    this.domainEvents.push(
      new ArticlePublished(this.id, this.tenantId, this.publishedAt),
    );
  }

  private canPublish(): boolean {
    return this.title.isValid() && this.content.isValid();
  }
}
```

### ステップ8: 統合テスト・E2E 追加

**統合テスト** (infrastructure 層):

```typescript
// src/contexts/publishing/infrastructure/PrismaArticleRepository.integration.test.ts
describe("PrismaArticleRepository (統合テスト)", () => {
  it("記事を保存し、取得できる", async () => {
    const article = Article.create(/* ... */);
    await repository.save(article);
    const found = await repository.findById(article.id);
    expect(found).not.toBeNull();
  });
});
```

**E2E テスト** (tests/e2e/):

```typescript
// tests/e2e/article-publish.spec.ts
test("下書き記事を公開できる", async ({ page }) => {
  await page.goto("/admin/articles/new");
  await page.fill('input[name="title"]', "テスト記事");
  await page.click('button:has-text("公開")');
  await expect(page.locator("text=公開しました")).toBeVisible();
});
```

### ステップ9: Server Action 経由で UI 層と接続

**実行内容**:

- Zod スキーマの定義 (プレゼンテーション層)
- Server Action の実装
- UI コンポーネントとの接続

**OK例**:

```typescript
// src/schemas/article.ts
import { z } from 'zod';

export const publishArticleInputSchema = z.object({
  articleId: z.string().length(26),
});

// src/presentation/actions/publishArticle.ts
'use server';
import { publishArticleInputSchema } from '@/schemas/article';
import { PublishArticleUseCase } from '@/contexts/publishing/application/PublishArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';

export async function publishArticle(formData: FormData) {
  const input = publishArticleInputSchema.parse({
    articleId: formData.get('articleId'),
  });

  const articleId = ArticleId.fromString(input.articleId);
  const useCase = new PublishArticleUseCase(/* DI */);
  await useCase.execute({ articleId });
}

// app/(admin)/articles/[id]/page.tsx
import { publishArticle } from '@/presentation/actions/publishArticle';

export default function ArticlePage({ params }: { params: { id: string } }) {
  return (
    <form action={publishArticle}>
      <input type="hidden" name="articleId" value={params.id} />
      <button type="submit">公開</button>
    </form>
  );
}
```

## コード生成時のセルフチェックリスト

各ステップ完了時、以下を確認:

### Domain 層

- [ ] 外部ライブラリの import がないか
- [ ] 値オブジェクトは不変か
- [ ] 値オブジェクトに等価性メソッドがあるか
- [ ] エンティティの同一性判定は ID で行っているか
- [ ] 集約ルート経由でのみ状態変更しているか
- [ ] ドメインイベントは過去形で命名されているか

### Application 層

- [ ] domain のみに依存しているか
- [ ] ビジネスロジックを domain に委譲しているか
- [ ] トランザクション境界は適切か

### Infrastructure 層

- [ ] リポジトリインターフェースは domain に定義されているか
- [ ] PrismaClient はシングルトンパターンか
- [ ] すべてのクエリに tenantId フィルタがあるか

### Presentation 層

- [ ] application のみに依存しているか
- [ ] Zod でバリデーションしているか
- [ ] ドメインオブジェクトに変換しているか

### テスト

- [ ] テストを実装より先に書いたか
- [ ] 値オブジェクトに必須3テスト (等価性・不変性・バリデーション) があるか
- [ ] 集約に必須テスト (状態遷移・不変条件・ドメインイベント) があるか
- [ ] テスト名は日本語で「〜のとき、〜する」形式か
- [ ] AAA パターンに従っているか

## ソース生成後のリンター必須実行ルール

### 絶対ルール

**ソースコード (`.ts`, `.tsx`) を生成・編集したら、必ずリンターを実行し、違反が 0 になるまで修正する**

### 実行手順

1. ファイルを生成・編集する
2. `getDiagnostics` で対象ファイルの問題を確認する
3. 問題が報告された場合、すべて修正する
4. 再度 `getDiagnostics` で問題が 0 であることを確認する
5. 問題が残っている場合、ステップ 3-4 を繰り返す

### 対象

- 新規作成したすべての `.ts` / `.tsx` ファイル
- 編集したすべての `.ts` / `.tsx` ファイル
- テストファイル (`*.test.ts`, `*.integration.test.ts`) も対象

### 確認タイミング

| タイミング                       | 必須 |
| -------------------------------- | ---- |
| テストコード生成後 (ステップ4)   | ✅   |
| 実装コード生成後 (ステップ6)     | ✅   |
| リファクタ後 (ステップ7)         | ✅   |
| 統合テスト追加後 (ステップ8)     | ✅   |
| Server Action 実装後 (ステップ9) | ✅   |

### 修正の優先順位

1. **error**: 即座に修正 (ビルドが通らない)
2. **warning**: 原則修正 (正当な理由がある場合のみスキップ可)

### 禁止事項

- ❌ リンターを実行せずに次のステップに進む
- ❌ エラーを残したまま人間にレビューを依頼する
- ❌ `// @ts-ignore` や `// eslint-disable` で警告を握りつぶす (正当な理由がない限り)

**OK例**:

```
ファイルを生成しました。リンターを実行します。

getDiagnostics 結果:
- src/contexts/publishing/domain/article/ArticleTitle.ts: 2 errors

修正を行います...

再度 getDiagnostics 結果:
- src/contexts/publishing/domain/article/ArticleTitle.ts: 0 errors ✅

リンター違反なし。次のステップに進みます。
```

**NG例**:

```
ファイルを生成しました。次のステップに進みます。 ❌
(リンター未実行)
```

## 「わからない・曖昧」な場合の対応

### 質問すべき状況

以下の場合、実装せず人間に質問:

1. **要件が曖昧**
   - 「公開」の定義が不明
   - バリデーションルールが未定義
   - エラーハンドリングの方針が不明

2. **技術的判断が必要**
   - 集約の境界が不明確
   - パフォーマンス要件が不明
   - セキュリティ要件が不明

3. **既存コードとの整合性**
   - 既存の命名規則と異なる
   - 既存のアーキテクチャと矛盾

**質問例**:

```
質問があります。

仕様書に「記事を公開する」とありますが、以下が不明です:
1. 公開時に通知を送る必要がありますか？
2. 公開後に編集可能ですか？
3. 公開の取り消し (非公開化) は可能ですか？

これらの要件を教えてください。
```

## ステアリングファイル違反時の対応

### 違反を検出した場合

人間から既存のステアリングファイルに違反する指示を受けた場合:

1. **違反箇所を指摘**
2. **理由を説明**
3. **代替案を提示**
4. **人間の最終判断を仰ぐ**

**対応例**:

```
指示内容を確認しました。

ただし、以下の点でステアリングファイルに違反しています:

【違反内容】
- domain 層で Prisma を使用する指示
- 違反ファイル: architecture.md
- 違反ルール: "domain 層は外部ライブラリに依存しない"

【理由】
domain 層が Prisma に依存すると、以下の問題が発生します:
1. ドメインロジックのテストが困難
2. 技術的詳細とビジネスロジックの混在
3. 将来の ORM 変更時に domain 層も修正が必要

【代替案】
- リポジトリインターフェースを domain に定義
- Prisma を使った実装を infrastructure に配置
- DI でリポジトリを注入

この代替案で進めてよろしいですか？
それとも、ステアリングファイルを更新しますか？
```

## コミットメッセージ規約

### Conventional Commits

**形式**:

```
<type>(<scope>): <subject>
                                ← 空行
<body>
                                ← 空行
<footer>
```

### type 一覧

| type       | 用途                                  |
| ---------- | ------------------------------------- |
| `feat`     | 新機能                                |
| `fix`      | バグ修正                              |
| `refactor` | リファクタリング (機能変更なし)       |
| `test`     | テスト追加・修正                      |
| `docs`     | ドキュメント                          |
| `chore`    | ビルド・設定変更                      |
| `style`    | コードフォーマット (ロジック変更なし) |
| `perf`     | パフォーマンス改善                    |
| `ci`       | CI/CD 設定変更                        |

### scope 一覧

境界づけられたコンテキストまたはレイヤーを指定:

| scope           | 対象                               |
| --------------- | ---------------------------------- |
| `publishing`    | 記事の執筆・公開コンテキスト       |
| `identity`      | 認証・権限コンテキスト             |
| `taxonomy`      | タグ・カテゴリコンテキスト         |
| `shared-kernel` | 共通値オブジェクト                 |
| `ui`            | UI コンポーネント・ページ          |
| `infra`         | インフラ設定 (Prisma, Supabase 等) |
| `ci`            | CI/CD パイプライン                 |
| `deps`          | 依存パッケージ更新                 |

scope が複数に跨る場合はカンマ区切り: `feat(publishing,taxonomy): ...`

### subject ルール

- **言語**: 日本語
- **文字数**: 50文字以内
- **末尾**: 句点 (。) を付けない
- **文体**: 体言止めまたは動詞終止形 (「〜を追加」「〜を修正」)

### body ルール

- **言語**: 日本語
- **内容**: 変更の理由・背景・影響範囲
- **形式**: 箇条書き推奨
- **1行**: 72文字以内で折り返し
- **省略可**: subject だけで十分な場合

### footer ルール

- **Breaking Change**: `BREAKING CHANGE: <説明>` を記述
- **Issue 参照**: `Refs: #123` または `Closes: #123`

### コミット粒度

**1コミット = 1論理変更**

**OK例**:

```
# コミット1: テスト
test(publishing): ArticleTitle 値オブジェクトのテストを追加

- 等価性テスト
- 不変性テスト
- バリデーションテスト (空文字、101文字以上)

# コミット2: 実装
feat(publishing): ArticleTitle 値オブジェクトを実装

- fromString ファクトリメソッド
- equals, toString メソッド
- 1-100文字のバリデーション
```

**NG例**:

```
# ❌ 複数の論理変更を1コミットに混ぜる
feat(publishing): ArticleTitle と ArticleStatus と Article を実装

# ❌ type がない
update code

# ❌ scope がない
fix: バグ修正

# ❌ subject が曖昧
feat(publishing): 修正

# ❌ subject が長すぎる (50文字超)
feat(publishing): ArticleTitle値オブジェクトにバリデーションとファクトリメソッドと等価性判定を追加して単体テストも書いた
```

### Breaking Change の記法

**形式**:

```
feat(identity)!: 認証方式を JWT から Supabase Auth に変更

Supabase Auth (@supabase/ssr) に統一

BREAKING CHANGE: 既存の JWT トークンは無効になる。
全ユーザーの再ログインが必要。
```

- subject の scope 後に `!` を付ける
- footer に `BREAKING CHANGE:` で詳細を記述

### Kiro がコミットメッセージを提案する場合

コード変更後、以下の形式で提案:

```
コミットメッセージの提案:

---
feat(publishing): 記事公開機能を追加

- Article 集約に publish メソッドを追加
- PublishArticleUseCase を実装
- ArticlePublished ドメインイベントを追加

Refs: #12
---

このメッセージでよろしいですか？
```

## 作業完了時の報告

### 簡潔な報告

**OK例**:

```
記事公開機能を実装しました。

実装内容:
- ArticleTitle, ArticleStatus 値オブジェクト
- Article 集約の publish メソッド
- PublishArticleUseCase
- PrismaArticleRepository
- publishArticle Server Action

テスト: 全て Green (カバレッジ 98%)
```

**NG例**:

```
記事公開機能の実装が完了しました！

今回の実装では、まず ArticleTitle という値オブジェクトを作成し、
これは1文字以上100文字以内という制約を持っています。
次に ArticleStatus を実装し、draft と published の2つの状態を...
(長すぎる説明が続く) ❌
```

## まとめ

Kiro (私) は以下の原則に従って作業します:

1. **仕様書を必ず確認**
2. **テストを実装より先に書く**
3. **人間の承認を待つ**
4. **Inside-Out で開発**
5. **DDD 原則を厳守**
6. **ソース生成後は必ずリンターを実行し、違反 0 まで修正**
7. **わからない場合は質問**
8. **ステアリング違反は指摘**
9. **簡潔に報告**

これらのルールを守ることで、高品質なコードを効率的に生成します。
