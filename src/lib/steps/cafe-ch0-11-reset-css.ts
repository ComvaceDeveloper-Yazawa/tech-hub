import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン11「リセット CSS を入れよう」
 * 簡易リセットを書き、body の margin が 0 になることを確認する。
 */
export const cafeCh0ResetCssChapter: Chapter = {
  id: 'cafe-ch0-11-reset-css',
  title: 'リセット CSS を入れよう',
  steps: [
    {
      kind: 'lesson',
      id: 'cafe-ch0-11-lesson-1',
      title: 'なぜリセットするのか',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-11-step-1-universal-reset',
      title: '① すべての要素の余白をゼロにしよう',
      description: `「すべての要素」のセレクタは * です。

書き方:
\`\`\`
* {
  margin: 0;
  padding: 0;
}
\`\`\`

CSS の一番上に書きましょう。`,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
`,
        css: `/* ここにリセットを書こう */
`,
      },
      hints: [
        'セレクタは *（アスタリスク）',
        '中に margin: 0; と padding: 0; を書きます',
      ],
      targetSelector: 'body',
      checkRules: [
        {
          property: 'marginTop',
          condition: 'equals',
          value: '0px',
          failureHint: 'body の上 margin が 0 になっていません',
        },
        {
          property: 'marginLeft',
          condition: 'equals',
          value: '0px',
          failureHint: 'body の左 margin が 0 になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'ブラウザが勝手に入れていた余白が消えました。h1 が画面左上にぴったり付きます。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-11-step-2-box-sizing',
      title: '② box-sizing を border-box にそろえよう',
      description: `幅や高さを計算するとき「padding や border を含むかどうか」を揃えるおまじない。これを入れておくと、後で要素の幅を決めるときに計算が楽になります。

書き方:
\`\`\`
* {
  box-sizing: border-box;
}
\`\`\`

既存のルールに追加する形で書きましょう。`,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
`,
        css: `* {
  margin: 0;
  padding: 0;
  /* ここに box-sizing を追加 */
}
`,
      },
      hints: [
        'プロパティは box-sizing、値は border-box',
        '既存の margin / padding は消さずに追加だけ',
      ],
      targetSelector: 'body',
      checkRules: [
        {
          property: 'boxSizing',
          condition: 'equals',
          value: 'border-box',
          failureHint: 'body の box-sizing が border-box になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '見た目はあまり変わりませんが、これから幅・高さを指定したときに計算が素直になる下ごしらえです。',
    },
  ],
};
