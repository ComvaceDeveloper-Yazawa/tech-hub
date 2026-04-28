type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const properties = [
  {
    num: 1,
    property: 'background-image',
    desc: '画像を指定',
    example: 'url("...")',
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
  },
  {
    num: 2,
    property: 'background-repeat',
    desc: '繰り返しを止める',
    example: 'no-repeat',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
  {
    num: 3,
    property: 'background-size',
    desc: '要素いっぱいに広げる',
    example: 'cover',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  {
    num: 4,
    property: 'background-position',
    desc: '中央に配置',
    example: 'center',
    color: 'bg-sky-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
  },
];

export function LessonIntro3({
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: Props) {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          解説 3 / 3
        </span>

        <h2 className="mb-3 text-2xl font-bold text-slate-800">
          background-image の「4点セット」
        </h2>
        <p className="mb-8 text-sm text-slate-500">
          background-image
          を使うときは、たいてい4つのプロパティをセットで書きます。
        </p>

        {/* 4点セットのカード */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          {properties.map((p) => (
            <div
              key={p.property}
              className={`rounded-xl border ${p.borderColor} ${p.bgColor} p-4`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${p.color} text-xs font-bold text-white`}
                >
                  {p.num}
                </span>
                <span className={`text-xs font-bold ${p.textColor}`}>
                  {p.desc}
                </span>
              </div>
              <div className="rounded-lg bg-slate-800 px-3 py-2">
                <code className="text-xs text-emerald-400">
                  {p.property}: {p.example};
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* 完成形コード */}
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200">
          <div className="bg-slate-800 px-4 py-2">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400">
              完成形のコード
            </span>
          </div>
          <div className="bg-slate-900 p-4">
            <pre className="text-xs leading-6 text-slate-300">
              <code>
                <span className="text-violet-400">{'.hero'}</span>
                {' {\n'}
                {'  width: '}
                <span className="text-amber-300">100%</span>
                {';\n'}
                {'  height: '}
                <span className="text-amber-300">400px</span>
                {';\n\n'}
                {'  '}
                <span className="text-rose-400">background-image</span>
                {': url('}
                <span className="text-emerald-400">{'"..."'}</span>
                {');\n'}
                {'  '}
                <span className="text-amber-400">background-repeat</span>
                {': '}
                <span className="text-sky-300">no-repeat</span>
                {';\n'}
                {'  '}
                <span className="text-emerald-400">background-size</span>
                {': '}
                <span className="text-sky-300">cover</span>
                {';\n'}
                {'  '}
                <span className="text-sky-400">background-position</span>
                {': '}
                <span className="text-sky-300">center</span>
                {';\n'}
                {'}'}
              </code>
            </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-sm font-medium text-emerald-800">
            準備はいいですか？
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            次のステップからエディタが登場します。1つずつ書いていきましょう！
          </p>
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
            {isLastStep ? '完了' : 'さっそく始める →'}
          </button>
        </div>
      </div>
    </div>
  );
}
