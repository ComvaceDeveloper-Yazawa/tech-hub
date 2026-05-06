import type { Chapter } from '@/types/step';

/**
 * 第0章 レッスン7「HTML の基本ルール」
 * 自己紹介ページに html / head / body / title の基本構造を入れる。
 */
export const cafeCh0HtmlRulesChapter: Chapter = {
  id: 'cafe-ch0-07-html-rules',
  title: 'HTML の基本ルール',
  steps: [
    {
      kind: 'lesson',
      id: 'cafe-ch0-07-lesson-1',
      title: 'HTML の型',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-07-step-1-skeleton',
      title: '① html / head / body の骨組みを入れる',
      description: `自己紹介の中身を、html・head・body のルールに沿った形にします。

書き方:
\`\`\`
<!DOCTYPE html>
<html lang="ja">
  <head>
    <title>自己紹介</title>
  </head>
  <body>
    <h1>自己紹介</h1>
  </body>
</html>
\`\`\`

まずは title を「自己紹介」に、body の中に h1 を置きましょう。`,
      initialCode: {
        html: `<!-- ここに骨組みを書こう -->
`,
        css: '',
      },
      hints: [
        'まず <!DOCTYPE html> を書き、次に <html lang="ja"> を開きます',
        'head の中に <title>自己紹介</title> を入れます',
        'body の中に <h1>自己紹介</h1> を入れます',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'html[lang="ja"]',
          failureHint: '<html lang="ja"> を書きましょう',
        },
        {
          kind: 'element-exists',
          selector: 'head > title',
          failureHint: 'head の中に <title> を書きましょう',
        },
        {
          kind: 'text-equals',
          selector: 'head > title',
          value: '自己紹介',
          failureHint: 'title の中身を「自己紹介」にしましょう',
        },
        {
          kind: 'element-exists',
          selector: 'body > h1',
          failureHint: 'body の中に <h1> を書きましょう',
        },
        {
          kind: 'text-equals',
          selector: 'body > h1',
          value: '自己紹介',
          failureHint: 'h1 の中身を「自己紹介」にしましょう',
        },
      ],
      successMessage:
        'ブラウザタブに「自己紹介」と表示されるようになりましたね。',
    },

    {
      kind: 'practice',
      id: 'cafe-ch0-07-step-2-meta',
      title: '② charset と viewport を入れる',
      description: `head の中に、文字コードとスマホ向けの設定を追加します。

書き方:
\`\`\`
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

title の上にこの 2 行を追加してください。`,
      initialCode: {
        html: `<!DOCTYPE html>
<html lang="ja">
  <head>
    <!-- ここに meta 2 行を追加 -->
    <title>自己紹介</title>
  </head>
  <body>
    <h1>自己紹介</h1>
  </body>
</html>
`,
        css: '',
      },
      hints: [
        'meta charset は「このファイルは UTF-8 という文字コードです」という宣言',
        'meta viewport はスマホ表示の基本設定。呪文として丸ごとコピーで OK',
      ],
      checkRules: [],
      htmlCheckRules: [
        {
          kind: 'element-exists',
          selector: 'meta[charset="UTF-8"]',
          failureHint: '<meta charset="UTF-8"> を書きましょう',
        },
        {
          kind: 'element-exists',
          selector:
            'meta[name="viewport"][content="width=device-width, initial-scale=1.0"]',
          failureHint:
            '<meta name="viewport" content="width=device-width, initial-scale=1.0"> を書きましょう',
        },
      ],
      successMessage:
        '文字化け防止とスマホ対応の下ごしらえができました。本物の HTML の形になっています。',
    },
  ],
};
