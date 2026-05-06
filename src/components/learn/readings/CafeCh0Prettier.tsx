export function CafeCh0Prettier() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン3
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        Prettier を設定しよう
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>Prettier 拡張機能をインストールできる</li>
          <li>保存したときにコードが自動で整形されるよう設定できる</li>
          <li>意図したフォーマットで整形されることを目で確認できる</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">
          フォーマッターって何？
        </h2>
        <p>
          プログラミングは「動けば何でもいい」ではありません。同じように動くコードでも、
          インデント（字下げ）の幅・改行の位置・引用符の種類がバラバラだと、後から読む人
          （未来の自分も含めて）がとても読みにくくなります。
        </p>
        <p>
          そこで <strong>フォーマッター</strong>
          という自動整形ツールを使います。コードを
          書いて保存するだけで、機械が勝手にきれいに並べ替えてくれる仕組みです。
          チームで決めたスタイルを機械に任せておけば、人間はロジックを書くことに集中できます。
        </p>
        <p>
          HTML / CSS / JavaScript の世界で最も広く使われているフォーマッターが
          <strong> Prettier（プリティア）</strong>です。ここからは VS Code に
          Prettier を入れて、
          「保存したら自動できれいになる」環境を作りましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. Prettier 拡張機能をインストールする
        </h2>
        <ol>
          <li>
            VS Code を開き、左端のアクティビティバーから四角 4 つの
            <strong>拡張機能アイコン</strong>をクリック。
          </li>
          <li>
            検索ボックスに <strong>Prettier - Code formatter</strong>{' '}
            と入力する。
          </li>
          <li>
            候補の中から提供元が <strong>Prettier</strong>（公式）のものを選び、
            <strong>「Install」</strong>をクリック。
          </li>
          <li>インストールが終わるとボタンが「Uninstall」に変わります。</li>
        </ol>
        <p className="text-sm text-slate-500">
          提供元表示が公式ではないコピー版が上位に出ていることもあります。ダウンロード数や
          星評価も参考にしながら、必ず本家 Prettier の拡張機能を選んでください。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. 保存時に自動整形する設定を入れる
        </h2>
        <p>
          拡張機能を入れただけではまだ動きません。「保存したらフォーマッターを走らせる」
          という設定を VS Code に教えます。
        </p>
        <ol>
          <li>
            上部メニューから <strong>Code → 基本設定 → 設定</strong>
            （Mac: <strong>Code → Settings… → Settings</strong>、Windows:
            <strong> ファイル → ユーザー設定 → 設定</strong>）を開く。
          </li>
          <li>
            画面上部の検索ボックスに <code>format on save</code> と入力する。
          </li>
          <li>
            <strong>Editor: Format On Save</strong>
            という項目が出てくるので、チェックボックスを ON にする。
          </li>
          <li>
            続けて検索を <code>default formatter</code> に変える。
          </li>
          <li>
            <strong>Editor: Default Formatter</strong>
            のドロップダウンで <strong>Prettier - Code formatter</strong>{' '}
            を選ぶ。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. プロジェクトに .prettierrc を配置する
        </h2>
        <p>
          Prettier は設定ファイル <code>.prettierrc</code>{' '}
          を読んでフォーマットの細かなルール （引用符の種類、1
          行の最大文字数、セミコロンの有無など）を決めます。
        </p>
        <p>
          作業フォルダの直下（VS Code の左サイドバーの一番上）に
          <code>.prettierrc</code>{' '}
          という名前のファイルを作り、中身を次のようにします。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "es5"
}`}</code>
        </pre>
        <p>
          この設定で「セミコロンを自動で付ける」「文字列はシングルクォート」「インデントは
          スペース 2 つ」「1 行は 80 文字まで」「末尾カンマを ES5
          に合わせて付ける」という ルールが適用されます。
        </p>
        <p className="text-sm text-slate-500">
          ファイル名は<strong>先頭にドット</strong>
          が付きます。意外と間違いやすいので、 保存後にファイル名が{' '}
          <code>.prettierrc</code> になっているか確認しましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. 実際に動かして感動する
        </h2>
        <p>
          準備が整ったら、動作確認です。<code>hello.html</code>{' '}
          に、わざと汚い書き方で HTML
          を書いてみてください。インデントがバラバラだったり、空白がおかしかったりで
          OK です。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`<html>
        <body>
  <h1>こんにちは</h1>
          <p>    Prettier    の実験    </p>
</body>
</html>`}</code>
        </pre>
        <p>
          このファイルを保存（
          <code>Cmd/Ctrl + S</code>
          ）してください。インデントと空白が一瞬できれいに 整うはずです。これが
          Prettier の動いた瞬間です。
        </p>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            感動ポイント: 「勝手にコードが綺麗になった」
          </p>
          <p className="mt-1 text-xs text-amber-800">
            この体験こそが Prettier
            を入れる最大の価値。書いている最中はスタイルを気にせず、
            保存すれば常にきれいな状態が保てます。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>保存しても何も変わらない</strong>: Format On Save
            のチェックが外れている ことが多いです。設定画面で{' '}
            <code>format on save</code> を検索して ON か確認しましょう。
          </li>
          <li>
            <strong>別のフォーマッターが動いてしまう</strong>: Default Formatter
            が Prettier に
            なっているか確認してください。別の拡張機能が勝手にフォーマッターを主張している
            場合があります。
          </li>
          <li>
            <strong>.prettierrc の中身が反映されない</strong>:
            ファイル名に誤字がないか （<code>.prettierrc</code>{' '}
            の先頭ドット）、JSON の書式として正しいか（カンマ忘れなど）
            を確認しましょう。
          </li>
        </ul>
      </section>
    </article>
  );
}
