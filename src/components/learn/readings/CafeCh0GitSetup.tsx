export function CafeCh0GitSetup() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン13
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        GitHub と Git を準備しよう
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>GitHub のアカウントを作れる</li>
          <li>PC に Git をインストールして動かせる</li>
          <li>Git の初期設定（名前・メールアドレス）を済ませる</li>
          <li>認証情報を覚えておく仕組みを整える</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">
          Git と GitHub の違い
        </h2>
        <p>よく混同されがちですが、Git と GitHub は別物です。</p>
        <ul>
          <li>
            <strong>Git</strong>: 自分の PC
            で動く「バージョン管理ツール」。ファイルの変更履歴
            を記録したり、以前の状態に戻したりできる。
          </li>
          <li>
            <strong>GitHub</strong>: Git
            の記録をインターネット上で共有できるサービス。
            他の人とコードを共同編集したり、作ったものをポートフォリオとして公開したりする場所。
          </li>
        </ul>
        <p>
          イメージとしては、Git は「作業記録帳」、GitHub
          は「その記録帳を置いておけるクラウドロッカー」 という関係です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. GitHub のアカウントを作る
        </h2>
        <ol>
          <li>
            ブラウザで{' '}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/
            </a>{' '}
            にアクセスする。
          </li>
          <li>
            右上の<strong>「Sign up」</strong>をクリックする。
          </li>
          <li>
            画面の指示に従って{' '}
            <strong>メールアドレス &rarr; パスワード &rarr; ユーザー名</strong>
            を入力する。ユーザー名は後からコードの URL
            の一部になるので、英数字で短くて
            読みやすい名前を選ぶのがおすすめです。
          </li>
          <li>メール認証コードが届くので、入力して登録完了。</li>
        </ol>
        <p className="text-sm text-slate-500">
          ユーザー名は後から変更もできますが、URL
          が変わるので最初から気に入ったものに しておくと後が楽です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. Git をインストールする
        </h2>

        <h3 className="mt-4 text-lg font-bold text-slate-700">Mac の場合</h3>
        <p>
          Mac では、ターミナルで <code>git --version</code> と打つだけで自動的に
          インストール画面が起動します。
        </p>
        <ol>
          <li>ターミナルを開く。</li>
          <li>
            <code>git --version</code> と打って Enter を押す。
          </li>
          <li>
            「Command Line Developer Tools
            をインストールしますか？」というダイアログが
            出たら「インストール」を選ぶ。
          </li>
          <li>
            完了後、もう一度 <code>git --version</code> を打つと
            <code>git version 2.x.x</code> のような表示が出れば OK。
          </li>
        </ol>

        <h3 className="mt-4 text-lg font-bold text-slate-700">
          Windows の場合
        </h3>
        <ol>
          <li>
            ブラウザで{' '}
            <a
              href="https://git-scm.com/download/win"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://git-scm.com/download/win
            </a>{' '}
            にアクセスすると、自動的にインストーラーのダウンロードが始まります。
          </li>
          <li>
            ダウンロードした <code>.exe</code> を起動する。
          </li>
          <li>
            インストール画面は項目が多いですが、
            <strong>基本的に「Next」で進めて大丈夫</strong>です。
            途中で出てくる選択肢で迷ったら、デフォルトのまま次へ。
          </li>
          <li>
            インストールが終わったら、スタートメニューから
            <strong>「Git Bash」</strong>
            を起動。黒いターミナルが開けば成功です。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. 初期設定（名前とメールアドレス）
        </h2>
        <p>
          Git は「誰が記録したか」を残すために、名前とメールアドレスを使います。
          GitHub に登録したものと同じものを使いましょう。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git config --global user.name "あなたの名前"
git config --global user.email "あなたのメール@example.com"`}</code>
        </pre>
        <p>設定が終わったら、念のため確認しましょう。</p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git config --global user.name
git config --global user.email`}</code>
        </pre>
        <p>先ほど設定した値が表示されれば OK です。</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. 認証情報を覚えておく仕組み（Credential Manager）
        </h2>
        <p>
          GitHub
          にコードをアップロードするとき、毎回パスワードを聞かれると手間です。
          その面倒を解決してくれるのが <strong>Git Credential Manager</strong>
          。初回だけ 認証すれば、以降は自動でログイン状態が維持されます。
        </p>
        <ul>
          <li>
            <strong>Windows</strong>: Git for Windows のインストーラーに
            Credential Manager
            が同梱されています。特別な作業は不要で、先ほどのインストールですでに
            入っているはずです。
          </li>
          <li>
            <strong>Mac</strong>: 標準で OS が認証情報を Keychain
            に保存してくれるため、 これも追加作業なしで大丈夫です。
          </li>
        </ul>
        <p className="text-sm text-slate-500">
          最初の push 時に「GitHub
          にサインインしてください」というブラウザ画面が出たら、
          指示に従って一度認証しましょう。そのあとは PC が覚えてくれます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>
              <code>git --version</code> が「コマンドが見つかりません」と返す
            </strong>
            : Git
            のインストールが完了していないか、ターミナルを再起動していない可能性が
            あります。一度ターミナルを閉じて開き直してみてください。
          </li>
          <li>
            <strong>GitHub のアカウントが作れない</strong>:
            使っているメールアドレスが
            すでに別のアカウントで登録されていることがあります。別のメールアドレスを試すか、
            既存アカウントを使いましょう。
          </li>
          <li>
            <strong>user.name が空欄のまま</strong>: ダブルクォート
            <code>&quot; &quot;</code>{' '}
            の中身を書き忘れた可能性があります。もう一度
            <code>git config</code> コマンドを打って設定しましょう。
          </li>
        </ul>
      </section>
    </article>
  );
}
