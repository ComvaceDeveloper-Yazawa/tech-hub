export function CafeCh0DevTools() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン8
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        Chrome の開発者ツールを使ってみよう
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>Chrome の開発者ツールを開ける</li>
          <li>Elements パネルで HTML の構造を確認できる</li>
          <li>Console パネルにエラーが出たら読める</li>
          <li>デバイスモードでスマホ表示を確認できる</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">
          開発者ツールって何？
        </h2>
        <p>
          Web サイトを見るたびに、実はブラウザは裏側で HTML / CSS / JavaScript
          を読み取って 画面を組み立てています。
          <strong>開発者ツール（DevTools）</strong>
          は、その裏側を覗くための Chrome 標準のツールです。
        </p>
        <p>
          書いた HTML が思った通りに表示されないとき、CSS が効いていないとき、
          JavaScript が動かないとき、開発者ツールが原因を教えてくれます。
          プログラマーはこのツールをほぼ毎日使います。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. 開発者ツールを開く
        </h2>
        <p>開き方は 3 つあります。好きな方法で覚えてください。</p>
        <ol>
          <li>
            <strong>キーボードショートカット</strong>: Windows は{' '}
            <code>F12</code>、 Mac は <code>Cmd + Option + I</code>
            。これが一番早いです。
          </li>
          <li>
            <strong>右クリックメニュー</strong>: ページのどこでも右クリックして
            「検証」（Inspect）を選ぶ。
          </li>
          <li>
            <strong>ブラウザメニュー</strong>: Chrome
            右上の「︙」メニューから「その他のツール &rarr; デベロッパー
            ツール」を選ぶ。
          </li>
        </ol>
        <p>
          開くとブラウザウィンドウの右側か下側にパネルが表示されます。位置が気に入らなければ、
          パネル右上の点 3 つメニューから「Dock side」で変えられます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. Elements パネルで HTML を覗く
        </h2>
        <p>
          開発者ツールの上部に並ぶタブの中から <strong>「Elements」</strong>
          を選びます （日本語化していると「要素」と表示される場合もあります）。
        </p>
        <p>
          ここに表示されているのが、そのページの現在の HTML
          構造です。自分の書いた
          <code>hello.html</code> を Chrome
          にドラッグ＆ドロップして開き、Elements を
          見てみましょう。自分が書いたタグがそのまま並んでいるはずです。
        </p>
        <p>便利な使い方をいくつか紹介します。</p>
        <ul>
          <li>
            <strong>タグの上にマウスを置く</strong>:
            そのタグがページのどこに対応するか、 ハイライト表示されます。
          </li>
          <li>
            <strong>タグをダブルクリック</strong>:
            内容をその場で書き換えて動作を試せます
            （変更はブラウザ内だけで、ファイルには保存されません）。
          </li>
          <li>
            <strong>選択したタグの右側パネル</strong>: そのタグに当たっている
            CSS
            が見られます。不要なら一時的にチェックを外して効果を確認することもできます。
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. Console パネルを見る
        </h2>
        <p>
          <strong>「Console」</strong>タブは JavaScript
          のログとエラーが表示される場所です。 HTML / CSS
          だけを書いている段階ではあまり使いませんが、これから先、意味の分からない
          エラーに遭遇したら、まず Console を見る癖をつけましょう。
        </p>
        <p>
          Console
          に赤い文字でメッセージが出ていたらエラー。メッセージの下に表示される
          ファイル名と行番号をクリックすると、問題の場所にジャンプできます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. デバイスモードでスマホ表示を確認する
        </h2>
        <p>
          Web サイトはスマートフォンでも見られます。開発者ツールには、PC
          で作業しながら スマホ表示をシミュレートする便利な機能があります。
        </p>
        <ol>
          <li>
            開発者ツール左上の<strong>「スマホとタブレット」アイコン</strong>
            （四角と縦長の四角が並んだもの）をクリックする。
          </li>
          <li>
            ページが強制的に縦長の表示に変わり、上部に幅と高さ、機種を選ぶメニューが出ます。
          </li>
          <li>
            幅を自由にドラッグして変えたり、ドロップダウンから「iPhone 14
            Pro」のような 具体的な機種を選んだりできます。
          </li>
          <li>
            解除したいときは、もう一度「スマホとタブレット」アイコンを押します。
          </li>
        </ol>
        <p>
          第1章で「ホーム画面の SP 版」を作るときに、この機能を頻繁に使います。
          今のうちに開き方に慣れておきましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>F12 で開かない</strong>: ノート PC の場合、Fn
            キーと一緒に押さないと F12 が効かない機種があります。右クリック
            &rarr;「検証」で開けば確実です。
          </li>
          <li>
            <strong>表示が英語で読みにくい</strong>: 設定（歯車アイコン）&rarr;
            Preferences &rarr; Language
            で日本語に変更できますが、エラーメッセージ自体が英語で
            出ることも多いので、慣れる意味でも英語のままで使うのが実はおすすめです。
          </li>
          <li>
            <strong>パネルが小さくて使いにくい</strong>:
            パネルの境界線をドラッグすると 自由にリサイズできます。また、Dock
            side を下 / 右 / 分離ウィンドウと切り替えて
            見やすい位置を探しましょう。
          </li>
        </ul>
      </section>
    </article>
  );
}
