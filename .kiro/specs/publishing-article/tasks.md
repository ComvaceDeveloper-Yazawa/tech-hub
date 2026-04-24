# 実装計画: Publishing Context — 記事機能

## 概要

Inside-Out TDD アプローチに基づき、shared-kernel の基盤 → 値オブジェクト → 集約 → エンティティ → ドメインイベント → リポジトリインターフェース → ユースケース → インフラ層 → プレゼンテーション層の順で実装する。各ステップではテストを先に書き (Red)、最小実装で通し (Green)、リファクタする。

## Tasks

- [x] 0. プロジェクト初期セットアップとデプロイ検証
  - [x] 0.1 Next.js 15 プロジェクトを作成し、TypeScript strict モードを設定する
    - `npx create-next-app@latest` (App Router, TypeScript, Tailwind CSS, ESLint)
    - `tsconfig.json` — strict: true, noUncheckedIndexedAccess: true
    - ディレクトリ構造の作成 (src/contexts/, src/presentation/, src/schemas/, src/components/, src/lib/)
  - [x] 0.2 Prisma を初期設定し、Supabase DB への接続を確認する
    - `prisma/schema.prisma` — datasource (DATABASE_URL + DIRECT_URL)、generator
    - `src/lib/prisma.ts` — PrismaClient シングルトンパターン
    - `.env` — DATABASE_URL (pgBouncer 6543)、DIRECT_URL (直接 5432)
    - `npx prisma db push` で接続確認
  - [x] 0.3 Supabase Auth (@supabase/ssr) の初期設定を行う
    - `src/lib/supabase/server.ts` — Server Components / Server Actions 用クライアント
    - `src/lib/supabase/client.ts` — Client Components 用クライアント
    - `middleware.ts` — セッション更新ミドルウェア
    - `.env` — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [x] 0.4 開発ツールチェーンを設定する
    - `.oxlintrc.json` — oxlint 設定
    - `.prettierrc` — Prettier + prettier-plugin-tailwindcss
    - `vitest.config.ts` — Vitest 設定 (カバレッジ閾値含む)
    - `playwright.config.ts` — Playwright 設定 (tests/e2e/)
    - `package.json` — scripts (postinstall, build, test, test:e2e, test:coverage)
  - [x] 0.5 Vercel へデプロイし、ビルド成功と DB 接続を検証する
    - `vercel.json` — buildCommand, framework, regions
    - Vercel Dashboard で環境変数を設定
    - `prisma generate && next build` がエラーなく完了することを確認
    - デプロイ後のヘルスチェック (トップページ表示 + DB 接続確認用 API Route)
  - [x] 0.6 src/lib/cn.ts ヘルパーを作成する
    - `src/lib/cn.ts` — clsx + tailwind-merge

- [x] 1. shared-kernel 基盤の実装
  - [x] 1.1 EntityId 基底クラス、DomainError、DomainEvent 型、Pagination 型を作成する
    - `src/contexts/shared-kernel/EntityId.ts` — ULID バリデーション付き抽象クラス
    - `src/contexts/shared-kernel/DomainError.ts` — ドメインエラー基底クラス
    - `src/contexts/shared-kernel/DomainEvent.ts` — ドメインイベント基底型
    - `src/contexts/shared-kernel/Pagination.ts` — PaginationParams, PaginatedResult 型定義
    - _Requirements: 11.9, 9.6_
  - [x] 1.2 TenantId、UserId、TagId 値オブジェクトを作成する
    - `src/contexts/shared-kernel/TenantId.ts` — personal() ファクトリ付き
    - `src/contexts/shared-kernel/UserId.ts` — EntityId 継承
    - `src/contexts/shared-kernel/TagId.ts` — EntityId 継承
    - _Requirements: 12.3_
  - [ ]\* 1.3 EntityId のプロパティベーステストを作成する
    - **Property 15: ArticleId の ULID バリデーション** (EntityId 基底クラスのバリデーションロジックを検証)
    - **Validates: Requirement 11.9**

- [x] 2. 値オブジェクト (ArticleId, ArticleTitle, ArticleContent, ArticleStatus) の実装
  - [x] 2.1 ArticleId を作成する
    - `src/contexts/publishing/domain/article/ArticleId.ts` — EntityId 継承、generate() / fromString()
    - _Requirements: 11.9_
  - [x] 2.2 ArticleTitle のテストと実装を作成する
    - `src/contexts/publishing/domain/article/ArticleTitle.test.ts` — 等価性・不変性・バリデーション (空文字、101文字、トリム)
    - `src/contexts/publishing/domain/article/ArticleTitle.ts` — 1〜100文字、前後空白トリム
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ]\* 2.3 ArticleTitle のプロパティベーステストを作成する
    - **Property 13: ArticleTitle のバリデーション**
    - **Validates: Requirements 11.1, 11.2, 11.3**
  - [x] 2.4 ArticleContent のテストと実装を作成する
    - `src/contexts/publishing/domain/article/ArticleContent.test.ts` — 等価性・不変性・空文字許容・charCount
    - `src/contexts/publishing/domain/article/ArticleContent.ts` — 空文字許容、isEmpty()、charCount()
    - _Requirements: 3.2, 3.3_
  - [x] 2.5 ArticleStatus のテストと実装を作成する
    - `src/contexts/publishing/domain/article/ArticleStatus.test.ts` — 等価性・状態遷移・不変性
    - `src/contexts/publishing/domain/article/ArticleStatus.ts` — draft / published、isDraft() / isPublished()
    - _Requirements: 3.1, 3.4, 4.1, 4.2_

- [x] 3. 値オブジェクト (Slug, ViewCount, LikeCount) の実装
  - [x] 3.1 Slug のテストと実装を作成する
    - `src/contexts/publishing/domain/article/Slug.test.ts` — 等価性・不変性・バリデーション (英小文字・数字・ハイフン、先頭末尾ハイフン不可、連続ハイフン不可、1〜200文字)
    - `src/contexts/publishing/domain/article/Slug.ts` — 正規表現 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
    - _Requirements: 11.4, 11.5, 11.6_
  - [ ]\* 3.2 Slug のプロパティベーステストを作成する
    - **Property 14: Slug のバリデーション**
    - **Validates: Requirements 11.4, 11.5, 11.6**
  - [x] 3.3 ViewCount のテストと実装を作成する
    - `src/contexts/publishing/domain/article/ViewCount.test.ts` — 等価性・不変性・バリデーション (0以上)・increment
    - `src/contexts/publishing/domain/article/ViewCount.ts` — zero()、fromNumber()、increment()
    - _Requirements: 6.2, 6.3, 11.7_
  - [ ]\* 3.4 ViewCount のプロパティベーステストを作成する
    - **Property 7: ViewCount の不変条件**
    - **Validates: Requirements 6.1, 6.2, 6.3, 11.7**
  - [x] 3.5 LikeCount のテストと実装を作成する
    - `src/contexts/publishing/domain/article/LikeCount.test.ts` — 等価性・不変性・バリデーション (0以上)・increment / decrement (0下限クランプ)
    - `src/contexts/publishing/domain/article/LikeCount.ts` — zero()、fromNumber()、increment()、decrement()
    - _Requirements: 7.3, 11.8_
  - [ ]\* 3.6 LikeCount のプロパティベーステストを作成する
    - **Property 8: LikeCount の不変条件**
    - **Validates: Requirements 7.3, 11.8**

- [x] 4. チェックポイント — 値オブジェクトの検証
  - すべてのテストが通ることを確認し、不明点があればユーザーに質問する。

- [x] 5. ドメインイベントの実装
  - [x] 5.1 Article 関連のドメインイベントを作成する
    - `src/contexts/publishing/domain/article/ArticleCreated.ts`
    - `src/contexts/publishing/domain/article/ArticlePublished.ts`
    - `src/contexts/publishing/domain/article/ArticleUnpublished.ts`
    - `src/contexts/publishing/domain/article/ArticleDeleted.ts`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  - [x] 5.2 Like / Bookmark 関連のドメインイベントを作成する
    - `src/contexts/publishing/domain/like/ArticleLiked.ts`
    - `src/contexts/publishing/domain/like/ArticleLikeRemoved.ts`
    - `src/contexts/publishing/domain/bookmark/ArticleBookmarked.ts`
    - `src/contexts/publishing/domain/bookmark/ArticleBookmarkRemoved.ts`
    - _Requirements: 14.5, 14.6, 14.7, 14.8_

- [x] 6. Article 集約の実装
  - [x] 6.1 Article 集約のテストを作成する
    - `src/contexts/publishing/domain/article/Article.test.ts`
    - 作成テスト: draft 状態初期化、viewCount=0、likeCount=0、publishedAt=null、ArticleCreated イベント
    - 更新テスト: タイトル・本文・スラッグ・タグ更新時の updatedAt 更新
    - 公開テスト: draft→published 遷移、publishedAt 設定、ArticlePublished イベント
    - 公開拒否テスト: タイトル空・本文空で公開不可、既に公開済みで公開不可
    - 非公開テスト: published→draft 遷移、ArticleUnpublished イベント
    - 非公開拒否テスト: 既に下書きで非公開不可
    - カウンターテスト: incrementViewCount、incrementLikeCount、decrementLikeCount
    - イベントクリアテスト: clearDomainEvents
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 13.2, 13.3, 13.4, 14.1, 14.2, 14.3, 14.9_
  - [x] 6.2 Article 集約を実装する
    - `src/contexts/publishing/domain/article/Article.ts`
    - create()、reconstruct()、updateTitle()、updateContent()、updateSlug()、updateTags()
    - publish()、unpublish()、incrementViewCount()、incrementLikeCount()、decrementLikeCount()
    - getDomainEvents()、clearDomainEvents()
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2_
  - [ ]\* 6.3 Article 集約のプロパティベーステストを作成する
    - **Property 1: 記事作成の不変条件**
    - **Property 2: タグ関連付けの置換**
    - **Property 3: 記事フィールド更新時の updatedAt 更新**
    - **Property 4: 公開状態遷移の正当性**
    - **Property 5: 不正な状態遷移の拒否**
    - **Property 6: 非公開化状態遷移の正当性**
    - **Property 16: ドメインイベントのクリア**
    - **Validates: Requirements 1.1, 1.3, 1.4, 2.1, 2.2, 2.5, 3.1, 3.4, 4.1, 4.2, 14.1, 14.2, 14.3, 14.9**

- [x] 7. ArticleLike / ArticleBookmark エンティティの実装
  - [x] 7.1 ArticleLike のテストと実装を作成する
    - `src/contexts/publishing/domain/like/ArticleLike.test.ts` — create / reconstruct / getter
    - `src/contexts/publishing/domain/like/ArticleLike.ts`
    - _Requirements: 7.1, 7.4_
  - [x] 7.2 ArticleBookmark のテストと実装を作成する
    - `src/contexts/publishing/domain/bookmark/ArticleBookmark.test.ts` — create / reconstruct / getter
    - `src/contexts/publishing/domain/bookmark/ArticleBookmark.ts`
    - _Requirements: 8.1, 8.3_

- [x] 8. リポジトリインターフェースの定義
  - [x] 8.1 IArticleRepository、IArticleLikeRepository、IArticleBookmarkRepository を作成する
    - `src/contexts/publishing/domain/IArticleRepository.ts` — findById, findBySlug, findPaginated, save, delete, existsBySlug, incrementViewCount
    - `src/contexts/publishing/domain/IArticleLikeRepository.ts` — findByArticleAndUser, save, delete, countByArticle
    - `src/contexts/publishing/domain/IArticleBookmarkRepository.ts` — findByArticleAndUser, findByUserPaginated, save, delete
    - _Requirements: 1.2, 2.3, 6.1, 7.1, 7.2, 8.1, 8.2, 9.1, 10.1, 12.1_

- [x] 9. チェックポイント — ドメイン層の検証
  - すべてのテストが通ることを確認し、不明点があればユーザーに質問する。

- [x] 10. ユースケースの実装 (記事 CRUD)
  - [x] 10.1 CreateArticleUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/CreateArticleUseCase.test.ts` — 正常系 (記事作成)、異常系 (スラッグ重複)
    - `src/contexts/publishing/application/CreateArticleUseCase.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 13.5, 14.1_
  - [x] 10.2 UpdateArticleUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/UpdateArticleUseCase.test.ts` — 正常系 (タイトル・本文・スラッグ・タグ更新)、異常系 (記事不存在、スラッグ重複)
    - `src/contexts/publishing/application/UpdateArticleUseCase.ts`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 13.1, 13.5_
  - [x] 10.3 PublishArticleUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/PublishArticleUseCase.test.ts` — 正常系 (公開)、異常系 (記事不存在、公開条件未達、既に公開済み)
    - `src/contexts/publishing/application/PublishArticleUseCase.ts`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 13.1, 13.2, 13.3, 14.2_
  - [x] 10.4 UnpublishArticleUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/UnpublishArticleUseCase.test.ts` — 正常系 (非公開化)、異常系 (記事不存在、既に下書き)
    - `src/contexts/publishing/application/UnpublishArticleUseCase.ts`
    - _Requirements: 4.1, 4.2, 13.1, 13.4, 14.3_
  - [x] 10.5 DeleteArticleUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/DeleteArticleUseCase.test.ts` — 正常系 (削除)、異常系 (記事不存在)
    - `src/contexts/publishing/application/DeleteArticleUseCase.ts`
    - _Requirements: 5.1, 5.2, 13.1, 14.4_

- [x] 11. ユースケースの実装 (エンゲージメント)
  - [x] 11.1 RecordViewUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/RecordViewUseCase.test.ts` — 正常系 (閲覧数+1)、異常系 (記事不存在)
    - `src/contexts/publishing/application/RecordViewUseCase.ts`
    - _Requirements: 6.1, 13.1_
  - [x] 11.2 ToggleLikeUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/ToggleLikeUseCase.test.ts` — 正常系 (いいね追加・解除トグル)、異常系 (記事不存在)
    - `src/contexts/publishing/application/ToggleLikeUseCase.ts`
    - _Requirements: 7.1, 7.2, 14.5, 14.6_
  - [ ]\* 11.3 いいねトグルのプロパティベーステストを作成する
    - **Property 9: いいねトグルの対称性**
    - **Validates: Requirements 7.1, 7.2, 14.5, 14.6**
  - [x] 11.4 ToggleBookmarkUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/ToggleBookmarkUseCase.test.ts` — 正常系 (ブックマーク追加・解除トグル)、異常系 (記事不存在)
    - `src/contexts/publishing/application/ToggleBookmarkUseCase.ts`
    - _Requirements: 8.1, 8.2, 14.7, 14.8_
  - [ ]\* 11.5 ブックマークトグルのプロパティベーステストを作成する
    - **Property 10: ブックマークトグルの対称性**
    - **Validates: Requirements 8.1, 8.2, 14.7, 14.8**

- [x] 12. ユースケースの実装 (一覧取得)
  - [x] 12.1 ListArticlesUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/ListArticlesUseCase.test.ts` — 正常系 (ページネーション、フィルタ、ソート)
    - `src/contexts/publishing/application/ListArticlesUseCase.ts`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  - [x] 12.2 ListBookmarksUseCase のテストと実装を作成する
    - `src/contexts/publishing/application/ListBookmarksUseCase.test.ts` — 正常系 (ブックマーク一覧ページネーション)
    - `src/contexts/publishing/application/ListBookmarksUseCase.ts`
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 13. チェックポイント — アプリケーション層の検証
  - すべてのテストが通ることを確認し、不明点があればユーザーに質問する。

- [x] 14. Prisma スキーマとリポジトリ実装
  - [x] 14.1 Prisma スキーマに Article、ArticleTag、ArticleLike、ArticleBookmark モデルを追加する
    - `prisma/schema.prisma` — 設計書のスキーマ定義に従い、インデックス・ユニーク制約を含める
    - _Requirements: 12.1, 12.2_
  - [x] 14.2 PrismaArticleRepository のテストと実装を作成する
    - `src/contexts/publishing/infrastructure/PrismaArticleRepository.integration.test.ts` — CRUD、スラッグ一意制約、ページネーション、フィルタ、ソート、テナント分離
    - `src/contexts/publishing/infrastructure/PrismaArticleRepository.ts` — toDomain / toPersistence マッピング含む
    - _Requirements: 1.2, 2.3, 6.1, 9.1, 9.3, 9.5, 12.1, 12.2_
  - [ ]\* 14.3 PrismaArticleRepository のページネーション・ソートのプロパティベーステストを作成する
    - **Property 11: ページネーション結果の整合性**
    - **Property 12: ソート順の保証**
    - **Validates: Requirements 9.1, 9.3, 9.5, 9.6, 10.3**
  - [x] 14.4 PrismaArticleLikeRepository のテストと実装を作成する
    - `src/contexts/publishing/infrastructure/PrismaArticleLikeRepository.integration.test.ts` — CRUD、一意制約、テナント分離
    - `src/contexts/publishing/infrastructure/PrismaArticleLikeRepository.ts`
    - _Requirements: 7.1, 7.2, 7.4, 12.1_
  - [x] 14.5 PrismaArticleBookmarkRepository のテストと実装を作成する
    - `src/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository.integration.test.ts` — CRUD、一意制約、ページネーション、テナント分離
    - `src/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository.ts`
    - _Requirements: 8.1, 8.2, 8.3, 10.1, 12.1_

- [x] 15. チェックポイント — インフラ層の検証
  - すべてのテストが通ることを確認し、不明点があればユーザーに質問する。

- [ ] 16. Server Actions と Zod スキーマの実装
  - [ ] 16.1 記事関連の Zod バリデーションスキーマを作成する
    - `src/schemas/article.ts` — createArticleInputSchema, updateArticleInputSchema, publishArticleInputSchema, unpublishArticleInputSchema, deleteArticleInputSchema, recordViewInputSchema, toggleLikeInputSchema, toggleBookmarkInputSchema, listArticlesInputSchema, listBookmarksInputSchema
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1_
  - [ ] 16.2 記事 CRUD の Server Actions を作成する
    - `src/presentation/actions/createArticle.ts`
    - `src/presentation/actions/updateArticle.ts`
    - `src/presentation/actions/publishArticle.ts`
    - `src/presentation/actions/unpublishArticle.ts`
    - `src/presentation/actions/deleteArticle.ts`
    - Zod バリデーション → 値オブジェクト変換 → ユースケース実行
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_
  - [ ] 16.3 エンゲージメント・一覧の Server Actions を作成する
    - `src/presentation/actions/recordView.ts`
    - `src/presentation/actions/toggleLike.ts`
    - `src/presentation/actions/toggleBookmark.ts`
    - `src/presentation/actions/listArticles.ts`
    - `src/presentation/actions/listBookmarks.ts`
    - _Requirements: 6.1, 7.1, 8.1, 9.1, 10.1_

- [ ] 17. 最終チェックポイント — 全体の検証
  - すべてのテストが通ることを確認し、不明点があればユーザーに質問する。

## Notes

- `*` 付きのタスクはオプションであり、MVP では省略可能
- 各タスクは特定の要件を参照しており、トレーサビリティを確保
- チェックポイントでインクリメンタルに検証を実施
- プロパティベーステストは設計書の Correctness Properties に基づく
- 単体テストは具体的な例とエッジケースを検証
- Inside-Out 順序: shared-kernel → 値オブジェクト → 集約 → ユースケース → インフラ → プレゼンテーション
