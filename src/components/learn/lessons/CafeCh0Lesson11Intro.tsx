type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function CafeCh0Lesson11Intro({
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
          リセット CSS を入れよう
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            ブラウザは親切なので、CSS を書かなくても h1
            に大きめのサイズと上下の余白を、 ul
            に左インデントを、といった既定のスタイルを勝手に当ててくれます。これを
            <strong>ブラウザデフォルトスタイル</strong>と呼びます。
          </p>
          <p>
            ただ、この既定スタイルはブラウザによって微妙に違ううえ、自分でデザインを組み立てる
            ときに邪魔になりがちです。そこで、デザインに取りかかる前に
            <strong>「一度既定を消す」</strong>ために書くのが
            <strong>リセット CSS</strong>です。
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            このレッスンで使う簡易リセット
          </p>
          <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
            <code>{`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`}</code>
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            <code>*</code> は「すべての要素」という意味のセレクタ。そこに margin
            と padding を 0 にし、box-sizing を border-box
            に揃える、というのが初学者向けの定番です。
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          実務では Normalize.css や modern-normalize
          のようなもっと洗練されたリセットを
          使うこともありますが、今はこれで十分。シンプルで効果が目に見えやすいです。
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
