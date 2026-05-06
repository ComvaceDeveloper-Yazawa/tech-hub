type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function CafeCh0Lesson10Intro({
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
          クラスセレクタを使おう
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            ここまでは <code>h1</code> や <code>body</code>{' '}
            のような「要素名」に対して CSS を
            当ててきました。ただ、これだと「同じ種類の要素はみんな同じ見た目になる」という
            問題があります。
          </p>
          <p>
            そこで登場するのが <strong>クラス</strong>。HTML
            の各要素に「好きな名前」を 付けておき、その名前を使って CSS
            を書きます。こうすると、同じ <code>p</code>
            でも別々の見た目にできます。
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              HTML 側
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
              <code>{`<p class="lead">重要な段落</p>
<p>ふつうの段落</p>`}</code>
            </pre>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              CSS 側
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
              <code>{`.lead {
  color: red;
  font-weight: bold;
}`}</code>
            </pre>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          ポイントは CSS 側のセレクタに
          <strong>ピリオド</strong>（<code>.</code>）が付くこと。
          <code>.lead</code> で「class が lead の要素」という 意味になります。
        </div>

        <div className="mb-8 space-y-2 text-sm leading-relaxed text-slate-600">
          <p>クラス名の付け方のコツ:</p>
          <ul className="space-y-1 pl-5">
            <li className="list-disc">
              意味で付ける（見た目ではなく役割）。<code>red-box</code> ではなく
              <code>alert</code> のように。
            </li>
            <li className="list-disc">
              英小文字とハイフンで書く（<code>hero-box</code>）。kebab-case
              と呼ばれます。
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
