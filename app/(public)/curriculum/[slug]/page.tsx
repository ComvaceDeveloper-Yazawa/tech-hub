import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurriculumBySlug } from '@/presentation/actions/curriculum/getCurriculumBySlug';
import { getStagesWithProgress } from '@/presentation/actions/curriculum/getStagesWithProgress';
import { getProfile } from '@/presentation/actions/avatar';
import { StageMapClient } from './StageMapClient';

interface StageMapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StageMapPage({ params }: StageMapPageProps) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const curriculum = await getCurriculumBySlug(slug);
  if (!curriculum) {
    notFound();
  }

  const [stages, profile] = await Promise.all([
    getStagesWithProgress(curriculum.id),
    getProfile(),
  ]);

  const avatarConfig = profile?.avatarConfig ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/curriculum"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100"
            aria-label="戻る"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">
              {curriculum.title}
            </h1>
            <p className="text-xs text-slate-500">
              {stages.filter((s) => s.status === 'completed').length} / 10 完了
            </p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-8 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
            style={{
              width: `${(stages.filter((s) => s.status === 'completed').length / 10) * 100}%`,
            }}
          />
        </div>

        {/* ステージマップ */}
        <StageMapClient stages={stages} avatarConfig={avatarConfig} />
      </div>
    </div>
  );
}
