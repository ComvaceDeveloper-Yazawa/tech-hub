import type { ArticleSeed } from './types';

export const securityArticles: ArticleSeed[] = [
  {
    title: '認証・認可ってなに？ — 「誰？」と「何していい？」の違いから始める',
    slug: 'authentication-and-authorization-basics',
    tags: ['認証', '認可', 'セキュリティ', 'JWT', '未経験'],
    content: `# 認証・認可ってなに？ — 「誰？」と「何していい？」の違いから始める

## はじめに

ログイン画面を実装しようとすると、急に現れる英単語たち。

> 「Authentication と Authorization って見た目ほぼ同じじゃん…」
> 「JWT とセッション、どっち使えばいいの？」
> 「OAuth、OpenID、SSO、バズワード多すぎ」

実はこれらは、レストランの入口と席のルールに例えるとスッと入ってきます。

> [!NOTE]
> この記事は「ログイン機能を作ってみたい、けど用語の海で溺れている」方向けです。具体的な実装より、**概念の地図**を提供します。

## TL;DR

- 認証 = 「あなたは誰？」の確認（Authentication）
- 認可 = 「あなたは何ができる？」の権限付与（Authorization）
- パスワードは必ずハッシュ化（bcrypt / Argon2）
- セッション認証 vs JWT、それぞれに得意分野
- OAuth は「他サービスのログインを借りる」仕組み
- パスキーは「パスワードを駆逐する」次世代認証
- 自作より NextAuth / Auth0 / Supabase Auth / Clerk を使うのが現代の主流

## 目次

- 認証と認可の違い
- レストランの例え
- パスワードの扱い方
- セッション認証
- JWT 認証
- セッション vs JWT
- OAuth 2.0 / OpenID Connect
- ソーシャルログイン
- 多要素認証
- パスワードレス / Passkey
- 認可のパターン
- 代表ライブラリ
- まとめ

## 認証と認可の違い

| 項目 | 認証 (AuthN) | 認可 (AuthZ) |
|---|---|---|
| 質問 | あなたは誰？ | 何してもいい？ |
| 例え | 身分証を見る | 会員ランクを確認 |
| 結果 | ユーザー ID が確定 | 許可/拒否 |
| 技術 | パスワード / Passkey / OAuth | RBAC / ABAC |

### レストランの例え

\`\`\`mermaid
sequenceDiagram
    participant U as あなた
    participant D as ドアマン
    participant S as ソムリエ

    U->>D: 予約名を伝える
    D->>U: 認証: 予約者リストに一致
    U->>S: 「ワイン飲みたい」
    S->>U: 認可: 20歳以上確認 → OK
\`\`\`

ドアマンが「誰か」を確認（認証）、ソムリエが「飲んでいいか」を確認（認可）。この2つは別物です。

## パスワードの扱い方

### 平文保存は**絶対に**ダメ

\`\`\`
# ❌ こんな DB は犯罪レベル
users
+----+----------+-----------+
| id | name     | password  |
+----+----------+-----------+
| 1  | alice    | hello123  |
+----+----------+-----------+
\`\`\`

### ハッシュ化 + ソルトが鉄則

- **bcrypt** / **Argon2** が推奨
- ソルトを1人ずつ加えて、同じパスワードでもハッシュがバラバラになるように

\`\`\`
# ✅ こちらが正解
users
+----+---------+--------------------------------------------+
| id | name    | password_hash                              |
+----+---------+--------------------------------------------+
| 1  | alice   | $2b$12$w8O... (bcrypt ハッシュ)             |
+----+---------+--------------------------------------------+
\`\`\`

> [!WARNING]
> MD5 や SHA-256 を単独で使うのは NG。高速すぎて総当り攻撃に弱いです。

## セッション認証

Cookie ベースの定番方式。

\`\`\`mermaid
sequenceDiagram
    participant C as ブラウザ
    participant S as サーバー
    participant D as DB

    C->>S: email/password でログイン
    S->>D: パスワード照合
    D-->>S: OK
    S->>D: セッション作成
    S-->>C: Set-Cookie: session_id=xxx
    C->>S: 以後のリクエスト（Cookie 付き）
    S->>D: session_id 照合
    S-->>C: レスポンス
\`\`\`

| 長所 | 短所 |
|---|---|
| サーバー側でセッションを即時無効化できる | セッションを DB に保存する必要 |
| Cookie + HTTPS で安全 | スケールする際に共有ストレージが必要 |

## JWT 認証

JSON Web Token。自己完結した署名付きトークン。

\`\`\`
eyJhbGciOiJIUzI1NiIs... . eyJzdWIiOiIxMjM0NSJ9... . SflKxwRJ...
  ヘッダー                   ペイロード              署名
\`\`\`

| 長所 | 短所 |
|---|---|
| サーバーが状態を持たない | 発行後の即時無効化が難しい |
| マイクロサービス間で持ち運びやすい | ペイロードは Base64 で誰でも読める |
| 水平スケールしやすい | 秘密鍵管理が命 |

> [!TIP]
> 「トークンが漏れた」に備えて、短い有効期限＋リフレッシュトークンが基本。

## セッション vs JWT

| 観点 | セッション | JWT |
|---|---|---|
| 状態 | サーバー持ち | 持たない |
| 取消 | 即時可能 | 工夫が必要 |
| スケール | ストレージ必要 | ステートレスで楽 |
| モバイル | Cookie が面倒 | トークン渡しがシンプル |
| 典型用途 | 従来の Web | API / マイクロサービス |

## OAuth 2.0 / OpenID Connect

「Google でログイン」の裏側。

- **OAuth 2.0**: 認可の枠組み（アクセス権の付与）
- **OpenID Connect (OIDC)**: OAuth の上に乗った認証層

\`\`\`mermaid
sequenceDiagram
    participant U as ユーザー
    participant App as あなたのアプリ
    participant G as Google

    U->>App: 「Google でログイン」
    App->>G: 認可リクエスト
    G->>U: 「同意しますか？」
    U->>G: 同意
    G->>App: authorization code
    App->>G: code を token に交換
    G-->>App: access_token + id_token
    App->>U: ログイン完了
\`\`\`

## ソーシャルログイン

| プロバイダ | 特徴 |
|---|---|
| Google | カバー率最強、法人メールもいける |
| GitHub | 開発者向けサービスの定番 |
| Apple | iOS アプリ必須、プライバシー重視 |
| LINE | 日本向けサービス |
| Twitter/X | 減少傾向だがまだ現役 |

> [!NOTE]
> Apple は iOS アプリに **Sign in with Apple** の実装を要求します（他のソーシャルログインがあるアプリは）。

## 多要素認証 (MFA/2FA)

- **Something you know**: パスワード
- **Something you have**: スマホ、セキュリティキー
- **Something you are**: 指紋、顔

この2つ以上を組み合わせるのが多要素認証。

TOTP（Google Authenticator 等）、SMS、WebAuthn など実装方法は多様。

## パスワードレス / Passkey

Apple / Google / Microsoft が推進する次世代認証。

- パスワードを入力しない
- 端末の生体認証＋公開鍵暗号で認証
- フィッシングに極めて強い

> [!IMPORTANT]
> Passkey は2026年現在、主要サービスで続々採用中。これから新規実装するなら優先検討。

## 認可のパターン

| パターン | 説明 | 例 |
|---|---|---|
| RBAC (Role Based) | 役割で判定 | admin / editor / viewer |
| ABAC (Attribute Based) | 属性で判定 | 部署 = 営業 AND 地域 = 東京 |
| ACL (Access Control List) | リソースごとの許可リスト | この記事を編集できるのは author のみ |
| ReBAC (Relationship Based) | 関係で判定 | 友達の友達まで閲覧可 |

小規模なら RBAC で十分。複雑化してきたら ABAC / ReBAC（Google Zanzibar）を検討。

## 代表ライブラリ

| ライブラリ | 得意 | 特徴 |
|---|---|---|
| [NextAuth.js (Auth.js)](https://authjs.dev/) | Next.js 向け | OSS、SSR 対応、ソーシャル簡単 |
| [Auth0](https://auth0.com/) | エンタープライズ | フル機能、ダッシュボードが優秀 |
| [Supabase Auth](https://supabase.com/auth) | 小〜中規模 | DB とセット、安価 |
| [Clerk](https://clerk.com/) | モダン Next.js | UI コンポーネントが美しい |
| [Firebase Auth](https://firebase.google.com/docs/auth) | モバイル | Google エコシステム |

> [!TIP]
> 認証まわりは**自作せずに任せる**のが現代の常識。セキュリティ事故を起こすと致命傷になります。

## よくある誤解

<details>
<summary>「認証さえあれば安全」</summary>

認可がザルだと、ログインした他人が全データを見られます。別物です。
</details>

<details>
<summary>「JWT は最強」</summary>

状況次第。セッションの方がシンプルで安全な場合もあります。
</details>

<details>
<summary>「ハッシュ化すればパスワードは漏れても大丈夫」</summary>

弱いハッシュや短いパスワードなら破られます。ハッシュ化は防御の**1枚目**。
</details>

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : email + password ログイン : bcrypt で保存
    Week 2 : Cookie セッション : ログアウト
    Week 3 : NextAuth で Google ログイン : セッション管理
    Week 4 : JWT の発行と検証 : Authorization ヘッダー
    Month 2 : 多要素認証 TOTP : 認可 RBAC 実装
    Month 3 : Passkey / WebAuthn : 最新仕様に触れる
\`\`\`

## まとめ

- 認証と認可は別物
- パスワードは必ずハッシュ化、できれば使わせない
- 自作せず、信頼できるライブラリ・SaaS に任せる
- 将来的にはパスキーへの移行を視野に

> [!IMPORTANT]
> 認証・認可は、セキュリティの土台です。一度理解すると、どのサービスでも応用が効きます。最初は「難しそう」に見えても、概念さえ掴めば実装は拍子抜けするほどシンプル。あなたの作るサービスを、守る側の知識を持って出していきましょう。

### 参考リソース

- [NextAuth.js Docs](https://authjs.dev/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 Simplified](https://www.oauth.com/)
- [Passkeys.dev](https://passkeys.dev/)
`,
  },
  {
    title: 'HTTPSってなに？ — 鍵マークの裏で動く「安全な通信」の仕組み',
    slug: 'what-is-https-for-beginners',
    tags: ['HTTPS', 'TLS', 'セキュリティ', '未経験'],
    content: `# HTTPSってなに？ — 鍵マークの裏で動く「安全な通信」の仕組み

## はじめに

ブラウザのアドレスバーに出る小さな鍵マーク。気にしたことありますか？

> 「HTTP に S が付いてるだけでしょ？」
> 「SSL と TLS の違いって何？」
> 「Let's Encrypt ってよく聞くけど、なんで無料なの？」

鍵マーク1つの裏には、暗号学・数学・運用が詰まっています。全部理解する必要はないですが、**仕組みの肌感覚**を持っていると、本番運用で強くなれます。

> [!NOTE]
> この記事は「HTTPS を設定したことはあるけど、何をしているのか正確にはわかっていない」方向けです。数式は出しません。

## TL;DR

- HTTPS = HTTP + TLS（通信の暗号化）
- 盗聴・改ざん・なりすましを防ぐ3点セット
- 公開鍵暗号と共通鍵暗号のハイブリッド
- TLS 証明書は認証局（CA）が発行
- Let's Encrypt のおかげで誰でも無料 HTTPS
- HTTP/2・HTTP/3 は HTTPS が前提
- 2026年現在、HTTPS なしの公開はほぼあり得ない

## 目次

- HTTP と HTTPS の違い
- なぜ暗号化が必要か
- TLS/SSL の役割
- 公開鍵暗号と錠前の例え
- TLS ハンドシェイク
- 証明書と認証局
- Let's Encrypt
- 証明書の種類
- HTTP/2 と HTTP/3
- HSTS
- よくある失敗
- 学習ロードマップ
- まとめ

## HTTP と HTTPS の違い

| 項目 | HTTP | HTTPS |
|---|---|---|
| 暗号化 | なし | あり（TLS） |
| 盗聴耐性 | 丸見え | 見えない |
| 改ざん耐性 | 検知できない | 検知できる |
| なりすまし | 防げない | 証明書で防ぐ |
| ブラウザ表示 | 「安全ではない」警告 | 鍵マーク |

HTTP は**ハガキ**、HTTPS は**封筒**みたいなものです。

## なぜ暗号化が必要か

想像してください。カフェの Wi-Fi でネットバンキングにログインします。

\`\`\`mermaid
graph LR
    A[あなた] -- パスワード --> B[Wi-Fi]
    B -- そのまま --> C[銀行]
    D[隣の席のハッカー] -. 盗聴 .-> B
\`\`\`

HTTP のままだと、このハッカーには全て丸見え。HTTPS で暗号化しておけば、盗聴されても解読不能な文字列にしか見えません。

## TLS/SSL の役割

- **SSL (Secure Sockets Layer)**: 歴史的名前、現在は使われない（脆弱）
- **TLS (Transport Layer Security)**: SSL の後継。現代の標準
- 今でも慣習的に「SSL証明書」と呼ばれますが、中身は TLS

TLS は3つを同時に実現します。

1. **機密性** — 通信内容を暗号化
2. **完全性** — 改ざんを検知
3. **認証性** — 相手が本物か確認

## 公開鍵暗号と錠前の例え

暗号の種類：

| 種類 | 鍵の数 | 速度 | 例え |
|---|---|---|---|
| 共通鍵暗号 | 1つ（両者が持つ） | 速い | 家の合鍵を渡す |
| 公開鍵暗号 | 2つ（公開鍵と秘密鍵） | 遅い | 南京錠を郵送 |

公開鍵暗号の例え: 「**開けっ放しの南京錠**」を渡して、誰でも荷物を閉じられるようにする。でも**開けられるのは秘密鍵を持つ自分だけ**。

TLS はこの2つをハイブリッドで使います。遅い公開鍵暗号で「共通鍵」をこっそり共有し、そこからは速い共通鍵暗号で通信する。

## TLS ハンドシェイク

\`\`\`mermaid
sequenceDiagram
    participant C as ブラウザ
    participant S as サーバー

    C->>S: ClientHello（対応暗号一覧）
    S->>C: ServerHello + 証明書 + 公開鍵
    C->>C: 証明書の検証
    C->>S: 暗号化された「共通鍵」
    Note over C,S: 以降は共通鍵で高速通信
    C->>S: GET / （暗号化）
    S->>C: レスポンス（暗号化）
\`\`\`

TLS 1.3 ではこれが **1RTT** でほぼ完了します。昔と比べて爆速。

## 証明書と認証局

サーバーの公開鍵が本物だと保証するのが **TLS 証明書**。発行するのが **認証局（CA: Certificate Authority）**。

\`\`\`mermaid
graph TB
    R[ルート認証局<br/>DigiCert など] --> I[中間認証局]
    I --> S[あなたのサーバー証明書]
\`\`\`

ブラウザは主要なルート CA を**最初から信頼**しています。チェーンを辿って、信頼できるか判定します。

## Let's Encrypt

2016年に登場した**無料 CA**。現代の Web が HTTPS 化した最大の功労者。

- 完全無料
- 自動発行（ACME プロトコル）
- 90日有効、自動更新が前提

Vercel・Netlify・Cloudflare など主要サービスは裏側で Let's Encrypt を使って**自動発行してくれる**ので、我々ユーザーは何もしなくて OK。

## 証明書の種類

| 種類 | 検証レベル | 用途 |
|---|---|---|
| DV (Domain Validation) | ドメイン所有のみ確認 | 一般的。Let's Encrypt はこれ |
| OV (Organization Validation) | 法人実在確認 | 企業サイト |
| EV (Extended Validation) | 法人審査＋厳格確認 | 銀行・金融（昔は緑バー表示）|

> [!NOTE]
> かつて EV には「緑のバー」や会社名表示がありましたが、最近のブラウザでは表示が控えめになりました。

## HTTP/2 と HTTP/3

HTTPS の上で動く新しい HTTP プロトコル。

| バージョン | 特徴 |
|---|---|
| HTTP/1.1 | テキストベース、遅い |
| HTTP/2 | バイナリ、多重化、ヘッダ圧縮 |
| HTTP/3 | QUIC ベース、UDP、モバイル最強 |

**HTTPS があって初めて** 2 や 3 が使えます。つまり HTTPS = 速度にも貢献。

## HSTS

\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains
\`\`\`

一度このヘッダを送ると、ブラウザは**以降 HTTP アクセスを拒否**します。プリロードリストに登録すれば、初回から HTTPS 強制も可能。

## よくある失敗

<details>
<summary>証明書期限切れ</summary>

自動更新されていないと、ある日突然「安全ではない」表示に。Let's Encrypt なら 60 日ごと更新がおすすめ。
</details>

<details>
<summary>混在コンテンツ</summary>

HTTPS ページに HTTP の画像を埋め込むと、ブラウザが警告を出します。全てのリソースを HTTPS に。
</details>

<details>
<summary>自己署名証明書を本番で使う</summary>

テスト用には便利ですが、本番では絶対 NG。CA に発行してもらいましょう。
</details>

<details>
<summary>古い TLS バージョンを許可</summary>

TLS 1.0 / 1.1 は現代では脆弱。TLS 1.2 以上、できれば 1.3 対応に。
</details>

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : Vercel で独自ドメイン HTTPS : 鍵マーク確認
    Week 2 : Cloudflare で DNS + HTTPS : CDN 体験
    Week 3 : Let's Encrypt を自前サーバーに : certbot
    Week 4 : HSTS / CSP ヘッダー設定
    Month 2 : curl -v で TLS ハンドシェイク観察 : wireshark
    Month 3 : HTTP/2 / HTTP/3 の速度比較
\`\`\`

## まとめ

- HTTPS は「暗号化された HTTP」
- 盗聴・改ざん・なりすましを同時に防ぐ
- 証明書は CA が発行、Let's Encrypt なら無料
- PaaS を使えば面倒な設定は不要

> [!IMPORTANT]
> 鍵マーク1つの裏には、世界中の研究者が積み上げた暗号学とインフラがあります。普段気にしなくても、その恩恵を受けているのがエンジニアの仕事です。仕組みを知ると、セキュリティ事故を起こしにくくなります。あなたの作るサービスを、鍵付きで届けましょう。

### 参考リソース

- [Let's Encrypt 公式](https://letsencrypt.org/ja/)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/) — 証明書診断
- [Mozilla Observatory](https://observatory.mozilla.org/) — セキュリティヘッダ診断
- [HTTP/3 Explained](https://http3-explained.haxx.se/ja/)
`,
  },
  {
    title: 'Webセキュリティ入門 — 攻撃者に狙われる前に知っておきたい10のこと',
    slug: 'web-security-basics-for-beginners',
    tags: ['セキュリティ', 'XSS', 'CSRF', 'OWASP', '未経験'],
    content: `# Webセキュリティ入門 — 攻撃者に狙われる前に知っておきたい10のこと

## はじめに

最初は小さな個人サービスでも、本番に出た瞬間、あなたのアプリは**世界中から狙われます**。

> 「たかが個人ブログに誰が攻撃してくるの？」
> 「普通に書いてれば大丈夫でしょ？」

答えは「自動化されたボットが、24時間365日、無差別に叩いている」です。セキュリティは規模の問題ではなく、**公開した時点で関係してくるトピック**。

> [!NOTE]
> この記事は「セキュリティを勉強しようと思いつつ、OWASP Top 10 で挫折した」方向けです。全部完璧に押さえるより、**最低限守るべき線**を明確にします。

## TL;DR

- XSS / CSRF / SQLi / 認可不備は今も現役の脅威
- パスワードは bcrypt / Argon2、CSP で XSS 緩和、SameSite Cookie で CSRF 緩和
- npm audit と Dependabot で依存の脆弱性を追跡
- シークレットを Git に入れない。入れたら即ローテーション
- レート制限と監視で「変なアクセス」を検知
- 現代は自作より既製サービス（認証・WAF）を使う

## 目次

- OWASP Top 10
- XSS
- CSRF
- SQL インジェクション
- パスワードの安全な保存
- CSP ヘッダー
- CORS
- SameSite Cookie
- シークレット管理
- レート制限
- 依存脆弱性
- Git にシークレットを push したら
- SAST / DAST
- 開発者の10箇条
- 学習ロードマップ
- まとめ

## OWASP Top 10

Web アプリの脆弱性トップ10ランキング。世界中の専門家が数年ごとに更新。

- アクセス制御の不備
- 暗号の不備
- インジェクション（XSS, SQLi 含む）
- 安全でない設計
- セキュリティ設定ミス
- 脆弱で古いコンポーネント
- 認証の不備
- データ整合性の不備
- ログ・監視の不備
- SSRF

> [!TIP]
> 全部暗記しようとすると挫折します。**今日直せるもの**から手をつけるのが吉。

## XSS（クロスサイトスクリプティング）

他人が書いたスクリプトを、あなたのページ上で実行される攻撃。

\`\`\`html
<!-- ユーザー入力をそのまま出力 → NG -->
<div>\${userInput}</div>

<!-- userInput = "<script>stealCookie()</script>" -->
\`\`\`

### 対策

- テンプレートエンジンの**自動エスケープ**を信じる
- \`dangerouslySetInnerHTML\` は極力使わない
- **CSP ヘッダ**で外部スクリプトの実行を制限
- ユーザー入力は Zod などでバリデーション

## CSRF（クロスサイトリクエストフォージェリ）

ログイン中のユーザーに、**知らぬ間に**自サービスに操作を送らせる攻撃。

\`\`\`html
<!-- 悪意ある別サイト -->
<img src="https://bank.example.com/transfer?to=attacker&amount=1000000">
\`\`\`

### 対策

- **SameSite=Lax / Strict** Cookie
- CSRF トークン（フォームに隠しフィールド）
- 重要操作は POST で、Origin ヘッダをチェック

## SQL インジェクション

ユーザー入力を SQL に直接埋め込んだときの悲劇。

\`\`\`typescript
// ❌ 絶対にやってはいけない
const query = \`SELECT * FROM users WHERE name = '\${name}'\`;

// name = "'; DROP TABLE users;--"
\`\`\`

### 対策

- **プレースホルダ（パラメータ化クエリ）**を使う
- **ORM（Prisma / Drizzle）** を使うと自動で防げる
- 生 SQL を書くなら、入力は必ずパラメータとして渡す

## パスワードの安全な保存

| アルゴリズム | 状態 |
|---|---|
| 平文 | 論外 |
| MD5 / SHA-1 / SHA-256 単独 | NG |
| bcrypt | OK |
| Argon2 | ベスト |
| scrypt | OK |

- コスト（反復回数）を十分に高く
- ユーザーごとのソルト（自動で入る）
- ペッパー（環境変数の secret）を追加するとさらに堅牢

## CSP ヘッダー

\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
\`\`\`

「このサイトからのスクリプトだけ実行 OK」とブラウザに宣言する仕組み。XSS の威力を大幅に削ぎます。

> [!TIP]
> 最初は \`Content-Security-Policy-Report-Only\` で試運転すると、既存ページを壊さずに調整できます。

## CORS

別オリジンからの API アクセスを制御する仕組み。

\`\`\`http
Access-Control-Allow-Origin: https://your-app.example.com
Access-Control-Allow-Credentials: true
\`\`\`

- \`*\` は安易に使わない
- Credentials を含める場合は必ず特定オリジンを指定

## SameSite Cookie

\`\`\`http
Set-Cookie: sid=xxx; Secure; HttpOnly; SameSite=Lax
\`\`\`

| 値 | 意味 |
|---|---|
| Strict | 完全に同一オリジンでのみ送信 |
| Lax | トップレベルナビゲーションは OK |
| None | クロスサイトでも送信（要 Secure） |

現代のブラウザは**デフォルトが Lax**。

## シークレット管理

**絶対に**コードに埋め込まない。

| 場所 | シークレット管理 |
|---|---|
| ローカル | \`.env.local\`（Git にコミットしない） |
| 本番 | Vercel / Railway / AWS Secrets Manager |
| CI | GitHub Actions Secrets |

> [!WARNING]
> \`.env\` を何度も \`git reset\` し忘れて push している人、めちゃくちゃ多いです。git-secrets や GitHub の secret scanning を ON に。

## レート制限

ブルートフォース、スクレイピング、API 乱用を防ぐ。

- ログイン失敗は数回で一時ロック
- API はユーザーごと / IP ごとに秒間 X 回まで
- Cloudflare / Vercel WAF など CDN レベルでの制限が強力

## 依存脆弱性

npm パッケージの数は膨大で、誰かが使っているパッケージの中に脆弱性が含まれることは日常茶飯事。

\`\`\`bash
npm audit
npm audit fix
\`\`\`

- **Dependabot**（GitHub 内蔵）で PR 自動化
- **Renovate** も優秀
- 定期的にアップデート

## Git にシークレットを push したら

1. **すぐにシークレットを無効化・ローテーション**
2. 履歴からファイルを消す（\`git filter-repo\` など）
3. フォース push する
4. ログを監査

> [!WARNING]
> 「プライベートリポジトリだから大丈夫」と思わない。AWS キーはスキャナーに拾われて数秒で悪用されます。まずは**鍵を作り直す**のが最優先。

## SAST / DAST

| 種類 | 意味 | 例 |
|---|---|---|
| SAST | 静的解析（コードを読む） | ESLint security plugin, Snyk |
| DAST | 動的解析（実行中のサイトを攻撃してみる） | OWASP ZAP, Burp Suite |

両方組み合わせると最強。

## 開発者が最低限守るべき10箇条

1. シークレットを Git に入れない
2. 依存パッケージを定期更新
3. パスワードは bcrypt/Argon2
4. 入力を信じず、必ず検証
5. SQL は ORM か パラメータ化
6. XSS 対策（エスケープ＋CSP）
7. CSRF 対策（SameSite / トークン）
8. HTTPS を強制（HSTS）
9. ログインは失敗回数制限
10. 監視・アラートを用意

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : OWASP Top 10 を読む : 自サイトを自己診断
    Week 2 : npm audit / Dependabot : 依存の監視
    Week 3 : CSP / HSTS ヘッダ追加
    Week 4 : CSRF / XSS ハンズオン (juice-shop)
    Month 2 : レート制限実装 : ログイン失敗検知
    Month 3 : Cloudflare WAF : 監視ダッシュボード
\`\`\`

## まとめ

- 完璧なセキュリティはないが、**基本を外さない**ことは可能
- 自作より**既製の防御**を重ねる
- 定期的な監査と依存更新でリスクを下げる

> [!IMPORTANT]
> セキュリティは**姿勢**です。一度完璧にしても、明日には新しい脆弱性が出ます。だからこそ「知っている」「気をつけている」「監視している」という状態を保つのが大事。難しく考えすぎず、今日できる小さな一歩から。あなたのサービスを守るのは、他でもないあなた自身です。

### 参考リソース

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/ja/docs/Web/Security)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — 練習用の脆弱アプリ
`,
  },
];
