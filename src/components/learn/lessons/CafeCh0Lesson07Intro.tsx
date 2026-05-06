type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function CafeCh0Lesson07Intro({
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
          HTML の基本ルール
        </h2>

        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            ここまで <code>h1</code> や <code>p</code>{' '}
            をただ並べてきましたが、本来の HTML
            にはもう少しお作法があります。ブラウザや検索エンジンが「このページは
            何者か」を正しく解釈するため、決まった枠組みで書く必要があります。
          </p>
          <p>
            このレッスンでは、前回作った自己紹介ページを「ちゃんとした形」に整えます。
            最初は呪文のように覚えてしまって
            OK。意味は少しずつ染み込んでいきます。
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            HTML ドキュメントの型
          </p>
          <pre className="overflow-x-auto rounded-lg bg-slate-800 px-3 py-2 text-xs leading-relaxed text-emerald-300">
            <code>{`<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ページのタイトル</title>
  </head>
  <body>
    <!-- ここに見える中身を書く -->
  </body>
</html>`}</code>
          </pre>
        </div>

        <div className="mb-8 space-y-2 text-sm leading-relaxed text-slate-600">
          <p>各行の意味をざっくり:</p>
          <ul className="space-y-1 pl-5">
            <li className="list-disc">
              <code>&lt;!DOCTYPE html&gt;</code>: これは最新の HTML ですよの宣言
            </li>
            <li className="list-disc">
              <code>&lt;html lang=&quot;ja&quot;&gt;</code>:
              ここからページ本体。日本語のページ
            </li>
            <li className="list-disc">
              <code>&lt;head&gt;</code>:
              設定情報。文字コード、タイトル、スマホ向けの設定など
            </li>
            <li className="list-disc">
              <code>&lt;body&gt;</code>: 実際に画面に表示される中身
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
