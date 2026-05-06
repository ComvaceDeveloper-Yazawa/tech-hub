import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン12「メディアクエリって何？」
 *
 * iframe プレビューは数百 px 以上の幅で表示されるため、
 * Step 2 では `min-width: 600px` の条件下で色が切り替わることを採点で確認する。
 * 学習者には「画面幅を変えると切り替わる体験」を devtools で別途してもらう。
 */
export const cafeCh0MediaQueryChapter: Chapter = {
  id: 'cafe-ch0-12-media-query',
  title: 'メディアクエリって何？',
  steps: [
    {
      kind: 'lesson',
      id: 'cafe-ch0-12-lesson-1',
      title: '画面幅で見た目を切り替える',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-12-step-1-default-color',
      title: '① まずは普段の色を決めよう',
      description: `メディアクエリの前に、通常時の h1 色を設定します。

書き方:
\`\`\`
h1 {
  color: blue;
}
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>画面の広さに合わせて見た目を変えてみよう。</p>
`,
        css: `/* ここに h1 のルールを書こう */
`,
      },
      hints: ['セレクタは h1', 'color: blue; を入れましょう'],
      targetSelector: 'h1',
      checkRules: [
        {
          property: 'color',
          condition: 'equals',
          value: 'rgb(0, 0, 255)',
          failureHint: 'h1 の color が blue になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage: 'まずは普段の色が決まりました。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-12-step-2-media-query',
      title: '② 広い画面のときだけ色を変えよう',
      description: `画面幅が 600px 以上のときだけ h1 を赤にします。

書き方:
\`\`\`
@media (min-width: 600px) {
  h1 {
    color: red;
  }
}
\`\`\`

通常ルールはそのままに、下に @media ブロックを追加しましょう。`,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>画面の広さに合わせて見た目を変えてみよう。</p>
`,
        css: `h1 {
  color: blue;
}

/* ここに @media ブロックを追加 */
`,
      },
      hints: [
        '@media (min-width: 600px) { ... } の中に h1 のルールを書きます',
        '中身は h1 { color: red; }',
      ],
      targetSelector: 'h1',
      checkRules: [
        {
          property: 'color',
          condition: 'equals',
          value: 'rgb(255, 0, 0)',
          failureHint:
            '@media (min-width: 600px) の中で h1 の color を red にしましょう',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '広い画面のときは赤、狭いと青、の切り替えができるようになりました。DevTools のデバイスモードで幅を狭くして青に戻ることも確認してみてください。',
    },
  ],
};
