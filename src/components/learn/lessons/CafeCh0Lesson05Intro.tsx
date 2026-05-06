type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

/**
 * 第0章 レッスン5「はじめての HTML」の解説ステップ。
 * HTML とは何か、タグとは何かを、ブラウザ画面との対応で説明する。
 */
export function CafeCh0Lesson05Intro({
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: Props) {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          解説
        </span>

        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          HTML って何？
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            ブラウザに表示されるすべての Web
            ページは、文字の集まりでできています。 その文字の書き方のルールが{' '}
            <strong>HTML</strong> です。
          </p>
          <p>
            HTML
            では、文字に「意味」をタグで付けます。タグとは山かっこで囲まれた目印で、
            開始タグと終了タグで文字を挟むことで、ブラウザにその文字の役割を伝えます。
          </p>
        </div>

        {/* 対比図: 書いたコード vs ブラウザ表示 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              あなたが書く
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
              <code>{`<h1>こんにちは</h1>`}</code>
            </pre>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              ブラウザが表示する
            </p>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <h1 className="text-2xl font-bold text-slate-900">こんにちは</h1>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-relaxed text-amber-900">
            ポイントはタグの書き方です。 開始タグ{' '}
            <code className="rounded bg-amber-100 px-1 font-mono text-xs">
              {'<h1>'}
            </code>{' '}
            で始まり、 終了タグ{' '}
            <code className="rounded bg-amber-100 px-1 font-mono text-xs">
              {'</h1>'}
            </code>{' '}
            で閉じます。
            終了タグにはスラッシュが付くのを忘れないようにしましょう。
          </p>
        </div>

        <div className="mb-8 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            今回のレッスンでは、代表的なタグを 2
            つ使って画面に文字を出してみます。
          </p>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">
              <strong>見出し</strong>:{' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                {'<h1>'}
              </code>
              （ページで一番大きな見出し）
            </li>
            <li className="list-disc">
              <strong>段落</strong>:{' '}
              <code className="rounded bg-slate-100 px-1 font-mono text-xs">
                {'<p>'}
              </code>
              （本文のひとかたまり）
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={isFirstStep}
            className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            ← 前へ
          </button>
          <button
            onClick={onNext}
            className="flex-1 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 active:scale-[0.98]"
          >
            {isLastStep ? '完了' : '実習に進む →'}
          </button>
        </div>
      </div>
    </div>
  );
}
