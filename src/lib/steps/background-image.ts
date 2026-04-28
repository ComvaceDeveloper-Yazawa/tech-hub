import type { Chapter } from '@/types/step';

export const backgroundImageChapter: Chapter = {
  id: 'background-image',
  title: '背景画像の表示をマスターしよう',
  steps: [
    // ── 導入解説 ──
    {
      kind: 'lesson',
      id: 'intro-1',
      title: 'Webページの画像、2つの入れ方',
    },
    {
      kind: 'lesson',
      id: 'intro-2',
      title: 'どっちを使う？判断フローチャート',
    },
    {
      kind: 'lesson',
      id: 'intro-3',
      title: 'background-image の「4点セット」',
    },

    // ── 実践ステップ ──
    {
      kind: 'practice',
      id: 'step-1',
      title: '① background-image で画像を表示しよう',
      description:
        'まずは `.hero` に背景画像を設定してみましょう。\n\n`background-image: url("画像のURL");` の形式で書きます。\n\n今回使う画像URL:\nhttps://picsum.photos/800/400',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {
  width: 100%;
  height: 400px;
  /* ここにコードを書こう */
}`,
      },
      hints: [
        '💡 CSSで背景に画像を設定するプロパティを使います',
        '💡 プロパティ名は background-image です',
        '💡 `background-image: url("https://picsum.photos/800/400");` と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundImage',
          condition: 'not-equals',
          value: 'none',
          failureHint:
            'background-image が設定されていません。`background-image: url("...");` の形式で書いているか確認しましょう。',
        },
      ],
      successMessage:
        '🎉 背景画像が表示されました！でもタイル状に繰り返されていますね…',
    },
    {
      kind: 'practice',
      id: 'step-2',
      title: '② background-repeat で繰り返しを止めよう',
      description:
        'デフォルトでは背景画像がタイル状に繰り返されます。\n\n`background-repeat: no-repeat;` で繰り返しを止めましょう。',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {
  width: 100%;
  height: 400px;
  background-image: url("https://picsum.photos/800/400");
  /* ここにコードを書こう */
}`,
      },
      hints: [
        '💡 繰り返しを制御するプロパティがあります',
        '💡 プロパティ名は background-repeat です',
        '💡 `background-repeat: no-repeat;` と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundRepeat',
          condition: 'equals',
          value: 'no-repeat',
          failureHint:
            'background-repeat が `no-repeat` になっていません。`background-repeat: no-repeat;` と書いているか確認しましょう。',
        },
      ],
      successMessage: '🎉 繰り返しが止まりました！でも画像が小さく見えますね…',
    },
    {
      kind: 'practice',
      id: 'step-3',
      title: '③ background-size で要素いっぱいに広げよう',
      description:
        '`background-size` で画像の表示サイズを制御できます。\n\n- `cover`: 要素全体を覆うように拡大（はみ出し部分はトリミング）\n- `contain`: 要素内に収まるように縮小\n\n今回は `cover` を使って要素いっぱいに広げましょう。',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {
  width: 100%;
  height: 400px;
  background-image: url("https://picsum.photos/800/400");
  background-repeat: no-repeat;
  /* ここにコードを書こう */
}`,
      },
      hints: [
        '💡 画像のサイズを制御するプロパティがあります',
        '💡 プロパティ名は background-size です',
        '💡 `background-size: cover;` と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundSize',
          condition: 'equals',
          value: 'cover',
          failureHint:
            'background-size が `cover` になっていません。`background-size: cover;` と書いているか確認しましょう。',
        },
      ],
      successMessage:
        '🎉 画像が要素いっぱいに広がりました！あとは位置を調整しましょう',
    },
    {
      kind: 'practice',
      id: 'step-4',
      title: '④ background-position で表示位置を調整しよう',
      description:
        '`background-position` で画像のどの部分を中心に表示するか指定できます。\n\n`center` を指定すると、画像の中央が要素の中央に来ます。\n他にも `top`, `bottom`, `left`, `right` などが使えます。',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {
  width: 100%;
  height: 400px;
  background-image: url("https://picsum.photos/800/400");
  background-repeat: no-repeat;
  background-size: cover;
  /* ここにコードを書こう */
}`,
      },
      hints: [
        '💡 画像の表示位置を制御するプロパティがあります',
        '💡 プロパティ名は background-position です',
        '💡 `background-position: center;` と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundPosition',
          condition: 'includes',
          value: 'center',
          failureHint:
            'background-position に `center` が含まれていません。`background-position: center;` と書いているか確認しましょう。',
        },
      ],
      successMessage: '🎉 完璧！背景画像の4点セットをマスターしました！',
    },

    // ── チェックポイント ──
    {
      kind: 'practice',
      id: 'checkpoint',
      title: 'チェックポイント：4点セットを全部書こう',
      description:
        '最後の仕上げです！何も見ずに4点セットを全部書いてみましょう。\n\n使う画像URL: https://picsum.photos/800/400\n\n🤔 **ミニテスト**: `height` を指定しないとどうなるでしょう？\n\n→ 背景画像は要素のサイズに影響しないため、高さ0になって何も見えなくなります！',
      initialCode: {
        html: '<div class="hero">\n  <h1>My Cafe</h1>\n  <p>Welcome to our cafe</p>\n</div>',
        css: `.hero {
  width: 100%;
  height: 400px;
  /* 4点セットを全部書いてみよう！ */
}`,
      },
      hints: [
        '💡 4つのプロパティを思い出しましょう',
        '💡 background-image, background-repeat, background-size, background-position',
        '💡 全部書くと:\nbackground-image: url("https://picsum.photos/800/400");\nbackground-repeat: no-repeat;\nbackground-size: cover;\nbackground-position: center;',
      ],
      checkRules: [
        {
          property: 'backgroundImage',
          condition: 'not-equals',
          value: 'none',
          failureHint:
            'background-image が設定されていません。`background-image: url("...");` を追加しましょう。',
        },
        {
          property: 'backgroundRepeat',
          condition: 'equals',
          value: 'no-repeat',
          failureHint:
            'background-repeat が設定されていません。`background-repeat: no-repeat;` を追加しましょう。',
        },
        {
          property: 'backgroundSize',
          condition: 'equals',
          value: 'cover',
          failureHint:
            'background-size が設定されていません。`background-size: cover;` を追加しましょう。',
        },
        {
          property: 'backgroundPosition',
          condition: 'includes',
          value: 'center',
          failureHint:
            'background-position が設定されていません。`background-position: center;` を追加しましょう。',
        },
      ],
      successMessage:
        '🎉 パーフェクト！背景画像の基本を完全にマスターしました！',
    },
  ],
};
