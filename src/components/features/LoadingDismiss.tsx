'use client';

import { useEffect } from 'react';
import { useLoading } from '@/contexts/loading/LoadingContext';

/**
 * マウント時に hideLoading を呼ぶ。
 * Server Component のページに配置して、レンダリング完了を通知する。
 */
export function LoadingDismiss() {
  const { hideLoading } = useLoading();

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  return null;
}
