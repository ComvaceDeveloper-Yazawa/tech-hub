/**
 * 第1章 各レッスンの解説ステップ用コンポーネント。
 * 1 レッスンに 1 画面、軽い導入を表示する共通レイアウト。
 */

type Props = {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

type IntroContent = {
  badge: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
};

function IntroLayout({
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  content,
}: Props & { content: IntroContent }) {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {content.badge}
        </span>
        <h2 className="mb-6 text-2xl font-bold text-slate-800">
          {content.title}
        </h2>
        <div className="mb-6 space-y-3 text-sm leading-relaxed text-slate-600">
          {content.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {content.bullets && (
          <ul className="mb-6 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
            {content.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
        {content.note && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {content.note}
          </div>
        )}
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

export function CafeCh1Lesson02Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン2',
        title: 'フォントを読み込んで使おう',
        paragraphs: [
          'Web フォントは、ブラウザに内蔵されていない書体を外部から読み込んで使う仕組みです。Google Fonts が最も手軽で無料。',
          'CSS の先頭で @import すると、そのフォントを font-family で指定できるようになります。',
        ],
        bullets: [
          '@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap");',
          'font-family: で使いたいフォント名を指定',
          'font-weight で太さ、font-size で大きさを調整',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson03Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン3',
        title: '画像を表示しよう',
        paragraphs: [
          '画像を出す方法は <img> タグと background-image の 2 つ。前者はコンテンツ、後者は装飾、というのが基本の使い分け。',
          'このレッスンでは <img> タグと object-fit を使って、画像をきれいに枠に収める方法を練習します。',
        ],
        bullets: [
          '<img src="…" alt="…"> で画像を表示',
          'object-fit: cover で画像を要素いっぱいに広げつつ比率を保つ',
          'object-fit: contain で要素内に収める',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson04Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン4',
        title: 'ボックスモデルを理解しよう',
        paragraphs: [
          'HTML の要素はすべて「四角い箱」と見なせます。その箱は「中身」「padding」「border」「margin」の 4 層で構成されています。これをボックスモデルと呼びます。',
          'box-sizing: border-box; にすると、指定した width に padding と border も含むようになり、レイアウトが直感的になります。',
        ],
        bullets: [
          'margin: 外側の余白',
          'border: 箱の枠線',
          'padding: 内側の余白',
          'display: block / inline / inline-block の違いも頭に入れておく',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson05Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン5',
        title: 'コンテナで中央寄せしよう',
        paragraphs: [
          '大きな画面でコンテンツが横幅いっぱいに広がると読みにくくなります。そこで「コンテナ」を作って中央に寄せるのが定番です。',
          'max-width で最大幅を制限し、margin: 0 auto で左右の余白を均等にすると中央寄せが完成します。',
        ],
        bullets: [
          'max-width: 960px; のように上限を決める',
          'margin: 0 auto; で横方向の中央寄せ',
          'width と max-width の違いに注意',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson06Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン6',
        title: 'Flexbox で横並びを作ろう',
        paragraphs: [
          '親要素に display: flex; を指定すると、中の子要素が横並びになります。これが Flexbox。',
          '1 次元（横か縦のどちらか）の配置を簡単に作れる道具で、レイアウトの主役。',
        ],
        bullets: [
          'justify-content: 主軸方向の配置（center / space-between / space-around）',
          'align-items: 直交する方向の揃え（center / flex-start / stretch）',
          'gap: 子要素同士の間隔',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson07Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン7',
        title: 'Grid で格子レイアウトを作ろう',
        paragraphs: [
          'Grid は 2 次元（縦横同時）の配置ができる仕組み。商品カードを 4 列 × 2 行のように並べたいときに最適。',
          'display: grid; を指定して、grid-template-columns で列の数や幅を決めます。',
        ],
        bullets: [
          'repeat(4, 1fr) で「同じ幅の 4 列」',
          'gap でカード同士の間隔を指定',
          '1 次元は Flex、2 次元は Grid と覚えておく',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson08Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン8',
        title: 'ホバーで動きをつけよう',
        paragraphs: [
          'マウスを載せた瞬間だけスタイルを変えたいときは :hover 疑似クラスを使います。ボタンが「押せる」ことを視覚的に伝える基本テクニック。',
          '最初のインタラクション体験。プレビューにマウスを載せてみましょう。',
        ],
        bullets: [
          'セレクタ:hover { … } で「マウスが載ったとき」を指定',
          '色を変える、影を濃くする、少し大きくする、など',
        ],
        note: '今回はトランジション（滑らかな変化）はまだ扱いません。色がパッと変わるシンプルな形で練習します。',
      }}
    />
  );
}

export function CafeCh1Lesson09Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン9',
        title: 'フォーム要素をカスタマイズしよう',
        paragraphs: [
          '<input> や <button>、<select> はブラウザによって見た目がバラバラで、そのままではデザインに馴染みません。',
          'appearance: none でデフォルト装飾をリセットし、自前のスタイルを当て直します。',
        ],
        bullets: [
          'appearance: none でブラウザ装飾をリセット',
          'padding / border / border-radius で形を作る',
          'font-family / font-size を親に合わせる',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson10Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン10',
        title: 'MainView を作ろう（PC 版）',
        paragraphs: [
          'いよいよホーム画面の実装に入ります。まずはページ上部の MainView。背景に大きな写真を敷き、中央に白い見出しボックスを重ねます。',
          '背景は background-image、中央寄せは Flexbox で作ります。',
        ],
        bullets: [
          'background-image / background-size / background-position の 3 点セット',
          'display: flex; justify-content: center; align-items: center; で中央寄せ',
          '中の .hero-box は border-radius で角丸をつけて柔らかい印象に',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson11Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン11',
        title: 'ButtonBar を作ろう（PC 版)',
        paragraphs: [
          '黒い帯の中に「商品一覧」見出しと並び替え <select> を左右に配置します。',
          'Flexbox の justify-content: space-between で「左右の端」に分けるのがポイント。',
        ],
        bullets: [
          '親に display: flex; justify-content: space-between;',
          'レッスン9 で学んだ <select> のカスタマイズを再利用',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson12Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン12',
        title: 'ProductLists を作ろう（PC 版)',
        paragraphs: [
          '商品カードを 4 列 × 2 行のグリッドで並べます。ここで Grid の本領発揮。',
          '各カードは「画像 + 商品名 + 価格」の 3 段構成。まずは骨組みだけ作ります。',
        ],
        bullets: [
          'display: grid; grid-template-columns: repeat(4, 1fr);',
          'gap で余白を調整',
          'カード内の画像は object-fit: cover で正方形に整える',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson13Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン13',
        title: 'CTA ブロック + フッターを作ろう（PC 版）',
        paragraphs: [
          'ダークグレー背景の CTA ブロックと、オレンジ背景のフッタープレースホルダーを作ります。',
          '「カート一覧を見る」ボタンは白い pill 形。border-radius を大きくすると角が完全に丸くなります。',
        ],
        bullets: [
          'CTA の背景は暗い色、ボタンは白で目立たせる',
          'pill 形は border-radius: 9999px（もしくは 999px）',
          'hover で色を少し変える',
        ],
      }}
    />
  );
}

export function CafeCh1Lesson14Intro(props: Props) {
  return (
    <IntroLayout
      {...props}
      content={{
        badge: '第1章 レッスン14',
        title: 'ホーム画面 SP 版を作ろう',
        paragraphs: [
          '最後に、これまで作った PC レイアウトを SP（スマホ）に対応させます。モバイルファーストの考え方で、狭い画面にきちんと収まる形に変えます。',
          'メディアクエリで画面幅ごとにスタイルを切り替えるのが主軸。',
        ],
        bullets: [
          'ブレイクポイントは 768px 前後が一般的',
          '@media (max-width: 767px) { … } で SP 向けを上書き',
          'Grid の列数は 4 → 1 に、Flex の向きは row → column に',
        ],
        note: '第1章の卒業 PR です。PC と SP の両方で崩れないことを確認してから提出しましょう。',
      }}
    />
  );
}
