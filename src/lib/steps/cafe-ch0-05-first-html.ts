import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン5「はじめての HTML」
 *
 * - まだ CSS は登場しないため、実習ステップでは HTML のみを判定する（CSS ルールは空）
 * - 判定はすべて `htmlCheckRules` で DOM 構造・テキストを見る
 */
export const cafeCh0FirstHtmlChapter: Chapter = {
  id: 'cafe-ch0-05-first-html',
  title: 'はじめての HTML',
  steps: [
    // ── 解説 ──
    {
      kind: 'lesson',
      id: 'cafe-ch0-05-lesson-1',
      title: 'HTML って何？',
    },

    // ── 実践 ──
    {
      kind: 'practice',
      id: 'cafe-ch0-05-step-1-h1',
      title: '① 見出しを書いてみよう',
      description: `HTML では「タグ」で文字の意味を表します。

見出しを表すタグは \`<h1>\` です。
\`<h1>\` で挟んだ文字は、ブラウザが「一番大きな見出し」として表示してくれます。

書き方:
\`\`\`
<h1>見出しの文字</h1>
\`\`\`

本文エリアに \`<h1>こんにちは</h1>\` と書いて、プレビューに大きな文字が出るのを確かめましょう。`,
      initialCode: {
        html: `<!-- ここに <h1>こんにちは</h1> と書こう -->
`,
        css: '',
      },
      hints: [
        'タグは山かっこ（<>）で囲みます。開始タグと終了タグで文字を挟みましょう',
        '終了タグにはスラッシュが付きます: </h1>',
        '<h1>こんにちは</h1> と1行書けば完成です',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'h1',
          failureHint: '<h1> 要素がありません。<h1>...</h1> を書きましょう',
        },
        {
          kind: 'text-equals',
          selector: 'h1',
          value: 'こんにちは',
          failureHint:
            'h1 の中身を「こんにちは」にしましょう（前後の空白も不要です）',
        },
      ],
      successMessage:
        'ブラウザに「こんにちは」が大きな文字で表示されました。自分の書いた文字がブラウザに出る瞬間です。',
    },
    {
      kind: 'practice',
      id: 'cafe-ch0-05-step-2-p',
      title: '② 段落を追加しよう',
      description: `見出しだけでは記事になりません。段落（本文）を表すタグは \`<p>\` です。

書き方:
\`\`\`
<p>本文の文字</p>
\`\`\`

\`<h1>\` の下に \`<p>はじめまして、よろしくお願いします。</p>\` を追加してください。`,
      initialCode: {
        html: `<h1>こんにちは</h1>
<!-- ここに <p>...</p> を追加しよう -->
`,
        css: '',
      },
      hints: [
        '段落タグは <p></p> です',
        '<h1> の下の行に <p>はじめまして、よろしくお願いします。</p> と書きましょう',
        'タグは重ねて並べると、上から順にブラウザに表示されます',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'h1',
          failureHint: '<h1> 要素が消えていないか確認しましょう',
        },
        {
          kind: 'text-equals',
          selector: 'h1',
          value: 'こんにちは',
          failureHint: 'h1 の中身は「こんにちは」のままにしましょう',
        },
        {
          kind: 'element-exists',
          selector: 'p',
          failureHint: '<p> 要素がありません。<p>...</p> を追加しましょう',
        },
        {
          kind: 'text-equals',
          selector: 'p',
          value: 'はじめまして、よろしくお願いします。',
          failureHint:
            'p の中身を「はじめまして、よろしくお願いします。」にしましょう（前後の空白も不要です）',
        },
      ],
      successMessage:
        '見出しと段落が並びました。HTML の基本「タグで意味を表す」が体験できました。',
    },
  ],
};
