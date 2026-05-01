import type { Chapter } from '@/types/step';

const HERO_IMAGE_URL = 'https://picsum.photos/id/1060/300/200';

export const heroSectionChapter: Chapter = {
  id: 'hero-section',
  title: 'ヒーローセクションを作ろう',
  steps: [
    // ── レッスン ──
    {
      kind: 'lesson',
      id: 'hero-lesson-1',
      title: 'Webページの画像、2つの入れ方',
    },
    {
      kind: 'lesson',
      id: 'hero-lesson-2',
      title: 'background-imageの4点セットとは',
    },

    // ── 実践ステップ ──
    {
      kind: 'practice',
      id: 'step-1-background-image',
      title: '① 背景画像を表示しよう',
      description: `まずは .hero に背景画像を設定してみましょう。\n\n書き方:\n\`\`\`\nbackground-image: url("画像のURL");\n\`\`\`\n\n今回使う画像URL:\n\`\`\`\n${HERO_IMAGE_URL}\n\`\`\``,
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {\n  width: 100%;\n  height: 400px;\n  /* ここに background-image を書こう */\n}`,
      },
      hints: [
        'CSSで背景に画像を設定するプロパティを使います',
        'プロパティ名は background-image です',
        `background-image: url("${HERO_IMAGE_URL}"); と書いてみましょう`,
      ],
      checkRules: [
        {
          property: 'backgroundImage',
          condition: 'includes',
          value: 'picsum.photos',
          failureHint:
            '画像URLが正しくありません。説明に記載されているURLを使いましょう。',
        },
      ],
      successMessage:
        '背景画像が表示されました！でもタイル状に繰り返されていますね...',
    },
    {
      kind: 'practice',
      id: 'step-2-background-repeat',
      title: '② 繰り返しを止めよう',
      description:
        'デフォルトでは背景画像がタイル状に繰り返されます。\n\n書き方:\n```\nbackground-repeat: no-repeat;\n```',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {\n  width: 100%;\n  height: 400px;\n  background-image: url("${HERO_IMAGE_URL}");\n  /* 繰り返しを止めよう */\n}`,
      },
      hints: [
        '繰り返しを制御するプロパティがあります',
        'プロパティ名は background-repeat です',
        'background-repeat: no-repeat; と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundRepeat',
          condition: 'equals',
          value: 'no-repeat',
          failureHint: 'background-repeat が no-repeat になっていません。',
        },
      ],
      successMessage: '繰り返しが止まりました！でも画像が小さく見えますね...',
    },
    {
      kind: 'practice',
      id: 'step-3-background-size',
      title: '③ 要素いっぱいに広げよう',
      description:
        'background-size で画像の表示サイズを制御できます。\n\n- cover: 要素全体を覆うように拡大\n- contain: 要素内に収まるように縮小\n\n書き方:\n```\nbackground-size: cover;\n```',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {\n  width: 100%;\n  height: 400px;\n  background-image: url("${HERO_IMAGE_URL}");\n  background-repeat: no-repeat;\n  /* 要素いっぱいに広げよう */\n}`,
      },
      hints: [
        '画像のサイズを制御するプロパティがあります',
        'プロパティ名は background-size です',
        'background-size: cover; と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundSize',
          condition: 'equals',
          value: 'cover',
          failureHint: 'background-size が cover になっていません。',
        },
      ],
      successMessage:
        '画像が要素いっぱいに広がりました！あとは位置を調整しましょう。',
    },
    {
      kind: 'practice',
      id: 'step-4-background-position',
      title: '④ 表示位置を調整しよう',
      description:
        'background-position で画像のどの部分を中心に表示するか指定できます。\n\ncenter を指定すると、画像の中央が要素の中央に来ます。\n\n書き方:\n```\nbackground-position: center;\n```',
      initialCode: {
        html: '<div class="hero"></div>',
        css: `.hero {\n  width: 100%;\n  height: 400px;\n  background-image: url("${HERO_IMAGE_URL}");\n  background-repeat: no-repeat;\n  background-size: cover;\n  /* 表示位置を中央にしよう */\n}`,
      },
      hints: [
        '画像の表示位置を制御するプロパティがあります',
        'プロパティ名は background-position です',
        'background-position: center; と書いてみましょう',
      ],
      checkRules: [
        {
          property: 'backgroundPosition',
          condition: 'includes',
          value: '50%',
          failureHint: 'background-position が center になっていません。',
        },
      ],
      successMessage:
        '背景画像の4点セットが完成しました！次は中央にボックスを配置します。',
    },
    {
      kind: 'practice',
      id: 'step-5-flexbox-center',
      title: '⑤ 中央に白いボックスを配置しよう',
      description:
        'ヒーロー領域の中央に白いボックスを配置します。\n\nFlexbox を使って中央寄せしましょう:\n\n```\ndisplay: flex;\njustify-content: center;\nalign-items: center;\n```',
      initialCode: {
        html: '<div class="hero">\n  <div class="hero-box">コーヒーショップを作ってみよう！</div>\n</div>',
        css: `.hero {\n  width: 100%;\n  height: 400px;\n  background-image: url("${HERO_IMAGE_URL}");\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center;\n  /* Flexbox で中央寄せしよう（3つのプロパティが必要） */\n}\n\n.hero-box {\n  background-color: white;\n  padding: 24px 32px;\n}`,
      },
      hints: [
        '要素を中央に配置するには Flexbox を使います。親要素に3つのプロパティを書きます',
        'display: flex; で Flexbox を有効にし、justify-content で横方向、align-items で縦方向を制御します',
        '.hero に次の3つを追加:\ndisplay: flex;\njustify-content: center;\nalign-items: center;',
      ],
      checkRules: [
        {
          property: 'display',
          condition: 'equals',
          value: 'flex',
          failureHint: 'display: flex; が設定されていません。',
        },
        {
          property: 'justifyContent',
          condition: 'equals',
          value: 'center',
          failureHint: 'justify-content: center; が設定されていません。',
        },
        {
          property: 'alignItems',
          condition: 'equals',
          value: 'center',
          failureHint: 'align-items: center; が設定されていません。',
        },
      ],
      successMessage:
        'ボックスが中央に配置されました！最後にデザインを整えましょう。',
    },
    {
      kind: 'practice',
      id: 'step-6-box-design',
      title: '⑥ ボックスのデザインを整えよう',
      description:
        '白いボックスに仕上げのスタイルを追加しましょう。\n\n```\nfont-weight: bold;\nborder-radius: 12px;\n```',
      initialCode: {
        html: '<div class="hero">\n  <div class="hero-box">コーヒーショップを作ってみよう！</div>\n</div>',
        css: `.hero {\n  width: 100%;\n  height: 400px;\n  background-image: url("${HERO_IMAGE_URL}");\n  background-repeat: no-repeat;\n  background-size: cover;\n  background-position: center;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.hero-box {\n  background-color: white;\n  padding: 24px 32px;\n  /* 文字を太く、角を丸くして仕上げよう */\n}`,
      },
      hints: [
        '文字を太くするプロパティと、角を丸くするプロパティがあります',
        'font-weight: bold; と border-radius: 12px; です',
        '.hero-box に font-weight: bold; border-radius: 12px; を追加しましょう',
      ],
      targetSelector: '.hero-box',
      checkRules: [
        {
          property: 'fontWeight',
          condition: 'equals',
          value: '700',
          failureHint: 'font-weight: bold; が設定されていません。',
        },
        {
          property: 'borderRadius',
          condition: 'not-equals',
          value: '0px',
          failureHint: 'border-radius で角を丸くしましょう（例: 12px）',
        },
      ],
      successMessage: 'ヒーローセクションが完成しました！',
    },
  ],
};
