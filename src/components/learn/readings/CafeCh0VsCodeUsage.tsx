export function CafeCh0VsCodeUsage() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン2
      </span>
      <h1 className="text-3xl font-bold text-slate-800">VS Code の使い方</h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>VS Code でフォルダを開ける</li>
          <li>新しいファイルを作って保存できる</li>
          <li>拡張機能の画面を開ける</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">
          まずは作業フォルダを準備する
        </h2>
        <p>
          プログラマーは「作業ごとにひとつのフォルダ」を作って、その中にファイルをまとめる
          文化があります。このあと HTML や CSS
          を書いていくにあたっても、まずそのための
          フォルダを一つ用意しましょう。
        </p>
        <ol>
          <li>
            デスクトップやドキュメントフォルダなど、分かりやすい場所に
            <code>cafe-shop</code>（お好きな名前で
            OK）という名前のフォルダを作る。
          </li>
          <li>
            フォルダの中は空っぽのままで大丈夫。後で VS Code
            からファイルを追加していきます。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. フォルダを VS Code で開く
        </h2>
        <p>
          VS Code
          では「ファイルを1つ開く」よりも「フォルダごと開く」のが基本です。
          そうすることで、画面の左側にファイル一覧が表示され、そのフォルダの中で
          自由にファイルを増やしたり編集したりできます。
        </p>
        <ol>
          <li>VS Code を起動する。</li>
          <li>
            上部メニューから <strong>ファイル → フォルダーを開く…</strong>
            を選ぶ（Mac の場合は <strong>File → Open Folder…</strong>）。
          </li>
          <li>
            先ほど作った <code>cafe-shop</code> フォルダを選び、「開く」を押す。
          </li>
          <li>
            初めて開くフォルダでは「このフォルダー内のファイルの作成者を信頼しますか？」
            と聞かれる場合があります。自分で作ったフォルダなので
            <strong>「はい、作成者を信頼します」</strong>を選びましょう。
          </li>
        </ol>
        <p>
          左サイドバーに「CAFE-SHOP」と大きく書かれ、その下に何もファイルが並んでいない状態になれば成功です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. 新しいファイルを作る
        </h2>
        <ol>
          <li>
            左サイドバーの <strong>「CAFE-SHOP」</strong>
            の文字にマウスを近づけると、 右側に 4
            つの小さなアイコンが表示されます。
          </li>
          <li>
            一番左の<strong>ファイル追加アイコン（紙に「＋」マーク）</strong>
            をクリックする。
          </li>
          <li>
            ファイル名を入力するテキストボックスが出るので、
            <code>hello.html</code> と入力して Enter キーを押す。
          </li>
          <li>
            右側のエディタエリアに空のファイルが開きます。試しに何か文字を書いてみましょう。
          </li>
        </ol>
        <p className="text-sm text-slate-500">
          ファイル名の末尾にある <code>.html</code>{' '}
          のような部分を「拡張子」と呼びます。
          拡張子は「このファイルがどんな種類か」を表す記号のようなもので、今回は
          HTML ファイルなので <code>.html</code> です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. ファイルを保存する
        </h2>
        <p>
          VS Code
          では、編集したファイルを保存しないと変更が反映されません。タブの
          ファイル名の横に白い丸印が出ていたら「まだ保存していない」という合図です。
        </p>
        <ul>
          <li>
            Windows:{' '}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              Ctrl + S
            </code>
          </li>
          <li>
            Mac:{' '}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              Cmd + S
            </code>
          </li>
        </ul>
        <p>
          保存すると白い丸印が消え、普通の ×
          マークに戻ります。これが「保存済み」の状態です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. 拡張機能の画面を開いておく
        </h2>
        <p>
          VS Code
          の強みは、拡張機能で機能を足せるところです。たとえば、コードを自動で
          整えてくれる Prettier、Git をビジュアルで操作できる GitLens など、
          世界中の開発者が作った便利なプラグインが無料で使えます。
        </p>
        <ol>
          <li>
            左端のアクティビティバーから
            <strong>四角が4つ並んだ拡張機能アイコン</strong>をクリックする。
          </li>
          <li>
            上部に検索ボックスが表示されます。ここに欲しい機能の名前を入れると候補が出てきます。
            次のレッスンで Prettier
            を入れるので、今はまだ何もインストールしなくて OK。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          覚えておくと便利なショートカット
        </h2>
        <p>
          今日すぐ使うものだけに絞って紹介します。全部覚えようとせず、
          「こんなのがあるんだな」くらいで大丈夫です。
        </p>
        <ul>
          <li>
            <strong>サイドバーの開閉</strong>: <code>Cmd/Ctrl + B</code> —
            ファイル一覧を 消して画面を広く使えます。
          </li>
          <li>
            <strong>ファイル検索</strong>: <code>Cmd/Ctrl + P</code> —
            プロジェクト内の ファイル名で素早く開けます。
          </li>
          <li>
            <strong>コマンドパレット</strong>: <code>Cmd/Ctrl + Shift + P</code>{' '}
            — VS Code のあらゆる機能を検索して実行できる万能ツール。
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>新しいファイルが見当たらない</strong>: 左サイドバー上部の
            「CAFE-SHOP」にマウスを置かないとアイコンが出てきません。表示されない場合は
            一度フォルダ名あたりを軽くクリックしてからもう一度置いてみてください。
          </li>
          <li>
            <strong>ファイルを保存したのに変更が反映されない</strong>:
            タブの丸印が 残っていないか確認しましょう。ちゃんと保存できれば ×
            マークに戻ります。
          </li>
          <li>
            <strong>フォルダを閉じたい</strong>:{' '}
            <strong>ファイル → フォルダーを閉じる</strong>
            を選ぶと、スタート画面に戻ります。
          </li>
        </ul>
      </section>
    </article>
  );
}
