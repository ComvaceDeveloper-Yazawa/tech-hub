'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/contexts/loading/LoadingContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      showLoading();
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        hideLoading();
        setError(authError.message);
        return;
      }

      // hideLoading は呼ばない — ページ遷移完了後に
      // 遷移先のレイアウトがマウントされた時点で LoadingContext がリセットされる。
      // RpgLoadingScreen 側で最低3秒表示 + isLoading が false になるまで待つ。
      router.push('/articles');
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="animate-fade-in-up w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="gradient-text inline-block text-2xl font-bold">
            ログイン
          </h1>
        </div>

        <div className="glow-card border-border bg-card/80 rounded-lg border p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'ログイン中...' : 'ログイン'}
            </Button>
          </form>

          <div className="mt-4 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('admin1234');
              }}
            >
              管理者情報を入力
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
