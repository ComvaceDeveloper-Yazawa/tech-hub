# 要件ドキュメント: Publishing UI — 記事公開プラットフォームのフロントエンド

## はじめに

Publishing Context のバックエンド (Server Actions) は実装済みである。本ドキュメントでは、記事公開プラットフォームのフロントエンド UI を定義する。公開ページ (記事一覧・記事詳細・タグフィルタ) と管理ページ (記事管理一覧・記事作成/編集フォーム・公開/非公開/削除操作) を提供し、共通コンポーネント (記事カード・ページネーション・いいねボタン・ブックマークボタン・タグフィルタ) およびレイアウト (ヘッダー・フッター・管理サイドバー) を構築する。

技術スタック: Next.js 15+ (App Router)、Tailwind CSS v4 + shadcn/ui、@tailwindcss/typography。レスポンシブ対応 (PC・タブレット・スマートフォン)。認証は Supabase Auth を使用する。

## 用語集

- **PublicLayout**: 公開ページ共通のレイアウトコンポーネント (ヘッダー・フッター含む)
- **AdminLayout**: 管理ページ共通のレイアウトコンポーネント (ヘッダー・サイドバー含む)
- **Header**: サイト上部のナビゲーションバー
- **Footer**: サイト下部のフッター
- **AdminSidebar**: 管理ページのサイドバーナビゲーション
- **ArticleCard**: 記事一覧で使用するカード型コンポーネント
- **Pagination**: カーソルベースのページネーション UI コンポーネント
- **LikeButton**: いいねトグルボタンコンポーネント
- **BookmarkButton**: ブックマークトグルボタンコンポーネント
- **TagFilter**: タグによる記事フィルタリング UI コンポーネント
- **ArticleForm**: 記事の作成・編集に使用するフォームコンポーネント
- **SortSelector**: 記事一覧のソート順を選択する UI コンポーネント
- **Server_Action**: バックエンドに実装済みの Server Action (createArticle, updateArticle, publishArticle, unpublishArticle, deleteArticle, recordView, toggleLike, toggleBookmark, listArticles, listBookmarks)
- **ArticleListItem**: listArticles Server_Action が返す記事データ (id, title, slug, status, viewCount, likeCount, publishedAt, createdAt, updatedAt)
- **PaginatedResult**: ページネーション結果 (items, nextCursor, prevCursor, hasNextPage, hasPrevPage)

## 要件

### 要件 1: 公開レイアウト

**ユーザーストーリー:** 読者として、すべての公開ページで統一されたヘッダーとフッターを表示したい。それにより、サイト内を一貫したナビゲーションで移動できる。

#### 受け入れ条件

1. THE PublicLayout SHALL `app/(public)/layout.tsx` に配置され、すべての公開ページに Header と Footer を表示する
2. THE Header SHALL サイトロゴ (トップページへのリンク)、記事一覧ページへのナビゲーションリンクを含む
3. WHILE ユーザーが認証済みの場合、THE Header SHALL ブックマーク一覧ページへのリンクと管理ページへのリンクを表示する
4. WHILE ユーザーが未認証の場合、THE Header SHALL ログインリンクを表示する
5. THE Header SHALL モバイルファーストのレスポンシブデザインを採用し、sm ブレークポイント未満ではハンバーガーメニューでナビゲーションを折りたたむ
6. THE Footer SHALL コピーライト表記を含む

### 要件 2: 管理レイアウト

**ユーザーストーリー:** 管理者として、管理ページ専用のサイドバーナビゲーションを使用したい。それにより、管理機能に素早くアクセスできる。

#### 受け入れ条件

1. THE AdminLayout SHALL `app/(admin)/layout.tsx` に配置され、すべての管理ページに Header と AdminSidebar を表示する
2. THE AdminSidebar SHALL 記事管理一覧ページへのリンクと新規記事作成ページへのリンクを含む
3. THE AdminSidebar SHALL 現在のページに対応するリンクをアクティブ状態で表示する
4. WHILE 画面幅が md ブレークポイント未満の場合、THE AdminSidebar SHALL 非表示となり、ハンバーガーメニューから開閉できるドロワー形式で表示する
5. WHILE 画面幅が md ブレークポイント以上の場合、THE AdminSidebar SHALL 画面左側に固定表示する
6. WHILE ユーザーが未認証の場合、THE AdminLayout SHALL ログインページにリダイレクトする

### 要件 3: 公開記事一覧ページ

**ユーザーストーリー:** 読者として、公開済みの記事一覧をページネーション付きで閲覧したい。それにより、興味のある記事を効率的に探せる。

#### 受け入れ条件

1. THE 公開記事一覧ページ SHALL `app/(public)/articles/page.tsx` に配置され、listArticles Server_Action を status=published で呼び出し、公開済み記事の一覧を表示する
2. THE 公開記事一覧ページ SHALL 各記事を ArticleCard コンポーネントで表示する
3. THE 公開記事一覧ページ SHALL SortSelector を表示し、公開日時 (publishedAt)・閲覧数 (viewCount)・いいね数 (likeCount) でソート順を切り替えられる
4. WHEN ソート順が指定されない場合、THE 公開記事一覧ページ SHALL 公開日時の降順で記事を表示する
5. THE 公開記事一覧ページ SHALL Pagination コンポーネントを表示し、カーソルベースのページ送りを提供する
6. THE 公開記事一覧ページ SHALL レスポンシブデザインを採用し、sm 未満では1カラム、md 以上では2カラム、lg 以上では3カラムのグリッドで ArticleCard を配置する

### 要件 4: タグフィルタ付き記事一覧

**ユーザーストーリー:** 読者として、特定のタグで記事をフィルタリングしたい。それにより、関心のあるトピックの記事だけを閲覧できる。

#### 受け入れ条件

1. WHEN URL クエリパラメータに tagId が指定された場合、THE 公開記事一覧ページ SHALL listArticles Server_Action を tagId フィルタ付きで呼び出し、該当タグの記事のみを表示する
2. THE TagFilter SHALL 公開記事一覧ページに表示され、タグを選択するとクエリパラメータを更新して記事一覧をフィルタリングする
3. WHEN タグフィルタが適用されている場合、THE 公開記事一覧ページ SHALL 現在のフィルタ条件を明示し、フィルタ解除ボタンを表示する

### 要件 5: 記事詳細ページ

**ユーザーストーリー:** 読者として、記事の全文を閲覧し、いいねやブックマークを行いたい。それにより、記事を評価し後で読み返せる。

#### 受け入れ条件

1. THE 記事詳細ページ SHALL `app/(public)/articles/[slug]/page.tsx` に配置され、スラッグに基づいて記事を取得し表示する
2. THE 記事詳細ページ SHALL 記事タイトル、公開日時、閲覧数、いいね数、記事本文を表示する
3. THE 記事詳細ページ SHALL 記事本文をマークダウンとしてパースし、`react-markdown` + `remark-gfm` で HTML にレンダリングし、`@tailwindcss/typography` の prose クラスでスタイリングする
4. WHEN 記事詳細ページが表示された場合、THE 記事詳細ページ SHALL recordView Server_Action を呼び出して閲覧数を記録する
5. THE 記事詳細ページ SHALL LikeButton と BookmarkButton を表示する
6. WHEN 存在しないスラッグでアクセスした場合、THE 記事詳細ページ SHALL Next.js の notFound() を呼び出し 404 ページを表示する
7. THE 記事詳細ページ SHALL 記事に関連付けられたタグをリンク付きで表示し、タグをクリックするとタグフィルタ付き記事一覧ページに遷移する

### 要件 6: ArticleCard コンポーネント

**ユーザーストーリー:** 読者として、記事一覧で各記事の概要を視覚的に把握したい。それにより、読みたい記事を素早く選べる。

#### 受け入れ条件

1. THE ArticleCard SHALL 記事タイトル、公開日時、閲覧数、いいね数を表示する
2. THE ArticleCard SHALL 記事タイトルをクリックすると記事詳細ページ (`/articles/[slug]`) に遷移するリンクを含む
3. THE ArticleCard SHALL `src/components/features/ArticleCard.tsx` に配置する
4. THE ArticleCard SHALL cn() ヘルパーを使用し、className プロパティによるスタイルのカスタマイズを受け付ける

### 要件 7: Pagination コンポーネント

**ユーザーストーリー:** 読者として、記事一覧のページを前後に移動したい。それにより、すべての記事にアクセスできる。

#### 受け入れ条件

1. THE Pagination SHALL nextCursor、prevCursor、hasNextPage、hasPrevPage を受け取り、前ページ・次ページボタンを表示する
2. WHILE hasNextPage が false の場合、THE Pagination SHALL 次ページボタンを無効化 (disabled) する
3. WHILE hasPrevPage が false の場合、THE Pagination SHALL 前ページボタンを無効化 (disabled) する
4. THE Pagination SHALL `src/components/features/Pagination.tsx` に配置する
5. THE Pagination SHALL ボタンクリック時にクエリパラメータ (cursor) を更新してページ遷移する

### 要件 8: LikeButton コンポーネント

**ユーザーストーリー:** 読者として、記事に「いいね」を付けたり外したりしたい。それにより、気に入った記事への評価を表明できる。

#### 受け入れ条件

1. THE LikeButton SHALL toggleLike Server_Action を呼び出し、いいねのトグルを実行する
2. THE LikeButton SHALL 現在のいいね数を表示する
3. WHEN いいねが成功した場合、THE LikeButton SHALL いいね済み状態のスタイル (塗りつぶしアイコン) に切り替え、いいね数を即座に更新する
4. WHEN いいね解除が成功した場合、THE LikeButton SHALL 未いいね状態のスタイル (アウトラインアイコン) に切り替え、いいね数を即座に更新する
5. THE LikeButton SHALL `src/components/features/LikeButton.tsx` に配置する
6. WHILE Server_Action の実行中、THE LikeButton SHALL ボタンを無効化し、ローディング状態を示す

### 要件 9: BookmarkButton コンポーネント

**ユーザーストーリー:** 読者として、記事をブックマークに追加したり解除したりしたい。それにより、後で読み返したい記事を管理できる。

#### 受け入れ条件

1. THE BookmarkButton SHALL toggleBookmark Server_Action を呼び出し、ブックマークのトグルを実行する
2. WHEN ブックマークが成功した場合、THE BookmarkButton SHALL ブックマーク済み状態のスタイル (塗りつぶしアイコン) に切り替える
3. WHEN ブックマーク解除が成功した場合、THE BookmarkButton SHALL 未ブックマーク状態のスタイル (アウトラインアイコン) に切り替える
4. THE BookmarkButton SHALL `src/components/features/BookmarkButton.tsx` に配置する
5. WHILE Server_Action の実行中、THE BookmarkButton SHALL ボタンを無効化し、ローディング状態を示す

### 要件 10: 管理記事一覧ページ

**ユーザーストーリー:** 管理者として、すべてのステータスの記事一覧を管理画面で閲覧したい。それにより、記事の状態を把握し管理操作を行える。

#### 受け入れ条件

1. THE 管理記事一覧ページ SHALL `app/(admin)/articles/page.tsx` に配置され、listArticles Server_Action をステータスフィルタなしで呼び出し、全記事を表示する
2. THE 管理記事一覧ページ SHALL 各記事のタイトル、ステータス (draft/published)、公開日時、閲覧数、いいね数、作成日時を表形式で表示する
3. THE 管理記事一覧ページ SHALL ステータスでフィルタリングできるタブまたはセレクタを提供する
4. THE 管理記事一覧ページ SHALL 各記事に対して編集ページへのリンク、公開/非公開トグルボタン、削除ボタンを表示する
5. THE 管理記事一覧ページ SHALL Pagination コンポーネントでカーソルベースのページ送りを提供する
6. THE 管理記事一覧ページ SHALL 新規記事作成ページへのリンクボタンを表示する
7. WHILE 画面幅が sm ブレークポイント未満の場合、THE 管理記事一覧ページ SHALL テーブルを横スクロール可能なコンテナで表示する

### 要件 11: 記事作成ページ

**ユーザーストーリー:** 管理者として、新しい記事を作成したい。それにより、コンテンツを追加できる。

#### 受け入れ条件

1. THE 記事作成ページ SHALL `app/(admin)/articles/new/page.tsx` に配置され、ArticleForm コンポーネントを表示する
2. WHEN フォームが送信された場合、THE 記事作成ページ SHALL createArticle Server_Action を呼び出して記事を作成する
3. WHEN 記事作成が成功した場合、THE 記事作成ページ SHALL 管理記事一覧ページにリダイレクトする
4. IF createArticle Server_Action がエラーを返した場合、THEN THE 記事作成ページ SHALL エラーメッセージをフォーム上部に表示する

### 要件 12: 記事編集ページ

**ユーザーストーリー:** 管理者として、既存の記事を編集したい。それにより、記事の内容を改善できる。

#### 受け入れ条件

1. THE 記事編集ページ SHALL `app/(admin)/articles/[id]/edit/page.tsx` に配置され、既存の記事データを取得して ArticleForm に初期値として設定する
2. WHEN フォームが送信された場合、THE 記事編集ページ SHALL updateArticle Server_Action を呼び出して記事を更新する
3. WHEN 記事更新が成功した場合、THE 記事編集ページ SHALL 管理記事一覧ページにリダイレクトする
4. IF updateArticle Server_Action がエラーを返した場合、THEN THE 記事編集ページ SHALL エラーメッセージをフォーム上部に表示する
5. WHEN 存在しない記事 ID でアクセスした場合、THE 記事編集ページ SHALL notFound() を呼び出し 404 ページを表示する

### 要件 13: ArticleForm コンポーネント

**ユーザーストーリー:** 管理者として、記事のタイトル・本文・スラッグ・タグを入力するフォームを使用したい。それにより、記事の内容を効率的に入力できる。

#### 受け入れ条件

1. THE ArticleForm SHALL タイトル入力フィールド (最大100文字)、本文入力フィールド (マークダウンエディタ)、スラッグ入力フィールド (英小文字・数字・ハイフンのみ)、タグ入力フィールドを含む
2. THE ArticleForm SHALL クライアントサイドバリデーションを実行し、不正な入力に対してフィールド単位のエラーメッセージを表示する
3. THE ArticleForm SHALL 作成モードと編集モードの両方に対応し、編集モードでは既存データを初期値として表示する
4. THE ArticleForm SHALL `src/components/features/ArticleForm.tsx` に配置する
5. WHILE フォーム送信中、THE ArticleForm SHALL 送信ボタンを無効化し、ローディング状態を示す
6. THE ArticleForm SHALL shadcn/ui のフォーム関連コンポーネント (Input, Button, Label) を使用する
7. THE ArticleForm SHALL 本文入力にマークダウンエディタ (`@uiw/react-md-editor`) を使用し、リアルタイムプレビューを提供する
8. THE ArticleForm SHALL マークダウンエディタ内で画像をドラッグ&ドロップまたはボタンクリックで挿入できる
9. WHEN 画像が挿入された場合、THE ArticleForm SHALL Supabase Storage に画像をアップロードし、公開 URL を取得してマークダウンの `![alt](url)` 形式で本文に挿入する
10. THE ArticleForm SHALL アップロード可能な画像形式を JPEG, PNG, GIF, WebP に制限し、最大ファイルサイズを 5MB とする

### 要件 14: 記事の公開・非公開・削除操作

**ユーザーストーリー:** 管理者として、管理画面から記事の公開・非公開・削除を実行したい。それにより、記事のライフサイクルを管理できる。

#### 受け入れ条件

1. WHEN 管理者が下書き記事の公開ボタンをクリックした場合、THE 管理記事一覧ページ SHALL publishArticle Server_Action を呼び出し、記事を公開する
2. WHEN 管理者が公開済み記事の非公開ボタンをクリックした場合、THE 管理記事一覧ページ SHALL unpublishArticle Server_Action を呼び出し、記事を非公開にする
3. WHEN 管理者が削除ボタンをクリックした場合、THE 管理記事一覧ページ SHALL 確認ダイアログを表示し、確認後に deleteArticle Server_Action を呼び出して記事を削除する
4. WHEN 公開・非公開・削除操作が成功した場合、THE 管理記事一覧ページ SHALL 記事一覧を再取得して最新の状態を表示する
5. IF 公開・非公開・削除操作がエラーを返した場合、THEN THE 管理記事一覧ページ SHALL エラーメッセージをトースト通知で表示する
6. WHILE 操作の実行中、THE 管理記事一覧ページ SHALL 対象の操作ボタンを無効化し、ローディング状態を示す

### 要件 15: ブックマーク一覧ページ

**ユーザーストーリー:** 読者として、自分がブックマークした記事の一覧を閲覧したい。それにより、保存した記事に素早くアクセスできる。

#### 受け入れ条件

1. THE ブックマーク一覧ページ SHALL `app/(public)/bookmarks/page.tsx` に配置され、listBookmarks Server_Action を呼び出してブックマーク済み記事を表示する
2. THE ブックマーク一覧ページ SHALL 各ブックマーク記事を ArticleCard コンポーネントで表示する
3. THE ブックマーク一覧ページ SHALL Pagination コンポーネントでカーソルベースのページ送りを提供する
4. WHILE ユーザーが未認証の場合、THE ブックマーク一覧ページ SHALL ログインページにリダイレクトする
5. WHEN ブックマークが0件の場合、THE ブックマーク一覧ページ SHALL 「ブックマークした記事はありません」メッセージと記事一覧ページへのリンクを表示する

### 要件 16: レスポンシブデザイン

**ユーザーストーリー:** ユーザーとして、PC・タブレット・スマートフォンのいずれのデバイスでも快適にサイトを利用したい。それにより、場所やデバイスを問わず記事を閲覧・管理できる。

#### 受け入れ条件

1. THE すべてのページ SHALL モバイルファーストのレスポンシブデザインを採用し、Tailwind CSS のブレークポイント (sm: 640px, md: 768px, lg: 1024px) で段階的にレイアウトを拡張する
2. THE すべてのインタラクティブ要素 SHALL タッチ操作に適したサイズ (最小 44x44px のタップターゲット) を確保する
3. THE すべてのフォーム入力フィールド SHALL モバイルデバイスで適切な入力タイプ (type 属性) を設定する

### 要件 17: アクセシビリティ

**ユーザーストーリー:** すべてのユーザーとして、支援技術を使用してもサイトの機能を利用したい。それにより、障害の有無に関わらず記事を閲覧・管理できる。

#### 受け入れ条件

1. THE すべてのインタラクティブ要素 SHALL キーボード操作可能であり、focus 状態を視覚的に明示する
2. THE すべてのボタンとリンク SHALL aria-label または可視テキストで目的を説明する
3. THE すべてのフォーム入力フィールド SHALL label 要素と関連付ける
4. THE すべてのページ SHALL 適切な見出し階層 (h1 → h2 → h3) を使用する
5. THE すべてのステータス変更通知 SHALL aria-live リージョンを使用してスクリーンリーダーに通知する

### 要件 18: エラーハンドリング UI

**ユーザーストーリー:** ユーザーとして、操作が失敗した場合に明確なエラーメッセージを受け取りたい。それにより、問題の原因を理解し対処できる。

#### 受け入れ条件

1. IF Server_Action がバリデーションエラーを返した場合、THEN THE フォームコンポーネント SHALL フィールド単位のエラーメッセージを該当フィールドの下に表示する
2. IF Server_Action がビジネスロジックエラーを返した場合、THEN THE ページ SHALL エラーメッセージをトースト通知またはアラートで表示する
3. IF ネットワークエラーが発生した場合、THEN THE ページ SHALL 「通信エラーが発生しました。再度お試しください」メッセージを表示する
4. THE すべてのエラーメッセージ SHALL role="alert" 属性を持ち、スクリーンリーダーに即座に通知する
