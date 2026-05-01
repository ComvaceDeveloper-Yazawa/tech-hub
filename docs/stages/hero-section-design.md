# ステージ1「ヒーローセクションを作ろう」設計書 v3

## 決定事項サマリ

| 項目                        | 決定                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| セレクタ拡張                | 案A: `PracticeStep` に `targetSelector?: string` 追加              |
| background-image チャプター | 案B: `hero-section` に置き換え。旧ファイルは `_deprecated/` に移動 |
| 画像パス                    | Picsum（ID固定）。`HERO_IMAGE_URL` 定数で一元管理                  |
| ステップ7の難易度           | 現状維持（3プロパティ一括）。ヒントを手厚く                        |
| border-radius               | 緩め判定（`not-equals: '0px'`）                                    |
| レッスン                    | 新規作成（`HeroLesson1.tsx`, `HeroLesson2.tsx`）                   |
| ステージタイトル            | 「ヒーローセクションを作ろう」に変更                               |

---

## 1. ファイル構成

### 新規作成

| ファイル                                       | 説明                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| `src/lib/steps/hero-section.ts`                | チャプターデータ定義（`HERO_IMAGE_URL` 定数含む） |
| `src/components/learn/lessons/HeroLesson1.tsx` | レッスン1                                         |
| `src/components/learn/lessons/HeroLesson2.tsx` | レッスン2                                         |

### 更新

| ファイル                                            | 変更内容                                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/types/step.ts`                                 | `PracticeStep` に `targetSelector?: string` 追加                                                 |
| `src/components/learn/LearnWorkspace.tsx`           | `handleGrade` で `step.targetSelector ?? '.hero'` を使用                                         |
| `app/(public)/learn/[chapterId]/page.tsx`           | `chapters` に `'hero-section'` 追加、`'background-image'` 削除                                   |
| `src/components/learn/LessonView.tsx`               | マッピングに `HeroLesson1`, `HeroLesson2` 追加。旧マッピング削除                                 |
| `app/(public)/curriculum/[slug]/StageMapClient.tsx` | ステージ1リンク先を `/learn/hero-section` に変更。タイトルを「ヒーローセクションを作ろう」に変更 |
| `next.config.ts`                                    | `/learn/background-image` → `/learn/hero-section` の permanent リダイレクト追加                  |

### 移動（削除しない）

| 移動元                                          | 移動先                                                      |
| ----------------------------------------------- | ----------------------------------------------------------- |
| `src/components/learn/lessons/LessonIntro1.tsx` | `src/components/learn/lessons/_deprecated/LessonIntro1.tsx` |
| `src/components/learn/lessons/LessonIntro2.tsx` | `src/components/learn/lessons/_deprecated/LessonIntro2.tsx` |
| `src/components/learn/lessons/LessonIntro3.tsx` | `src/components/learn/lessons/_deprecated/LessonIntro3.tsx` |

### 削除

| ファイル                            | 理由                         |
| ----------------------------------- | ---------------------------- |
| `src/lib/steps/background-image.ts` | `hero-section.ts` に置き換え |

---

## 2. データ構造設計

### 型変更

```typescript
// src/types/step.ts に追加
export type PracticeStep = {
  kind: 'practice';
  id: string;
  title: string;
  description: string;
  initialCode: { html: string; css: string };
  hints: string[];
  checkRules: CheckRule[];
  successMessage: string;
  targetSelector?: string; // 追加。省略時は '.hero'
};
```

### handleGrade の変更

```typescript
// LearnWorkspace.tsx
const selector = currentStep.targetSelector ?? '.hero';
const targetEl = iframe.contentDocument?.querySelector(selector);
```

### 画像URL定数

```typescript
// src/lib/steps/hero-section.ts 先頭
const HERO_IMAGE_URL = 'https://picsum.photos/id/1060/1200/400';
```

全ステップの `description` と `initialCode` からこの定数を参照する。

---

## 3. 各ステップの詳細仕様

### ステップ1 (lesson)

- **id**: `hero-lesson-1`
- **type**: `lesson`
- **title**: Webページの画像、2つの入れ方
- **コンポーネント**: `HeroLesson1.tsx`
- **内容**: `<img>` vs `background-image` の比較。コーヒーショップのヒーローセクションでは `background-image` を使う理由。

---

### ステップ2 (lesson)

- **id**: `hero-lesson-2`
- **type**: `lesson`
- **title**: background-imageの4点セットとは
- **コンポーネント**: `HeroLesson2.tsx`
- **内容**: 4プロパティの概要と完成形プレビュー。

---

### ステップ3 (practice)

- **id**: `step-1-background-image`
- **title**: 背景画像を表示しよう
- **description**: `.hero` に背景画像を設定。画像URLを提示。
- **initialCode HTML**: `<div class="hero"></div>`
- **initialCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  /* ここに background-image を書こう */
}
```

- **expectedCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url('https://picsum.photos/id/1060/1200/400');
}
```

- **hints**: 概念 → プロパティ名 → 完全な答え
- **targetSelector**: 省略（デフォルト `.hero`）
- **checkRules**: `backgroundImage not-equals 'none'`

---

### ステップ4 (practice)

- **id**: `step-2-background-repeat`
- **title**: 繰り返しを止めよう
- **initialCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url('https://picsum.photos/id/1060/1200/400');
  /* 繰り返しを止めよう */
}
```

- **checkRules**: `backgroundRepeat equals 'no-repeat'`

---

### ステップ5 (practice)

- **id**: `step-3-background-size`
- **title**: 要素いっぱいに広げよう
- **initialCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url('https://picsum.photos/id/1060/1200/400');
  background-repeat: no-repeat;
  /* 要素いっぱいに広げよう */
}
```

- **checkRules**: `backgroundSize equals 'cover'`

---

### ステップ6 (practice)

- **id**: `step-4-background-position`
- **title**: 表示位置を調整しよう
- **initialCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url('https://picsum.photos/id/1060/1200/400');
  background-repeat: no-repeat;
  background-size: cover;
  /* 表示位置を中央にしよう */
}
```

- **checkRules**: `backgroundPosition includes '50%'`

---

### ステップ7 (practice)

- **id**: `step-5-flexbox-center`
- **title**: 中央に白いボックスを配置しよう
- **initialCode HTML**:

```html
<div class="hero">
  <div class="hero-box">コーヒーショップを作ってみよう！</div>
</div>
```

- **initialCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url('https://picsum.photos/id/1060/1200/400');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  /* Flexbox で中央寄せしよう（3つのプロパティが必要） */
}

.hero-box {
  background-color: white;
  padding: 24px 32px;
}
```

- **targetSelector**: 省略（`.hero` で Flexbox プロパティを検証）
- **checkRules**: `display equals 'flex'`, `justifyContent equals 'center'`, `alignItems equals 'center'`
- **hints**:
  1. 要素を中央に配置するには Flexbox を使います。親要素に3つのプロパティを書きます
  2. `display: flex;` で Flexbox を有効にし、`justify-content` で横方向、`align-items` で縦方向を制御します
  3. `.hero` に次の3つを追加: `display: flex;` / `justify-content: center;` / `align-items: center;`

---

### ステップ8 (practice) -- targetSelector: '.hero-box'

- **id**: `step-6-box-design`
- **title**: ボックスのデザインを整えよう
- **initialCode CSS**:

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url('https://picsum.photos/id/1060/1200/400');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-box {
  background-color: white;
  padding: 24px 32px;
  /* 文字を太く、角を丸くして仕上げよう */
}
```

- **targetSelector**: `'.hero-box'` （ここだけ明示的に指定）
- **checkRules**:

```typescript
[
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
];
```

---

## 4. ステップ間のコード継承

| ステップ | HTML変更         | CSS追加                        | コメント文言                                              |
| -------- | ---------------- | ------------------------------ | --------------------------------------------------------- |
| 3        | なし             | `background-image`             | `/* ここに background-image を書こう */`                  |
| 4        | なし             | `background-repeat`            | `/* 繰り返しを止めよう */`                                |
| 5        | なし             | `background-size`              | `/* 要素いっぱいに広げよう */`                            |
| 6        | なし             | `background-position`          | `/* 表示位置を中央にしよう */`                            |
| 7        | `.hero-box` 追加 | Flexbox 3プロパティ            | `/* Flexbox で中央寄せしよう（3つのプロパティが必要） */` |
| 8        | なし             | `font-weight`, `border-radius` | `/* 文字を太く、角を丸くして仕上げよう */`                |

---

## 5. CheckRule 採点ロジック

| プロパティ           | CSS記述      | getComputedStyle 返り値 | 判定方法              |
| -------------------- | ------------ | ----------------------- | --------------------- |
| `backgroundImage`    | `url("...")` | `url("...")`            | `not-equals: 'none'`  |
| `backgroundRepeat`   | `no-repeat`  | `no-repeat`             | `equals: 'no-repeat'` |
| `backgroundSize`     | `cover`      | `cover`                 | `equals: 'cover'`     |
| `backgroundPosition` | `center`     | `50% 50%`               | `includes: '50%'`     |
| `display`            | `flex`       | `flex`                  | `equals: 'flex'`      |
| `justifyContent`     | `center`     | `center`                | `equals: 'center'`    |
| `alignItems`         | `center`     | `center`                | `equals: 'center'`    |
| `fontWeight`         | `bold`       | `700`                   | `equals: '700'`       |
| `borderRadius`       | `12px` 等    | `12px` 等               | `not-equals: '0px'`   |

---

## 6. 画像素材

- 実装時: `https://picsum.photos/id/1060/1200/400`（ID固定）
- 将来: `/images/cafe.jpg` に差し替え
- `HERO_IMAGE_URL` 定数で一元管理
- 繰り返し表示の教育効果: Picsum の `1200x400` だとプレビュー幅次第で繰り返しが見えにくい可能性あり。ステップ3のみ小さい画像（`400x200`）を使うことも検討

---

## 7. Markdown レンダリング

レッスンはハードコードJSXで作成。Markdown対応はスコープ外。

---

## 8. 既存実装との競合

- `background-image` チャプターは `hero-section` に置き換え
- `/learn/background-image` → `/learn/hero-section` に permanent リダイレクト（`next.config.ts`）
- DB変更不要（ステージマップはフロントエンドのダミーデータ）

---

## 9. 動作確認シナリオ

1. `/learn/hero-section` にアクセス → レッスン1が表示される
2. レッスン1・2を「次のステップへ」で進む
3. ステップ3〜8を順に採点してクリア
4. `/learn/background-image` にアクセス → `/learn/hero-section` にリダイレクトされる
5. ステージマップからステージ1をクリック → `/learn/hero-section` に遷移

---

## 10. iframe sandbox 属性の現状

`Preview.tsx` で設定されている sandbox 属性:

```
sandbox="allow-scripts allow-same-origin"
```

Picsum の外部画像読み込みには `allow-same-origin` が必要。現在の設定で外部画像は読み込み可能なはず。実装時に最初に確認する。

---

## 実装順序

1. `src/types/step.ts` に `targetSelector` 追加
2. `LearnWorkspace.tsx` の `handleGrade` 修正 → 既存チャプターで動作確認
3. `src/lib/steps/hero-section.ts` 作成 → iframe で Picsum 画像表示確認
4. `HeroLesson1.tsx`, `HeroLesson2.tsx` 作成
5. マッピング更新（`page.tsx`, `LessonView.tsx`, `StageMapClient.tsx`）
6. 旧ファイル移動（`_deprecated/`）、`background-image.ts` 削除
7. `next.config.ts` リダイレクト追加
8. 全ステップ動作確認
