import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurriculums } from '@/presentation/actions/curriculum/getCurriculums';
import { CurriculumList } from '@/components/features/curriculum/CurriculumList';

export default async function CurriculumListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const curriculums = await getCurriculums();

  const totalStages = curriculums.reduce((sum, c) => sum + c.total_stages, 0);
  const completedStages = curriculums.reduce(
    (sum, c) => sum + c.completed_stages,
    0
  );
  const overallProgress =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      {/* ヘッダー */}
      <header className="mb-10 md:mb-14">
        <p className="text-muted-foreground mb-2 font-mono text-[10px] uppercase tracking-[0.3em] md:text-xs">
          Frontend Engineer Curriculum
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          未経験からフロントエンドエンジニアへ
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm md:text-base">
          章ごとに段階的にスキルを身につけ、実務で通用するフロントエンド開発力を育てるカリキュラムです。
        </p>

        {/* 全体進捗 */}
        {totalStages > 0 && (
          <div className="border-border bg-card mt-6 rounded-xl border p-4 md:p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">全体の進捗</span>
              <span className="text-muted-foreground font-mono tabular-nums">
                {completedStages} / {totalStages} ステージ ({overallProgress}%)
              </span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* 章リスト */}
      {curriculums.length === 0 ? (
        <div className="border-border bg-card rounded-xl border py-16 text-center">
          <p className="text-muted-foreground text-sm">
            カリキュラムがまだ公開されていません
          </p>
        </div>
      ) : (
        <CurriculumList curriculums={curriculums} />
      )}
    </div>
  );
}
