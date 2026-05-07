import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">アクセス権限がありません</h1>
        <p className="text-muted-foreground text-lg">
          このページを表示するには管理者権限が必要です。
        </p>
      </div>

      <p className="text-muted-foreground text-sm">
        3秒後にトップページへ移動します。
      </p>

      <Link href="/">
        <Button>トップページへ戻る</Button>
      </Link>

      {/* meta refresh による自動リダイレクト */}
      <meta httpEquiv="refresh" content="3;url=/" />
    </div>
  );
}
