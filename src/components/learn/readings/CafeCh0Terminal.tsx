export function CafeCh0Terminal() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン4
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        ターミナルに慣れよう
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>ターミナル（またはコマンドプロンプト）を起動できる</li>
          <li>現在いる場所を確認し、別のフォルダに移動できる</li>
          <li>フォルダやファイルの一覧を表示できる</li>
          <li>新しいフォルダを作れる</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">ターミナルって何？</h2>
        <p>
          ターミナル（Terminal / コマンドプロンプト）は、PC
          に対して文字で命令を出すための
          窓口です。普段はマウスでフォルダをダブルクリックして開いていますが、ターミナルでは
          <code>cd</code> や <code>ls</code>{' '}
          といった短い命令（コマンド）を文字で打ち込みます。
        </p>
        <p>
          プログラマーはファイル操作だけでなく、ライブラリのインストール・Git
          操作・
          サーバー起動などあらゆる作業をターミナルから行います。最初は「黒い画面が怖い」と
          感じるかもしれませんが、やることはすごくシンプルで、数個のコマンドに慣れるだけで
          大体の作業ができてしまいます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. ターミナルを開く
        </h2>

        <h3 className="mt-4 text-lg font-bold text-slate-700">Mac の場合</h3>
        <ol>
          <li>
            Launchpad で「ターミナル」と検索し、アプリを起動する。もしくは
            <strong>
              {' '}
              アプリケーション &rarr; ユーティリティ &rarr; ターミナル
            </strong>
            を開く。
          </li>
          <li>
            白か黒の背景の小さなウィンドウが開き、一番上にユーザー名が書かれた行と、
            その下に点滅するカーソルが表示されます。これが入力待ちのサインです。
          </li>
        </ol>

        <h3 className="mt-4 text-lg font-bold text-slate-700">
          Windows の場合
        </h3>
        <ol>
          <li>
            スタートメニューで <strong>「コマンドプロンプト」</strong>または
            <strong>「PowerShell」</strong>を検索して起動する（どちらでもOK）。
          </li>
          <li>
            暗い色のウィンドウが開き、カーソルが点滅していれば準備完了です。
          </li>
        </ol>

        <p>
          VS Code の中にもターミナルを内蔵する機能があります。メニューから
          <strong>ターミナル &rarr; 新しいターミナル</strong>を選ぶと、VS Code
          の下半分に ターミナルが開きます。普段は VS Code
          内蔵のものを使うと移動が少なくて便利です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. 自分が今どこにいるか確認する
        </h2>
        <p>
          ターミナルには「カレントディレクトリ」という概念があります。これは「今、君は
          この PC のどのフォルダにいるのか」を表します。迷子防止のために、まずは
          現在地を表示するコマンドを覚えましょう。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`pwd`}</code>
        </pre>
        <p>
          <code>pwd</code> は Print Working Directory の略。Mac / Linux
          のコマンドです。 Windows のコマンドプロンプトでも PowerShell
          なら使えます。 実行すると、今いるフォルダの場所が{' '}
          <code>/Users/yourname</code> のような形で表示されます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. フォルダの中身を一覧表示する
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`ls          # Mac / Linux / PowerShell
dir         # Windows コマンドプロンプト`}</code>
        </pre>
        <p>
          今いるフォルダに存在するファイルやサブフォルダが一覧で表示されます。
          先ほど作った <code>cafe-shop</code>{' '}
          フォルダが見えるか試してみましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. フォルダを移動する
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`cd フォルダ名      # そのフォルダに入る
cd ..            # 一つ上のフォルダに戻る
cd ~             # ホームフォルダ（自分のユーザーフォルダ）へ`}</code>
        </pre>
        <p>
          <code>cd</code> は Change Directory
          の略。使い方は「移動したいフォルダの名前を 後ろに書くだけ」です。
        </p>
        <p className="text-sm text-slate-500">
          長いフォルダ名を途中まで打って <code>Tab</code>{' '}
          キーを押すと、残りの名前を
          ターミナルが補完してくれます。タイプミス防止にもなるのでおすすめです。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 5. 新しいフォルダを作る
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`mkdir フォルダ名`}</code>
        </pre>
        <p>
          <code>mkdir</code> は Make Directory
          の略。実行すると、その名前のフォルダが
          カレントディレクトリに作られます。試しに{' '}
          <code>mkdir test-folder</code>
          と打ってみて、<code>ls</code>{' '}
          で新しいフォルダが増えたか確認してみましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          練習：cafe-shop フォルダまで降りてみる
        </h2>
        <ol>
          <li>
            <code>pwd</code> で現在地を確認する。
          </li>
          <li>
            <code>cd ~</code> でホームフォルダに移動する。
          </li>
          <li>
            <code>ls</code> で一覧を出し、<code>cafe-shop</code>{' '}
            フォルダの親になっている 場所（Desktop や Documents
            など）がどこかを探す。
          </li>
          <li>
            <code>cd Desktop</code>（または Documents）で移動し、さらに
            <code>cd cafe-shop</code> で降りる。
          </li>
          <li>
            もう一度 <code>pwd</code> と <code>ls</code> を実行して、今度は
            <code>cafe-shop</code> の中にいて <code>hello.html</code>{' '}
            が見えることを確認する。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>コマンドを打っても反応がない</strong>: Enter
            キーを押していないだけの ことが多いです。入力後は必ず Enter。
          </li>
          <li>
            <strong>「そんなファイルはありません」と言われる</strong>:
            スペルミスか、 現在地が違う可能性が高いです。<code>pwd</code> と{' '}
            <code>ls</code>
            を組み合わせて落ち着いて確認しましょう。
          </li>
          <li>
            <strong>スペースを含むフォルダ名に移動できない</strong>:
            フォルダ名を ダブルクォートで囲みます（例:{' '}
            <code>cd &quot;My Folder&quot;</code>）。
          </li>
        </ul>
      </section>
    </article>
  );
}
