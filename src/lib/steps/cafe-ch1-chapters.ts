import type { Chapter } from '@/types/step';

const HERO_IMAGE_URL = 'https://picsum.photos/id/225/600/400';
const PRODUCT_IMAGE_URL = 'https://picsum.photos/id/1060/300/300';

/**
 * 第1章 レッスン2「フォントを読み込んで使おう」
 */
export const cafeCh1FontsChapter: Chapter = {
  id: 'cafe-ch1-02-fonts',
  title: 'フォントを読み込んで使おう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-02-lesson-1', title: 'フォント読み込み' },
    {
      kind: 'practice',
      id: 'cafe-ch1-02-step-1',
      title: '① フォントを読み込んで適用しよう',
      description: `Google Fonts の "Noto Sans JP" を読み込み、body 全体に適用します。

書き方:
\`\`\`
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap");

body {
  font-family: "Noto Sans JP", sans-serif;
}
\`\`\``,
      initialCode: {
        html: `<h1>コーヒーショップを作ってみよう！</h1>
<p>スクラッチから作る EC サイトの学習カリキュラム。</p>
`,
        css: `/* ここに @import と body ルールを書こう */
`,
      },
      hints: [
        '@import は CSS の先頭に書きます',
        'body { font-family: "Noto Sans JP", sans-serif; }',
      ],
      targetSelector: 'body',
      checkRules: [
        {
          property: 'fontFamily',
          condition: 'includes',
          value: 'Noto Sans JP',
          failureHint:
            'body の font-family に "Noto Sans JP" が含まれていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'フォントが変わりました。文字の印象がガラッと変わるのが分かります。',
    },
  ],
};

/**
 * 第1章 レッスン3「画像を表示しよう」
 */
export const cafeCh1ImagesChapter: Chapter = {
  id: 'cafe-ch1-03-images',
  title: '画像を表示しよう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-03-lesson-1', title: '画像の出し方' },
    {
      kind: 'practice',
      id: 'cafe-ch1-03-step-1',
      title: '① img タグで画像を表示しよう',
      description: `<img> タグで画像を表示し、幅を 300px に揃えます。alt も忘れずに。

書き方:
\`\`\`
<img src="${PRODUCT_IMAGE_URL}" alt="商品" class="product-img">
\`\`\`

CSS 側:
\`\`\`
.product-img {
  width: 300px;
  height: 200px;
  object-fit: cover;
}
\`\`\``,
      initialCode: {
        html: `<h1>商品一覧</h1>
<!-- ここに img タグを書こう -->
`,
        css: `/* ここに .product-img のルールを書こう */
`,
      },
      hints: [
        '<img src="…" alt="…" class="product-img">',
        'width と height で枠を作り、object-fit: cover で画像を収める',
      ],
      targetSelector: '.product-img',
      checkRules: [
        {
          property: 'objectFit',
          condition: 'equals',
          value: 'cover',
          failureHint: '.product-img の object-fit が cover になっていません',
        },
        {
          property: 'width',
          condition: 'equals',
          value: '300px',
          failureHint: '.product-img の width が 300px になっていません',
        },
      ],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'img.product-img',
          failureHint: '<img class="product-img"> が見当たりません',
        },
      ],
      successMessage: '画像がきれいに枠に収まりました。',
    },
  ],
};

/**
 * 第1章 レッスン4「ボックスモデル」
 */
export const cafeCh1BoxModelChapter: Chapter = {
  id: 'cafe-ch1-04-box-model',
  title: 'ボックスモデルを理解しよう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-04-lesson-1', title: 'ボックスモデル' },
    {
      kind: 'practice',
      id: 'cafe-ch1-04-step-1',
      title: '① カードに padding と border を付けよう',
      description: `.card に padding: 24px; と border: 1px solid #ccc; border-radius: 8px; を当てて、カード風にしましょう。

\`\`\`
.card {
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
\`\`\``,
      initialCode: {
        html: `<div class="card">
  <h2>新商品</h2>
  <p>本日のおすすめです。</p>
</div>
`,
        css: `/* ここに .card のルールを書こう */
`,
      },
      hints: [
        'padding: 24px; で内側の余白',
        'border: 1px solid #ccc; で外側の枠線',
        'border-radius: 8px; で角丸',
      ],
      targetSelector: '.card',
      checkRules: [
        {
          property: 'paddingTop',
          condition: 'equals',
          value: '24px',
          failureHint: 'padding が 24px になっていません',
        },
        {
          property: 'borderRadius',
          condition: 'equals',
          value: '8px',
          failureHint: 'border-radius が 8px になっていません',
        },
        {
          property: 'borderTopWidth',
          condition: 'equals',
          value: '1px',
          failureHint: 'border が 1px になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'カードっぽくなりました。padding・border・margin の違いを体で覚えましょう。',
    },
  ],
};

/**
 * 第1章 レッスン5「コンテナで中央寄せ」
 */
export const cafeCh1ContainerChapter: Chapter = {
  id: 'cafe-ch1-05-container',
  title: 'コンテナで中央寄せしよう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-05-lesson-1', title: 'コンテナ' },
    {
      kind: 'practice',
      id: 'cafe-ch1-05-step-1',
      title: '① コンテナを作って中央寄せしよう',
      description: `.container に max-width: 960px; margin: 0 auto; を指定して、広い画面でも中央に収まるようにします。

\`\`\`
.container {
  max-width: 960px;
  margin: 0 auto;
}
\`\`\``,
      initialCode: {
        html: `<div class="container">
  <h1>サイトタイトル</h1>
  <p>中央に揃っていますか？</p>
</div>
`,
        css: `/* ここに .container のルールを書こう */
`,
      },
      hints: [
        'max-width は最大幅の指定',
        'margin: 0 auto; は上下 0、左右自動で中央寄せ',
      ],
      targetSelector: '.container',
      checkRules: [
        {
          property: 'maxWidth',
          condition: 'equals',
          value: '960px',
          failureHint: 'max-width が 960px になっていません',
        },
        {
          property: 'marginLeft',
          condition: 'equals',
          value: 'auto',
          failureHint: 'margin-left が auto になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'コンテナが中央に配置されました。広い画面でも読みやすくなります。',
    },
  ],
};

/**
 * 第1章 レッスン6「Flexbox で横並び」
 */
export const cafeCh1FlexboxChapter: Chapter = {
  id: 'cafe-ch1-06-flexbox',
  title: 'Flexbox で横並びを作ろう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-06-lesson-1', title: 'Flexbox' },
    {
      kind: 'practice',
      id: 'cafe-ch1-06-step-1',
      title: '① Flexbox で横並びにしよう',
      description: `親要素 .bar に display: flex; と justify-content: space-between; align-items: center; を指定して、中身を左右に分け、縦に中央揃え。

\`\`\`
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\``,
      initialCode: {
        html: `<div class="bar">
  <h2>商品一覧</h2>
  <button>並び替え</button>
</div>
`,
        css: `/* ここに .bar のルールを書こう */
`,
      },
      hints: [
        'display: flex; で子要素が横並びになる',
        'justify-content: space-between; で両端に分ける',
        'align-items: center; で縦中央',
      ],
      targetSelector: '.bar',
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'flex',
          failureHint: 'display: flex; が指定されていません',
        },
        {
          property: 'justifyContent',
          condition: 'equals',
          value: 'space-between',
          failureHint: 'justify-content が space-between になっていません',
        },
        {
          property: 'alignItems',
          condition: 'equals',
          value: 'center',
          failureHint: 'align-items が center になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '左右に分かれました。Flexbox は 1 次元レイアウトの相棒です。',
    },
  ],
};

/**
 * 第1章 レッスン7「Grid で格子」
 */
export const cafeCh1GridChapter: Chapter = {
  id: 'cafe-ch1-07-grid',
  title: 'Grid で格子レイアウトを作ろう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-07-lesson-1', title: 'Grid' },
    {
      kind: 'practice',
      id: 'cafe-ch1-07-step-1',
      title: '① 4 列のグリッドを作ろう',
      description: `.grid に display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; を指定。

\`\`\`
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
\`\`\``,
      initialCode: {
        html: `<div class="grid">
  <div class="card">1</div>
  <div class="card">2</div>
  <div class="card">3</div>
  <div class="card">4</div>
</div>
`,
        css: `.card {
  padding: 12px;
  background: #eee;
  text-align: center;
}

/* ここに .grid のルールを書こう */
`,
      },
      hints: [
        'display: grid; を指定',
        'grid-template-columns: repeat(4, 1fr); で 4 等分',
        'gap: 16px; で余白',
      ],
      targetSelector: '.grid',
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'grid',
          failureHint: 'display: grid; が指定されていません',
        },
        {
          property: 'gridTemplateColumns',
          condition: 'includes',
          value: 'px',
          failureHint: 'grid-template-columns が設定されていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '4 列で綺麗に並びました。商品カード並べるのにぴったりです。',
    },
  ],
};

/**
 * 第1章 レッスン8「ホバーで動き」
 */
export const cafeCh1HoverChapter: Chapter = {
  id: 'cafe-ch1-08-hover',
  title: 'ホバーで動きをつけよう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-08-lesson-1', title: ':hover' },
    {
      kind: 'practice',
      id: 'cafe-ch1-08-step-1',
      title: '① ボタンに hover で色変化をつけよう',
      description: `.btn の通常の背景色を #528bff にし、:hover のときだけ #3a6fd6 にします。

\`\`\`
.btn {
  background: #528bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
}

.btn:hover {
  background: #3a6fd6;
}
\`\`\``,
      initialCode: {
        html: `<button class="btn">クリック</button>
`,
        css: `/* ここに .btn と .btn:hover のルールを書こう */
`,
      },
      hints: [
        '.btn で基本のスタイル',
        '.btn:hover で上書きするのは background だけで OK',
      ],
      targetSelector: '.btn',
      checkRules: [
        {
          property: 'backgroundColor',
          condition: 'equals',
          value: 'rgb(82, 139, 255)',
          failureHint: '.btn の background が #528bff になっていません',
        },
        {
          property: 'borderRadius',
          condition: 'equals',
          value: '4px',
          failureHint: 'border-radius が 4px になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'ボタンにマウスを載せると色が変わります。最初のインタラクションです。',
    },
  ],
};

/**
 * 第1章 レッスン9「フォーム要素カスタマイズ」
 */
export const cafeCh1FormChapter: Chapter = {
  id: 'cafe-ch1-09-form',
  title: 'フォーム要素をカスタマイズしよう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-09-lesson-1', title: 'フォーム装飾' },
    {
      kind: 'practice',
      id: 'cafe-ch1-09-step-1',
      title: '① input と select を整える',
      description: `.input と .select の両方に、ブラウザ装飾をリセットしつつ枠線と余白を当てます。

\`\`\`
.input, .select {
  appearance: none;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
\`\`\``,
      initialCode: {
        html: `<input type="text" class="input" placeholder="名前">
<select class="select">
  <option>カテゴリ A</option>
  <option>カテゴリ B</option>
</select>
`,
        css: `/* ここに .input, .select のルールを書こう */
`,
      },
      hints: [
        'セレクタはカンマ区切りでまとめられる: .input, .select { … }',
        'appearance: none; でデフォルト装飾を消す',
      ],
      targetSelector: '.input',
      checkRules: [
        {
          property: 'borderRadius',
          condition: 'equals',
          value: '4px',
          failureHint: '.input の border-radius が 4px になっていません',
        },
        {
          property: 'paddingTop',
          condition: 'equals',
          value: '8px',
          failureHint: '.input の padding-top が 8px になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'ブラウザデフォルトの野暮ったさが消え、自分のデザインが当てられました。',
    },
  ],
};

/**
 * 第1章 レッスン10「MainView (PC)」
 */
export const cafeCh1MainViewChapter: Chapter = {
  id: 'cafe-ch1-10-mainview',
  title: 'MainView を作ろう（PC 版）',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-10-lesson-1', title: 'MainView' },
    {
      kind: 'practice',
      id: 'cafe-ch1-10-step-1',
      title: '① 背景 + 中央ボックスの MainView',
      description: `.main-view に背景画像と Flexbox の中央寄せを、.hero-box に白背景・角丸・padding を当てます。

\`\`\`
.main-view {
  background-image: url("${HERO_IMAGE_URL}");
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-box {
  background: white;
  padding: 24px 40px;
  border-radius: 12px;
  font-weight: bold;
}
\`\`\``,
      initialCode: {
        html: `<div class="main-view">
  <div class="hero-box">コーヒーショップを作ってみよう！</div>
</div>
`,
        css: `/* ここに .main-view と .hero-box のルールを書こう */
`,
      },
      hints: [
        'まず .main-view に背景とサイズ、そして display: flex の中央寄せ',
        '.hero-box で白い四角を角丸に',
      ],
      targetSelector: '.main-view',
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'flex',
          failureHint: '.main-view が display: flex; になっていません',
        },
        {
          property: 'justifyContent',
          condition: 'equals',
          value: 'center',
          failureHint: 'justify-content が center になっていません',
        },
        {
          property: 'alignItems',
          condition: 'equals',
          value: 'center',
          failureHint: 'align-items が center になっていません',
        },
        {
          property: 'backgroundSize',
          condition: 'equals',
          value: 'cover',
          failureHint: 'background-size が cover になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '背景写真の中央に白いボックスが浮かびました。ホーム画面の顔が完成です。',
    },
  ],
};

/**
 * 第1章 レッスン11「ButtonBar (PC)」
 */
export const cafeCh1ButtonBarChapter: Chapter = {
  id: 'cafe-ch1-11-buttonbar',
  title: 'ButtonBar を作ろう（PC 版）',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-11-lesson-1', title: 'ButtonBar' },
    {
      kind: 'practice',
      id: 'cafe-ch1-11-step-1',
      title: '① 黒い帯に見出しと select を配置',
      description: `.button-bar を黒背景 + padding + display: flex で整え、justify-content: space-between で左右に分けます。

\`\`\`
.button-bar {
  background: #000;
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\``,
      initialCode: {
        html: `<div class="button-bar">
  <h2>商品一覧</h2>
  <select>
    <option>新着順</option>
    <option>価格順</option>
  </select>
</div>
`,
        css: `/* ここに .button-bar のルールを書こう */
`,
      },
      hints: ['display: flex + justify-content: space-between の組み合わせ'],
      targetSelector: '.button-bar',
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'flex',
          failureHint: 'display: flex; になっていません',
        },
        {
          property: 'justifyContent',
          condition: 'equals',
          value: 'space-between',
          failureHint: 'justify-content が space-between になっていません',
        },
        {
          property: 'backgroundColor',
          condition: 'equals',
          value: 'rgb(0, 0, 0)',
          failureHint: '背景色が黒 (#000) になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage: '黒い帯の左側に見出し、右側に並び替えが配置されました。',
    },
  ],
};

/**
 * 第1章 レッスン12「ProductLists (PC)」
 */
export const cafeCh1ProductListsChapter: Chapter = {
  id: 'cafe-ch1-12-productlists',
  title: 'ProductLists を作ろう（PC 版）',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-12-lesson-1', title: 'ProductLists' },
    {
      kind: 'practice',
      id: 'cafe-ch1-12-step-1',
      title: '① 4 列のグリッドで商品カードを並べる',
      description: `.product-list に 4 列のグリッドを、.product-card に画像付きカードの基本スタイルを当てます。

\`\`\`
.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.product-card {
  background: white;
  padding: 12px;
  border-radius: 8px;
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
\`\`\``,
      initialCode: {
        html: `<div class="product-list">
  <div class="product-card">
    <img src="${PRODUCT_IMAGE_URL}" alt="商品A">
    <h3>商品A</h3>
    <p>¥500</p>
  </div>
  <div class="product-card">
    <img src="${PRODUCT_IMAGE_URL}" alt="商品B">
    <h3>商品B</h3>
    <p>¥600</p>
  </div>
  <div class="product-card">
    <img src="${PRODUCT_IMAGE_URL}" alt="商品C">
    <h3>商品C</h3>
    <p>¥700</p>
  </div>
  <div class="product-card">
    <img src="${PRODUCT_IMAGE_URL}" alt="商品D">
    <h3>商品D</h3>
    <p>¥800</p>
  </div>
</div>
`,
        css: `/* ここに .product-list と .product-card のルールを書こう */
`,
      },
      hints: ['display: grid; grid-template-columns: repeat(4, 1fr);'],
      targetSelector: '.product-list',
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'grid',
          failureHint: '.product-list が display: grid; になっていません',
        },
        {
          property: 'gridTemplateColumns',
          condition: 'includes',
          value: 'px',
          failureHint: 'grid-template-columns が設定されていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '4 列の商品一覧ができました。PC 版の目玉セクションの完成です。',
    },
  ],
};

/**
 * 第1章 レッスン13「CTA + フッター」
 */
export const cafeCh1CtaChapter: Chapter = {
  id: 'cafe-ch1-13-cta',
  title: 'CTA ブロック + フッターを作ろう（PC 版）',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-13-lesson-1', title: 'CTA と Footer' },
    {
      kind: 'practice',
      id: 'cafe-ch1-13-step-1',
      title: '① CTA ブロックと pill 形ボタンを作る',
      description: `.cta を暗い背景 + 中央寄せ、.cta-btn を pill 形（角完全丸）に。

\`\`\`
.cta {
  background: #333;
  color: white;
  padding: 40px;
  text-align: center;
}

.cta-btn {
  display: inline-block;
  background: white;
  color: #333;
  padding: 12px 32px;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: bold;
}
\`\`\``,
      initialCode: {
        html: `<section class="cta">
  <p>お買い物を進めますか？</p>
  <a href="#" class="cta-btn">カート一覧を見る</a>
</section>
`,
        css: `/* ここに .cta と .cta-btn のルールを書こう */
`,
      },
      hints: ['border-radius: 9999px; で完全な pill 形になる'],
      targetSelector: '.cta-btn',
      checkRules: [
        {
          property: 'borderRadius',
          condition: 'includes',
          value: 'px',
          failureHint: '.cta-btn に border-radius が指定されていません',
        },
        {
          property: 'backgroundColor',
          condition: 'equals',
          value: 'rgb(255, 255, 255)',
          failureHint: '.cta-btn の背景が白になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage: 'ダークな CTA の上に白い pill ボタンが映えています。',
    },
  ],
};

/**
 * 第1章 レッスン14「SP 版」
 */
export const cafeCh1ResponsiveChapter: Chapter = {
  id: 'cafe-ch1-14-responsive',
  title: 'ホーム画面 SP 版を作ろう',
  steps: [
    { kind: 'lesson', id: 'cafe-ch1-14-lesson-1', title: 'SP 対応' },
    {
      kind: 'practice',
      id: 'cafe-ch1-14-step-1',
      title: '① PC 版を 4 列、SP 版を 1 列にする',
      description: `まず .product-list を 4 列で組み、@media (max-width: 767px) の中で 1 列に切り替えます。

\`\`\`
.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 767px) {
  .product-list {
    grid-template-columns: 1fr;
  }
}
\`\`\``,
      initialCode: {
        html: `<div class="product-list">
  <div class="product-card">A</div>
  <div class="product-card">B</div>
  <div class="product-card">C</div>
  <div class="product-card">D</div>
</div>
`,
        css: `.product-card {
  background: #eee;
  padding: 24px;
  text-align: center;
}

/* ここに .product-list の PC 用と SP 用メディアクエリを書こう */
`,
      },
      hints: [
        '通常は 4 列の grid',
        '@media (max-width: 767px) で grid-template-columns: 1fr に切り替え',
      ],
      targetSelector: '.product-list',
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'grid',
          failureHint: '.product-list が display: grid; になっていません',
        },
        {
          property: 'gridTemplateColumns',
          condition: 'includes',
          value: 'px',
          failureHint: 'grid-template-columns が設定されていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'PC 幅では 4 列、SP 幅では 1 列。DevTools のデバイスモードで切り替わりを確認してみてください。これで第1章卒業です。',
    },
  ],
};
