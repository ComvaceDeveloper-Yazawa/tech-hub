export function CafeCh0VsCodeSetup() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン1
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        VS Code のセットアップ
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>自分の PC に VS Code を入れて起動できる</li>
          <li>VS Code の表示を日本語にできる</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">
          VS Code ってどんなもの？
        </h2>
        <p>
          VS Code（正式名称は Visual Studio Code）は Microsoft
          が無料で配布している
          <strong>コードエディタ</strong>
          です。プログラマーが文字を書くときに使う、
          高機能なメモ帳のようなものだと思ってください。
        </p>
        <p>
          世界中のエンジニアが使っているため、困ったときの情報がとても多く、
          拡張機能（プラグイン）で機能を追加できる柔軟さも特徴です。
          このカリキュラムでも、VS Code を使って HTML や CSS を書いていきます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. ダウンロードする
        </h2>
        <ol>
          <li>
            ブラウザで{' '}
            <a
              href="https://code.visualstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://code.visualstudio.com/
            </a>{' '}
            にアクセスする。
          </li>
          <li>
            画面中央の大きな青いボタン「Download」を押す。お使いの OS（Windows /
            Mac）が
            自動で判別され、それに合ったインストーラーのダウンロードが始まります。
          </li>
        </ol>
        <p className="text-sm text-slate-500">
          もしダウンロードボタンの下に OS が表示されていて、それが自分の PC
          と違う場合は、 そこをクリックして正しい OS を選び直してください。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. インストールする
        </h2>

        <h3 className="mt-4 text-lg font-bold text-slate-700">
          Windows の場合
        </h3>
        <ol>
          <li>
            ダウンロードした <code>VSCodeUserSetup-x64-x.xx.x.exe</code>
            （末尾のバージョン番号は時期によって変わる）をダブルクリックで起動する。
          </li>
          <li>
            セットアップ画面では、基本的に「次へ」をクリックしていけば大丈夫です。
            途中の「追加タスクの選択」では、以下のチェックを入れておくと後が楽になります。
            <ul>
              <li>PATH への追加</li>
              <li>
                エクスプローラーのコンテキストメニューに追加（右クリックから開けるようになる）
              </li>
            </ul>
          </li>
          <li>最後に「インストール」をクリックして完了を待つ。</li>
        </ol>

        <h3 className="mt-4 text-lg font-bold text-slate-700">Mac の場合</h3>
        <ol>
          <li>
            ダウンロードされた <code>VSCode-darwin.zip</code>{' '}
            をダブルクリックして解凍する。 解凍すると{' '}
            <code>Visual Studio Code.app</code> が出てきます。
          </li>
          <li>
            解凍された <code>Visual Studio Code.app</code> を
            <strong> アプリケーション（Applications）</strong>
            フォルダにドラッグする。 これでインストール完了です。
          </li>
          <li>
            Launchpad から「Visual Studio Code」を探して起動する。初回起動時に
            「このアプリはインターネットからダウンロードされました」という警告が出るので、
            「開く」を選びます。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. 起動できるか確かめる
        </h2>
        <p>
          どちらの OS でも、VS Code を起動すると初回の Welcome
          画面が表示されます。 画面左側にアイコンが縦に並んでいて、真ん中に「Get
          Started」のようなウィンドウが 出ていれば起動成功です。
        </p>
        <p>
          もし起動できない・インストーラーが止まるなどの症状があれば、一度ダウンロードし直すか、
          次のレッスンに入る前に質問をしてください。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. 日本語化する
        </h2>
        <p>
          VS Code
          は最初、英語で表示されています。メニューもメッセージも英語のままだと
          読みにくいので、日本語化しておきましょう。
        </p>
        <ol>
          <li>
            左側の縦に並んだアイコンの中から、四角が4つ並んだ
            <strong>「拡張機能（Extensions）」</strong>
            のアイコンをクリックする。 上から 5 番目にあるアイコンです。
          </li>
          <li>
            画面の上に検索ボックスが出るので、そこに「Japanese Language
            Pack」と入力する。
          </li>
          <li>
            候補の中から{' '}
            <strong>「Japanese Language Pack for Visual Studio Code」</strong>
            （提供元: Microsoft）を選び、「Install」ボタンを押す。
          </li>
          <li>
            インストールが終わると、画面右下に「言語を変更するには再起動が必要です」という
            ポップアップが出る。<strong>「Change Language and Restart」</strong>
            ボタンを クリックして VS Code を再起動する。
          </li>
          <li>再起動後、メニューが日本語になっていれば成功です。</li>
        </ol>
        <p className="text-sm text-slate-500">
          ポップアップを見逃した場合でも大丈夫。VS Code を手動で閉じて開き直すと
          日本語化が反映されます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>Mac で「開発元が未確認のため開けません」と出る</strong>:
            一度「OK」で閉じ、Launchpad
            から開き直すと「このアプリを本当に開きますか」
            という別のダイアログが出ます。そちらでは「開く」を選べます。
          </li>
          <li>
            <strong>日本語化したのにメニューが英語のまま</strong>:
            再起動が完了していない可能性が高いです。VS Code
            を一度完全に終了して開き直してみましょう。
          </li>
          <li>
            <strong>ダウンロードが進まない</strong>:
            ネットワークが不安定な可能性があります。時間をおいてもう一度試すか、
            別のネットワーク（スマホのテザリングなど）から試してみてください。
          </li>
        </ul>
      </section>

      <section className="not-prose mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-800">
          このレッスンを完了する条件
        </p>
        <ul className="mt-2 space-y-1 text-sm text-emerald-700">
          <li>・ VS Code を起動できた</li>
          <li>・ メニューが日本語で表示されている</li>
        </ul>
        <p className="mt-3 text-sm text-emerald-700">
          どちらもできたら、下のボタンで完了しましょう。
        </p>
      </section>
    </article>
  );
}
