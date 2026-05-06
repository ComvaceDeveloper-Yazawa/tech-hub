export function CafeCh0RepoSetup() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン14
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        学習用リポジトリを準備しよう
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>テンプレートリポジトリから自分専用のリポジトリを作れる</li>
          <li>
            手元の PC に <code>git clone</code> できる
          </li>
          <li>フォルダが VS Code で開ける</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">リポジトリって何？</h2>
        <p>
          リポジトリ（Repository）は、Git で管理している 1 つの作業フォルダ、
          またはその GitHub 上のコピーのことです。これから書く HTML / CSS
          はすべて この「自分のリポジトリ」の中に入れていきます。
        </p>
        <p>
          毎回ゼロからフォルダ構成を考えるのは大変なので、事前に雛形となる
          <strong>テンプレートリポジトリ</strong>
          を用意しました。これをワンクリックで
          自分のリポジトリとしてコピーできるので、そこから始めます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. テンプレートから自分のリポジトリを作る
        </h2>
        <ol>
          <li>
            講師・カリキュラム担当者から共有されたテンプレートリポジトリの URL
            を開く （例:{' '}
            <code>https://github.com/example-org/cafe-shop-template</code>）。
          </li>
          <li>
            ページ右上にある緑色の<strong>「Use this template」</strong>
            ボタンをクリックする。
          </li>
          <li>
            出てきたメニューから <strong>「Create a new repository」</strong>
            を選ぶ。
          </li>
          <li>
            次の画面で新しいリポジトリの設定を入力します。
            <ul>
              <li>
                <strong>Owner</strong>: 自分の GitHub
                アカウントになっているか確認。
              </li>
              <li>
                <strong>Repository name</strong>: <code>cafe-shop</code>{' '}
                などわかりやすい名前。
              </li>
              <li>
                <strong>Description</strong>: 任意。空でも OK。
              </li>
              <li>
                <strong>公開設定</strong>:
                個人練習なら「Private」でも「Public」でも OK。 学習中はまず
                Private にしておき、後から公開してもいいでしょう。
              </li>
            </ul>
          </li>
          <li>
            <strong>「Create repository」</strong>ボタンを押して完了。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. 手元の PC に clone する
        </h2>
        <p>
          GitHub 上のリポジトリを PC にダウンロードしてくる操作を{' '}
          <code>git clone</code> と 呼びます。
        </p>
        <ol>
          <li>
            作成したリポジトリのページ右上にある緑色の
            <strong>「{'<>'} Code」</strong>
            ボタンをクリック。
          </li>
          <li>
            表示されるパネルの「HTTPS」タブで、URL をコピーボタン（四角が 2
            つ重なったアイコン） でコピーする。
          </li>
          <li>ターミナルを開く。</li>
          <li>
            リポジトリを置きたい場所に <code>cd</code> で移動する（例:{' '}
            <code>cd ~/Desktop</code>）。
          </li>
          <li>
            次のコマンドを実行する（URL は自分でコピーしたものに置き換える）:
          </li>
        </ol>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git clone https://github.com/あなた/cafe-shop.git`}</code>
        </pre>
        <p>
          コマンドを実行すると、同名のフォルダが作られてその中にリポジトリの内容が
          ダウンロードされます。最初は認証画面が出ることがあるので、画面の指示に従って
          GitHub にサインインしてください。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. VS Code で開く
        </h2>
        <ol>
          <li>
            ターミナルで <code>cd cafe-shop</code> を実行し、clone
            したフォルダに入る。
          </li>
          <li>
            同じターミナルで <code>code .</code> と打って Enter。{' '}
            （最後のドットは「今いるフォルダ」という意味です）
          </li>
          <li>
            VS Code
            がフォルダごと開くはずです。左サイドバーに、テンプレートに含まれている
            ファイル群が表示されていれば成功。
          </li>
        </ol>
        <p className="text-sm text-slate-500">
          <code>code .</code> が使えない場合、VS Code
          側に「シェルコマンドをインストール」 する設定があります。VS Code
          のコマンドパレット （<code>Cmd/Ctrl + Shift + P</code>）で
          <code>Shell Command: Install &apos;code&apos; command in PATH</code>
          を検索して実行してください。それ以降は <code>code .</code>{' '}
          が使えます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. README を眺めてみる
        </h2>
        <p>
          テンプレートの一番上には <code>README.md</code>{' '}
          というファイルがあります。
          そのリポジトリの説明書のようなもので、フォルダ構成や使い方が書かれています。
          まずはざっと読んでみて、どこに何を書くフォルダなのか把握しましょう。
        </p>
        <p>
          わからない単語が出てきても、今の段階では全部理解しなくて大丈夫です。
          「どうやらこのフォルダに HTML を置くらしい」くらい掴めれば十分です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>「Use this template」ボタンが見つからない</strong>:
            そのリポジトリが テンプレート設定になっていない可能性があります。URL
            をもう一度確認し、
            配布された正しいリポジトリにアクセスしているか確かめてください。
          </li>
          <li>
            <strong>
              <code>git clone</code> で authentication required と出る
            </strong>
            : 初回は GitHub
            への認証が必要です。ブラウザでサインインする指示が出るので
            それに従いましょう。ログインしても通らない場合は、ユーザー名に誤字がないか
            確認してください。
          </li>
          <li>
            <strong>
              <code>code .</code> が「コマンドが見つかりません」
            </strong>
            : 上の Step 3 の注釈に書いた「Shell Command
            のインストール」を行ってください。 それでも解決しない場合は、VS Code
            を起動してから
            <strong>ファイル &rarr; フォルダーを開く</strong>
            で手動選択しても大丈夫です。
          </li>
        </ul>
      </section>
    </article>
  );
}
