import type { ArticleSeed } from './types';

export const infraDevopsArticles: ArticleSeed[] = [
  {
    title:
      'Git/GitHubってなに？ — 開発者の相棒、バージョン管理の世界へようこそ',
    slug: 'what-is-git-and-github-for-beginners',
    tags: ['Git', 'GitHub', 'インフラ', '未経験'],
    content: `# Git/GitHubってなに？ — 開発者の相棒、バージョン管理の世界へようこそ

## はじめに

プログラミングの勉強を始めて少し経つと、必ずと言っていいほど出会う言葉が「Git」と「GitHub」です。

> 「チュートリアル通りにやっていたら、突然 \`git commit\` と打たされた」
> 「GitHub って猫のマークの可愛いサイトだけど、なんで開発者はみんな使ってるの？」
> 「ていうか Git と GitHub って何が違うの？」

最初はみんな混乱します。わたしもそうでした。でもこれ、エンジニアにとって電気やガスみたいなインフラです。使えないと仕事が始まりません。

逆に言えば、ここを押さえておくと一気に「開発者っぽい」動きができるようになります。

> [!NOTE]
> この記事は「Git を触ったことがない、または \`git push\` と \`git pull\` を呪文のように唱えているだけ」の方向けです。細かいコマンドよりも、全体像と「なぜ必要か」を腹落ちさせることを優先します。

## TL;DR

- Git は「ファイルの変更履歴を管理するツール」で、ローカル PC で動きます
- GitHub は「Git で管理したコードをオンラインで共有・共同編集できるサービス」です
- 変更を保存する流れは \`add\` → \`commit\` → \`push\` の3ステップ
- ブランチを使えば、本線を壊さずに安全に新機能を試せます
- Pull Request は「マージしていい？」とチームにお伺いを立てる仕組み
- チーム開発に不可欠で、個人開発でも使うと過去の自分を救える
- コマンドは最初はコピペで OK。使っているうちに馴染みます

## 目次

- バージョン管理って何？
- Git と GitHub の違い
- 基本のコマンドたち
- ブランチという「作業のパラレルワールド」
- Pull Request とレビュー文化
- コンフリクトと向き合う
- \`.gitignore\` の書き方
- コミットメッセージの書き方
- GitHub の周辺機能
- GitHub vs GitLab vs Bitbucket
- よくあるアンチパターン
- 学習ロードマップ
- まとめ

## バージョン管理って何？

想像してみてください。卒論を書いているときのファイル名、こうなっていませんでしたか？

\`\`\`
卒論.docx
卒論_修正版.docx
卒論_修正版_FINAL.docx
卒論_修正版_FINAL_本当に最後.docx
卒論_修正版_FINAL_本当に最後_教授に見せた後.docx
\`\`\`

あの地獄を、プログラムレベルで、そして複数人で、賢く解決するのが「バージョン管理システム」です。

Git を使うと、

- いつ、誰が、どのファイルを、どう変更したかがすべて記録される
- 好きな時点に巻き戻せる
- 複数人が同じコードを並行して編集できる

ようになります。タイムマシンとチームチャットが合体したようなものですね。

### Git の歴史

Git は 2005年に **Linus Torvalds**（Linux カーネルの生みの親）が作りました。Linux カーネル開発で使っていた BitKeeper というツールが有料化したことに激怒し、たった数週間で自作してしまったという伝説のツールです。

> [!TIP]
> 「git」は英国スラングで「嫌な奴」という意味もあります。Linus 本人が「自分の名前を取った」とも言っていて、彼らしいユーモアが詰まっています。

## Git と GitHub の違い

ここが最初の壁です。

| 項目 | Git | GitHub |
|---|---|---|
| 正体 | バージョン管理ツール（ソフトウェア） | Git のホスティングサービス（Web サービス） |
| 場所 | 自分の PC（ローカル） | インターネット上（クラウド） |
| 料金 | 無料・OSS | 基本無料、ビジネス機能は有料 |
| 運営 | コミュニティ | Microsoft 傘下の会社 |
| 例え | ビデオカメラ | YouTube |

Git は「動画を撮る機材」、GitHub は「撮った動画をアップする YouTube」と考えるとわかりやすいです。

\`\`\`mermaid
graph LR
    A[ローカル PC<br/>Git で管理] -->|push| B[GitHub<br/>みんなで共有]
    B -->|clone / pull| C[同僚の PC<br/>Git で管理]
    C -->|push| B
    B -->|pull| A
\`\`\`

## 基本のコマンドたち

ここは暗記不要です。使いながら覚えます。

| コマンド | やること | 例え |
|---|---|---|
| \`git init\` | Git 管理を開始する | ノートを買って1ページ目を開く |
| \`git clone <url>\` | GitHub からコードを手元に取ってくる | 本を図書館から借りる |
| \`git add <file>\` | 変更を「次に記録するリスト」に入れる | レシートをまとめる |
| \`git commit -m "..."\` | 変更をスナップショットとして記録 | 家計簿に書き込む |
| \`git push\` | ローカルの記録を GitHub に送る | 家計簿をクラウドに同期 |
| \`git pull\` | GitHub の変更をローカルに取り込む | 最新の共有ノートをダウンロード |
| \`git status\` | 今の状態を確認 | 部屋を見渡す |
| \`git log\` | これまでの歴史を見る | 日記を読み返す |

典型的な1日の流れはこんな感じです。

\`\`\`bash
# 朝、最新の状態を取り込む
git pull

# 作業をする
# ... コードを書く ...

# 変更を記録する
git add .
git commit -m "feat: ログインフォームを追加"

# チームに共有
git push
\`\`\`

> [!NOTE]
> \`git add\` と \`git commit\` が分かれているのが最初は謎ですが、「記録するもの」と「記録しないもの」を選べる余白だと思うとしっくりきます。

## ブランチという「作業のパラレルワールド」

Git の真価はブランチにあります。ブランチは「作業用の分身」です。

\`\`\`mermaid
gitGraph
    commit id: "初期"
    commit id: "ヘッダー追加"
    branch feature/login
    commit id: "ログイン画面"
    commit id: "バリデーション"
    checkout main
    commit id: "ロゴ修正"
    merge feature/login
    commit id: "ログイン完成"
\`\`\`

main ブランチはサービスの本番。そこで実験すると壊れます。なので \`feature/login\` のような別ブランチを作り、そこで自由に試します。うまくいったら main に合流（マージ）させます。

### ブランチ戦略

代表的なルール2種。

| 戦略 | 特徴 | 向いているチーム |
|---|---|---|
| git-flow | main / develop / feature / release / hotfix と多数のブランチ | 大規模、リリース時期が決まっている |
| GitHub Flow | main と feature ブランチだけのシンプル構成 | スピード重視、継続的デプロイ |

> [!TIP]
> 最初は GitHub Flow で十分です。シンプルは正義。

## Pull Request とレビュー文化

ブランチで作った変更を main に合流させる前に、「これどう思う？」とチームに見せるのが Pull Request（以下 PR）です。

\`\`\`mermaid
sequenceDiagram
    participant Dev as 開発者
    participant GH as GitHub
    participant Rev as レビュアー

    Dev->>GH: feature ブランチを push
    Dev->>GH: PR を作成
    GH->>Rev: 通知
    Rev->>GH: コードを読む・コメント
    Rev->>Dev: 「ここ直して」
    Dev->>GH: 修正を push
    Rev->>GH: Approve
    Dev->>GH: main にマージ
\`\`\`

PR のいいところは、

- **第三者の視点が入る** — バグや読みにくい箇所を指摘してもらえる
- **知識が共有される** — 「そんな書き方があるんだ」と学びになる
- **履歴が残る** — なぜこの変更をしたかが未来の自分に伝わる

ただのコードレビューではなく、**チームで育てる文化**そのものです。

## コンフリクトと向き合う

複数人が同じ行を編集すると、Git は「どっちが正しいか自分には判断できません」と手を上げます。これがコンフリクトです。

\`\`\`
<<<<<<< HEAD
console.log('こんにちは');
=======
console.log('Hello');
>>>>>>> feature/english
\`\`\`

慌てず、残したい方を選んでマーカー（\`<<<<<<<\` など）を消せば OK。初心者が最初に怖がるポイントですが、慣れれば **ただのパズル**です。

## \`.gitignore\` の書き方

管理したくないファイル（秘密情報、ビルド成果物など）は \`.gitignore\` に書きます。

\`\`\`gitignore
# 依存パッケージ
node_modules/

# 環境変数（絶対にコミットしない）
.env
.env.local

# ビルド成果物
dist/
.next/

# OS 固有
.DS_Store
Thumbs.db
\`\`\`

> [!WARNING]
> \`.env\` をうっかり push してしまい、API キーが漏れる事故は**毎週のように起きています**。最初から \`.gitignore\` に入れる癖をつけてください。

## コミットメッセージの書き方

未来の自分と同僚に向けた手紙です。適当に書くと、半年後に自分が泣きます。

### Conventional Commits

\`\`\`
<type>(<scope>): <subject>

例:
feat(auth): ログイン機能を追加
fix(ui): ボタンのホバー色を修正
docs(readme): セットアップ手順を追記
refactor(api): 記事取得ロジックを分割
\`\`\`

| type | 意味 |
|---|---|
| feat | 新機能 |
| fix | バグ修正 |
| refactor | 動作を変えないリファクタ |
| docs | ドキュメント |
| test | テスト |
| chore | 設定・雑務 |

> [!TIP]
> 「このコミットは何をした？」に50文字以内で答えられるようにすると、自然と変更が小さくなります。

## GitHub の周辺機能

GitHub は単なるコード置き場ではありません。開発プラットフォームです。

| 機能 | できること |
|---|---|
| Issues | バグ報告・タスク管理 |
| Pull Request | コードレビュー・マージ |
| Actions | CI/CD（テスト自動実行など） |
| Pages | 静的サイトを無料公開 |
| Copilot | AI によるコード補完 |
| Projects | かんばん方式のタスクボード |
| Discussions | フォーラム形式の議論 |

GitHub が使えると、個人開発でもチーム開発でも一気にレベルが上がります。

## GitHub vs GitLab vs Bitbucket

| 項目 | GitHub | GitLab | Bitbucket |
|---|---|---|---|
| 運営 | Microsoft | GitLab Inc. | Atlassian |
| 強み | 世界最大のシェア、OSS の聖地 | 統合 DevOps、セルフホスト | Jira 連携 |
| 無料枠 | プライベート無制限 | プライベート無制限 | 小規模チーム無料 |
| 採用市場 | ここを見られる | 企業で採用が多い | Atlassian 圏で採用 |

> [!NOTE]
> 未経験のうちは GitHub 一択で問題なしです。就活でもポートフォリオの置き場として圧倒的に使われています。

## よくあるアンチパターン

<details>
<summary>1. main に直 push する</summary>

本番ブランチで実験してしまう事故。ブランチを切りましょう。
</details>

<details>
<summary>2. 巨大な1コミット</summary>

「1日分の作業を最後にまとめてコミット」はやめましょう。小さく、意味のある単位で。
</details>

<details>
<summary>3. コミットメッセージが「修正」</summary>

何を修正したのか未来の自分もわからなくなります。
</details>

<details>
<summary>4. \`.env\` を push する</summary>

秘密鍵流出、アカウント停止、最悪 AWS の請求が数十万円…実話です。
</details>

<details>
<summary>5. \`git push -f\` を乱発する</summary>

force push は他人の作業を消し飛ばすことがあります。使うときは十分に注意を。
</details>

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : Git をインストール : GitHub アカウント作成 : 練習用リポジトリ作成
    Week 2 : add / commit / push / pull : ブランチを切ってみる
    Week 3 : Pull Request を出す : コンフリクト体験
    Week 4 : 自分のポートフォリオを push : GitHub Pages で公開
    Month 2 : OSS にコメントしてみる : 小さな typo 修正 PR
    Month 3 : GitHub Actions で自動テスト : README を充実させる
\`\`\`

## まとめ

Git と GitHub は、最初こそ「呪文の暗記大会」に見えますが、慣れると **過去の自分・未来の自分・チームメイトすべてを助ける道具**になります。

大事なのはコマンドを覚えることではなく、

- 変更を小さく、意味のある単位で記録する
- 本線と作業ブランチを分ける
- メッセージで「なぜ」を伝える

この3つです。最初は毎回ググって大丈夫。みんなそうしてきました。

> [!IMPORTANT]
> Git は「壊したら終わり」のツールではありません。ほとんどの操作はやり直せます。だから安心して触ってください。手を動かした人だけが、ある日突然「あ、いま全部繋がった」と腹落ちする瞬間を迎えられます。あなたもその1人になれます。

### 参考リソース

- [Pro Git (日本語)](https://git-scm.com/book/ja/v2) — 公式かつ無料の決定版書籍
- [GitHub Docs](https://docs.github.com/ja) — GitHub 公式ドキュメント
- [サル先生のGit入門](https://backlog.com/ja/git-tutorial/) — 図解が豊富で初心者に優しい
- [Oh Shit, Git!?!](https://ohshitgit.com/ja) — 事故ったときの救急箱
`,
  },
  {
    title: 'Dockerってなに？ — 「自分のPCでは動くんです」を過去にする魔法の箱',
    slug: 'what-is-docker-for-beginners',
    tags: ['Docker', 'インフラ', 'コンテナ', '未経験'],
    content: `# Dockerってなに？ — 「自分のPCでは動くんです」を過去にする魔法の箱

## はじめに

開発現場で最も有名な言い訳、それが「自分のPCでは動くんですけど…」です。

環境の違いで動いたり動かなかったり、新人の PC セットアップに半日かかったり、本番で動かないサービス。これらの問題をまとめて解決してくれるのが **Docker** です。

> 「コンテナって聞いたことあるけど、港のあのコンテナ？」
> 「VM とは違うらしいけど、何が違うの？」
> 「Dockerfile って書き方が謎すぎる」

最初は戸惑うと思います。でも、一度仕組みがわかれば、もう Docker なしの開発には戻れません。

> [!NOTE]
> この記事は「Docker って名前は聞くけど、仮想マシンとの違いがよくわからない」方向けです。具体的な Dockerfile の書き方よりも、「なぜ Docker が革命だったのか」を中心に説明します。

## TL;DR

- Docker は「アプリと動作環境を1つの箱（コンテナ）にまとめる」技術
- 仮想マシンより軽量・高速で、起動は秒単位
- Dockerfile で「環境の作り方」をコードとして残せる
- docker-compose で複数サービスをまとめて起動できる
- 開発環境の差異による不具合がほぼ消える
- 本番でも使われる。Kubernetes はその集合体

## 目次

- コンテナって何？
- 仮想マシンとの違い
- 「自分のPCでは動く」問題の正体
- Image と Container の違い
- Dockerfile の書き方
- docker-compose で複数コンテナ
- Docker Hub とイメージ共有
- 本番で使うときの注意
- Kubernetes との関係
- 開発環境と Dev Containers
- ハンズオン: Node.js + PostgreSQL
- 学習ロードマップ
- まとめ

## コンテナって何？

コンテナは「軽量な仮想環境」です。船のコンテナを思い浮かべてください。

- 中身（荷物）が何であろうと、外側の規格が同じだから、どんな船・トラック・港でも運べる

Docker コンテナも同じで、

- 中身（アプリ・依存ライブラリ・設定）をひとまとめにして、
- どの OS・どのサーバーでも同じように動かせる

という魔法の箱です。

## 仮想マシンとの違い

これが最大のポイント。

| 項目 | 仮想マシン（VM） | Docker コンテナ |
|---|---|---|
| OS | ゲスト OS を丸ごと積む | ホスト OS のカーネルを共有 |
| 起動時間 | 分単位 | 秒単位 |
| サイズ | GB 単位 | MB 単位が普通 |
| 隔離レベル | 強い（OS ごと別） | OS は共有、プロセスを分離 |
| 1台のサーバーに | 数個 | 数十〜数百 |

\`\`\`mermaid
graph TB
    subgraph 仮想マシン
        A1[アプリ A] --- G1[ゲスト OS]
        A2[アプリ B] --- G2[ゲスト OS]
        G1 --- H1[ハイパーバイザ]
        G2 --- H1
        H1 --- O1[ホスト OS]
    end

    subgraph Docker
        B1[アプリ A] --- D[Docker Engine]
        B2[アプリ B] --- D
        B3[アプリ C] --- D
        D --- O2[ホスト OS]
    end
\`\`\`

VM は「家を丸ごと建てる」、Docker は「マンションの部屋を借りる」イメージです。どちらが軽いかは明らかですね。

## 「自分のPCでは動く」問題の正体

この定番セリフが発動する理由は、環境差です。

- Node.js のバージョンが違う
- ライブラリの細かいバージョンが違う
- OS のパスや権限が違う
- 誰かがローカルで入れた環境変数が違う

Docker は「アプリが動く環境ごと持ち運ぶ」ので、A さんの PC でも B さんの PC でも本番サーバーでも、**全く同じ環境で動きます**。

> [!TIP]
> チーム開発で新人が参加したとき、\`git clone\` → \`docker compose up\` の2コマンドで開発を始められる。これが Docker の威力です。

## Image と Container の違い

ここでも混乱ポイント。

| 概念 | 例え |
|---|---|
| Image | クッキーの型。設計図。動かない |
| Container | その型で焼いたクッキー。実体。動く |

1つの Image から、コンテナはいくつでも作れます。

\`\`\`bash
# Image を取ってくる
docker pull node:20

# Image からコンテナを作って起動
docker run -it node:20 bash

# コンテナ一覧を見る
docker ps
\`\`\`

## Dockerfile の書き方

Dockerfile は「この環境をこう作ってね」という指示書です。

\`\`\`dockerfile
# ベースにする環境
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# package.json を先にコピーして依存だけインストール（キャッシュ効かせるテクニック）
COPY package*.json ./
RUN npm ci

# アプリ本体をコピー
COPY . .

# ビルド
RUN npm run build

# 起動時に実行するコマンド
CMD ["npm", "start"]
\`\`\`

主な命令はこれだけ押さえれば OK。

| 命令 | 意味 |
|---|---|
| FROM | ベースになる Image |
| WORKDIR | 作業ディレクトリ |
| COPY | ホストからコンテナへファイルコピー |
| RUN | ビルド時に実行するコマンド |
| CMD | コンテナ起動時に実行するコマンド |
| EXPOSE | 使うポートを宣言 |

> [!NOTE]
> \`RUN\` は「Image を作るとき」、\`CMD\` は「Container を動かすとき」に実行されます。ここの違いが最初ピンと来ないのですが、パン屋で言えば「RUN=生地を焼く」「CMD=お客さんに出す」です。

## docker-compose で複数コンテナ

本物のアプリはフロント・バック・DB など複数サービスで動いています。これを1つの YAML で管理するのが docker-compose です。

\`\`\`yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
\`\`\`

\`docker compose up\` を叩くだけで、Web とデータベースが連携した環境が立ち上がります。

## Docker Hub とイメージ共有

Docker Hub は「GitHub の Docker 版」。世界中のイメージが共有されています。

- \`nginx\` — 超有名 Web サーバー
- \`postgres\` — データベース
- \`node\` — Node.js 実行環境
- \`python\` — Python 実行環境

自分で作ったイメージを公開することもできます。

> [!WARNING]
> Docker Hub にはセキュリティ上怪しいイメージも混ざっています。公式（Official）または Verified Publisher の印があるものを選びましょう。

## 本番で使うときの注意

- **サイズを小さく**: \`alpine\` ベースのイメージや **マルチステージビルド**を使う
- **\`root\` ユーザーで動かさない**: セキュリティの基本
- **シークレットを \`ENV\` に埋め込まない**: Image に残ってしまう
- **ログは標準出力へ**: ログ収集ツールに拾わせる

### マルチステージビルド例

\`\`\`dockerfile
# --- build 用ステージ ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# --- 本番用ステージ（成果物だけ移す）---
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
\`\`\`

最終 Image にビルドツールを残さないので、サイズと攻撃面が大幅に減ります。

## Kubernetes との関係

Docker が「1つのコンテナを動かすための道具」なら、Kubernetes（通称 k8s）は「何百ものコンテナを束ねて運用するオーケストラの指揮者」です。

| 規模 | 適した道具 |
|---|---|
| 個人開発 | docker / docker-compose |
| スモールスタートの本番 | Cloud Run / Railway / Fly.io など |
| 大規模本番 | Kubernetes |

> [!TIP]
> 未経験のうちから Kubernetes を学ぶ必要はありません。まずは Docker でコンテナの感覚を掴むのが先です。

## 開発環境と Dev Containers

VS Code には **Dev Containers** 機能があり、プロジェクトの開発環境まるごとを Docker コンテナに閉じ込めて共有できます。

\`\`\`json
// .devcontainer/devcontainer.json
{
  "name": "My Project",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "forwardPorts": [3000],
  "postCreateCommand": "npm install"
}
\`\`\`

チーム全員が同じエディタ設定、同じ Node.js バージョン、同じ依存で開発できる。未来を感じますね。

## ハンズオン: Node.js + PostgreSQL

試しに簡単なスタックを立ち上げてみましょう。

1. プロジェクトディレクトリに \`docker-compose.yml\` を作成

\`\`\`yaml
services:
  db:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: devdb

  adminer:
    image: adminer
    ports:
      - "8080:8080"
\`\`\`

2. 起動

\`\`\`bash
docker compose up -d
\`\`\`

3. ブラウザで http://localhost:8080 を開くと、PostgreSQL の GUI（Adminer）で中身を覗けます。

4. 片付け

\`\`\`bash
docker compose down
\`\`\`

PC に PostgreSQL を直接インストールすることなく、DB を立ち上げ、遊び、綺麗に片付けられました。これが Docker の日常です。

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : Docker インストール : hello-world を動かす
    Week 2 : 自作 Dockerfile : Node.js アプリを動かす
    Week 3 : docker-compose : DB + アプリ連携
    Week 4 : Dev Containers 体験 : VS Code 統合
    Month 2 : マルチステージビルド : 本番用イメージ作成
    Month 3 : Cloud Run にデプロイ : 自作イメージを本番へ
\`\`\`

## よくある誤解

<details>
<summary>Docker = 仮想マシン</summary>

違います。仮想マシンは OS ごと、Docker は OS カーネルを共有します。
</details>

<details>
<summary>Docker は開発環境専用</summary>

いえ、本番でも広く使われています。Kubernetes の中身はコンテナです。
</details>

<details>
<summary>Docker Desktop は重いから Mac では使えない</summary>

最近の Docker Desktop はかなり軽くなりました。Apple Silicon の M チップとの相性も改善しています。
</details>

## まとめ

Docker は「アプリを動かす環境ごと持ち運ぶ」技術です。

- 仮想マシンより軽く、起動が速い
- Dockerfile で環境を再現可能にする
- docker-compose で複数サービスを1コマンドで起動
- チーム全員の環境を揃えられる
- 本番でも使える

覚えるべきコマンドは最初は片手で足ります。焦らず、\`docker run hello-world\` から始めましょう。

> [!IMPORTANT]
> Docker は 最初こそ「なんだか難しい道具」に見えますが、一度乗りこなすと、PC を汚さずに何でも試せる遊び場が手に入ります。エンジニアの実験精神を爆発的に広げてくれる道具です。あなたの学習スピードを、想像以上に引き上げてくれます。

### 参考リソース

- [Docker 公式ドキュメント](https://docs.docker.com/) — 決定版
- [Docker Curriculum](https://docker-curriculum.com/) — ハンズオン形式の名教材
- [Play with Docker](https://labs.play-with-docker.com/) — ブラウザで Docker を試せる
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker) — リソース集
`,
  },
  {
    title: 'デプロイってなに？ — 「作ったアプリ」を「世に出す」までの道のり',
    slug: 'what-is-deployment-for-beginners',
    tags: ['デプロイ', 'Vercel', 'インフラ', '未経験'],
    content: `# デプロイってなに？ — 「作ったアプリ」を「世に出す」までの道のり

## はじめに

プログラミングを始めて最初に作るもの、それはだいたい「自分の PC の中だけで動くアプリ」です。

> 「頑張って作ったけど、これ、友達にどうやって見せればいいの？」
> 「localhost って URL を送っても見られないって言われた」
> 「本番環境ってなに？ 本番って何が本番なの？」

作ることと、世に出すことは、別のスキルです。そして世に出すことを**デプロイ**と呼びます。

> [!NOTE]
> この記事は「ローカルでは動くけど、インターネットに公開したことがない」方向けです。AWS などの重厚な話はせず、まずは「今日 Vercel で公開する」レベルから話します。

## TL;DR

- デプロイ = 作ったアプリを世に出して、誰でもアクセスできるようにすること
- ローカル → 開発 → ステージング → 本番 と複数環境を使い分けるのが普通
- 選択肢は PaaS / IaaS / サーバーレスの3種類
- フロント単体なら Vercel / Netlify / Cloudflare Pages が最強
- フルスタックは Railway / Render / Fly.io が手軽
- 本格運用は AWS / GCP / Azure
- 環境変数とドメイン設定、HTTPS 対応はどこでも必須
- CI/CD と組み合わせて自動化するのがゴール

## 目次

- デプロイとは
- 環境の使い分け
- デプロイ先の3つの選択肢
- フロント向けサービス
- フルスタック向けサービス
- クラウド大手3強
- サーバーレスの世界
- ドメインと HTTPS
- 環境変数の管理
- ゼロダウンタイムデプロイ
- ロールバック戦略
- 比較表
- 学習ロードマップ
- まとめ

## デプロイとは

**デプロイ（deploy）** は英語で「配備する」。作ったアプリをサーバーに配置して、インターネット経由で誰でもアクセスできる状態にすることです。

ローカルで動いているアプリは「自分の部屋のラジオ」。デプロイは「ラジオを放送局に持ち込んで、全国に電波を飛ばす」イメージです。

\`\`\`mermaid
graph LR
    A[ローカル PC<br/>localhost:3000] -->|デプロイ| B[サーバー]
    B --> C[世界中のユーザー]
\`\`\`

## 環境の使い分け

プロのチームはだいたい3〜4つの環境を持っています。

| 環境 | 用途 | URL 例 |
|---|---|---|
| ローカル | 自分の PC で開発 | http://localhost:3000 |
| 開発 (dev) | チームで機能確認 | https://dev.example.com |
| ステージング (staging) | 本番直前の最終確認 | https://staging.example.com |
| 本番 (production) | 実際にユーザーが使う | https://example.com |

> [!TIP]
> 個人開発なら「ローカル + 本番」の2つで十分です。大事なのは**本番に壊れたコードを流さない仕組み**を持つこと。

## デプロイ先の3つの選択肢

| 種類 | 特徴 | 代表 |
|---|---|---|
| PaaS (Platform as a Service) | サーバー管理不要、コード push で動く | Vercel / Heroku / Railway |
| IaaS (Infrastructure as a Service) | サーバーを自分で組み上げる | AWS EC2 / GCP Compute Engine |
| サーバーレス | 関数だけデプロイ、使った分だけ課金 | AWS Lambda / Cloudflare Workers |

初心者は **PaaS** から入るのが圧倒的に楽です。

## フロント向けサービス

フロントエンド（HTML/CSS/JS、Next.js、React など）はこのあたりが王道。

| サービス | 推しポイント |
|---|---|
| [Vercel](https://vercel.com) | Next.js の生みの親が運営。GitHub 連携1分で公開 |
| [Netlify](https://www.netlify.com) | 老舗。Form や Functions も持つ |
| [Cloudflare Pages](https://pages.cloudflare.com) | 高速 CDN、無料枠が太っ腹 |
| [GitHub Pages](https://pages.github.com) | GitHub リポジトリから直接公開、静的サイト向け |

### Vercel のデプロイの流れ

1. GitHub にコードを push
2. Vercel で「Import Project」し、対象リポジトリを選択
3. ビルドコマンドを確認（たいてい自動検出）
4. Deploy ボタンを押す
5. 数分後、\`https://your-app.vercel.app\` が爆誕

怖いぐらい簡単です。

## フルスタック向けサービス

DB や API サーバーも一緒にデプロイしたい場合。

| サービス | 特徴 |
|---|---|
| [Railway](https://railway.app) | DB ・Redis なども数クリックで追加 |
| [Render](https://render.com) | Web Service・Worker・DB がひとまとめに |
| [Fly.io](https://fly.io) | 世界 30+ リージョンに展開できる |
| [Heroku](https://www.heroku.com) | 古参。無料枠は 2022 年に終了 |

## クラウド大手3強

本格運用になると AWS / GCP / Azure の出番。

| クラウド | 強み | 学習コスト |
|---|---|---|
| AWS | シェア首位、サービス数が圧倒的 | 高 |
| GCP | BigQuery、Kubernetes、AI が強い | 中 |
| Azure | 企業向け、Microsoft スタックに強い | 中 |

> [!WARNING]
> 3強は「自由度が高い = 自分で組む必要がある」。未経験が最初に触ると迷子になります。まずは PaaS → 必要になってから大手に移行、がセオリー。

## サーバーレスの世界

「アクセスがあったときだけ動く、使った分だけ課金」という発想。

- **AWS Lambda** — 元祖
- **Cloudflare Workers** — エッジで超高速
- **Vercel Functions** — Next.js と一体
- **Supabase Edge Functions** — Deno ベース
- **Google Cloud Run** — コンテナをサーバーレス実行

\`\`\`mermaid
graph LR
    U[ユーザー] --> F[関数]
    F -->|実行中だけ起動| C[コンテナ]
    C -->|終わったら消える| Z[ゼロ]
\`\`\`

トラフィックが少ないサービスには天国、常時多いサービスにはコスト注意。

## ドメインと HTTPS

独自ドメインで公開すると、一気に「本物」感が出ます。

1. [お名前.com](https://onamae.com) や [Cloudflare Registrar](https://www.cloudflare.com/ja-jp/products/registrar/) でドメインを買う
2. DNS を設定してデプロイ先（Vercel など）を指す
3. HTTPS 証明書は **Let's Encrypt** が自動発行される（Vercel・Netlify などは何もしなくても OK）

> [!NOTE]
> 今の時代、HTTPS なし（\`http://\`）の本番公開はほぼ NG。検索エンジンや決済サービスが警告を出します。

## 環境変数の管理

コードに API キーや DB 接続情報を直書きするのは厳禁。\`.env\` を使い、デプロイ先の「環境変数設定画面」に登録します。

| 環境 | DB URL の例 |
|---|---|
| ローカル | \`.env.local\` に記載 |
| 本番 | Vercel Dashboard の Environment Variables |

> [!WARNING]
> \`.env\` を Git にコミットしない。\`.gitignore\` に必ず入れましょう。

## ゼロダウンタイムデプロイ

デプロイ中にサービスが止まらないようにする仕組み。PaaS の多くは標準装備。

\`\`\`mermaid
sequenceDiagram
    participant U as ユーザー
    participant LB as ロードバランサ
    participant V1 as 旧バージョン
    participant V2 as 新バージョン

    U->>LB: リクエスト
    LB->>V1: 転送
    Note over V2: 新バージョン起動
    LB->>V2: 健康チェック OK
    LB->>V2: 以降はこちらへ
    Note over V1: 静かに撤収
\`\`\`

## ロールバック戦略

新しいデプロイでバグった時、**1クリックで前のバージョンに戻せる**のが理想。Vercel や Netlify はそれができます。

> [!TIP]
> デプロイごとに履歴が残り、ポチッと戻せる。これだけでデプロイの心理的ハードルが一気に下がります。

## 比較表

| 項目 | Vercel | Railway | AWS |
|---|---|---|---|
| 難易度 | 最低 | 低 | 高 |
| 対象 | フロント中心 | フルスタック | 何でも |
| 無料枠 | 寛大 | 小さめ | 1年限定が多い |
| 価格感（個人） | 0円〜 | 数百円 | 油断すると数千円 |
| スケール | 自動 | 自動 | 自分で設計 |
| サーバー管理 | 不要 | 不要 | 自分で全部 |

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : Vercel に Next.js デプロイ : 独自ドメイン設定
    Week 2 : 環境変数管理 : プレビュー URL
    Week 3 : Railway に DB 付きアプリ : 環境変数と DB 接続
    Week 4 : Cloudflare Pages で静的サイト : CDN の速さ体験
    Month 2 : CI/CD 設定 : PR ごとのプレビュー
    Month 3 : AWS Lambda で関数デプロイ : サーバーレス入門
\`\`\`

## よくある誤解

<details>
<summary>本番サーバーは常に高スペックが必要</summary>

まずは無料枠でスタートできます。必要になってからスケール。
</details>

<details>
<summary>デプロイは一回やれば終わり</summary>

コードを更新するたびにデプロイします。CI/CD で自動化が基本。
</details>

<details>
<summary>AWS が使えないとエンジニアじゃない</summary>

そんなことはないです。まず自分のプロダクトを世に出す経験を優先しましょう。
</details>

## まとめ

デプロイは「作ったものを人に届ける」最後の一押しです。

- PaaS から始めれば驚くほど簡単
- 環境は本番とそれ以外を必ず分ける
- ドメイン・HTTPS・環境変数はどこでも必須
- ロールバックできる仕組みが心の平和

一度デプロイを経験すると、「自分のアプリに URL がある」という感動があります。ポートフォリオにも一気に説得力が出ます。

> [!IMPORTANT]
> 完璧を目指してローカルに籠るより、**70点で世に出す**方が学びは100倍あります。バグってもロールバックできます。失敗しても大丈夫。あなたのアプリには、世に出る価値があります。

### 参考リソース

- [Vercel Docs](https://vercel.com/docs) — 圧倒的に読みやすい公式
- [Railway Docs](https://docs.railway.app/) — フルスタック派に
- [AWS Getting Started](https://aws.amazon.com/jp/getting-started/) — いつか必要になる大手入門
- [Cloudflare Learning Center](https://www.cloudflare.com/ja-jp/learning/) — ネットワークの基礎知識
`,
  },
  {
    title: 'CI/CDってなに？ — 人の手を離れて、コードが自動で育つ仕組み',
    slug: 'what-is-ci-cd-for-beginners',
    tags: ['CI/CD', 'GitHub Actions', 'インフラ', '未経験'],
    content: `# CI/CDってなに？ — 人の手を離れて、コードが自動で育つ仕組み

## はじめに

チーム開発の現場に入ると、最初に圧倒される光景があります。

- 誰かが PR を出す
- 数分後、自動でテストが走る
- 緑のチェックマークが並ぶ
- マージした瞬間、自動で本番にデプロイされる

「これ、誰がやってるの？」と思ったら、誰もやっていません。**CI/CD** がやっています。

> [!NOTE]
> この記事は「GitHub Actions ってよく聞くけど、何が嬉しいのかピンと来ない」方向けです。YAML の細かい書き方より、考え方とワークフロー設計を重視します。

## TL;DR

- CI = 継続的インテグレーション。コードを統合するたびに自動チェック
- CD = 継続的デリバリー/デプロイ。自動で配信・本番反映
- 人間の手作業を減らすほど、事故も減る
- GitHub Actions / CircleCI / GitLab CI / Jenkins が代表
- Lint → Test → Build → Deploy が基本パイプライン
- プレビュー環境が PR ごとに立ち上がる体験は、一度味わうと戻れない
- シークレット管理とキャッシュ最適化が実用上の肝

## 目次

- CI と CD の定義
- なぜ必要か
- GitHub Actions の基本
- ワークフローの実例
- 主要サービスの比較
- シークレット管理
- デプロイプレビュー
- 環境別デプロイ
- ハンズオン: Next.js の自動デプロイ
- よくある落とし穴
- 学習ロードマップ
- まとめ

## CI と CD の定義

| 略 | 正式名 | 意味 |
|---|---|---|
| CI | Continuous Integration | 継続的インテグレーション。変更を頻繁に統合し、自動テスト |
| CD | Continuous Delivery | 継続的デリバリー。いつでもリリース可能な状態を保つ |
| CD | Continuous Deployment | 継続的デプロイ。マージ即本番反映 |

Delivery（いつでも出せる）と Deployment（自動で出す）はニュアンスが違います。

## なぜ必要か

かつての開発現場はこんな感じでした。

- 月末にみんなのコードを1人がマージ → 祭り
- リリース前日は徹夜でテスト → 修羅場
- 本番デプロイは儀式 → 胃が痛い

CI/CD が流行った理由は、これらを**毎日少しずつ** **自動で**やれば、祭りも修羅場もなくなる、という発想です。

\`\`\`mermaid
graph LR
    A[push] --> B[Lint]
    B --> C[Test]
    C --> D[Build]
    D --> E[Deploy to Preview]
    E --> F[レビュー]
    F --> G[merge]
    G --> H[Deploy to Prod]
\`\`\`

## GitHub Actions の基本

GitHub に組み込まれた CI/CD。\`.github/workflows/\` に YAML を置くだけで動きます。

### 用語

| 用語 | 意味 |
|---|---|
| Workflow | 一連の自動化の集合（ファイル単位） |
| Job | 並列実行できる仕事の単位 |
| Step | Job の中の1コマンド |
| Runner | 実際に動かす仮想マシン |

### 最小サンプル

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
\`\`\`

これだけで push・PR ごとに Lint と Test が自動で走ります。

## ワークフローの実例

ちょっと実戦的なもの。

\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  # 1. 静的チェック
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # 2. テスト
  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  # 3. ビルド
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
\`\`\`

\`needs\` で依存を表現できます。Lint がこけたらテストもビルドも回らない。無駄な CI 時間を節約できます。

## 主要サービスの比較

| サービス | 特徴 | おすすめ度 |
|---|---|---|
| GitHub Actions | GitHub と統合、個人無料枠が太い | 最初はこれ |
| CircleCI | Docker 標準、マトリクスビルドが強い | 中〜大規模 |
| GitLab CI | GitLab に内蔵 | GitLab 派 |
| Jenkins | 歴戦のオンプレ、拡張性 | 古参企業 |
| Buildkite / Travis CI | 老舗、歴史あり | 既存案件 |

## シークレット管理

API キー・DB パスワードなどは **Secrets** に登録して参照します。

\`\`\`yaml
steps:
  - name: Deploy
    run: ./deploy.sh
    env:
      API_KEY: \${{ secrets.API_KEY }}
\`\`\`

> [!WARNING]
> YAML にシークレットを直書きしない。一度 push してしまうと GitHub の履歴に残り、ローテーションが面倒になります。

## デプロイプレビュー

PR を出すごとに、**そのブランチ専用の URL**が立ち上がる仕組み。Vercel などが標準で提供。

- レビュアーは実物を触って確認できる
- デザイナーやプロダクトマネージャーも PR をチェックできる
- 本番に出す前に「見た目」「動作」の確認完了

\`\`\`mermaid
graph TD
    A[PR 作成] --> B[CI が走る]
    B --> C[プレビュー URL 生成]
    C --> D[https://pr-42.example.vercel.app]
    D --> E[レビュアーが確認]
    E --> F[OK → マージ]
\`\`\`

## 環境別デプロイ

- \`develop\` ブランチ push → 開発環境へ自動デプロイ
- \`main\` ブランチ push → 本番環境へ自動デプロイ
- PR → プレビュー環境へ自動デプロイ

\`\`\`yaml
deploy-prod:
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: ./deploy.sh production
\`\`\`

\`if:\` で対象ブランチを絞れるのが便利。

## ハンズオン: Next.js の自動デプロイ

最短ルートは Vercel を使うこと。GitHub と連携すれば、**YAML を書かなくても** CI/CD が完成します。

1. Vercel でプロジェクトをインポート
2. GitHub のブランチに push
3. Vercel が自動でビルド → デプロイ
4. PR にはプレビュー URL が自動でコメントされる

これが「何もしてないのに全部回ってる」感覚の正体です。

Vercel だけで物足りないなら、GitHub Actions でテストを足しましょう。

\`\`\`yaml
name: Test and deploy
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
\`\`\`

Vercel はデプロイ、GitHub Actions はチェック、と役割分担。

## よくある落とし穴

<details>
<summary>シークレットをログに出力</summary>

echo すると GitHub ログに残ります。\`::add-mask::\` か、そもそも echo しない。
</details>

<details>
<summary>キャッシュが効いていない</summary>

\`cache: 'npm'\` や \`actions/cache\` を使わないと毎回 npm install に3分消えます。
</details>

<details>
<summary>本番と CI 環境のズレ</summary>

Node.js バージョン、環境変数、DB 接続を合わせる。差が出るなら Docker を検討。
</details>

<details>
<summary>並列化していない</summary>

Lint・Test・Typecheck は並列で OK。直列にすると CI が遅くなります。
</details>

<details>
<summary>失敗したら夜中でも通知が来る</summary>

通知設定は Slack や Discord に寄せる。メールは埋もれがち。
</details>

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : GitHub Actions で Hello World : Lint を自動化
    Week 2 : テスト自動化 : カバレッジ計測
    Week 3 : Vercel + GitHub Actions : プレビュー URL
    Week 4 : シークレット管理 : 環境別デプロイ
    Month 2 : Docker build & push : GitHub Packages 公開
    Month 3 : マトリクスビルド : 複数 Node.js バージョン検証
\`\`\`

## まとめ

CI/CD は「手作業を減らす」だけではありません。**チームのリズムを変える**ものです。

- 毎日の push が自動でテストされる
- PR ごとにレビュー可能な URL が立ち上がる
- マージ即デプロイ、問題があればロールバック
- 人間は考えることに集中できる

1つでも自動化を増やすたびに、開発の呼吸が楽になります。

> [!IMPORTANT]
> 完璧な CI/CD を最初から目指す必要はありません。\`npm test\` を PR で自動実行するだけでも、立派な第一歩です。自動化は積み重ねです。未経験でも、1つずつ積めば必ず強くなります。あなたが組んだ CI が、未来のチームメイトを助けます。

### 参考リソース

- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions) — 再利用可能な Action 集
- [Continuous Delivery Foundation](https://cd.foundation/) — 業界団体のリソース
- [Vercel × GitHub ガイド](https://vercel.com/docs/git)
`,
  },
];
