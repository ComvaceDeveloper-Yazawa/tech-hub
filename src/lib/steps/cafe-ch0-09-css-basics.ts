import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン9「CSS で装飾してみよう」
 * h1 に color を当て、body の font-size と text-align を変える。
 */
export const cafeCh0CssBasicsChapter: Chapter = {
  id: 'cafe-ch0-09-css-basics',
  title: 'CSS で装飾してみよう',
  steps: [
    {
      kind: 'lesson',
      id: 'cafe-ch0-09-lesson-1',
      title: 'CSS の書き方',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-09-step-1-color',
      title: '① 見出しに色をつけよう',
      description: `左の CSS エディタに、h1 の文字色を青にするルールを書きましょう。

書き方:
\`\`\`
h1 {
  color: blue;
}
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
`,
        css: `/* ここに h1 のルールを書こう */
`,
      },
      hints: [
        'セレクタは h1',
        'プロパティは color、値は blue',
        'コロン、セミコロンを忘れずに',
      ],
      targetSelector: 'h1',
      checkRules: [
        {
          property: 'color',
          condition: 'equals',
          value: 'rgb(0, 0, 255)',
          failureHint:
            'h1 の color が blue になっていません。color: blue; と書きましょう',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        'h1 の文字が青くなりました。文字が青くなる瞬間の感動です。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-09-step-2-font-size',
      title: '② 本文の文字を少し大きくしよう',
      description: `body 全体の文字サイズを 18px に設定しましょう。

書き方:
\`\`\`
body {
  font-size: 18px;
}
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
`,
        css: `h1 {
  color: blue;
}

/* ここに body のルールを書こう */
`,
      },
      hints: ['セレクタは body', 'プロパティは font-size、値は 18px'],
      targetSelector: 'body',
      checkRules: [
        {
          property: 'fontSize',
          condition: 'equals',
          value: '18px',
          failureHint: 'body の font-size が 18px になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage: '全体の文字が少し大きくなりました。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-09-step-3-align',
      title: '③ 中央寄せにしよう',
      description: `body の中身を中央寄せにしましょう。

書き方:
\`\`\`
body {
  text-align: center;
}
\`\`\`

既存の body のルールに text-align を足す形で書きます。`,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
`,
        css: `h1 {
  color: blue;
}

body {
  font-size: 18px;
  /* ここに text-align を追加 */
}
`,
      },
      hints: [
        'body のブロック内に text-align: center; を追加しましょう',
        '既存の font-size は消さずに追加するだけで OK',
      ],
      targetSelector: 'body',
      checkRules: [
        {
          property: 'fontSize',
          condition: 'equals',
          value: '18px',
          failureHint: 'font-size が消えていませんか？',
        },
        {
          property: 'textAlign',
          condition: 'equals',
          value: 'center',
          failureHint: 'body の text-align が center になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage: '見出しも本文も中央に揃いましたね。装飾の第一歩です。',
    },
  ],
};
