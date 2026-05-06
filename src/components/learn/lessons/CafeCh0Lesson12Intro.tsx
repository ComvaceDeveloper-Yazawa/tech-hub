type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function CafeCh0Lesson12Intro({
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
          メディアクエリって何？
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            Web サイトは PC でもスマホでも、同じ URL
            で見られます。でも画面の広さは全然違うので、
            同じ見た目のままだと、PC
            では余白が広すぎて寂しかったり、スマホでは文字が小さすぎて
            読めなかったり、という問題が起きます。
          </p>
          <p>
            そこで CSS には
            <strong>「画面の幅に応じてスタイルを切り替える」</strong>
            仕組みが用意されています。 それが<strong>メディアクエリ</strong>
            です。
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            書き方
          </p>
          <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
            <code>{`/* 画面幅が 768px 未満のときだけ適用 */
@media (max-width: 767px) {
  h1 {
    color: red;
  }
}`}</code>
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            <code>@media (max-width: 767px)</code> は「画面幅が 767px
            以下のとき」という条件。 その波カッコの中に書いた CSS
            は、条件に合うときだけ適用されます。
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          開発者ツールのデバイスモードで画面幅を変えながら見ると、色が切り替わる瞬間を
          目で確認できます。今回はその体験をしてもらうレッスンです。
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
