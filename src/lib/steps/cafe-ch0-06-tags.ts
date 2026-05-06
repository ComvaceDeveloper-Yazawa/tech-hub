import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン6「色んなタグを試そう」
 * h1 / p / ul / li / a を順に組み合わせて自己紹介ページの原型を作る。
 */
export const cafeCh0TagsChapter: Chapter = {
  id: 'cafe-ch0-06-tags',
  title: '色んなタグを試そう',
  steps: [
    {
      kind: 'lesson',
      id: 'cafe-ch0-06-lesson-1',
      title: 'よく使うタグたち',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-06-step-1-heading',
      title: '① 見出しをつけよう',
      description: `自己紹介ページの先頭に、大きな見出しを置きます。

書き方:
\`\`\`
<h1>自己紹介</h1>
\`\`\`

この通り書いてみてください。`,
      initialCode: {
        html: `<!-- ここに <h1>自己紹介</h1> を書こう -->
`,
        css: '',
      },
      hints: [
        '一番大きな見出しは <h1> です',
        '<h1>自己紹介</h1> と 1 行書けば完成',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'h1',
          failureHint: '<h1> が見つかりません',
        },
        {
          kind: 'text-equals',
          selector: 'h1',
          value: '自己紹介',
          failureHint: 'h1 の中身を「自己紹介」にしましょう',
        },
      ],
      successMessage: '大きな「自己紹介」がブラウザに出ましたね。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-06-step-2-paragraph',
      title: '② あいさつを段落で書こう',
      description: `見出しの下に、あいさつ文を段落として書きます。

書き方:
\`\`\`
<p>はじめまして、Webを学びはじめました。</p>
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<!-- ここに <p>...</p> を追加しよう -->
`,
        css: '',
      },
      hints: ['段落タグは <p></p> です', 'h1 の下の行に書きましょう'],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'h1',
          failureHint: 'h1 が消えていないか確認しましょう',
        },
        {
          kind: 'element-exists',
          selector: 'p',
          failureHint: '<p> が見つかりません',
        },
        {
          kind: 'text-equals',
          selector: 'p',
          value: 'はじめまして、Webを学びはじめました。',
          failureHint:
            'p の中身を「はじめまして、Webを学びはじめました。」にしましょう',
        },
      ],
      successMessage: '見出しと段落が並びました。記事っぽくなってきました。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-06-step-3-list',
      title: '③ 好きなものを箇条書きで並べよう',
      description: `好きなものリストを作りましょう。

書き方:
\`\`\`
<ul>
  <li>コーヒー</li>
  <li>読書</li>
  <li>旅行</li>
</ul>
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
<!-- ここに <ul>...</ul> を追加しよう -->
`,
        css: '',
      },
      hints: [
        'ul の中に li を 3 つ入れます',
        '<li>コーヒー</li> / <li>読書</li> / <li>旅行</li> の順で並べましょう',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'ul',
          failureHint: '<ul> が見つかりません',
        },
        {
          kind: 'element-exists',
          selector: 'ul > li',
          failureHint: 'ul の中に li を入れてください',
        },
        {
          kind: 'text-equals',
          selector: 'ul > li:nth-of-type(1)',
          value: 'コーヒー',
          failureHint: '1 つ目の li を「コーヒー」にしましょう',
        },
        {
          kind: 'text-equals',
          selector: 'ul > li:nth-of-type(2)',
          value: '読書',
          failureHint: '2 つ目の li を「読書」にしましょう',
        },
        {
          kind: 'text-equals',
          selector: 'ul > li:nth-of-type(3)',
          value: '旅行',
          failureHint: '3 つ目の li を「旅行」にしましょう',
        },
      ],
      successMessage: '黒丸つきリストが表示されました。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-06-step-4-link',
      title: '④ リンクを張ってみよう',
      description: `ページの最後に、自分のブログや GitHub へのリンクを置きましょう。今回は GitHub のトップを例にします。

書き方:
\`\`\`
<a href="https://github.com/">GitHub を見る</a>
\`\`\``,
      initialCode: {
        html: `<h1>自己紹介</h1>
<p>はじめまして、Webを学びはじめました。</p>
<ul>
  <li>コーヒー</li>
  <li>読書</li>
  <li>旅行</li>
</ul>
<!-- ここに <a href="...">...</a> を追加しよう -->
`,
        css: '',
      },
      hints: [
        'リンクタグは <a>...</a>。飛び先は href="..." に書きます',
        '<a href="https://github.com/">GitHub を見る</a> と書きましょう',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'a',
          failureHint: '<a> が見つかりません',
        },
        {
          kind: 'text-equals',
          selector: 'a',
          value: 'GitHub を見る',
          failureHint: 'リンクの文字を「GitHub を見る」にしましょう',
        },
      ],
      successMessage:
        'リンクができました。クリックすると別のページに飛ぶやつですね。',
    },
  ],
};
