export function CafeCh0FirstPullRequest() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第0章 レッスン15
      </span>
      <h1 className="text-3xl font-bold text-slate-800">最初の Pull Request</h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>作業用のブランチを切れる</li>
          <li>
            <code>add</code> / <code>commit</code> で変更を記録できる
          </li>
          <li>
            GitHub に <code>push</code> して反映できる
          </li>
          <li>プルリクエスト（PR）を作成してレビュー依頼ができる</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">全体の流れ</h2>
        <p>
          Git と GitHub を使った基本の作業フローは、この 5
          ステップの繰り返しです。
          難しく見えるかもしれませんが、一度流れを掴んでしまえばずっと使い回せます。
        </p>
        <ol>
          <li>
            <strong>ブランチを切る</strong> — 作業の枝分かれを作る
          </li>
          <li>
            <strong>ファイルを変更する</strong> — 今までと同じように書く
          </li>
          <li>
            <strong>add → commit</strong> — 変更を記録する
          </li>
          <li>
            <strong>push</strong> — GitHub に反映する
          </li>
          <li>
            <strong>Pull Request</strong> — レビュー依頼を出す
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. ブランチを切る
        </h2>
        <p>
          いきなり <code>main</code>{' '}
          ブランチを編集するのではなく、変更ごとに別のブランチを
          用意します。ブランチは「作業の枝分かれ」のようなもの。後で{' '}
          <code>main</code> に まとめて取り込みます。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git checkout -b introduce-myself`}</code>
        </pre>
        <p>
          <code>-b</code> は「新しく作って、そこに切り替える」という意味。
          <code>introduce-myself</code> の部分は自分で分かる名前なら何でも OK
          です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. 自己紹介ページを作る
        </h2>
        <p>
          レッスン6・7
          で書いた自己紹介ページをテンプレートリポジトリに追加します。
          すでに書いてあれば、そのままコピーしてリポジトリのフォルダに置きましょう。
          まだ無ければ、<code>self-introduction.html</code> を作って簡単な HTML
          を書いてください。
        </p>
        <p>
          保存したらターミナルで次のコマンドを実行して、変更された状態を確認します。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git status`}</code>
        </pre>
        <p>
          新しく追加したファイルは赤字で「Untracked
          files」として表示されているはずです。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. add と commit で記録する
        </h2>
        <p>変更を記録するには 2 段階あります。</p>
        <ol>
          <li>
            <strong>
              <code>add</code>
            </strong>
            : 記録対象を選ぶ（ステージングエリアに置く）。
          </li>
          <li>
            <strong>
              <code>commit</code>
            </strong>
            : メッセージをつけて記録を確定する。
          </li>
        </ol>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git add self-introduction.html
git commit -m "自己紹介ページを追加"`}</code>
        </pre>
        <p>
          <code>-m</code> の後に続く文字列がコミットメッセージです。短い日本語で
          「何をしたか」が分かるように書きましょう。
        </p>
        <p className="text-sm text-slate-500">
          追加ファイルが複数ある場合は <code>git add .</code>{' '}
          で「今いるフォルダ以下の 変更を全部」ステージングできます。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. GitHub に push する
        </h2>
        <p>
          ここまではすべて自分の PC 内の操作です。<code>git push</code> で初めて
          GitHub に アップロードされます。
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-800 px-4 py-3 text-xs leading-relaxed text-emerald-300">
          <code>{`git push -u origin introduce-myself`}</code>
        </pre>
        <p>
          <code>-u origin introduce-myself</code> は「このブランチは GitHub 側の
          <code>origin</code>（= 自分のリモートリポジトリ）の{' '}
          <code>introduce-myself</code>
          と紐付ける」という設定です。初回だけこの形を書きます。 2 回目以降は{' '}
          <code>git push</code> だけで OK。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 5. プルリクエストを作る
        </h2>
        <ol>
          <li>
            ブラウザでリポジトリのページを開くと、黄色い帯で
            <strong>「Compare &amp; pull request」</strong>
            ボタンが表示されていることがあります。 あればクリック。
          </li>
          <li>
            なければ、画面上部の<strong>「Pull requests」</strong>タブ &rarr;
            <strong>「New pull request」</strong>を開き、
            <strong>base: main &larr; compare: introduce-myself</strong>
            という組み合わせを選びます。
          </li>
          <li>
            <strong>Title</strong>:
            変更内容が一言で分かるものを（例:「自己紹介ページを追加」）。
          </li>
          <li>
            <strong>Description</strong>:
            何を変えたか・確認してほしい点を書く。箇条書きでOK。
          </li>
          <li>
            <strong>「Create pull request」</strong>を押して完了。
          </li>
        </ol>
        <p>
          レビュアーを指定できる場合は、講師や同期メンバーを選びます。コメントが付いたら
          対応し、修正があれば同じブランチで <code>commit</code> &rarr;{' '}
          <code>push</code>
          を繰り返せば、PR に自動で反映されます。
        </p>
      </section>

      <section className="not-prose mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900">
          ここが第0章の卒業 PR です
        </p>
        <p className="mt-2 text-sm text-amber-800">
          この PR が作れれば、導入フェーズは完了。HTML を書いて Git
          で履歴を残し、 GitHub
          上でレビューを依頼する、という実務のミニマム版が身についた状態です。
          胸を張って第1章に進みましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>push しても GitHub に何も増えていない</strong>: push
            したブランチと、GitHub で今見ているブランチが違う可能性があります。
            リポジトリページ上部のブランチ切り替え（プルダウン）で、
            <code>introduce-myself</code> を選んでみてください。
          </li>
          <li>
            <strong>Pull request の比較対象が逆</strong>: base と compare
            を間違えると、 差分がマイナスになって確認できません。
            <strong>base: main</strong>、
            <strong>compare: 自分のブランチ</strong>
            の順で必ず選びましょう。
          </li>
          <li>
            <strong>
              コミットメッセージを空で確定しようとしてエディタが開いた
            </strong>
            :<code>:wq</code> と打って Enter で脱出できます（Vim
            というエディタが起動しています）。 次回からは{' '}
            <code>-m &quot;…&quot;</code> を忘れずに。
          </li>
        </ul>
      </section>
    </article>
  );
}
