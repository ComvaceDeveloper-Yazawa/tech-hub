type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function LessonIntro1({
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: Props) {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          解説 1 / 3
        </span>

        <h2 className="mb-8 text-2xl font-bold text-slate-800">
          Webページの画像、2つの入れ方
        </h2>

        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          Webページに画像を表示する方法は大きく2つあります。
          それぞれ役割が違うので、使い分けが大切です。
        </p>

        {/* 2カラム比較図 */}
        <div className="mb-10 grid grid-cols-2 gap-4">
          {/* img タグ */}
          <div className="rounded-xl border-2 border-sky-200 bg-sky-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white">
                1
              </span>
              <h3 className="text-base font-bold text-sky-800">
                {'<img>'} タグ
              </h3>
            </div>
            <p className="mb-3 text-xs font-medium text-sky-600">HTML で書く</p>

            <div className="mb-4 rounded-lg bg-slate-800 p-3">
              <code className="text-xs leading-relaxed text-emerald-400">
                {'<img src="photo.jpg"'}
                <br />
                {'     alt="カフェの外観">'}
              </code>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-sky-500">✓</span>
                <p className="text-xs text-slate-600">
                  コンテンツとして意味のある画像
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-sky-500">✓</span>
                <p className="text-xs text-slate-600">
                  スクリーンリーダーが alt を読み上げる
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-sky-500">✓</span>
                <p className="text-xs text-slate-600">
                  例：商品写真、記事の図解
                </p>
              </div>
            </div>
          </div>

          {/* background-image */}
          <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-white">
                2
              </span>
              <h3 className="text-base font-bold text-violet-800">
                background-image
              </h3>
            </div>
            <p className="mb-3 text-xs font-medium text-violet-600">
              CSS で書く
            </p>

            <div className="mb-4 rounded-lg bg-slate-800 p-3">
              <code className="text-xs leading-relaxed text-emerald-400">
                {'.hero {'}
                <br />
                {'  background-image:'}
                <br />
                {'    url("hero.jpg");'}
                <br />
                {'}'}
              </code>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-500">✓</span>
                <p className="text-xs text-slate-600">
                  装飾・デザイン目的の画像
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-500">✓</span>
                <p className="text-xs text-slate-600">
                  見た目を整えるための画像
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-500">✓</span>
                <p className="text-xs text-slate-600">
                  例：ヒーロー背景、パターン
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={isFirstStep}
            className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
          >
            ← 前へ
          </button>
          <button
            onClick={onNext}
            className="flex-1 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98]"
          >
            {isLastStep ? '完了' : '次へ進む →'}
          </button>
        </div>
      </div>
    </div>
  );
}
