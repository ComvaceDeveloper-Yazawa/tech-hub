type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function HeroLesson2({ onNext, onPrev }: Props) {
  const properties = [
    {
      name: 'background-image',
      desc: '画像を指定する',
      example: 'url("cafe.jpg")',
      color: 'bg-rose-500',
      border: 'border-rose-200',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
    },
    {
      name: 'background-repeat',
      desc: '繰り返しを制御する',
      example: 'no-repeat',
      color: 'bg-amber-500',
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
    },
    {
      name: 'background-size',
      desc: 'サイズを制御する',
      example: 'cover',
      color: 'bg-emerald-500',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
    },
    {
      name: 'background-position',
      desc: '位置を制御する',
      example: 'center',
      color: 'bg-sky-500',
      border: 'border-sky-200',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
    },
  ];

  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          解説 2 / 2
        </span>

        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          background-imageの4点セットとは
        </h2>

        <p className="mb-8 text-sm leading-relaxed text-slate-600">
          背景画像をきれいに表示するには、4つのプロパティをセットで書くのが基本です。
          これを「4点セット」と呼びます。
        </p>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {properties.map((prop, i) => (
            <div
              key={prop.name}
              className={`rounded-xl border-2 ${prop.border} ${prop.bg} p-4`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${prop.color} text-xs font-bold text-white`}
                >
                  {i + 1}
                </span>
                <h3 className={`text-sm font-bold ${prop.text}`}>
                  {prop.name}
                </h3>
              </div>
              <p className="mb-2 text-xs text-slate-600">{prop.desc}</p>
              <div className="rounded bg-slate-800 px-3 py-1.5">
                <code className="text-xs text-emerald-400">
                  {prop.name}: {prop.example};
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <p className="text-sm font-medium text-indigo-800">
            次のステップから、この4つを1つずつ書いていきます。
            最後にはカフェのヒーローセクションが完成します。
          </p>
        </div>

        <div className="mt-8 flex gap-2">
          <button
            onClick={onPrev}
            className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            ← 前へ
          </button>
          <button
            onClick={onNext}
            className="flex-1 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600 active:scale-[0.98]"
          >
            実践に進む →
          </button>
        </div>
      </div>
    </div>
  );
}
