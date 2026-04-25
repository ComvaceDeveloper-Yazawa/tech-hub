import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

const RequestSchema = z.object({
  action: z.enum([
    'proofread',
    'summarize',
    'translate',
    'rewrite',
    'generateTitle',
    'suggestTags',
  ]),
  text: z.string().min(1).max(10000),
  targetLang: z.enum(['en', 'ja']).optional(),
  articleContext: z.string().max(20000).optional(),
});

// 簡易レートリミット（メモリ内、サーバ再起動でリセット）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// アクション別プロンプト
function buildPrompt(
  action: z.infer<typeof RequestSchema>['action'],
  targetLang?: string
): string {
  switch (action) {
    case 'proofread':
      return '日本語の技術文書として、誤字脱字・不自然な表現を修正してください。Markdownの記法は維持してください。修正後のテキストのみを出力してください。';
    case 'summarize':
      return '以下のテキストを3文以内で要約してください。';
    case 'translate':
      return `以下のテキストを${targetLang === 'en' ? '英語' : '日本語'}に翻訳してください。Markdownの記法は維持してください。翻訳後のテキストのみを出力してください。`;
    case 'rewrite':
      return '以下の文章を、より明快で読みやすい技術文書に書き直してください。Markdownの記法は維持してください。書き直し後のテキストのみを出力してください。';
    case 'generateTitle':
      return '以下の記事内容に最適なタイトル候補を3つ、JSON配列形式で返してください。例: ["タイトル1", "タイトル2", "タイトル3"]。JSON配列のみを出力してください。';
    case 'suggestTags':
      return '以下の記事内容から、技術ブログのタグを5つ提案してください。JSON配列形式で返してください。例: ["TypeScript", "React", "Next.js"]。JSON配列のみを出力してください。';
  }
}

// コスト最適化: アクション別モデル選択
function selectModel(action: z.infer<typeof RequestSchema>['action']): string {
  switch (action) {
    case 'summarize':
    case 'generateTitle':
    case 'suggestTags':
      return 'google/gemini-flash-1.5';
    default:
      return 'google/gemini-flash-1.5';
  }
}

export async function POST(req: NextRequest) {
  // 1. 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  // 2. レートリミットチェック
  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: 'リクエスト数の上限に達しました。1分後に再試行してください。' },
      { status: 429 }
    );
  }

  // 3. リクエスト検証
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'リクエストの形式が不正です' },
      { status: 400 }
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '入力値が不正です', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, text, targetLang, articleContext } = parsed.data;

  // 4. AI API呼び出し
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI機能が設定されていません' },
      { status: 500 }
    );
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        'X-Title': 'Markdown Editor AI Assist',
      },
    });
    const systemPrompt = buildPrompt(action, targetLang);
    const userContent =
      action === 'generateTitle' || action === 'suggestTags'
        ? (articleContext ?? text)
        : text;

    const completion = await openai.chat.completions.create({
      model: selectModel(action),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content ?? '';
    const usage = completion.usage;

    return NextResponse.json({
      result,
      usage: usage
        ? {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
          }
        : undefined,
    });
  } catch (err) {
    console.error('[AI assist] API呼び出し失敗:', err);
    // APIキー等の機密情報を漏洩させない
    return NextResponse.json(
      { error: 'AI処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
