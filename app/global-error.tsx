'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-bold">エラーが発生しました</h2>
          <p className="max-w-md text-sm text-gray-500">
            ページの読み込み中に問題が発生しました。しばらく経ってから再度お試しください。
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-gray-400">
              エラーID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}
