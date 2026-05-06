type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function CafeCh0Lesson06Intro({
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
          色んなタグを試そう
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            HTML には意味ごとに様々なタグがあります。前回覚えた <code>h1</code>{' '}
            と <code>p</code>{' '}
            もその一部。このレッスンでは、よく使うタグを一通り触って、
            「何をするタグか」を目で覚えていきます。
          </p>
          <p>
            覚えるのは名前と役割だけで大丈夫。使い方は実習しながらじわじわ染み込ませていきましょう。
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <TagCard name="h1〜h6" desc="見出しタグ。1 が最大、6 が最小。" />
          <TagCard name="p" desc="段落タグ。本文のひとかたまり。" />
          <TagCard name="br" desc="改行タグ。閉じタグがない。" />
          <TagCard
            name="strong / em"
            desc="強調タグ。太字 / 斜体の意味を持つ。"
          />
          <TagCard
            name="ul / ol / li"
            desc="箇条書き。ul は黒丸、ol は番号。"
          />
          <TagCard name="a" desc="リンクタグ。href に飛び先を書く。" />
          <TagCard name="img" desc="画像タグ。src に画像の場所を書く。" />
          <TagCard name="div / span" desc="意味を持たない箱。レイアウト用。" />
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          このあとの実習で、自己紹介ページを作りながらタグに触れていきます。最初は
          「こんな感じで並べるんだな」が分かれば OK。
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

function TagCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-1 font-mono text-sm font-bold text-indigo-700">
        &lt;{name}&gt;
      </p>
      <p className="text-xs leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}
