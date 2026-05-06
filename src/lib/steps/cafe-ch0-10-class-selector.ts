import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン10「クラスセレクタを使おう」
 * p に class を付けて、クラスセレクタでスタイルを当て分ける。
 */
export const cafeCh0ClassSelectorChapter: Chapter = {
  id: 'cafe-ch0-10-class-selector',
  title: 'クラスセレクタを使おう',
  steps: [
    {
      kind: 'lesson',
      id: 'cafe-ch0-10-lesson-1',
      title: 'クラスで当て分ける',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-10-step-1-class-attribute',
      title: '① 1 つ目の段落にクラスを付けよう',
      description: `HTML 側の 1 つ目の <p> に class="lead" を付けます。

書き方:
\`\`\`
<p class="lead">重要な段落</p>
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>これは大事な一文です。</p>
<p>こちらは普通の一文です。</p>
`,
        css: '',
      },
      hints: [
        '最初の <p> の開始タグに class="lead" を追加します',
        '<p class="lead">これは大事な一文です。</p>',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'p.lead',
          failureHint: '最初の p に class="lead" を付けましょう',
        },
        {
          kind: 'text-equals',
          selector: 'p.lead',
          value: 'これは大事な一文です。',
          failureHint:
            'class="lead" を付けた p の中身は「これは大事な一文です。」のままにしましょう',
        },
      ],
      successMessage: 'class 属性を付けられました。まだ見た目は変わりません。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-10-step-2-class-selector',
      title: '② .lead にスタイルを当てよう',
      description: `CSS 側で、.lead の文字を赤で太字にしましょう。

書き方:
\`\`\`
.lead {
  color: red;
  font-weight: bold;
}
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p class="lead">これは大事な一文です。</p>
<p>こちらは普通の一文です。</p>
`,
        css: `/* ここに .lead のルールを書こう */
`,
      },
      hints: [
        'クラスセレクタはピリオドから始めます',
        '.lead { color: red; font-weight: bold; }',
      ],
      targetSelector: '.lead',
      checkRules: [
        {
          property: 'color',
          condition: 'equals',
          value: 'rgb(255, 0, 0)',
          failureHint: '.lead の color が red になっていません',
        },
        {
          property: 'fontWeight',
          condition: 'equals',
          value: '700',
          failureHint: '.lead の font-weight が bold になっていません',
        },
      ],
      htmlCheckRules: [],
      successMessage:
        '1 つ目の p だけが赤く太字になりました。2 つ目は変わらないままです。',
    },
  ],
};
