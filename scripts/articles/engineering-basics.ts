import type { ArticleSeed } from './types';

export const engineeringBasicsArticles: ArticleSeed[] = [
  {
    title: 'テストってなに？ — 「動いてるから大丈夫」が通用しなくなる前に',
    slug: 'what-is-testing-for-beginners',
    tags: ['テスト', 'Vitest', 'Playwright', 'TDD', '未経験'],
    content: `# テストってなに？ — 「動いてるから大丈夫」が通用しなくなる前に

## はじめに

プログラミング初期の頃、こう思ったことはありませんか。

> 「テスト書く時間があるなら、機能を1つでも多く作りたい」
> 「手で動かして確認してるから大丈夫」
> 「バグが出たら直せばいいじゃん」

気持ちはわかります。でも、実務に入ると、その「大丈夫」が通用しなくなる瞬間が必ず来ます。コードが 1000 行を超え、人が増え、変更が怖くなったとき、**テストがあるかないかで地獄と天国が分かれます**。

> [!NOTE]
> この記事は「テストの必要性はなんとなく聞いたけど、自分では書いたことがない」方向けです。細かい Assertion の書き方より、**なぜ書くのか**にフォーカスします。

## TL;DR

- テストの目的は「バグ発見」よりも「**安心して変更できる土台**を作る」こと
- 単体 / 結合 / E2E の3階層がある（テストピラミッド）
- TDD は「失敗するテスト → 実装 → リファクタ」のサイクル
- JS/TS では Vitest / Jest / Testing Library / Playwright が定番
- カバレッジは目安、100% が正義ではない
- テストを書きやすい = 設計が良い、の鏡
- 「書く時間がない」は、実は**書いた方が速い**

## 目次

- テストの目的
- テストの種類
- テストピラミッド
- TDD（テスト駆動開発）
- フロントエンドのテスト
- バックエンドのテスト
- E2E テスト
- モック・スタブ・スパイ
- カバレッジ
- CI との組み合わせ
- テスト容易性 = 良い設計
- アンチパターン
- 「時間がない」問題
- ハンズオン: Vitest
- 学習ロードマップ
- まとめ

## テストの目的

多くの人は「バグを見つけるため」と思いがちですが、もっと本質的な目的があります。

- **リファクタリングの保険** — 安全に直せる
- **仕様の記述** — テストが読めば仕様がわかる
- **他人に渡す自信** — レビュアーの脳内シミュレーションを減らす
- **壊さない証明** — 変更しても既存機能が壊れていないと示す

> [!TIP]
> テストは「書いた瞬間に価値がある」ものではなく、**未来の変更のときに効いてくる**道具です。

## テストの種類

| 種類 | 対象 | 速さ | 例 |
|---|---|---|---|
| 単体 (Unit) | 関数・クラス単位 | 超速 | 「価格計算関数は消費税込みを返す」 |
| 結合 (Integration) | 複数コンポーネント | 速い | 「DB と API が連携できる」 |
| E2E (End-to-End) | ブラウザ操作まで | 遅い | 「ログイン → 記事作成 → 公開」 |
| ビジュアル回帰 | 見た目 | 中 | 「ボタンの見た目が壊れていない」 |
| スナップショット | 出力 | 速い | 「JSON レスポンスが変わっていない」 |

## テストピラミッド

\`\`\`mermaid
graph TB
    E[E2E<br/>少数・遅い・高価]
    I[結合<br/>中程度]
    U[単体<br/>大量・高速・安価]
    U --> I --> E
\`\`\`

**単体を大量に、E2E を少数に。** これが基本原則。逆ピラミッド（E2E ばかり）は地獄。

## TDD（テスト駆動開発）

\`\`\`mermaid
graph LR
    R[Red<br/>失敗するテスト] --> G[Green<br/>通す最小実装] --> F[Refactor<br/>綺麗にする] --> R
\`\`\`

1. まず「こうあるべき」というテストを書く → 当然 Red（失敗）
2. テストを通す最小限の実装 → Green
3. 重複を除いたりリファクタリング
4. 次のテストへ…

強制されるのは「**実装より先にテストを書く**」こと。

> [!TIP]
> TDD は宗教ではありません。「最初は Red を見てから書く」習慣を1週間試すと、設計力が上がります。

## フロントエンドのテスト

### Vitest / Jest（ロジック）

\`\`\`ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from './price';

describe('formatPrice', () => {
  it('税込み価格を整形する', () => {
    expect(formatPrice(1000)).toBe('¥1,100');
  });
});
\`\`\`

### Testing Library（コンポーネント）

\`\`\`tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

it('クリックするとカウントが増える', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: '+1' }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
\`\`\`

ポイントは「**ユーザー視点**」で書くこと。DOM の内部構造ではなく、ラベルや役割で要素を探す。

## バックエンドのテスト

\`\`\`ts
import { describe, it, expect } from 'vitest';
import { ArticleTitle } from './ArticleTitle';

describe('ArticleTitle', () => {
  it('空文字の場合、エラーを投げる', () => {
    expect(() => ArticleTitle.fromString('')).toThrow();
  });

  it('100文字以内なら作成できる', () => {
    const title = ArticleTitle.fromString('テスト');
    expect(title.toString()).toBe('テスト');
  });
});
\`\`\`

値オブジェクトや純粋関数は単体テストと相性抜群。DB・外部 API に依存する処理は**結合テスト**で。

## E2E テスト

\`\`\`ts
import { test, expect } from '@playwright/test';

test('ログインできる', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'secret');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
\`\`\`

**Playwright** は Microsoft 製、**Cypress** はモダン Web 向け、どちらも優秀。

## モック・スタブ・スパイ

| 用語 | 役割 |
|---|---|
| スタブ (Stub) | 決まった値を返す「ダミー」 |
| モック (Mock) | 「この関数が呼ばれた」を検証する |
| スパイ (Spy) | 実物を呼びつつ、呼ばれた事実を記録 |

\`\`\`ts
const save = vi.fn();
save('hello');
expect(save).toHaveBeenCalledWith('hello');
\`\`\`

> [!TIP]
> モックは強力ですが、**使いすぎは設計の警告**。そもそも依存を注入できる設計になっているか見直すきっかけに。

## カバレッジ

テストが何割のコードを通ったかの指標。

- **業務コード**: 70〜90% 目安
- **ドメインロジック**: 95% 以上を狙う
- **UI**: 60% 程度でも許容

> [!WARNING]
> カバレッジ 100% は目的ではありません。**重要な場所が通っているか**が本質。

## CI との組み合わせ

PR のたびにテストが走るようにすれば、壊れる PR はマージできなくなります。

\`\`\`yaml
- name: Test
  run: npm test

- name: Coverage
  run: npm run test:coverage
\`\`\`

GitHub Actions で回すだけで、レビューの質が一段上がります。

## テスト容易性 = 良い設計

テストが書きにくいコードは、たいてい**密結合**していて、**責任がごちゃ混ぜ**。

- 依存を外から渡せるか（DI）
- 副作用が分離されているか
- 純粋関数の割合は多いか

テストを意識すると、自然と設計が整います。

## アンチパターン

<details>
<summary>実装詳細をテストしている</summary>

「プライベートメソッドの呼び出し回数」を検証すると、リファクタで壊れます。結果に注目を。
</details>

<details>
<summary>テストが長くて読めない</summary>

AAA（Arrange / Act / Assert）で構造化すれば、誰でも読める。
</details>

<details>
<summary>E2E ばかり書く</summary>

実行時間が膨れあがって、誰もローカルで走らせなくなります。ピラミッドを意識。
</details>

<details>
<summary>テストが本番 DB に書き込む</summary>

統合テスト専用 DB か、テスト後にクリーンアップする仕組みを。
</details>

## 「時間がない」問題

結論: **テストがある方が、中長期では速い**。

- バグ修正の時間が減る
- リリース前の手動確認が減る
- 人が入れ替わっても引き継ぎが楽

短期的には書くコストがかかるのは事実。でもそれは**投資**。

## ハンズオン: Vitest

\`\`\`bash
npm i -D vitest
\`\`\`

\`package.json\`:

\`\`\`json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest"
  }
}
\`\`\`

\`sum.ts\`:

\`\`\`ts
export const sum = (a: number, b: number) => a + b;
\`\`\`

\`sum.test.ts\`:

\`\`\`ts
import { describe, it, expect } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('2つの数を足す', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
\`\`\`

\`npm test\` で緑の✓が出れば成功。

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : Vitest で Hello Test : 純粋関数
    Week 2 : Testing Library : React コンポーネント
    Week 3 : モックの基本 : 外部 API の置き換え
    Week 4 : Playwright で E2E : ログイン導線
    Month 2 : TDD を1週間試す : Red-Green-Refactor
    Month 3 : CI に組み込む : カバレッジ計測
\`\`\`

## まとめ

- テストはバグ発見ではなく「安心して変更する」ための土台
- 単体を厚く、E2E を少なく
- 書きやすいコードは良いコード
- 書く時間は、未来の時間を買う投資

> [!IMPORTANT]
> 初学者のうちは、テストを書くことに罪悪感を感じる必要はありません。むしろテストが書ける人は、**どのチームでも重宝される**スキルを持っているということ。最初は1ファイル、1関数のテストから。積み重ねれば、あなたのコードは壊れにくく、直しやすくなります。

### 参考リソース

- [Vitest](https://vitest.dev/) / [Jest](https://jestjs.io/ja/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- 書籍「テスト駆動開発」（Kent Beck）
`,
  },
  {
    title: 'TypeScriptの型システム入門 — JavaScriptに「意味」を与える旅',
    slug: 'typescript-type-system-basics',
    tags: ['TypeScript', '型', '未経験'],
    content: `# TypeScriptの型システム入門 — JavaScriptに「意味」を与える旅

## はじめに

JavaScript でコードを書き始めると、最初はその自由さに感動します。でもしばらくすると、こんな罠に出会います。

> 「このオブジェクト、どんなプロパティがあるんだっけ？」
> 「undefined is not a function って、また？」
> 「この関数は何を返すの？」

その悩みを**ほぼ全部消してくれる**のが TypeScript です。2026年現在、新規 Web 開発で TypeScript を使わない理由はほぼありません。

> [!NOTE]
> この記事は「TypeScript のチュートリアルは見たけど、型を自由自在に書けるわけではない」方向けです。ジェネリクスやユーティリティ型など、**次の壁**を突破するお手伝いをします。

## TL;DR

- 型は「値の説明書」。書くと IDE が賢くなり、バグが減る
- プリミティブ・配列・オブジェクト・関数・Union・Intersection を押さえれば 9 割カバー
- \`any\` より \`unknown\`、\`as\` は最終手段
- ジェネリクスは「型の引数」
- ユーティリティ型（\`Partial\`, \`Pick\`, \`Omit\` 等）を覚えるとコードが短くなる
- \`satisfies\` は「型で制約しつつ、推論は残す」最強演算子
- zod で実行時もバリデーション

## 目次

- なぜ型が必要か
- プリミティブ型
- オブジェクト型とインターフェース
- 配列とタプル
- Union型 / Intersection型
- リテラル型
- 型推論
- ジェネリクス
- ユーティリティ型
- \`any\` vs \`unknown\`
- 型アサーション \`as\`
- 型ガード
- \`satisfies\`
- zod との組み合わせ
- TS vs Flow vs JSDoc
- 学習ロードマップ
- まとめ

## なぜ型が必要か

\`\`\`js
// JavaScript
function greet(user) {
  return 'Hello ' + user.name;
}
// user に何を渡していいかドキュメントなしでは不明
\`\`\`

\`\`\`ts
// TypeScript
function greet(user: { name: string }): string {
  return 'Hello ' + user.name;
}
// 型が「仕様書」として機能する
\`\`\`

**コードがドキュメントになる**。これが一番大きな利点。

## プリミティブ型

\`\`\`ts
const s: string = 'hello';
const n: number = 42;
const b: boolean = true;
const u: undefined = undefined;
const nu: null = null;
const big: bigint = 10n;
const sym: symbol = Symbol('x');
\`\`\`

## オブジェクト型とインターフェース

\`\`\`ts
type User = {
  id: string;
  name: string;
  age?: number; // オプショナル
};

interface Article {
  id: string;
  title: string;
}
\`\`\`

\`type\` と \`interface\` の違いは、ほぼ趣味です。迷ったら \`type\` で OK。

## 配列とタプル

\`\`\`ts
const nums: number[] = [1, 2, 3];
const nums2: Array<number> = [1, 2, 3];

// タプル（位置ごとに型）
const pair: [string, number] = ['age', 30];
\`\`\`

## Union型 / Intersection型

\`\`\`ts
// Union: A または B
type Id = string | number;

// Intersection: A かつ B
type A = { id: string };
type B = { name: string };
type AB = A & B; // { id: string; name: string }
\`\`\`

Union は「どっちかわからないとき」、Intersection は「両方の性質を持つとき」。

## リテラル型

\`\`\`ts
type Status = 'draft' | 'published' | 'archived';

const s: Status = 'draft';  // OK
const s2: Status = 'xxxxx'; // エラー
\`\`\`

文字列そのものを型にできる。Union と組み合わせると**状態遷移の表現**が爆発的に強くなります。

## 型推論

TypeScript は賢いので、書かなくても推論してくれます。

\`\`\`ts
const x = 10;          // number
const arr = [1, 2, 3]; // number[]
const fn = () => 'hi'; // () => string
\`\`\`

書かなくて良いところは書かない。これが TS の粋な使い方。

## ジェネリクス

「型に対する引数」。同じロジックを異なる型で使い回す。

\`\`\`ts
function identity<T>(value: T): T {
  return value;
}

identity<string>('hello'); // 'hello'
identity(42);              // 42（推論される）

// コンテナの例
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
\`\`\`

> [!TIP]
> T は「型の引数」。\`<T extends string>\` のように制約を付けるのも基本。

## ユーティリティ型

覚えると世界が変わります。

| 型 | 意味 | 例 |
|---|---|---|
| \`Partial<T>\` | 全プロパティを任意に | \`Partial<User>\` |
| \`Required<T>\` | 全プロパティを必須に | \`Required<User>\` |
| \`Pick<T, K>\` | プロパティを抜粋 | \`Pick<User, 'id' | 'name'>\` |
| \`Omit<T, K>\` | プロパティを除外 | \`Omit<User, 'password'>\` |
| \`Record<K, V>\` | マップ型 | \`Record<string, number>\` |
| \`Readonly<T>\` | 読み取り専用 | \`Readonly<User>\` |
| \`ReturnType<F>\` | 関数の戻り値型 | \`ReturnType<typeof fn>\` |

## \`any\` vs \`unknown\`

| 型 | 特徴 |
|---|---|
| \`any\` | 何でもあり、型チェックを無効化 |
| \`unknown\` | 何でも入るが、使う前に絞り込みが必要 |

\`\`\`ts
function safe(value: unknown) {
  if (typeof value === 'string') {
    value.toUpperCase(); // OK（string に絞り込まれた）
  }
}
\`\`\`

> [!WARNING]
> \`any\` は TS の安全性を捨てる麻薬。使わざるを得ないときも、\`unknown\` を検討。

## 型アサーション \`as\`

\`\`\`ts
const el = document.getElementById('app') as HTMLDivElement;
\`\`\`

「私の方が知ってる、信じて」とコンパイラに言う行為。**嘘をつけてしまう**ので、リスクあり。できるだけ**型ガード**で絞り込むのが安全。

## 型ガード

\`\`\`ts
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x;
}

if (isUser(data)) {
  data.id; // OK
}
\`\`\`

Narrow down（絞り込み）こそ TS の奥義。

## \`satisfies\`

TypeScript 4.9+ の最強演算子。

\`\`\`ts
const config = {
  host: 'localhost',
  port: 3000,
} satisfies { host: string; port: number };

// 型チェックはされる、でも推論は具体のまま
config.host; // 'localhost' と推論される（string より具体）
\`\`\`

型で制約しつつ、具体的な推論を残せる。使い出したら戻れません。

## zod との組み合わせ

型は**コンパイル時**のチェック。ランタイム（API レスポンス、フォーム入力）では効きません。

\`\`\`ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().optional(),
});

type User = z.infer<typeof UserSchema>;

const user = UserSchema.parse(apiResponse); // 実行時バリデーション
\`\`\`

**Zod + TypeScript** は最強の組み合わせ。

## TS vs Flow vs JSDoc

| 技術 | 現状 |
|---|---|
| TypeScript | 現代の事実上の標準 |
| Flow | Meta 社内中心、衰退中 |
| JSDoc | JS 純正、型チェックは限定的 |

2026年時点、新規開発なら **TypeScript 一択**。

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : 基本型 : 関数の型付け
    Week 2 : オブジェクト / Union / Literal : 型推論を読む
    Week 3 : ユーティリティ型 : Partial / Pick / Omit
    Week 4 : ジェネリクス : 自作の Result 型
    Month 2 : 型ガード : narrowing : satisfies
    Month 3 : zod 統合 : API 境界で型を守る
\`\`\`

## まとめ

- 型は「値の説明書」
- \`any\` より \`unknown\`
- ユーティリティ型と \`satisfies\` を味方に
- zod で実行時も守る

> [!IMPORTANT]
> TypeScript は最初「書くことが増えた」と感じます。でも半年後、あなたは JavaScript に戻れなくなります。IDE の補完、リファクタの安心感、コードが「話し始める」感覚。一度味わうと、もう戻れません。あなたのコードをもっと賢く、もっと安全に。

### 参考リソース

- [TypeScript Handbook（日本語）](https://www.typescriptlang.org/ja/docs/handbook/intro.html)
- [type-challenges](https://github.com/type-challenges/type-challenges) — 型で遊ぶ名所
- [Zod](https://zod.dev/)
- 書籍「プロを目指す人のための TypeScript 入門」
`,
  },
  {
    title: '設計原則ってなに？ — SOLID・DRY・KISS・YAGNIを未経験者が腹落ちする',
    slug: 'software-design-principles-basics',
    tags: ['設計原則', 'SOLID', 'DRY', '未経験'],
    content: `# 設計原則ってなに？ — SOLID・DRY・KISS・YAGNIを未経験者が腹落ちする

## はじめに

プログラミングを学び始めて、こんな経験ありませんか。

> 「動くけど、読み返したら自分でも何書いたか忘れてる」
> 「機能を1つ足したら、関係ないところが壊れた」
> 「コピペで3回目のコードを書いている自分がいる」

これ、全部**設計**の問題です。動くコードと、**変更に強いコード**は別のスキル。

> [!NOTE]
> この記事は「コードは書けるけど、設計と言われるとピンと来ない」方向けです。抽象的な話に終始せず、具体例で腹落ちを目指します。

## TL;DR

- SOLID は「変更に強いコード」の5原則
- DRY は重複排除、KISS はシンプルに、YAGNI は要らないものは作らない
- 凝集度は高く、結合度は低く
- 早すぎる抽象化は**悪**。まずベタで書く
- 良い設計 = 読みやすい、壊れにくい、テストしやすい

## 目次

- なぜ設計原則が必要か
- SOLID 原則
  - S: 単一責任
  - O: 開放閉鎖
  - L: リスコフの置換
  - I: インターフェース分離
  - D: 依存性逆転
- DRY
- KISS
- YAGNI
- 凝集度と結合度
- 関心の分離
- 早すぎる抽象化
- 可読性のコツ
- リファクタリング
- 実務でのバランス
- 「過剰設計 > 無設計」の罠
- まとめ

## なぜ設計原則が必要か

コードは「一度書いたら終わり」ではなく、**何度も読まれ、修正される**もの。設計原則は「変更に強くする」ためのベストプラクティスです。

\`\`\`mermaid
graph LR
    A[初めて書くとき] --> B[1週間後の自分]
    B --> C[半年後のチームメイト]
    C --> D[3年後の新入社員]
\`\`\`

全員があなたのコードを読むんです。

## SOLID 原則

### S: 単一責任の原則 (SRP)

**1つのクラス（関数）は、1つの理由だけで変更される**。

\`\`\`ts
// ❌ 何でも屋
class User {
  save() { /* DB 保存 */ }
  sendEmail() { /* メール送信 */ }
  calculateDiscount() { /* 割引計算 */ }
}

// ✅ 責務を分ける
class User { /* ドメイン */ }
class UserRepository { save() {} }
class EmailService { sendEmail() {} }
class DiscountCalculator { calculate() {} }
\`\`\`

### O: 開放閉鎖の原則 (OCP)

**拡張には開かれ、修正には閉じられる**。

\`\`\`ts
// ❌ if 地獄
function area(shape: { type: 'circle' | 'square'; /* ... */ }) {
  if (shape.type === 'circle') return /* ... */;
  if (shape.type === 'square') return /* ... */;
}

// ✅ 継承/多態性
interface Shape { area(): number; }
class Circle implements Shape { area() { return /* ... */; } }
class Square implements Shape { area() { return /* ... */; } }
\`\`\`

### L: リスコフの置換原則 (LSP)

**サブクラスはスーパークラスと入れ替え可能であるべし**。

\`\`\`ts
// ❌ 派生クラスが親を裏切る
class Bird { fly() {} }
class Penguin extends Bird { fly() { throw new Error(); } }
// → Bird を期待する場所で Penguin を渡すと壊れる
\`\`\`

### I: インターフェース分離の原則 (ISP)

**必要ないメソッドに依存させない**。

\`\`\`ts
// ❌ 肥大化したインターフェース
interface Machine {
  print(): void;
  scan(): void;
  fax(): void;
}

// ✅ 分ける
interface Printer { print(): void; }
interface Scanner { scan(): void; }
interface Fax { fax(): void; }
\`\`\`

### D: 依存性逆転の原則 (DIP)

**具象ではなく抽象に依存する**。

\`\`\`ts
// ❌
class UserService {
  private repo = new MySQLUserRepository();
}

// ✅
interface IUserRepository { /* ... */ }
class UserService {
  constructor(private repo: IUserRepository) {}
}
\`\`\`

## DRY（Don't Repeat Yourself）

同じコードを繰り返さない。でも…

> [!WARNING]
> **早すぎる DRY は害**。3回目に重複を見てから抽象化するくらいがちょうど良い。

## KISS（Keep It Simple, Stupid）

**必要以上に複雑にしない**。

\`\`\`ts
// ❌
const isEven = (n: number) => (n & 1) === 0 ? true : false;

// ✅
const isEven = (n: number) => n % 2 === 0;
\`\`\`

## YAGNI（You Aren't Gonna Need It）

**今要らない機能は作らない**。

「将来必要になるかも」で作った機能の **9割は使われない**。しかも作った分だけバグを生みます。

## 凝集度と結合度

| 概念 | 理想 | イメージ |
|---|---|---|
| 凝集度 | 高い | 関連する処理が1つにまとまっている |
| 結合度 | 低い | 他モジュールへの依存が少ない |

**高凝集・低結合**が良い設計の定石。

## 関心の分離

- UI とロジックを混ぜない
- ドメインとインフラを混ぜない
- 計算と副作用を混ぜない

分けておくと、**部分的に差し替えやすい**。

## 早すぎる抽象化

初学者がやりがちな罠。

- クラスを先に作って中身を埋めていく
- 使いもしない継承ツリーを作る
- 無意味な Generic を乱用

> [!TIP]
> まず**ベタ書き**。重複が**3回**出てから抽象化を考えましょう（Rule of Three）。

## 可読性のコツ

- 変数名・関数名で**意図を語る**
- マジックナンバーは定数化
- ネストは浅く、早期 return
- コメントで「なぜ」を書く（「何を」はコードで）

\`\`\`ts
// ❌
if (u && u.a > 18) { /* ... */ }

// ✅
const isAdult = user.age >= 18;
if (isAdult) { /* ... */ }
\`\`\`

## リファクタリング

**動作を変えずにコードを綺麗にする**作業。

- テストを書く → リファクタ → テストが通る
- 小さな変更を積み重ねる
- 「動いているから触るな」ではなく、「動いているうちに綺麗に」

## 実務でのバランス感覚

| 状況 | 優先 |
|---|---|
| プロトタイプ | 動くことが最優先、設計は後 |
| 安定したプロダクト | 可読性・テスタビリティ |
| 大規模なエンタープライズ | SOLID / DDD をフル活用 |

**状況に応じて力を入れる場所を変える**のが熟練者。

## 「過剰設計 > 無設計」の罠

「設計 = 難しいことをたくさんやる」ではありません。

- インターフェースを増やしすぎて読めない
- 抽象化して誰も触れないコードにする
- デザインパターンを使いたくて使う

**シンプルさは最大の設計**。

## よくある誤解

<details>
<summary>「設計原則を全部守らないといけない」</summary>

原則は**ヒューリスティック**。ルールではなく参考です。
</details>

<details>
<summary>「DRY は絶対」</summary>

似ているだけで意味が違うコードを DRY すると、別の理由で壊れます。
</details>

<details>
<summary>「SOLID を知らないと恥ずかしい」</summary>

概念を知っていて、必要なときに使えれば十分。暗記は不要。
</details>

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : SRP / DRY を意識してリファクタ
    Week 2 : KISS / YAGNI で削減
    Week 3 : DIP で依存を逆転する例
    Week 4 : OCP / LSP をサンプルで写経
    Month 2 : リファクタリング（第2版）を読む
    Month 3 : デザインパターン入門
\`\`\`

## まとめ

- SOLID は「変更に強いコード」の5原則
- DRY / KISS / YAGNI でシンプルに
- 早すぎる抽象化は害
- 可読性は最高の設計

> [!IMPORTANT]
> 設計原則は**ルール**ではなく**道具**。最初から完璧を求めず、「今のコードをちょっと良くする」意識で触れていけば、少しずつ身に付きます。あなたのコードを読んだ誰かが、「読みやすいな」と感じたら勝ちです。

### 参考リソース

- 書籍「リファクタリング 第2版」（Martin Fowler）
- 書籍「Clean Code」
- 書籍「良いコード/悪いコードで学ぶ設計入門」
- [Refactoring Guru](https://refactoring.guru/ja)
`,
  },
  {
    title:
      'アジャイル・スクラムってなに？ — 2週間で動くものを作り続ける開発スタイル',
    slug: 'agile-and-scrum-for-beginners',
    tags: ['アジャイル', 'スクラム', '開発プロセス', '未経験'],
    content: `# アジャイル・スクラムってなに？ — 2週間で動くものを作り続ける開発スタイル

## はじめに

エンジニア転職が決まった翌日、いきなり言われます。

> 「明日から朝会があるから」
> 「スプリント中だから、それは次にね」
> 「このストーリーは5ポイントにしよう」

ポイント？ スプリント？ 何の話？ というのが初日の光景です。

> [!NOTE]
> この記事は「アジャイル・スクラムという言葉は聞くけど、実態がつかめていない」方向けです。**用語集**ではなく、**なぜそう働くのか**を説明します。

## TL;DR

- アジャイル = 小さく作って、学んで、直し続ける開発の考え方
- スクラムはアジャイルを実践するフレームワークの1つ
- 2週間などの短い期間（スプリント）で動くものを出す
- イベント: スプリントプランニング / デイリー / レビュー / レトロ
- ロール: プロダクトオーナー / スクラムマスター / 開発チーム
- 「ウォータースクラムフォール」という残念な失敗パターンも
- カンバン、XP など他手法との使い分けも理解しておく

## 目次

- ウォーターフォールとの違い
- アジャイル宣言
- スクラムの全体像
- スクラムのイベント
- スクラムのロール
- プロダクトバックログとスプリントバックログ
- ユーザーストーリー
- 見積もり
- ベロシティ
- スクラム vs カンバン
- スクラムの失敗パターン
- XP との関係
- 新卒・若手の心構え
- 学習ロードマップ
- まとめ

## ウォーターフォールとの違い

| 項目 | ウォーターフォール | アジャイル |
|---|---|---|
| 進め方 | 要件→設計→実装→テストを順に | 小さくサイクルを回す |
| 変更 | 嫌う | 歓迎する |
| リリース | 最後に1回 | 頻繁に何度も |
| リスク | 最後にまとめて露呈 | 早期に発見 |
| 向いている | 要件が明確な大規模案件 | 変化の多いプロダクト |

\`\`\`mermaid
graph LR
    subgraph ウォーターフォール
        A[要件] --> B[設計] --> C[実装] --> D[テスト] --> E[リリース]
    end

    subgraph アジャイル
        F[小さく計画] --> G[小さく作る] --> H[レビュー] --> I[学ぶ] --> F
    end
\`\`\`

## アジャイル宣言

2001年、17人の開発者が集まって発表した「アジャイルソフトウェア開発宣言」。

- プロセスやツールよりも **個人と対話** を
- 包括的なドキュメントよりも **動くソフトウェア** を
- 契約交渉よりも **顧客との協調** を
- 計画に従うことよりも **変化への対応** を

どちらも価値はあるが、左のほうを重視する、という微妙な言い回しがポイント。

## スクラムの全体像

\`\`\`mermaid
graph LR
    PB[プロダクトバックログ] --> SP[スプリントプランニング]
    SP --> SB[スプリントバックログ]
    SB --> S[スプリント 2週間]
    S --> D[デイリー]
    S --> SR[スプリントレビュー]
    SR --> SRE[レトロスペクティブ]
    SRE --> SP
\`\`\`

## スクラムのイベント

| イベント | 長さ（2週間スプリントの場合） | 目的 |
|---|---|---|
| スプリントプランニング | 最大4時間 | 今回何をやるか決める |
| デイリー | 15分 | 状況共有・障害発見 |
| スプリントレビュー | 最大2時間 | 成果物をステークホルダーに見せる |
| スプリントレトロスペクティブ | 最大1.5時間 | プロセスの改善 |

## スクラムのロール

| ロール | 責務 |
|---|---|
| プロダクトオーナー (PO) | 何を作るかを決める。優先順位付け |
| スクラムマスター (SM) | プロセスを回す、障害除去 |
| 開発チーム | どう作るかを決める、実装 |

> [!TIP]
> PO は「顧客の代表」、SM は「コーチ」、開発チームは「職人集団」です。

## プロダクトバックログとスプリントバックログ

- **プロダクトバックログ**: 全ての「やりたいこと」を優先順位付きで並べたリスト
- **スプリントバックログ**: 今回のスプリントで着手するアイテム

## ユーザーストーリー

タスクの書き方の1スタイル。

\`\`\`
〜として（ユーザー）
〜したい（目的）
なぜなら〜（理由）

例:
読者として
記事をブックマークしたい
なぜなら後から読み返したいから
\`\`\`

「機能」ではなく「**誰が何のためにそれを使うか**」を書くのがポイント。

## 見積もり

- **ストーリーポイント**: 相対的な大きさ（1, 2, 3, 5, 8, 13…）
- **プランニングポーカー**: 全員で同時にカードを出して議論

> [!NOTE]
> 時間ではなく**相対サイズ**で見積もる理由は、「絶対時間は外れるけど、比較は比較的当たる」から。

## ベロシティ

1スプリントで消化できるストーリーポイントの合計。チームの**スピード計**。

\`\`\`
スプリント1: 20pt
スプリント2: 25pt
スプリント3: 22pt
スプリント4: 24pt
→ チームの平均ベロシティは 22-24pt
\`\`\`

過去のベロシティで**未来の計画**を立てられる。

## スクラム vs カンバン

| 項目 | スクラム | カンバン |
|---|---|---|
| 区切り | スプリントあり | 連続流れ |
| 役割 | PO / SM / Dev | 厳密には定義なし |
| 変更 | スプリント内は原則固定 | いつでも OK |
| 向き | 開発プロダクト | 運用・問い合わせ対応 |

カンバンは「かんばん方式」という**見える化＋WIP制限**が肝。

## スクラムの失敗パターン

### ウォータースクラムフォール

名前だけスクラム、実態はウォーターフォール。

- スプリントに分けただけで、結局最後にまとめてリリース
- PO が要件を決めず、毎スプリント大量の変更
- ベロシティで「早く働け」と圧力をかける

### 形骸化したデイリー

- 報告会になって議論しない
- 15分が毎日1時間に伸びる
- 障害が出ても誰も助けに動かない

### ふりかえりが ceremonies（儀式化）

- 毎回同じ Keep/Problem/Try を繰り返す
- 改善策を誰も実行しない

## XP（エクストリームプログラミング）との関係

スクラムは**プロジェクト管理**、XP は**エンジニアリング実践**。

- TDD
- ペアプロ
- リファクタリング
- 継続的インテグレーション

スクラム×XP の組み合わせが現代のベストプラクティス。

## 新卒・若手の心構え

- わからないことを「わからない」と言える勇気
- デイリーで前日の困りごとを共有する
- レトロで一言でも意見を出す
- ポイント見積もりは経験で身につく

> [!TIP]
> 最初は「手を挙げるのが怖い」もの。**困っていることを言うのは、チームへの貢献**です。

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : アジャイル宣言を読む : スクラムガイド読む
    Week 2 : 小さなプロジェクトで 1週間スプリント
    Week 3 : ユーザーストーリー練習 : プランニング体験
    Week 4 : レトロで KPT を試す
    Month 2 : カンバンボードで個人タスク管理
    Month 3 : 実チームに参加 : ベロシティ計測
\`\`\`

## まとめ

- アジャイルは考え方、スクラムは実践フレームワーク
- 小さく作り、すぐ学び、すぐ直す
- 形だけ真似ても機能しない
- 失敗しても、レトロで直せば OK

> [!IMPORTANT]
> アジャイル・スクラムは「銀の弾丸」ではありません。大事なのは**チームで学び続ける姿勢**。ルールを完璧に守ることより、チームが良くなっていくことが目的。最初は慣れず戸惑うと思いますが、3ヶ月も働けば体に染み込みます。焦らず、一緒に走りましょう。

### 参考リソース

- [スクラムガイド（日本語）](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Japanese.pdf)
- [アジャイルソフトウェア開発宣言](https://agilemanifesto.org/iso/ja/manifesto.html)
- 書籍「SCRUM BOOT CAMP THE BOOK」
- 書籍「カイゼン・ジャーニー」
`,
  },
];
