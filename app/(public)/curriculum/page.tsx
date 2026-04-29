import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurriculums } from '@/presentation/actions/curriculum/getCurriculums';
import { BookShelf } from '@/components/features/curriculum/BookShelf';

export default async function CurriculumListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const curriculums = await getCurriculums();

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #2a1f14 0%, #1a1520 50%, #0f0d12 100%)',
      }}
    >
      {/* 背景の雰囲気 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(180,120,50,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(120,80,30,0.08)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%23fff' stroke-width='.5'/%3E%3C/svg%3E\")",
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* タイトル */}
      <div className="relative mb-12 text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-500/50">
          Tech Hub
        </p>
        <h1
          className="text-4xl font-black text-amber-100/90 md:text-5xl"
          style={{
            fontFamily: 'serif',
            textShadow: '0 0 40px rgba(180,130,60,0.3)',
          }}
        >
          冒険の書
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600/40" />
          <span className="text-xs text-amber-600/40">✦</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600/40" />
        </div>
      </div>

      {/* 本棚 */}
      <div className="relative">
        {curriculums.length === 0 ? (
          <p className="text-amber-300/40">カリキュラムがありません</p>
        ) : (
          <BookShelf curriculums={curriculums} />
        )}
      </div>

      {/* ヒント */}
      <p className="mt-8 text-xs text-amber-300/30">
        本をクリックして冒険を始めよう
      </p>
    </div>
  );
}
