import type { ArticleSeed } from './types';

export const aiAdvancedArticles: ArticleSeed[] = [
  {
    title: 'プロンプトエンジニアリング実践 — AIに本気を出させる5つの設計',
    slug: 'prompt-engineering-practical-guide',
    tags: ['AI', 'プロンプト', 'LLM', 'ChatGPT'],
    content: `# プロンプトエンジニアリング実践 — AIに本気を出させる5つの設計

## はじめに

ChatGPT や Claude を使っていて、こう思ったことありませんか？

> 「同じことを聞いてるのに、日によって答えが違う」
> 「『もう少し詳しく』と言い続けて3往復目に入る」
> 「思ったフォーマットで出してくれない」

それ、プロンプトの書き方で**大半が解決できます**。

> [!NOTE]
> この記事は「AI は使っているけど、毎回ふわっとした頼み方をしている」方向けです。プロンプトを**設計する**視点を持ち帰ってもらうことが目標です。

## TL;DR

- プロンプト = 役割 / タスク / 制約 / 出力形式 の4要素
- Zero-shot → Few-shot → Chain of Thought で段階的に精度が上がる
- System と User は目的が違う
- 悪い例を見せる「Negative Example」も効く
- 出力形式（JSON、Markdown、表）を明示すると安定
- モデルごとに得意技が違う
- 温度（temperature）の意味を押さえる
- プロンプトは**テンプレ化**して再利用

## 目次

- プロンプトの基本構造
- Zero-shot / Few-shot / CoT
- System Prompt と User Prompt
- Role Prompting
- 段階的プロンプト
- 出力形式の制御
- 悪い例 / 良い例
- モデル別の特性
- 温度パラメータ
- プロンプトの評価
- 再利用とテンプレ化
- 日本語プロンプトのコツ
- エージェント時代のプロンプト
- ハンズオン
- まとめ

## プロンプトの基本構造

\`\`\`
あなたは [役割] です。
[タスク] をしてください。
制約:
- [制約1]
- [制約2]
出力形式:
[形式]
\`\`\`

### 例

\`\`\`
あなたは SEO に詳しい日本語のテクニカルライターです。
次のトピックについて、2,000字の記事を書いてください。
制約:
- 初心者向けに専門用語は必ず例えで説明する
- 必ず目次を含める
- コードブロックは typescript で書く
出力形式: Markdown
トピック: 「Next.js の Server Components」
\`\`\`

要素を意識すると、**同じ品質を再現できる**プロンプトになります。

## Zero-shot / Few-shot / CoT

### Zero-shot

例を見せずに指示。

\`\`\`
次の英文を日本語に翻訳してください: "Hello World"
\`\`\`

### Few-shot

例を数個見せる。

\`\`\`
例1:
入力: 1+1
出力: 2

例2:
入力: 2+3
出力: 5

入力: 5+8
出力:
\`\`\`

### Chain of Thought (CoT)

「段階的に考えて」と指示。

\`\`\`
以下の問題を**段階的に考えてから**答えてください。

リンゴが3個あります。2個食べました。友達から5個もらいました。今何個？

Step 1: ...
Step 2: ...
最終回答: ...
\`\`\`

複雑な推論ほど効果が出ます。

## System Prompt と User Prompt

| 種類 | 目的 |
|---|---|
| System | 役割・方針・恒常的な制約 |
| User | 今回のタスク |

\`\`\`
System: あなたは医師向けの情報を扱う医療ライターです。必ず出典を示してください。
User: 糖尿病の最新治療について500字で教えて。
\`\`\`

System をしっかり書くと、User が軽くて済みます。

## Role Prompting

「あなたは〇〇の専門家です」。これだけで出力の質が変わります。

- 「あなたはセキュリティ専門家です」
- 「あなたはシニア Next.js エンジニアです」
- 「あなたは辛口の編集者です」

役割を与えることで、出力のトーン・用語選択が最適化されます。

## 段階的プロンプト

1回のプロンプトで全部やらせずに、**分割する**。

\`\`\`
Step 1: まず記事の構成案を作って
Step 2: 承認後、各セクションを書いて
Step 3: 最後に全体を推敲
\`\`\`

「考える → 書く → 直す」を分けると、LLM の出力が格段に良くなります。

## 出力形式の制御

\`\`\`
次のキーを持つ JSON で返してください:
- title: string
- tags: string[]
- body: string（Markdown）

その他のテキストは一切出力しないでください。
\`\`\`

構造化出力を使うと、プログラムから扱いやすくなります。

> [!TIP]
> 最近のモデルは「JSON mode」「Structured Output」「Function Calling」などで構造化をサポートしています。活用しましょう。

## 悪い例 / 良い例

| 悪い | 良い |
|---|---|
| 「記事書いて」 | 「初心者向けに 2000字、目次付き、コード例あり、Markdown で」 |
| 「詳しく」 | 「以下のセクションを500字ずつで」 |
| 「いい感じに」 | 「箇条書き5項目以内、敬語、200字以内」 |

曖昧さを減らすほど、再現性が上がります。

## モデル別の特性

| モデル | 得意 |
|---|---|
| GPT-5 系 | 論理性、コード生成、長文要約 |
| Claude 4/5 系 | 丁寧な日本語、長文読解、倫理感 |
| Gemini 2/3 系 | マルチモーダル、検索連携、長文コンテキスト |
| ローカル LLM | オフライン、機密データ、コスト |

目的によって使い分けると、同じプロンプトでも全然違う結果になります。

## 温度パラメータ

\`temperature\` は「ランダムさ」。

| 値 | 特徴 | 用途 |
|---|---|---|
| 0 | ほぼ決定論的 | コード生成、要約 |
| 0.3-0.7 | 適度に多様 | 記事、会話 |
| 1.0+ | 大胆 | 創作 |

## プロンプトの評価

品質を測るための定性・定量評価。

- **人間の目視**: 小規模なら十分
- **LLM as a Judge**: 別の LLM に評価させる
- **自動テスト**: 期待値との完全一致、JSON のスキーマ、正規表現

本番では**プロンプトもテストする**時代です。

## 再利用とテンプレ化

\`\`\`ts
function articlePrompt(topic: string, length: number) {
  return \`あなたは技術ライターです。
次のトピックについて、\${length}字で記事を書いてください。
トピック: \${topic}
出力形式: Markdown\`;
}
\`\`\`

コード内に埋め込まず、**テンプレート関数**にしておくとメンテが楽。

## 日本語プロンプトのコツ

- 日本語で指示すれば、日本語で返ってくる（ことが多い）
- 敬体か常体か、**明示**したほうが安定
- 専門用語は日本語・英語を併記（例: 「プロンプト（prompt）」）
- 数量表現は「だいたい3つ」より「ちょうど3つ」

## エージェント時代のプロンプト

2026年現在、単発のプロンプトから**自律エージェント**へと主戦場が移っています。

- エージェントは自分でツールを選び、結果を見て、次の行動を決める
- プロンプトは「人格」「方針」「安全ルール」を書く役割に変化
- ツールの説明文（description）もプロンプトの一部

## ハンズオン

同じタスクを3段階で改善していきます。

### v1（ダメ）

\`\`\`
Next.js の記事書いて
\`\`\`

### v2（まあまあ）

\`\`\`
Next.js の App Router について、日本語で、初心者向けに書いてください。
\`\`\`

### v3（良い）

\`\`\`
あなたはベテランの Next.js エンジニア兼テクニカルライターです。

【タスク】
Next.js 15 の App Router について、日本語の Markdown 記事を書いてください。

【対象読者】
React の基礎は知っている、Next.js 初心者

【構成】
1. 要約（TL;DR、箇条書き5つ）
2. App Router とは
3. Pages Router との比較表
4. 基本的なルーティング（コード例）
5. Layout と loading.tsx
6. まとめ

【制約】
- 全体で 2500〜3000字
- コード例は typescript
- 専門用語は比喩で補足
- 絵文字は使わない
\`\`\`

v3 は**誰でも同じような質の記事**を量産できます。これがプロンプトエンジニアリング。

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : 4要素（役割/タスク/制約/形式）を練習
    Week 2 : Few-shot と CoT : 推論系
    Week 3 : 構造化出力（JSON/関数呼び出し）
    Week 4 : 同じタスクで3モデル比較
    Month 2 : プロンプトをコード化 : テンプレート関数
    Month 3 : エージェント時代の System プロンプト設計
\`\`\`

## まとめ

- 良いプロンプトは**構造化されている**
- 例・手順・形式を明示するほど安定
- モデルごとの特性を理解して使い分ける
- プロンプトも**継続改善**する対象

> [!IMPORTANT]
> プロンプトエンジニアリングは「魔法の呪文を探す」作業ではなく、**相手（AI）が理解しやすい頼み方を設計する**スキルです。人間相手にも役立つので、学んで損はありません。AI と上手に付き合えるエンジニアは、これからますます価値が上がります。

### 参考リソース

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Prompting Library](https://docs.anthropic.com/claude/docs/prompt-library)
- [Prompting Guide](https://www.promptingguide.ai/jp)
- 論文「Chain-of-Thought Prompting Elicits Reasoning in Large Language Models」
`,
  },
  {
    title: 'RAG実装ハンズオン — PDFを喋るチャットボットを作る',
    slug: 'rag-implementation-hands-on',
    tags: ['AI', 'RAG', 'LLM', 'ベクトルDB'],
    content: `# RAG実装ハンズオン — PDFを喋るチャットボットを作る

## はじめに

LLM は博識ですが、**自社の資料**や**特定のドキュメント**については知りません。ChatGPT に「我が社の就業規則教えて」と聞いても答えてくれません。

そこで登場するのが **RAG（Retrieval-Augmented Generation）**。自分のデータを LLM に「読ませる」技術です。

> [!NOTE]
> この記事は「LLM API を触ったことがあり、次は自分のデータを使いたい」方向けです。数式や理論より、**動くものを作る**ことを優先します。

## TL;DR

- RAG = 検索 + 生成。関連文書を検索してから LLM に渡す
- 仕組みは「埋め込み化 → ベクトル DB に保存 → 質問で検索 → プロンプトに注入」
- チャンキング（文書分割）が精度を左右する
- Pinecone / pgvector / Qdrant / Weaviate が代表的ベクトル DB
- LangChain / LlamaIndex を使えば数十行で組める
- Re-ranking や Hybrid Search で精度向上
- 評価指標と本番運用の注意

## 目次

- RAG とは
- 全体アーキテクチャ
- 埋め込み（Embedding）
- ベクトル DB
- チャンキング戦略
- 類似度検索
- ハンズオン: PDF を読むチャットボット
- LangChain / LlamaIndex
- Re-ranking
- Hybrid Search
- 評価指標
- 本番運用の注意
- 学習ロードマップ
- まとめ

## RAG とは

「LLM が知らないことを答えさせる」手法。

\`\`\`mermaid
graph LR
    Q[質問] --> E[埋め込み化]
    E --> S[ベクトル DB 検索]
    S --> D[関連文書]
    D --> P[プロンプトに注入]
    P --> L[LLM]
    L --> A[回答]
\`\`\`

LLM の知識を更新する代わりに、**必要な情報を都度渡す**発想。

## 全体アーキテクチャ

大きく2フェーズに分かれます。

1. **Ingestion（事前準備）**: 文書を分割 → 埋め込み化 → ベクトル DB に保存
2. **Query（問い合わせ時）**: 質問 → 埋め込み化 → 検索 → LLM に渡す

## 埋め込み（Embedding）

テキストを**意味を持った数値ベクトル**に変換すること。

\`\`\`
「犬」 → [0.2, -0.1, 0.8, 0.3, ...]
「いぬ」 → [0.21, -0.09, 0.79, 0.32, ...]
「猫」 → [0.15, -0.2, 0.85, 0.1, ...]
\`\`\`

意味が近い単語は**ベクトル空間で近い**場所にマッピングされます。

- OpenAI: text-embedding-3-small / large
- Cohere: embed-multilingual-v3
- Google: textembedding-gecko
- OSS: sentence-transformers / BGE

## ベクトル DB

ベクトルを保存して、類似度検索できる DB。

| 種類 | 特徴 |
|---|---|
| Pinecone | マネージド、使いやすい |
| Qdrant | OSS、Rust 製、高速 |
| Weaviate | OSS、GraphQL |
| pgvector | PostgreSQL 拡張、シンプル |
| Chroma | 軽量、開発用 |

## チャンキング戦略

文書を丸ごと突っ込むと長すぎる。**適切に分割**します。

- **固定長**: 500〜1000文字ごと
- **段落ベース**: 改行やヘッダで分割
- **セマンティック**: 意味のまとまりで分割
- **重複あり**: 文脈が切れないよう前後を重ねる

> [!TIP]
> 「チャンキングが RAG の精度の 8割を決める」とも言われます。チューニングの価値あり。

## 類似度検索

- **コサイン類似度**: ベクトルの角度。RAG では定番
- **ユークリッド距離**: ベクトル間の距離
- **ドット積**: 規模と方向の両方

1つの質問に対して、上位 k 件（top-k）を取るのが一般的。

## ハンズオン: PDF を読むチャットボット

### 手順

1. PDF からテキスト抽出
2. チャンクに分割
3. 埋め込み化してベクトル DB に保存
4. 質問を受けたら検索
5. 関連文書を LLM に渡して回答

### 疑似コード

\`\`\`ts
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

async function main() {
  // 1. PDF を読む
  const loader = new PDFLoader('./manual.pdf');
  const docs = await loader.load();

  // 2. チャンクに分割
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const chunks = await splitter.splitDocuments(docs);

  // 3. 埋め込み化してストアへ
  const store = await MemoryVectorStore.fromDocuments(
    chunks,
    new OpenAIEmbeddings()
  );

  // 4. 質問で検索
  const question = 'ログインできない時の対処は？';
  const relevant = await store.similaritySearch(question, 3);

  // 5. LLM にコンテキストと質問を渡す
  const llm = new ChatOpenAI({ model: 'gpt-4o-mini' });
  const context = relevant.map((d) => d.pageContent).join('\\n\\n');
  const answer = await llm.invoke(
    \`次の資料を元に質問に答えてください:\\n\${context}\\n\\n質問: \${question}\`
  );
  console.log(answer.content);
}

main();
\`\`\`

たったこれだけで「自分の PDF を喋るボット」の完成。

## LangChain / LlamaIndex

| ライブラリ | 強み |
|---|---|
| LangChain | 総合デパート、TS/Python |
| LlamaIndex | RAG に特化、検索戦略が豊富 |
| Vercel AI SDK | Next.js 統合、ストリーミング |
| Mastra | TypeScript 専用のモダンフレームワーク |

## Re-ranking

最初の検索で返ってきた結果を、**もう一段階並べ直す**。

- Cohere Rerank API
- BGE Reranker
- OpenAI の GPT を使った self-rerank

精度が目に見えて上がります。

## Hybrid Search

**キーワード検索 + ベクトル検索**を組み合わせる。

- 具体的な固有名詞はキーワードが強い
- 抽象的な質問はベクトルが強い

両方を重み付けで合成すると、幅広い質問に強くなります。

## 評価指標

| 指標 | 意味 |
|---|---|
| Retrieval Precision | 検索が関連文書を返したか |
| Retrieval Recall | 必要な文書を取りこぼしていないか |
| Answer Faithfulness | 回答がソースに忠実か（幻覚防止） |
| Answer Relevance | 回答が質問に答えているか |

**Ragas** や **DeepEval** などのツールで自動化できます。

## 本番運用の注意

- **コスト**: 埋め込み + LLM で二重コスト
- **レイテンシ**: 検索 + 生成で応答時間が延びる
- **キャッシュ**: よくある質問は結果をキャッシュ
- **鮮度**: 文書が更新されたら再インデックス
- **セキュリティ**: テナントごとにベクトル空間を分離
- **監査ログ**: 質問と回答を保存して改善に活用

> [!WARNING]
> 会社の機密文書を OpenAI の API に送るのは要確認。**プライベート LLM**（Azure OpenAI、AWS Bedrock、自前ホスト）も選択肢に。

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : 埋め込みと類似度検索の基本
    Week 2 : pgvector でローカル RAG
    Week 3 : PDF を読むボット作成
    Week 4 : Next.js に組み込む
    Month 2 : Re-ranking : Hybrid Search
    Month 3 : 評価指標で改善サイクル
\`\`\`

## よくある誤解

<details>
<summary>ファインチューニングと同じ</summary>

違います。RAG は外付けメモリ、ファインチューニングはモデル自体を変える。目的が別。
</details>

<details>
<summary>ベクトル DB がないと RAG できない</summary>

小規模ならインメモリや SQLite + pgvector でも十分。
</details>

<details>
<summary>「精度は LLM 次第」</summary>

むしろチャンキングと検索戦略で精度の大半が決まります。
</details>

## まとめ

- RAG は「外付けメモリ」で LLM を賢くする
- 埋め込み → DB → 検索 → 生成の4ステップ
- チャンキングと Re-ranking がカギ
- 評価指標で改善していく

> [!IMPORTANT]
> RAG は 2026 年現在、業務 AI の**事実上の標準**です。社内ナレッジ、カスタマーサポート、リサーチ、どんな場面でも応用が効きます。一度自分で組むと、他のサービスを見る目が変わります。ハンズオンから始めて、実践投入まで一気に駆け抜けていきましょう。

### 参考リソース

- [LangChain JS Docs](https://js.langchain.com/docs/)
- [LlamaIndex TS](https://ts.llamaindex.ai/)
- [Pinecone Learning Center](https://www.pinecone.io/learn/)
- [pgvector](https://github.com/pgvector/pgvector)
`,
  },
  {
    title: 'AIエージェント入門 — LLMが「考えて動く」世界の歩き方',
    slug: 'ai-agent-introduction',
    tags: ['AI', 'エージェント', 'LLM', 'MCP'],
    content: `# AIエージェント入門 — LLMが「考えて動く」世界の歩き方

## はじめに

2024〜2026年、AI の世界で一気に熱を帯びた言葉があります。それが **AI エージェント**。

> 「Claude Code が勝手にファイル読んで、勝手にコード書いて、勝手にテスト走らせている」
> 「Devin というエンジニアを名乗る AI が登場した」
> 「Cursor / Cline がまるで同僚のように動く」

これ全部、エージェントです。チャットボットの次の進化形。

> [!NOTE]
> この記事は「LLM は使うけど、エージェントって何が違うの？」という方向けです。実装の細部より、**エージェントの仕組みと限界**を掴むことを目指します。

## TL;DR

- エージェント = 目的を与えると、自分で計画して、ツールを使って、結果を見て、次を考える AI
- ReAct（Reasoning + Acting）が基本パターン
- 構成要素: LLM / メモリ / ツール / プランニング
- MCP が業界標準になりつつある
- Single-Agent と Multi-Agent、目的で使い分け
- 暴走リスクあり、ガードレール必須
- 2026年現在、コーディング・調査・顧客対応で実用段階

## 目次

- エージェントとは
- チャットボットとの違い
- ReAct パターン
- エージェントの構成要素
- Single-Agent vs Multi-Agent
- フレームワーク
- Function Calling / Tool Use
- MCP（Model Context Protocol）
- 実例: コーディングエージェント
- 実例: 調査エージェント
- ハンズオン: 天気 × 予定エージェント
- 暴走リスクとガードレール
- 2026年の業界動向
- 学習ロードマップ
- まとめ

## エージェントとは

エージェントは「目的を与えられると、それを達成するために自律的に行動する AI」です。

\`\`\`mermaid
graph LR
    U[ユーザー] -->|目的| A[エージェント]
    A -->|観察| E[環境]
    E -->|結果| A
    A -->|行動| E
    A -->|報告| U
\`\`\`

## チャットボットとの違い

| 項目 | チャットボット | エージェント |
|---|---|---|
| 対話 | 1問1答 | 複数ステップの思考 |
| ツール | 使わない | 使う |
| 計画 | なし | 立てて実行 |
| 結果判断 | なし | 自分で評価 |

「秘書」と「新人社員」くらい違います。

## ReAct パターン

Reasoning（思考） + Acting（行動）のループ。

\`\`\`
Thought: 天気を調べる必要がある
Action: weather_api("Tokyo")
Observation: 晴れ、最高25℃
Thought: 次に予定を確認しよう
Action: calendar_api("today")
Observation: 15時に会議
Thought: 揃ったので回答を作成
Answer: 今日は晴れで25℃、15時に会議があります。
\`\`\`

このループを LLM 自身が回します。

## エージェントの構成要素

1. **LLM（脳）** — 意思決定
2. **メモリ** — 短期記憶（会話履歴）と長期記憶（ベクトル DB）
3. **ツール** — API、関数、外部システムへのアクセス
4. **プランニング** — タスクを分解して実行順序を決める

## Single-Agent vs Multi-Agent

| 方式 | 特徴 | 例 |
|---|---|---|
| Single | 1人で全部やる | Claude Code |
| Multi | 複数エージェントが役割分担 | CrewAI、AutoGen |

Multi は「**専門家チーム**」を作れる一方、調整コストが高い。

\`\`\`mermaid
graph TB
    U[ユーザー] --> P[プランナー]
    P --> R[リサーチャー]
    P --> C[ライター]
    P --> E[編集者]
    R --> P
    C --> E
    E --> U
\`\`\`

## フレームワーク

| 名前 | 特徴 |
|---|---|
| LangChain / LangGraph | Python/TS 両対応、業界最古参 |
| CrewAI | マルチエージェントに特化 |
| AutoGen | Microsoft、マルチエージェント |
| Mastra | TS 専用、モダン、商用 |
| Vercel AI SDK | Next.js 親和性 |
| OpenAI Agents SDK | 公式、シンプル |

## Function Calling / Tool Use

LLM に「使える関数の一覧」を教える仕組み。

\`\`\`json
{
  "name": "get_weather",
  "description": "指定した都市の現在の天気を取得",
  "parameters": {
    "type": "object",
    "properties": {
      "city": { "type": "string" }
    },
    "required": ["city"]
  }
}
\`\`\`

LLM は「このツールを呼べ」と判断し、こちらが実行、結果を返す、という協力プレーです。

## MCP（Model Context Protocol）

Anthropic が提案した**ツール連携の業界標準**。

- エージェントとツールの間を標準化
- ツールを MCP サーバーとして公開すれば、Claude / Cursor / Kiro など対応クライアントから使える
- 2026 年、デファクトスタンダード候補

> [!TIP]
> 「USB-C for AI」とも呼ばれています。

## 実例: コーディングエージェント

- **Claude Code** — Anthropic 公式、ターミナル特化
- **Cursor** — エディタ統合、AI ペアプロ
- **Cline** — VS Code 拡張、OSS
- **Devin** — 自律エンジニア、Cognition 社
- **Kiro** — 仕様書駆動の開発エージェント

やってくれること:

- ファイルを読む・書く
- テストを実行
- 差分を確認
- Git 操作
- 継続的に自己修正

## 実例: 調査エージェント

- **Perplexity** — 質問すると Web を検索して出典付きで答える
- **Consensus** — 学術論文に特化
- **You.com** — AI 検索のパイオニア

これらは**検索ツール**を内蔵した調査特化型エージェント。

## ハンズオン: 天気 × 予定エージェント

概念コード（疑似）:

\`\`\`ts
const tools = [
  {
    name: 'get_weather',
    description: '指定都市の天気',
    run: async (city: string) => fetchWeather(city),
  },
  {
    name: 'list_events',
    description: '今日の予定一覧',
    run: async () => fetchCalendar(),
  },
  {
    name: 'send_plan',
    description: '計画をメールで送る',
    run: async (text: string) => sendEmail(text),
  },
];

const result = await agent.run({
  goal: '今日の天気と予定を踏まえて、最適な一日の計画を立ててメールで送って',
  tools,
});
\`\`\`

エージェントは順番に天気 → 予定 → 計画 → 送信を自分で決めて動きます。

## 暴走リスクとガードレール

自律で動くからこそ怖い。

- **ループ暴走**: 同じツールを延々呼び続ける
- **費用爆発**: 1 セッションで数千円の API 課金
- **誤操作**: ファイル削除、本番 DB 破壊
- **情報漏洩**: 機密データを外部 API に送る

### 対策

- **回数制限**（max_iterations）
- **コスト上限**
- **書き込み系は人間承認**
- **サンドボックス実行**
- **監査ログ**

> [!WARNING]
> 本番サーバーに rm -rf する権限を与えない。徹底的に**最小権限**で。

## 2026年の業界動向

- **OpenAI / Anthropic / Google** がエージェント機能を強化
- **MCP が標準**として浸透
- **コーディングエージェント**は実用段階、毎月のように新製品
- **業務 AI エージェント**が登場（営業、カスタマーサポート）
- 個人レベルでも「**自分専用エージェント**」を作る時代

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : ReAct 論文を読む : Function Calling 体験
    Week 2 : 小さなエージェント（ツール1つ）
    Week 3 : ツールを増やしてタスク分解
    Week 4 : LangGraph / Mastra でワークフロー化
    Month 2 : MCP サーバー作成
    Month 3 : マルチエージェント : CrewAI / AutoGen
\`\`\`

## まとめ

- エージェントは「自律的に動く AI」
- ReAct と Tool Use が基本
- 強力だが、ガードレール必須
- 2026 年現在、急速に実用化中

> [!IMPORTANT]
> エージェントは「AI を使う」から「AI と働く」への転換点です。あなたが今学ぶ Web 開発スキルは、そのままエージェント時代でも通用します。むしろエージェントを**使いこなす側**に立てるよう、今から触れておきましょう。

### 参考リソース

- [Anthropic Agents Guide](https://docs.anthropic.com/en/docs/build-with-claude/agents)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [MCP 公式サイト](https://modelcontextprotocol.io/)
- 論文「ReAct: Synergizing Reasoning and Acting in Language Models」
`,
  },
  {
    title: 'LangChain/Mastraで作るAIアプリ — TypeScriptでエージェントを組む',
    slug: 'build-ai-app-with-langchain-mastra',
    tags: ['AI', 'LangChain', 'Mastra', 'TypeScript'],
    content: `# LangChain/Mastraで作るAIアプリ — TypeScriptでエージェントを組む

## はじめに

「AI アプリ作ろう」と思い立ったときの最初の壁。

> 「OpenAI API を叩くのはできた。でも、会話履歴・ツール・ベクトル DB まで合わせると、ぐちゃぐちゃ」
> 「Python の方が情報多くて、TypeScript だと例が少ない」

TypeScript で AI アプリを組むなら、**LangChain**・**Mastra**・**Vercel AI SDK** の3択が主流。それぞれ個性があります。

> [!NOTE]
> この記事は「LLM API を個別には叩ける、次に組み合わせたアプリを作りたい」方向けです。フレームワーク比較と、**TypeScript での実装スタイル**を掴むのが目的。

## TL;DR

- LangChain: 総合デパート、機能豊富、学習コスト中
- Mastra: TypeScript 専用、モダン設計、DX 重視
- Vercel AI SDK: Next.js 親和性、UI ストリーミング特化
- 用途: LangChain = 柔軟、Mastra = 型安全、Vercel = フロント統合
- 共通要素: Chain、Memory、Tool、Streaming、Observability

## 目次

- 3つのフレームワーク比較
- LangChain の基本
- LCEL（LangChain Expression Language）
- Mastra の基本
- Vercel AI SDK の基本
- メモリ管理
- ストリーミング応答
- LLM プロバイダの切り替え
- ハンズオン: チャットボット
- ハンズオン: ツール使用エージェント
- デプロイ
- オブザーバビリティ
- 比較まとめ
- 学習ロードマップ
- まとめ

## 3つのフレームワーク比較

| 項目 | LangChain | Mastra | Vercel AI SDK |
|---|---|---|---|
| 登場 | 2022 | 2024 | 2023 |
| 主軸 | 総合 | エージェント | UI |
| 型安全 | 中 | 高 | 高 |
| DX | 中 | 高 | 高 |
| エコシステム | 広大 | 成長中 | Next.js 特化 |

## LangChain の基本

\`\`\`ts
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

const llm = new ChatOpenAI({ model: 'gpt-4o-mini' });
const prompt = PromptTemplate.fromTemplate(
  'あなたは丁寧な日本語ライターです。{topic} について200字で説明してください。'
);

const chain = prompt.pipe(llm);
const result = await chain.invoke({ topic: 'Next.js' });
console.log(result.content);
\`\`\`

## LCEL（LangChain Expression Language）

\`.pipe()\` で処理を繋げる書き方。

\`\`\`ts
import { StringOutputParser } from '@langchain/core/output_parsers';

const chain = prompt.pipe(llm).pipe(new StringOutputParser());
const text = await chain.invoke({ topic: 'React' });
\`\`\`

関数合成に慣れていれば直感的、慣れていないと最初は戸惑います。

## Mastra の基本

\`\`\`ts
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

const writer = new Agent({
  name: 'writer',
  instructions: 'あなたは丁寧な日本語ライターです。',
  model: openai('gpt-4o-mini'),
});

const mastra = new Mastra({ agents: { writer } });

const result = await mastra.getAgent('writer').generate(
  'Next.js について200字で説明して'
);
console.log(result.text);
\`\`\`

**型でインテリセンスがガンガン効く**のが Mastra のいいところ。

## Vercel AI SDK の基本

\`\`\`ts
import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// 1回の生成
const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Next.js の強みを3つ',
});

// ストリーミング
const result = await streamText({
  model: openai('gpt-4o-mini'),
  prompt: 'React 19 の新機能を教えて',
});
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
\`\`\`

**フロントエンドのストリーミング体験**が圧倒的に楽。

## メモリ管理

会話履歴を保持する仕組み。

\`\`\`ts
// LangChain
import { BufferMemory } from 'langchain/memory';
const memory = new BufferMemory();

// Mastra
import { Memory } from '@mastra/memory';
const memory = new Memory();

// Vercel AI SDK では messages 配列を自分で管理
\`\`\`

長期記憶には**ベクトル DB**、短期記憶には**会話バッファ**が定番。

## ストリーミング応答

ChatGPT 風の「文字が流れる」体験は、**サーバーからの Server-Sent Events / ReadableStream** で実現。

### Next.js + Vercel AI SDK の例

\`\`\`ts
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });
  return result.toDataStreamResponse();
}
\`\`\`

\`\`\`tsx
// app/chat/page.tsx
'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <b>{m.role}:</b> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
\`\`\`

これだけで ChatGPT 風 UI の完成。

## LLM プロバイダの切り替え

| プロバイダ | モデル例 |
|---|---|
| OpenAI | gpt-5 / gpt-4o / gpt-4o-mini |
| Anthropic | claude-sonnet / claude-opus |
| Google | gemini-2.0-flash / gemini-3-pro |
| Mistral | mistral-large |
| ローカル | Ollama / LM Studio |

フレームワークのおかげで**モデルを差し替えるだけ**で切り替えられます。

## ハンズオン: チャットボット

### Mastra × Next.js

\`\`\`ts
// lib/agents.ts
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

export const helper = new Agent({
  name: 'helper',
  instructions: 'あなたは初心者向けエンジニアのメンターです。',
  model: openai('gpt-4o-mini'),
});
\`\`\`

\`\`\`ts
// app/api/chat/route.ts
import { helper } from '@/lib/agents';

export async function POST(req: Request) {
  const { message } = await req.json();
  const stream = await helper.stream(message);
  return stream.toDataStreamResponse();
}
\`\`\`

## ハンズオン: ツール使用エージェント

Mastra でツールを定義:

\`\`\`ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const weatherTool = createTool({
  id: 'get_weather',
  description: '指定都市の天気を取得',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ context }) => {
    return { temp: 22, condition: '晴れ', city: context.city };
  },
});

const agent = new Agent({
  name: 'assistant',
  instructions: 'ツールを使って質問に答えてください。',
  model: openai('gpt-4o-mini'),
  tools: { weatherTool },
});

const res = await agent.generate('東京の天気は？');
\`\`\`

LLM が自動でツールを呼び、結果を踏まえて答えを返します。

## デプロイ

| 構成 | 向き先 |
|---|---|
| Next.js + Vercel AI SDK | Vercel / Netlify |
| Mastra | Vercel / Cloudflare Workers / Node.js サーバー |
| LangChain | どこでも動く、Docker 化が王道 |

> [!TIP]
> ストリーミングは **Edge ランタイム**と相性抜群。

## オブザーバビリティ

AI アプリは「なぜこう答えたか」がブラックボックスになりがち。

- **Langfuse** — OSS、ステップごとの可視化
- **LangSmith** — LangChain 公式
- **Arize / Phoenix** — トレース、評価

本番では**必ず**入れましょう。

## 比較まとめ

| 観点 | 推奨 |
|---|---|
| Next.js で ChatGPT 風 UI | Vercel AI SDK |
| TypeScript で型安全にエージェント | Mastra |
| 機能の広さ、既存情報の多さ | LangChain |
| Python との互換性 | LangChain |
| 最先端の TS DX | Mastra |

## 学習ロードマップ

\`\`\`mermaid
timeline
    Week 1 : OpenAI API 単独呼び出し
    Week 2 : Vercel AI SDK で chat UI
    Week 3 : Mastra でエージェント : ツール1つ
    Week 4 : メモリ : 会話履歴保持
    Month 2 : RAG 統合 : ベクトル DB
    Month 3 : Langfuse でトレース : 評価
\`\`\`

## まとめ

- TypeScript で AI アプリは十分組める
- 用途で LangChain / Mastra / Vercel AI SDK を選ぶ
- ストリーミング UI は Vercel AI SDK が最短
- 型安全エージェントなら Mastra
- オブザーバビリティを最初から入れる

> [!IMPORTANT]
> AI アプリ開発は、フロントエンドとバックエンド両方の知識が活きる最高の舞台です。Web 開発で積んできたあらゆるスキルがそのまま武器になります。あなたが今まで学んだものは無駄になりません。むしろ AI 時代に一番ハマります。一緒に組んでいきましょう。

### 参考リソース

- [LangChain JS](https://js.langchain.com/docs/)
- [Mastra Docs](https://mastra.ai/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Langfuse](https://langfuse.com/)
`,
  },
];
