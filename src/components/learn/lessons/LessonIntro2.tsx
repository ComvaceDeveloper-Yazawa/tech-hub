type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const examples: {
  usage: string;
  method: 'img' | 'bg';
  reason: string;
}[] = [
  { usage: '商品写真', method: 'img', reason: '商品情報として必要' },
  { usage: 'ヒーロー背景', method: 'bg', reason: '装飾目的' },
  {
    usage: 'ユーザーアイコン',
    method: 'img',
    reason: 'ユーザーを識別する情報',
  },
  {
    usage: 'セクション背景パターン',
    method: 'bg',
    reason: 'デザイン要素',
  },
  { usage: '記事内の図解', method: 'img', reason: '記事の内容を補足' },
];

export function LessonIntro2({
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: Props) {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          解説 2 / 3
        </span>

        <h2 className="mb-8 text-2xl font-bold text-slate-800">
          どっちを使う？判断フローチャート
        </h2>

        {/* フローチャート風の図 */}
        <div className="mb-10 flex flex-col items-center">
          {/* 質問ボックス */}
          <div className="relative mb-2 w-full max-w-md rounded-xl border-2 border-amber-300 bg-amber-50 px-6 py-4 text-center">
            <span className="mb-1 block text-xs font-semibold text-amber-600">
              判断基準
            </span>
            <p className="text-sm font-bold text-slate-800">
              その画像がなくなったら、
              <br />
              ページの意味が変わる？
            </p>
          </div>

          {/* 矢印 + 分岐 */}
          <div className="flex w-full max-w-md items-start justify-center gap-0">
            {/* はい側 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="h-6 w-0.5 bg-slate-300" />
              <span className="mb-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                はい
              </span>
              <div className="h-4 w-0.5 bg-slate-300" />
              <div className="rounded-lg border-2 border-sky-300 bg-sky-50 px-4 py-3 text-center">
                <p className="text-xs font-bold text-sky-700">{'<img>'} タグ</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  コンテンツ画像
                </p>
              </div>
            </div>

            {/* いいえ側 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="h-6 w-0.5 bg-slate-300" />
              <span className="mb-1 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-bold text-rose-700">
                いいえ
              </span>
              <div className="h-4 w-0.5 bg-slate-300" />
              <div className="rounded-lg border-2 border-violet-300 bg-violet-50 px-4 py-3 text-center">
                <p className="text-xs font-bold text-violet-700">
                  background-image
                </p>
                <p className="mt-1 text-[10px] text-slate-500">装飾画像</p>
              </div>
            </div>
          </div>
        </div>

        {/* 具体例テーブル */}
        <h3 className="mb-3 text-sm font-bold text-slate-700">具体例</h3>
        <div className="mb-10 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">
                  画像の用途
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">
                  使うべき方法
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold text-slate-500">
                  理由
                </th>
              </tr>
            </thead>
            <tbody>
              {examples.map((ex) => (
                <tr
                  key={ex.usage}
                  className="border-t border-slate-100 bg-white"
                >
                  <td className="px-4 py-2.5 text-xs font-medium text-slate-700">
                    {ex.usage}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={
                        ex.method === 'img'
                          ? 'rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700'
                          : 'rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700'
                      }
                    >
                      {ex.method === 'img' ? '<img>' : 'background-image'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {ex.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
          <p className="text-sm text-slate-700">
            このチャプターでは{' '}
            <span className="font-bold text-violet-700">background-image</span>{' '}
            を使って、
            <br />
            カフェサイトのヒーロー画像を作っていきます。
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
            {isLastStep ? '完了' : '次へ進む →'}
          </button>
        </div>
      </div>
    </div>
  );
}
