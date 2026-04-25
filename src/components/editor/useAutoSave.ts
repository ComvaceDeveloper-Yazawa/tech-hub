'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseAutoSaveResult {
  status: SaveStatus;
  lastSavedAt: Date | null;
  hasDraft: boolean;
  restoreDraft: () => string | null;
  discardDraft: () => void;
  savedContent: string | null;
}

interface DraftData {
  content: string;
  savedAt: string;
  version: 1;
}

const MAX_CONTENT_SIZE = 5 * 1024 * 1024; // 5MB

export function useAutoSave(
  articleId: string,
  content: string,
  options: { debounceMs?: number; storageKeyPrefix?: string } = {}
): UseAutoSaveResult {
  const { debounceMs = 2000, storageKeyPrefix = 'markdown-draft' } = options;
  const storageKey = `${storageKeyPrefix}-${articleId}`;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [savedContent, setSavedContent] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  // マウント時の復元確認
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as DraftData;
        if (data.version === 1 && typeof data.content === 'string') {
          setSavedContent(data.content);
          setLastSavedAt(new Date(data.savedAt));
        }
      }
    } catch (err) {
      console.warn('[useAutoSave] 下書き読み込み失敗:', err);
    } finally {
      initialLoadDone.current = true;
    }
  }, [storageKey]);

  const save = useMemo(
    () =>
      debounce((text: string) => {
        if (typeof window === 'undefined') return;
        if (text.length > MAX_CONTENT_SIZE) {
          console.warn('[useAutoSave] コンテンツが大きすぎます');
          setStatus('error');
          return;
        }
        setStatus('saving');
        try {
          const data: DraftData = {
            content: text,
            savedAt: new Date().toISOString(),
            version: 1,
          };
          try {
            localStorage.setItem(storageKey, JSON.stringify(data));
          } catch (quotaErr) {
            // QuotaExceededError: 古い下書きを削除してリトライ
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && k.startsWith(storageKeyPrefix) && k !== storageKey) {
                keysToRemove.push(k);
              }
            }
            keysToRemove.forEach((k) => localStorage.removeItem(k));
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.warn(
              '[useAutoSave] 古い下書きを削除してリトライしました',
              quotaErr
            );
          }
          setLastSavedAt(new Date());
          setStatus('saved');
          setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
          console.error('[useAutoSave] 保存失敗:', err);
          setStatus('error');
        }
      }, debounceMs),
    [storageKey, storageKeyPrefix, debounceMs]
  );

  useEffect(() => {
    if (!initialLoadDone.current) return;
    save(content);
  }, [content, save]);

  useEffect(() => {
    return () => {
      save.cancel();
    };
  }, [save]);

  const restoreDraft = useCallback(() => savedContent, [savedContent]);

  const discardDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(storageKey);
    setSavedContent(null);
    setLastSavedAt(null);
  }, [storageKey]);

  return {
    status,
    lastSavedAt,
    hasDraft: savedContent !== null,
    restoreDraft,
    discardDraft,
    savedContent,
  };
}
