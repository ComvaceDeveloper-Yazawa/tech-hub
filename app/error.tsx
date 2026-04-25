'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-foreground text-2xl font-bold">
        エラーが発生しました
      </h2>
      <p className="text-muted-foreground max-w-md text-sm">
        ページの読み込み中に問題が発生しました。しばらく経ってから再度お試しください。
      </p>
      {error.digest && (
        <p className="text-muted-foreground font-mono text-xs">
          エラーID: {error.digest}
        </p>
      )}
      <Button onClick={reset}>再試行</Button>
    </div>
  );
}
