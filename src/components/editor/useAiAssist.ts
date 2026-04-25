'use client';

import { useState, useCallback } from 'react';

export type AiAction =
  | 'proofread'
  | 'summarize'
  | 'translate'
  | 'rewrite'
  | 'generateTitle'
  | 'suggestTags';

export interface UseAiAssistResult {
  loading: boolean;
  error: string | null;
  execute: (params: {
    action: AiAction;
    text: string;
    targetLang?: 'en' | 'ja';
    articleContext?: string;
  }) => Promise<string | null>;
}

export function useAiAssist(): UseAiAssistResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (params: {
      action: AiAction;
      text: string;
      targetLang?: 'en' | 'ja';
      articleContext?: string;
    }): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ai/assist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          const message = data.error ?? `エラー: ${res.status}`;
          setError(message);
          return null;
        }
        const data = (await res.json()) as { result: string };
        return data.result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'AI処理に失敗しました';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, execute };
}
