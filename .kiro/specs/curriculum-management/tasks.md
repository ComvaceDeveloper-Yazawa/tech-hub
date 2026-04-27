# 実装計画: カリキュラム管理機能（MVP）

## 概要

ゲームスタイルのステージマップ上で学習カリキュラムを進行できる機能を実装する。Supabase クライアント直接利用（Prisma 不使用）で4テーブルを構築し、純粋関数によるステータス計算・座標計算を TDD で実装した後、Server Actions → UI コンポーネント → ページの順に構築する。

## Tasks

- [x] 1. データベースセットアップ
  - [x] 1.1 マイグレーション SQL を作成
    - `prisma/migrations/add_curriculum_tables.sql` を作成
    - curriculums, stages, user_stage_progress, reference_articles の4テーブルの DDL
    - RLS ポリシー（認証ユーザーのみ読み取り、user_stage_progress は自分のみ読み書き）
    - インデックス定義
    - _要件: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  - [x] 1.2 シードデータ SQL を作成
    - `scripts/seed-curriculum.sql` を作成
    - 「フロントエンドカリキュラム」カリキュラム1件（slug: "frontend"、3ステージ）
    - 参考記事3件（Markdown コンテンツ付き）
    - _要件: 8.1, 8.2, 8.3_

- [x] 2. 型定義
  - [x] 2.1 カリキュラム関連の型定義を作成
    - `src/lib/curriculum/types.ts` を作成
    - StageStatus, Curriculum, Stage, UserStageProgress, StageWithStatus, CurriculumWithProgress, StageCoordinate, ReferenceArticle 型を定義
    - _要件: 7.1, 7.2, 7.3, 7.4_

- [x] 3. 純粋関数の実装（TDD: Red → Green）
  - [x] 3.1 computeStageStatuses のテストを作成
    - `src/lib/curriculum/computeStageStatuses.test.ts` を作成
    - 日本語テスト名で AAA パターン準拠
    - ユニットテスト: 全未完了、最初のみ完了、全完了、ステージ1個、空配列、未ソートの stage_number
    - _要件: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [x] 3.2 computeStageStatuses の Property テストを作成
    - **Property 1: ステージステータス計算の正確性**
    - fast-check でランダムなステージ数 (1-20)、ランダムな完了パターンを生成
    - ソート順、ステータス割り当てルール、completed/unlocked/locked の正確性を検証
    - **Validates: 要件 4.1, 4.2, 4.3, 4.4, 4.5**
  - [x] 3.3 現在のステージ特定の Property テストを作成
    - **Property 2: 現在のステージ特定**
    - computeStageStatuses の出力に対し、最初の unlocked ステージが current stage であることを検証
    - 全完了時は current stage が存在しないことを検証
    - **Validates: 要件 4.6**
  - [x] 3.4 computeStageStatuses を実装
    - `src/lib/curriculum/computeStageStatuses.ts` を作成
    - stage_number 昇順ソート → progress を stage_id でインデックス化 → ステータス計算
    - テストが Green になることを確認
    - _要件: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 3.5 computeStageCoordinates のテストを作成
    - `src/lib/curriculum/computeStageCoordinates.test.ts` を作成
    - ユニットテスト: ステージ0個、1個、3個、蛇行パスの座標検証
    - _要件: 3.3_
  - [x] 3.6 computeStageCoordinates の Property テストを作成
    - **Property 3: ステージ座標の境界内配置**
    - fast-check でランダムなステージ数 (1-20)、SVG サイズ (200-1200) を生成
    - 全座標が SVG 境界内、座標数がステージ数と一致、stageNumber が連番であることを検証
    - **Validates: 要件 3.3**
  - [x] 3.7 computeStageCoordinates を実装
    - `src/lib/curriculum/computeStageCoordinates.ts` を作成
    - 蛇行パスで座標を計算（奇数行: 左→右、偶数行: 右→左）
    - テストが Green になることを確認
    - _要件: 3.3_

- [x] 4. チェックポイント — 純粋関数のテスト通過確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認する。

- [x] 5. Server Actions の実装
  - [x] 5.1 getCurriculums Server Action を実装
    - `src/presentation/actions/curriculum/getCurriculums.ts` を作成
    - Supabase クライアントで公開カリキュラムを sort_order 順に取得
    - 各カリキュラムの total_stages と completed_stages を計算して CurriculumWithProgress[] を返す
    - _要件: 2.1, 2.2_
  - [x] 5.2 getCurriculumBySlug Server Action を実装
    - `src/presentation/actions/curriculum/getCurriculumBySlug.ts` を作成
    - slug でカリキュラムを1件取得、見つからない場合は null を返す
    - _要件: 2.3_
  - [x] 5.3 getStagesWithProgress Server Action を実装
    - `src/presentation/actions/curriculum/getStagesWithProgress.ts` を作成
    - curriculumId でステージ一覧と認証ユーザーの進捗を取得
    - computeStageStatuses を呼び出して StageWithStatus[] を返す
    - _要件: 3.1, 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 5.4 completeStage Server Action を実装
    - `src/presentation/actions/curriculum/completeStage.ts` を作成
    - 認証チェック → user_stage_progress に upsert → revalidatePath('/curriculum')
    - `{ success: boolean; error?: string }` を返す
    - _要件: 5.4, 5.5, 5.6_
  - [x] 5.5 getReferenceArticles Server Action を実装
    - `src/presentation/actions/curriculum/getReferenceArticles.ts` を作成
    - sort_order 順で参考記事一覧を取得
    - _要件: 6.2, 6.3_
  - [x] 5.6 getReferenceArticleBySlug Server Action を実装
    - `src/presentation/actions/curriculum/getReferenceArticleBySlug.ts` を作成
    - slug で参考記事を1件取得、見つからない場合は null を返す
    - _要件: 6.4_

- [x] 6. チェックポイント — Server Actions の確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認する。

- [x] 7. UI コンポーネントの実装
  - [x] 7.1 StageMap コンポーネントを実装
    - `src/components/features/curriculum/StageMap.tsx` ('use client')
    - SVG viewBox ベースのレスポンシブステージマップ
    - computeStageCoordinates で座標計算、ステータスごとの色分け（緑/青/グレー）
    - ステージ間の接続線、番号付き円、foreignObject で Avatar 表示
    - aria-label, tabIndex, role="button" でアクセシビリティ対応
    - Tab キーでフォーカス移動、Enter/Space でクリック発火
    - locked ステージは cursor-not-allowed + クリック無視
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 9.1, 9.2, 9.3_
  - [x] 7.2 StageContentDialog コンポーネントを実装
    - `src/components/features/curriculum/StageContentDialog.tsx` ('use client')
    - shadcn/ui の Dialog を使用
    - completed: タイトル + description + "✅ クリア済み" バッジ（完了ボタンなし）
    - unlocked: タイトル + description + "完了する" ボタン
    - "完了する" クリックで completeStage 呼び出し、成功時はダイアログ閉じ + ステータス更新
    - 失敗時は Sonner トースト通知
    - フォーカストラップ対応
    - _要件: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.5_
  - [x] 7.3 GearFab + ReferenceDrawer + ReferenceArticleModal を実装
    - `src/components/features/curriculum/GearFab.tsx` ('use client') — fixed bottom-4 left-4 の歯車ボタン、aria-label 付き、キーボード操作対応
    - `src/components/features/curriculum/ReferenceDrawer.tsx` ('use client') — shadcn/ui Sheet (side="left")、記事一覧を sort_order 順に表示
    - `src/components/features/curriculum/ReferenceArticleModal.tsx` ('use client') — shadcn/ui Dialog、react-markdown で Markdown レンダリング
    - GearFab が ReferenceDrawer を管理、ReferenceDrawer が ReferenceArticleModal を管理
    - _要件: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 9.4_

- [x] 8. ページの実装
  - [x] 8.1 カリキュラム共通レイアウトを実装
    - `app/(public)/curriculum/layout.tsx` を作成
    - children + GearFab（getReferenceArticles で記事一覧を取得して渡す）
    - _要件: 6.1_
  - [x] 8.2 カリキュラム一覧ページを実装
    - `app/(public)/curriculum/page.tsx` (RSC)
    - 認証チェック（未認証は `/login` にリダイレクト）
    - getCurriculums で一覧取得、Card で表示（タイトル、説明、進捗 "{completed}/{total} ステージ完了"）
    - カードクリックで `/curriculum/{slug}` に遷移
    - 空状態メッセージ対応
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 8.3 ステージマップページを実装
    - `app/(public)/curriculum/[slug]/page.tsx` (RSC)
    - 認証チェック（未認証は `/login` にリダイレクト）
    - getCurriculumBySlug でカリキュラム取得（見つからない場合 notFound()）
    - getStagesWithProgress でステージ一覧取得
    - getProfile でアバター設定取得
    - StageMap + StageContentDialog を配置
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 9. ヘッダー修正
  - [x] 9.1 Header に「カリキュラム」リンクを追加
    - `src/components/features/Header.tsx` を修正
    - 認証済みユーザーにのみ「カリキュラム」リンク (`/curriculum`) を表示
    - デスクトップナビゲーションに追加
    - _要件: 1.1, 1.2_
  - [x] 9.2 MobileNav に「カリキュラム」リンクを追加
    - `src/components/features/MobileNav.tsx` を修正
    - 認証済みユーザーにのみ「カリキュラム」リンクを表示
    - _要件: 1.3_

- [x] 10. 最終チェックポイント — 全テスト通過確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認する。

## Notes

- タスクに `*` が付いているものはオプション（Property-Based Test）であり、スキップ可能
- Property テストは fast-check を使用（既にインストール済み）
- テスト名は日本語で「〜のとき、〜する」形式
- Supabase クライアント直接利用（Prisma スキーマには追加しない）
- 各タスクは要件番号で追跡可能
- E2E テスト (Playwright) は GitHub Actions でのみ実行するため、本タスクリストには含めない
