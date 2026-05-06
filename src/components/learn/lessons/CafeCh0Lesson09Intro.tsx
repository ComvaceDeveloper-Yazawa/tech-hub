type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function CafeCh0Lesson09Intro({
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
          CSS で装飾してみよう
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            HTML が「意味」を書くものなら、CSS は「見た目」を書くものです。同じ
            HTML でも、 CSS を変えれば色もサイズも雰囲気もガラッと変わります。
          </p>
          <p>
            書き方はシンプル。
            <strong>「どの要素に」「何を、いくつにする」</strong>を
            対にして並べていくだけです。
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            CSS の基本構文
          </p>
          <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
            <code>{`h1 {
  color: blue;
  font-size: 32px;
}`}</code>
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            <code>h1</code> が「どの要素に」、その後の波カッコの中が
            「何をいくつにする」の組。プロパティと値はコロン
            <code>:</code> で区切り、終わりにセミコロン
            <code>;</code> を付けます。
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <PropCard
            name="color"
            desc="文字の色。赤 = red、青 = blue、16進数 #528bff などで指定。"
          />
          <PropCard name="background-color" desc="背景の色。" />
          <PropCard
            name="font-size"
            desc="文字の大きさ。16px / 1.5rem などで指定。"
          />
          <PropCard
            name="text-align"
            desc="文字の揃え方。left / center / right。"
          />
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          このあとの実習では、HTML の head 内に &lt;style&gt;
          タグを置いて、そこに CSS を
          書いていきます。別ファイルにする方法は次回以降で学びます。
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

function PropCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-1 font-mono text-sm font-bold text-indigo-700">{name}</p>
      <p className="text-xs leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}
