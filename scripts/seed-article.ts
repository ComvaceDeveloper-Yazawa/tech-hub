import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

const prisma = new PrismaClient();

const TENANT_ID = '00000000000000000000000000';
const AUTHOR_ID = '00000000000000000000000001';

const CB3 = '```';

const content = `# マークアップ言語を習得した人のためのTypeScript基礎 — 型で守る堅牢なフロントエンド開発

## はじめに

HTML / CSS を書けるようになり、JavaScript に触れ始めたあなた。今度は「**TypeScript**」という単語があちこちで出てきて戸惑っていませんか？

- 求人票に「TypeScript必須」「TypeScript歓迎」ばかり
- Vue / React のチュートリアルが TypeScript 前提になっている
- 「型」「ジェネリクス」「インターフェース」って何の呪文...？

本記事は、**HTML / CSS / 少しのJavaScript**を書いた経験がある読者を想定し、**TypeScript を実務レベルで書けるようになるための最短ロードマップ**を解説します。難しい数学や型理論は扱いません。**明日からコードを書き始められる実用知識**に絞ります。

> [!NOTE]
> 本記事では TypeScript 5.x 系を前提にします。Vue 3 / React で TypeScript を使うことを想定した実用的な内容中心です。

## TL;DR

TypeScript 習得には、**6つのステップ**を順に進みます：

1. **Step 1**: なぜTypeScriptが必要か、環境構築（2日）
2. **Step 2**: 基本の型（string / number / boolean / array / object）（3日）
3. **Step 3**: 関数と戻り値の型（3日）
4. **Step 4**: 型エイリアスとインターフェース（3日）
5. **Step 5**: ユニオン型・ジェネリクス・ユーティリティ型（1週間）
6. **Step 6**: 実践 — Vue / React / API連携で使う（2週間）

**合計3〜4週間**（1日1〜2時間）。重要なのは「**JSの基礎を先に固める**」「**any に逃げない**」「**自分のプロジェクトで使う**」の3点です。

## 目次

- [そもそもTypeScriptとは何か](#そもそもtypescriptとは何か)
- [Step 1: 環境構築と初めてのTS](#step-1-環境構築と初めてのts)
- [Step 2: 基本の型](#step-2-基本の型)
- [Step 3: 関数と型](#step-3-関数と型)
- [Step 4: 型エイリアスとインターフェース](#step-4-型エイリアスとインターフェース)
- [Step 5: 実践で使う応用型](#step-5-実践で使う応用型)
- [Step 6: フレームワークでの実践](#step-6-フレームワークでの実践)
- [つまずきポイントと対処法](#つまずきポイントと対処法)

## そもそもTypeScriptとは何か

### 一言で言うと「型が付けられるJavaScript」

TypeScript は、**JavaScript に「型」の概念を追加した言語**です。Microsoft が開発し、2012年にリリースされました。

${CB3}mermaid
graph LR
    A[TypeScript<br/>.ts ファイル] -->|コンパイル| B[JavaScript<br/>.js ファイル]
    B --> C[ブラウザ / Node.js<br/>で実行]
${CB3}

ブラウザは TypeScript を直接実行できないので、**コンパイル（変換）** して JavaScript にしてから実行します。

### なぜ型が必要なのか

JavaScript で以下のバグを想像してください。

${CB3}js
function calcTax(price) {
  return price * 1.1
}

calcTax('1000')  // "10001.1" という文字列が返る（バグ）
calcTax(null)    // NaN が返る（バグ）
calcTax()        // NaN が返る（バグ）
${CB3}

素の JavaScript では、**実行するまで間違いに気づけません**。しかも本番環境で発覚することも多い。

TypeScript なら：

${CB3}ts
function calcTax(price: number): number {
  return price * 1.1
}

calcTax('1000')  // ❌ コンパイルエラー
calcTax(null)    // ❌ コンパイルエラー
calcTax()        // ❌ コンパイルエラー
${CB3}

**書いた瞬間にエディタが赤線で警告**してくれます。

### TypeScript の3大メリット

#### 1. バグを早期発見

実行前にエラーを検出。本番で落ちるバグが激減。

#### 2. エディタの補完が超強力

VS Code で \`user.\` と打つと、\`name\`、\`age\`、\`email\` など利用可能なプロパティが**全部サジェスト**されます。関数の引数も型情報付きで教えてくれる。

#### 3. ドキュメントとしての型

型を見れば**関数の使い方が一目でわかる**。コメントを読まなくても、何を渡せばいいか・何が返るかが明確。

> [!IMPORTANT]
> 現代のフロントエンド求人は、**TypeScript必須** がデフォルトになりつつあります。「JavaScriptは書けるがTSは未経験」では書類落ちするケースも。**これからフロントエンドを学ぶなら、最初から TypeScript で書く**のが投資対効果が高い選択です。

## Step 1: 環境構築と初めてのTS

### 前提: JavaScriptの基礎

TypeScript は JavaScript の**スーパーセット**（JavaScript にさらに機能を足したもの）です。つまり、**JavaScript が書けなければ TypeScript も書けません**。

最低限、以下のJavaScript知識が必要です。

- 変数（const / let）
- データ型（string / number / boolean / array / object）
- 関数（アロー関数含む）
- 配列メソッド（map / filter）
- 分割代入・スプレッド構文
- モジュール（import / export）
- Promise / async / await

不安な方は、前記事の **「完全未経験からWebエンジニアになるロードマップ」** の Phase 1 を先に完了してください。

### 動かし方の選択肢

TypeScriptを試す環境は3つあります。

| 環境 | 難易度 | 用途 |
|---|---|---|
| **TypeScript Playground** | ★ | ブラウザで即試せる |
| **ローカル環境（tsc）** | ★★ | 単体ファイルで学習 |
| **Vite + Vue/React** | ★★★ | 実践的な開発環境 |

### おすすめ: TypeScript Playground

最初は **https://www.typescriptlang.org/play** が最強。ブラウザで開くだけで TypeScript が書けて、即座にコンパイル結果とエラーが見られます。インストール不要。

### ローカル環境の構築

本格的に学ぶならローカル環境を用意しましょう。

${CB3}bash
# プロジェクト作成
mkdir ts-lesson
cd ts-lesson
npm init -y

# TypeScriptインストール
npm install -D typescript tsx

# 設定ファイル生成
npx tsc --init
${CB3}

\`hello.ts\` を作成：

${CB3}ts
const message: string = 'Hello, TypeScript!'
console.log(message)
${CB3}

実行：

${CB3}bash
npx tsx hello.ts
${CB3}

### VS Code の設定

VS Code は **標準でTypeScriptに完全対応**しています。特別な設定は不要ですが、以下の拡張機能があると便利。

- **Error Lens**: エラーをコード上に直接表示
- **Prettier**: コード整形
- **ESLint**: コード品質チェック

## Step 2: 基本の型

### プリミティブ型

#### string / number / boolean

${CB3}ts
const name: string = 'Taro'
const age: number = 25
const isActive: boolean = true
${CB3}

#### null / undefined

${CB3}ts
const empty: null = null
const notDefined: undefined = undefined
${CB3}

### 配列

${CB3}ts
// 2つの書き方（どちらも同じ）
const numbers: number[] = [1, 2, 3]
const names: Array<string> = ['Taro', 'Hanako']

// 複数の型が混ざる場合
const mixed: (string | number)[] = [1, 'two', 3]
${CB3}

### オブジェクト

${CB3}ts
const user: { name: string; age: number } = {
  name: 'Taro',
  age: 25,
}
${CB3}

オブジェクトの型は長くなりがちなので、後述の「**型エイリアス**」でまとめて名前を付けます。

### 型推論

実は、多くの場合 **型を書かなくてもTypeScriptが推測してくれます**。

${CB3}ts
const name = 'Taro'  // string と推論される
const age = 25       // number と推論される

name.toUpperCase()  // OK（string のメソッド）
age.toUpperCase()   // ❌ エラー（number にはない）
${CB3}

> [!TIP]
> **型を毎回書く必要はありません**。変数の初期値から推論できる場合は省略してOK。逆に、**関数の引数と戻り値、外部から来るデータ**には明示的に型を書くのが鉄則です。

### リテラル型

**「特定の値だけ」** を型にできます。

${CB3}ts
let status: 'success' | 'error' | 'loading'
status = 'success'  // OK
status = 'failed'   // ❌ エラー
${CB3}

これは後述の **ユニオン型** の応用で、実務で死ぬほど使います。

### any と unknown

**\`any\` は TypeScript の禁じ手**。何でも代入可能で、型チェックを無効化します。

${CB3}ts
let value: any = 10
value = 'hello'
value = { foo: 'bar' }
value.nonExistent.foo  // エラーにならない（危険）
${CB3}

代わりに **\`unknown\`** を使います。これは「何が入るか分からないが、使う前に型を絞り込む必要がある」という安全な any です。

${CB3}ts
let value: unknown = 10
// value.toString()  // ❌ エラー

if (typeof value === 'number') {
  value.toFixed(2)  // OK
}
${CB3}

> [!WARNING]
> **\`any\` を使ったらTypeScriptを使う意味がありません**。初学者が詰まった時に \`any\` で逃げる癖がつくと、成長が止まります。困ったら \`unknown\` を使うか、型を正しく書く努力をしましょう。

## Step 3: 関数と型

### 引数と戻り値の型

${CB3}ts
function add(a: number, b: number): number {
  return a + b
}

// アロー関数
const multiply = (a: number, b: number): number => a * b
${CB3}

### 戻り値が void

何も返さない関数。

${CB3}ts
function logMessage(msg: string): void {
  console.log(msg)
}
${CB3}

### オプショナル引数

\`?\` を付けると省略可能。

${CB3}ts
function greet(name: string, title?: string): string {
  if (title) {
    return \`Hello, \${title} \${name}\`
  }
  return \`Hello, \${name}\`
}

greet('Taro')         // OK
greet('Taro', 'Dr.')  // OK
${CB3}

### デフォルト引数

${CB3}ts
function greet(name: string, title: string = 'Mr.'): string {
  return \`Hello, \${title} \${name}\`
}
${CB3}

### 関数型

変数に関数を代入する時、関数そのものの型を書けます。

${CB3}ts
const add: (a: number, b: number) => number = (a, b) => a + b
${CB3}

コールバック関数の型指定で特に役立ちます。

${CB3}ts
function processNumbers(nums: number[], callback: (n: number) => number): number[] {
  return nums.map(callback)
}

processNumbers([1, 2, 3], n => n * 2)  // [2, 4, 6]
${CB3}

## Step 4: 型エイリアスとインターフェース

### 型エイリアス (\`type\`)

**型に名前を付ける**仕組み。

${CB3}ts
type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

const user: User = {
  id: 1,
  name: 'Taro',
  email: 'taro@example.com',
  isAdmin: false,
}
${CB3}

関数の引数にも使えます。

${CB3}ts
function createUser(user: User): void {
  console.log(\`Created: \${user.name}\`)
}
${CB3}

### インターフェース (\`interface\`)

\`type\` とほぼ同じ機能。

${CB3}ts
interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
}
${CB3}

### \`type\` と \`interface\` の使い分け

| 観点 | \`type\` | \`interface\` |
|---|---|---|
| オブジェクト定義 | ⭕ | ⭕ |
| ユニオン型 | ⭕ | ❌ |
| 拡張（継承） | \`&\` で合成 | \`extends\` |
| 同名再定義 | ❌ エラー | ⭕ マージ |

**迷ったら \`type\`** を使う方針で問題ありません。React / Vue 界隈では \`type\` がやや主流です。

### プロパティのオプショナル

${CB3}ts
type User = {
  id: number
  name: string
  email?: string  // 省略可能
}

const user1: User = { id: 1, name: 'Taro' }                           // OK
const user2: User = { id: 2, name: 'Hanako', email: 'h@test.com' }    // OK
${CB3}

### 読み取り専用

${CB3}ts
type User = {
  readonly id: number
  name: string
}

const user: User = { id: 1, name: 'Taro' }
user.name = 'Hanako'  // OK
user.id = 2           // ❌ エラー（読み取り専用）
${CB3}

### ネストした型

${CB3}ts
type Address = {
  city: string
  zip: string
}

type User = {
  id: number
  name: string
  address: Address
}
${CB3}

## Step 5: 実践で使う応用型

### ユニオン型 — 「A または B」

${CB3}ts
type ID = string | number

function printId(id: ID): void {
  console.log(id)
}

printId(123)       // OK
printId('abc123')  // OK
printId(true)      // ❌ エラー
${CB3}

API レスポンスや状態管理で超頻出。

${CB3}ts
type Status = 'idle' | 'loading' | 'success' | 'error'

let currentStatus: Status = 'idle'
${CB3}

### 型の絞り込み

ユニオン型は、**条件分岐で型が絞り込まれます**。

${CB3}ts
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()  // この中では string として扱える
  }
  return value.toFixed(2)       // この中では number として扱える
}
${CB3}

### インターセクション型 — 「A かつ B」

${CB3}ts
type WithId = { id: number }
type WithName = { name: string }

type User = WithId & WithName  // { id: number; name: string }
${CB3}

### ジェネリクス — 型を引数にする

**同じロジックを様々な型で使い回したい**時に使います。

${CB3}ts
// 配列の最初の要素を返す関数
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

first([1, 2, 3])             // number | undefined
first(['a', 'b', 'c'])       // string | undefined
first([{ id: 1 }, { id: 2 }]) // { id: number } | undefined
${CB3}

\`<T>\` が「型の引数」。呼び出し時の実際の型に置き換わります。

#### よく使うジェネリクスの例

${CB3}ts
// API レスポンスの型
type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'Taro', email: 'taro@test.com', isAdmin: false },
  status: 200,
  message: 'OK',
}
${CB3}

### ユーティリティ型

TypeScriptには**便利な組み込み型**が多数あります。頻出の5つ。

#### \`Partial<T>\` — 全プロパティをオプショナルに

${CB3}ts
type User = { id: number; name: string; email: string }

// 部分更新のために使う
function updateUser(id: number, updates: Partial<User>): void {
  // updates は { id?, name?, email? } 全部オプショナル
}

updateUser(1, { name: 'Hanako' })  // OK
${CB3}

#### \`Required<T>\` — 全プロパティを必須に

${CB3}ts
type User = { id?: number; name?: string }
type StrictUser = Required<User>  // { id: number; name: string }
${CB3}

#### \`Pick<T, K>\` — 一部プロパティだけ抜き出す

${CB3}ts
type User = { id: number; name: string; email: string; password: string }
type PublicUser = Pick<User, 'id' | 'name'>  // { id: number; name: string }
${CB3}

#### \`Omit<T, K>\` — 一部プロパティを除く

${CB3}ts
type User = { id: number; name: string; email: string; password: string }
type SafeUser = Omit<User, 'password'>  // password 以外の全プロパティ
${CB3}

#### \`Record<K, V>\` — キーと値の型でオブジェクトを定義

${CB3}ts
type StatusMessages = Record<'success' | 'error' | 'loading', string>

const messages: StatusMessages = {
  success: 'OK',
  error: 'Failed',
  loading: 'Please wait...',
}
${CB3}

> [!TIP]
> ユーティリティ型は**最初から全部覚える必要はない**。\`Partial\` \`Pick\` \`Omit\` の3つを覚えて、必要に応じて他を調べる形で十分です。

### \`as const\` と \`as\`

#### \`as const\` — リテラル型で固定

${CB3}ts
const colors = ['red', 'green', 'blue'] as const
// readonly ['red', 'green', 'blue'] 型になる

type Color = typeof colors[number]  // 'red' | 'green' | 'blue'
${CB3}

#### \`as\` — 型アサーション（要注意）

${CB3}ts
const input = document.getElementById('myInput') as HTMLInputElement
input.value  // HTMLInputElement として扱える
${CB3}

> [!WARNING]
> \`as\` は**型チェックを強制的にねじ曲げる**機能です。間違った型に変換してもエラーにならないので、**本当に必要な時だけ使う**。乱用は \`any\` と同じ悪手です。

## Step 6: フレームワークでの実践

### Vue 3 + TypeScript

Vue プロジェクトを TypeScript で作成：

${CB3}bash
npm create vue@latest
# TypeScript を Yes にする
${CB3}

#### \`<script setup lang="ts">\`

${CB3}vue
<script setup lang="ts">
import { ref } from 'vue'

// ref に型を明示
const count = ref<number>(0)
const message = ref<string>('')

// オブジェクトの型
type User = {
  id: number
  name: string
}

const users = ref<User[]>([])
</script>
${CB3}

#### Props に型を付ける

${CB3}vue
<script setup lang="ts">
// 型だけ指定する defineProps
const props = defineProps<{
  name: string
  age: number
  isAdmin?: boolean
}>()
</script>
${CB3}

#### Emit に型を付ける

${CB3}vue
<script setup lang="ts">
const emit = defineEmits<{
  update: [value: string]
  delete: [id: number]
}>()
</script>
${CB3}

### React + TypeScript

Vite で作成：

${CB3}bash
npm create vite@latest my-app -- --template react-ts
${CB3}

#### コンポーネントの型

${CB3}tsx
type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
${CB3}

#### useState に型を付ける

${CB3}tsx
import { useState } from 'react'

const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
${CB3}

### API レスポンスの型

実務で最もTypeScriptが活きる場面。

${CB3}ts
type User = {
  id: number
  name: string
  email: string
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  const data: User = await response.json()
  return data
}

// 使う側では補完が効く
const user = await fetchUser(1)
console.log(user.name)  // ✅ 補完が効く
console.log(user.phone) // ❌ 存在しないプロパティ
${CB3}

> [!IMPORTANT]
> **API レスポンスの型は信頼できない**ことに注意。サーバが想定外の形で返してきてもTSはエラーにしません。本番運用では **zod** などのバリデーションライブラリで実行時チェックすることが推奨されます。

## つまずきポイントと対処法

### つまずき1: エラーメッセージが長すぎて読めない

${CB3}
Argument of type '{ name: string; age: "25"; }' is not assignable to parameter of type 'User'.
  Types of property 'age' are incompatible.
    Type 'string' is not assignable to type 'number'.
${CB3}

**対処**: エラーは**下から読む**。最後の行が最も具体的な原因を示していることが多い。

### つまずき2: \`any\` に逃げたくなる

**対処**: まず \`unknown\` を使う。それでも型が分からない時は\`zod\`などで実行時チェック。「一時的に\`any\`」は永続化するので注意。

### つまずき3: \`Object is possibly 'null'\`

${CB3}ts
const el = document.getElementById('myInput')
el.value  // ❌ Object is possibly 'null'
${CB3}

**対処**:

${CB3}ts
// 方法1: null チェック
if (el) {
  el.value
}

// 方法2: オプショナルチェーン
el?.value

// 方法3: 非null アサーション（使用注意）
el!.value
${CB3}

### つまずき4: 型が複雑すぎて書けない

**対処**: 一旦 \`unknown\` や \`any\` で動かして、**後から型を書く**のもアリ。完璧を目指さず段階的に。

### つまずき5: \`tsconfig.json\` が何か分からない

**対処**: 最初は触らなくてOK。\`strict: true\` だけ確認してください。これが厳格モードをONにする設定で、**最初から厳しい方が学習効率が良い**です。

## 実践課題: 型付きTODOアプリ

Vue 3 記事で作った TODO アプリを **TypeScript でリライト**しましょう。

### 実装ポイント

${CB3}ts
// 型定義
type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

type Filter = 'all' | 'active' | 'completed'

// 関数の型
function addTodo(title: string): Todo { /* ... */ }
function toggleTodo(id: string): void { /* ... */ }
function filterTodos(todos: Todo[], filter: Filter): Todo[] { /* ... */ }
${CB3}

型を書いてから実装することで、**APIが明確になる**体験ができます。これがTypeScriptの真の魅力です。

## 学習を加速するTips

### 1. 公式ドキュメントを読む

**TypeScript Handbook（日本語版）** が存在します。https://typescript-jp.gitbook.io/deep-dive/

### 2. \`strict: true\` を常にON

厳格モードで書く習慣を最初からつける。後で緩和は簡単だが、緩くして書いたコードを厳格化するのは地獄。

### 3. 型から考える設計

コードを書く前に「このデータはどんな型か」を考える。設計が自然と綺麗になります。

### 4. 他人のコードの型を読む

OSSの型定義（\`@types/xxx\`）を読むと、プロの型設計が学べます。

### 5. Playgroundで小さく実験

疑問は **TypeScript Playground** で即座に試す。インストール不要で学習速度が最速。

## まとめ: TypeScript への道のり

本記事のロードマップを再掲します。

| Step | 期間 | 内容 |
|---|---|---|
| 1 | 2日 | 環境構築 |
| 2 | 3日 | 基本の型 |
| 3 | 3日 | 関数と型 |
| 4 | 3日 | 型エイリアス / インターフェース |
| 5 | 1週間 | ユニオン型・ジェネリクス・ユーティリティ型 |
| 6 | 2週間 | フレームワーク実践 |

**合計3〜4週間**で、Vue / React プロジェクトで TypeScript を使いこなせるレベルに到達できます。

### 次のステップ

TypeScript の基礎ができたら：

- **zod**: 実行時の型バリデーション
- **高度な型**: Mapped Types、Conditional Types、Template Literal Types
- **Node.js + TypeScript**: バックエンドも型で守る
- **tRPC**: 型安全なAPI通信
- **Prisma**: 型安全なORM

### 最後に

TypeScript を最初に触ると、「型を書くのが面倒」と感じるかもしれません。しかし2〜3ヶ月使えば、**素のJavaScriptに戻れない体**になります。

**エディタが補完してくれる安心感、リファクタリング時に型が守ってくれる信頼感、コードがそのままドキュメントになる便利さ**——これを体験すると、「TypeScriptで書くのが標準、たまに学習用にJSを書く」という感覚に変わります。

2026年現在、フロントエンドの実務は TypeScript 一色です。この記事がその第一歩を確実にするものになれば幸いです。

### 参考リソース

- **TypeScript 公式ドキュメント**: https://www.typescriptlang.org/docs/
- **TypeScript Deep Dive（日本語）**: https://typescript-jp.gitbook.io/deep-dive/
- **サバイバル TypeScript**: https://typescriptbook.jp/
- **TypeScript Playground**: https://www.typescriptlang.org/play
- **type-challenges**（GitHub）: 型パズルで腕試し
`;

async function main() {
  const articleId = ulid();
  const now = new Date();

  await prisma.article.create({
    data: {
      id: articleId,
      tenantId: TENANT_ID,
      title:
        'マークアップ言語を習得した人のためのTypeScript基礎 — 型で守る堅牢なフロントエンド開発',
      content,
      status: 'published',
      slug: 'typescript-basics-for-markup-learners',
      authorId: AUTHOR_ID,
      viewCount: 0,
      likeCount: 0,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log(`✅ 記事を作成しました: ${articleId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
