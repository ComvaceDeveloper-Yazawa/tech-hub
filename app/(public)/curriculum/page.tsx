import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurriculums } from '@/presentation/actions/curriculum/getCurriculums';
import { CurriculumWorldBackground } from '@/components/features/curriculum/CurriculumWorldBackground';

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
    <div className="relative min-h-screen overflow-hidden bg-[#1a0f05]">
      {/* 3D背景 */}
      <CurriculumWorldBackground />

      {/* コンテンツ */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* 上部タイトルエリア */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-16">
          {/* サブタイトル */}
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-amber-300/70">
            Tech Hub
          </p>

          {/* メインタイトル */}
          <h1
            className="mb-2 text-center text-5xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(251,191,36,0.4)] md:text-7xl"
            style={{
              textShadow:
                '0 0 60px rgba(251,191,36,0.3), 0 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'serif',
            }}
          >
            カリキュラム
          </h1>

          {/* 装飾ライン */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-sm text-amber-400/60">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          {/* カリキュラムカード */}
          {curriculums.length === 0 ? (
            <p className="text-white/50">カリキュラムがありません</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-5">
              {curriculums.map((curriculum, i) => (
                <Link
                  key={curriculum.id}
                  href={`/curriculum/${curriculum.slug}`}
                  className="group relative"
                >
                  {/* カード */}
                  <div
                    className="relative w-72 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition-all duration-300 group-hover:border-amber-400/40 group-hover:bg-black/60 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* 番号バッジ */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-sm font-bold text-amber-300">
                        {i + 1}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
                    </div>

                    {/* タイトル */}
                    <h2 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-amber-200">
                      {curriculum.title}
                    </h2>

                    {/* 説明 */}
                    <p className="mb-4 text-sm leading-relaxed text-white/50">
                      {curriculum.description}
                    </p>

                    {/* 進捗 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-white/40">
                        <span>進捗</span>
                        <span>
                          {curriculum.completed_stages} /{' '}
                          {curriculum.total_stages}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500"
                          style={{
                            width:
                              curriculum.total_stages > 0
                                ? `${(curriculum.completed_stages / curriculum.total_stages) * 100}%`
                                : '0%',
                          }}
                        />
                      </div>
                    </div>

                    {/* ホバー時の矢印 */}
                    <div className="mt-4 flex items-center justify-end gap-1 text-xs text-amber-400/0 transition-all duration-300 group-hover:text-amber-400/80">
                      <span>冒険を始める</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 下部の霧グラデーション */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a0f05] to-transparent" />
      </div>
    </div>
  );
}
