# 要件ドキュメント: Publishing Context — 記事機能

## はじめに

Publishing Context における記事 (Article) の執筆・管理・公開機能の要件を定義する。記事のライフサイクル全体 (作成 → 編集 → 公開 → 非公開 → 削除) を管理し、エンゲージメント機能 (閲覧数カウント、いいね、ブックマーク) を提供する。タグは taxonomy コンテキストと連携し、記事の分類を支援する。記事一覧・ブックマーク一覧にはカーソルベースのページネーションを採用する。マルチテナント設計を初期段階から組み込み、すべてのエンティティに tenantId を持たせる。

## 用語集

- **Article**: 記事集約ルート。タイトル・本文・スラッグ・ステータス・タグ・閲覧数・いいね数を持つ
- **ArticleId**: 記事の一意識別子 (ULID ベース、26文字)
- **ArticleTitle**: 記事タイトル値オブジェクト (1〜100文字、前後空白トリム)
- **ArticleContent**: 記事本文値オブジェクト (下書き時は空文字許容)
- **ArticleStatus**: 記事ステータス値オブジェクト (`draft` または `published`)
- **Slug**: URL パス用スラッグ値オブジェクト (英小文字・数字・ハイフン、1〜200文字)
- **ViewCount**: 閲覧数値オブジェクト (0以上の整数、不変)
- **LikeCount**: いいね数値オブジェクト (0以上の整数、不変)
- **ArticleLike**: ユーザーが記事に「いいね」した記録を管理するエンティティ
- **ArticleBookmark**: ユーザーが記事をブックマークした記録を管理するエンティティ
- **TenantId**: マルチテナント識別子 (shared-kernel、ULID ベース)
- **UserId**: ユーザー識別子 (shared-kernel、identity コンテキスト由来)
- **TagId**: タグ識別子 (shared-kernel、taxonomy コンテキスト由来)
- **PaginationParams**: カーソルベースページネーションのパラメータ (cursor, limit, direction)
- **PaginatedResult**: ページネーション結果 (items, nextCursor, prevCursor, hasNextPage, hasPrevPage)
- **System**: Publishing Context の記事機能全体

## 要件

### 要件 1: 記事の作成

**ユーザーストーリー:** 著者として、新しい記事を下書き状態で作成したい。それにより、公開前に内容を準備できる。

#### 受け入れ条件

1. WHEN 著者が有効なタイトル・本文・スラッグを指定して記事作成を実行した場合、THE System SHALL 下書き (draft) 状態の Article を生成し、ArticleCreated ドメインイベントを発行する
2. WHEN 記事作成時にスラッグが同一テナント内で既に使用されている場合、THE System SHALL 記事の作成を拒否し、スラッグ重複エラーを返す
3. WHEN 記事が作成された場合、THE System SHALL 閲覧数を 0、いいね数を 0、publishedAt を null で初期化する
4. WHEN 記事作成時にタグ ID のリストが指定された場合、THE System SHALL 指定されたタグ ID を記事に関連付ける

### 要件 2: 記事の編集

**ユーザーストーリー:** 著者として、既存の記事のタイトル・本文・スラッグ・タグを更新したい。それにより、記事の内容を改善できる。

#### 受け入れ条件

1. WHEN 著者が記事のタイトルを更新した場合、THE System SHALL 新しいタイトルを保存し、更新日時を現在時刻に設定する
2. WHEN 著者が記事の本文を更新した場合、THE System SHALL 新しい本文を保存し、更新日時を現在時刻に設定する
3. WHEN 著者が記事のスラッグを更新した場合、THE System SHALL 新しいスラッグが同一テナント内で一意であることを検証し、保存する
4. WHEN 著者が記事のスラッグを同一テナント内で既に使用されている値に更新しようとした場合、THE System SHALL 更新を拒否し、スラッグ重複エラーを返す
5. WHEN 著者が記事のタグを更新した場合、THE System SHALL 指定されたタグ ID のリストで既存のタグ関連付けを置き換える

### 要件 3: 記事の公開

**ユーザーストーリー:** 著者として、下書き記事を公開したい。それにより、読者が記事を閲覧できるようになる。

#### 受け入れ条件

1. WHEN 著者が下書き状態の記事に対して公開を実行した場合、THE System SHALL 記事のステータスを published に変更し、publishedAt を現在時刻に設定し、ArticlePublished ドメインイベントを発行する
2. WHEN タイトルが空の記事に対して公開を実行した場合、THE System SHALL 公開を拒否し、公開条件未達エラーを返す
3. WHEN 本文が空の記事に対して公開を実行した場合、THE System SHALL 公開を拒否し、公開条件未達エラーを返す
4. WHEN 既に公開済みの記事に対して公開を実行した場合、THE System SHALL 公開を拒否し、既に公開済みエラーを返す

### 要件 4: 記事の非公開化

**ユーザーストーリー:** 著者として、公開済みの記事を非公開 (下書き) に戻したい。それにより、記事を一時的に読者から非表示にできる。

#### 受け入れ条件

1. WHEN 著者が公開済みの記事に対して非公開化を実行した場合、THE System SHALL 記事のステータスを draft に変更し、ArticleUnpublished ドメインイベントを発行する
2. WHEN 既に下書き状態の記事に対して非公開化を実行した場合、THE System SHALL 非公開化を拒否し、既に下書き状態エラーを返す

### 要件 5: 記事の削除

**ユーザーストーリー:** 著者として、不要な記事を削除したい。それにより、記事一覧を整理できる。

#### 受け入れ条件

1. WHEN 著者が記事の削除を実行した場合、THE System SHALL 記事を永続化ストアから削除し、ArticleDeleted ドメインイベントを発行する
2. WHEN 存在しない記事に対して削除を実行した場合、THE System SHALL 記事が見つからないエラーを返す

### 要件 6: 閲覧数の記録

**ユーザーストーリー:** システム運営者として、記事の閲覧数を記録したい。それにより、記事の人気度を把握できる。

#### 受け入れ条件

1. WHEN ユーザーが記事を閲覧した場合、THE System SHALL 記事の閲覧数 (viewCount) を 1 増加させる
2. THE ViewCount SHALL 0以上の整数のみを保持し、負の値を許容しない
3. WHEN 閲覧数が増加した場合、THE ViewCount SHALL 新しいインスタンスを返し、元のインスタンスを変更しない

### 要件 7: いいねのトグル

**ユーザーストーリー:** 読者として、記事に「いいね」を付けたり外したりしたい。それにより、気に入った記事への評価を表明できる。

#### 受け入れ条件

1. WHEN ユーザーがまだ「いいね」していない記事に対していいねを実行した場合、THE System SHALL ArticleLike を作成し、記事の likeCount を 1 増加させ、ArticleLiked ドメインイベントを発行する
2. WHEN ユーザーが既に「いいね」済みの記事に対していいねを実行した場合、THE System SHALL ArticleLike を削除し、記事の likeCount を 1 減少させ、ArticleLikeRemoved ドメインイベントを発行する
3. THE LikeCount SHALL 0以上の整数のみを保持し、decrement 時に 0 未満にならないよう 0 で下限クランプする
4. THE ArticleLike SHALL articleId と userId の組み合わせでテナント内の一意性を保証する

### 要件 8: ブックマークのトグル

**ユーザーストーリー:** 読者として、記事をブックマーク (お気に入り) に追加したり解除したりしたい。それにより、後で読み返したい記事を管理できる。

#### 受け入れ条件

1. WHEN ユーザーがまだブックマークしていない記事に対してブックマークを実行した場合、THE System SHALL ArticleBookmark を作成し、ArticleBookmarked ドメインイベントを発行する
2. WHEN ユーザーが既にブックマーク済みの記事に対してブックマークを実行した場合、THE System SHALL ArticleBookmark を削除し、ArticleBookmarkRemoved ドメインイベントを発行する
3. THE ArticleBookmark SHALL articleId と userId の組み合わせでテナント内の一意性を保証する

### 要件 9: 記事一覧の取得

**ユーザーストーリー:** 読者として、公開済みの記事一覧をページネーション付きで閲覧したい。それにより、興味のある記事を効率的に探せる。

#### 受け入れ条件

1. WHEN ユーザーが記事一覧を要求した場合、THE System SHALL カーソルベースのページネーションで記事を返す
2. THE System SHALL 1ページあたりのデフォルト表示件数を 20 件、最大表示件数を 50 件とする
3. WHEN ユーザーがソート順を指定した場合、THE System SHALL 公開日時 (publishedAt)、閲覧数 (viewCount)、いいね数 (likeCount) のいずれかでソートする
4. WHEN ユーザーがソート順を指定しなかった場合、THE System SHALL 公開日時の降順でソートする
5. WHEN ユーザーがステータス・著者・タグでフィルタを指定した場合、THE System SHALL 指定された条件に一致する記事のみを返す
6. THE PaginatedResult SHALL nextCursor、prevCursor、hasNextPage、hasPrevPage を含み、次ページ・前ページの存在を示す

### 要件 10: ブックマーク一覧の取得

**ユーザーストーリー:** 読者として、自分がブックマークした記事の一覧をマイページで閲覧したい。それにより、保存した記事に素早くアクセスできる。

#### 受け入れ条件

1. WHEN ユーザーがブックマーク一覧を要求した場合、THE System SHALL 該当ユーザーのブックマーク済み記事をカーソルベースのページネーションで返す
2. THE System SHALL ブックマーク一覧の1ページあたりのデフォルト表示件数を 20 件、最大表示件数を 50 件とする
3. THE System SHALL ブックマーク一覧をブックマーク日時の降順でソートする

### 要件 11: 値オブジェクトのバリデーション

**ユーザーストーリー:** 開発者として、ドメインオブジェクトが常に有効な状態を保つことを保証したい。それにより、不正なデータがシステムに入り込むことを防げる。

#### 受け入れ条件

1. WHEN 空文字のタイトルで ArticleTitle を作成しようとした場合、THE ArticleTitle SHALL 作成を拒否しエラーを返す
2. WHEN 100文字を超えるタイトルで ArticleTitle を作成しようとした場合、THE ArticleTitle SHALL 作成を拒否しエラーを返す
3. WHEN 前後に空白を含むタイトルで ArticleTitle を作成した場合、THE ArticleTitle SHALL 前後の空白をトリムして保存する
4. WHEN 英小文字・数字・ハイフン以外の文字を含むスラッグで Slug を作成しようとした場合、THE Slug SHALL 作成を拒否しエラーを返す
5. WHEN 先頭・末尾にハイフンを含む、または連続ハイフンを含むスラッグで Slug を作成しようとした場合、THE Slug SHALL 作成を拒否しエラーを返す
6. WHEN 200文字を超えるスラッグで Slug を作成しようとした場合、THE Slug SHALL 作成を拒否しエラーを返す
7. WHEN 負の値で ViewCount を作成しようとした場合、THE ViewCount SHALL 作成を拒否しエラーを返す
8. WHEN 負の値で LikeCount を作成しようとした場合、THE LikeCount SHALL 作成を拒否しエラーを返す
9. WHEN 無効な ULID 文字列で ArticleId を作成しようとした場合、THE ArticleId SHALL 作成を拒否しエラーを返す

### 要件 12: マルチテナント分離

**ユーザーストーリー:** システム運営者として、テナント間のデータが完全に分離されることを保証したい。それにより、データの安全性とプライバシーを確保できる。

#### 受け入れ条件

1. THE System SHALL すべての記事・いいね・ブックマークのクエリに tenantId フィルタを含める
2. THE System SHALL テナント内でスラッグの一意性を保証する (異なるテナント間では同一スラッグを許容する)
3. THE System SHALL すべてのエンティティ (Article, ArticleLike, ArticleBookmark) に tenantId を持たせる

### 要件 13: エラーハンドリング

**ユーザーストーリー:** ユーザーとして、操作が失敗した場合に明確なエラーメッセージを受け取りたい。それにより、問題の原因を理解し対処できる。

#### 受け入れ条件

1. WHEN 存在しない記事に対して操作を実行した場合、THE System SHALL 「記事が見つかりません」エラーを返す
2. WHEN 公開条件を満たさない記事に対して公開を実行した場合、THE System SHALL 「公開条件を満たしていません」エラーを返す
3. WHEN 既に公開済みの記事に対して公開を実行した場合、THE System SHALL 「既に公開済みです」エラーを返す
4. WHEN 既に下書き状態の記事に対して非公開化を実行した場合、THE System SHALL 「既に下書き状態です」エラーを返す
5. WHEN 同一テナント内で既に使用されているスラッグで記事を作成・更新した場合、THE System SHALL 「このスラッグは既に使用されています」エラーを返す

### 要件 14: ドメインイベントの発行

**ユーザーストーリー:** 開発者として、重要なドメイン操作時にイベントが発行されることを保証したい。それにより、他のコンテキストやサービスとの連携が可能になる。

#### 受け入れ条件

1. WHEN 記事が作成された場合、THE Article SHALL ArticleCreated イベントを記録する
2. WHEN 記事が公開された場合、THE Article SHALL ArticlePublished イベントを記録する
3. WHEN 記事が非公開化された場合、THE Article SHALL ArticleUnpublished イベントを記録する
4. WHEN 記事が削除された場合、THE System SHALL ArticleDeleted イベントを生成する
5. WHEN いいねが追加された場合、THE System SHALL ArticleLiked イベントを発行する
6. WHEN いいねが解除された場合、THE System SHALL ArticleLikeRemoved イベントを発行する
7. WHEN ブックマークが追加された場合、THE System SHALL ArticleBookmarked イベントを発行する
8. WHEN ブックマークが解除された場合、THE System SHALL ArticleBookmarkRemoved イベントを発行する
9. WHEN ドメインイベントのクリアが要求された場合、THE Article SHALL 記録済みのイベントをすべて削除する
