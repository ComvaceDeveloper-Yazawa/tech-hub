import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurriculumBySlug } from '@/presentation/actions/curriculum/getCurriculumBySlug';
import { getStagesWithProgress } from '@/presentation/actions/curriculum/getStagesWithProgress';
import { getProfile } from '@/presentation/actions/avatar';
import { StageMapClient } from './StageMapClient';
import { ParallaxBackground } from '@/components/features/curriculum/ParallaxBackground';

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
  const completedCount = stages.filter((s) => s.status === 'completed').length;

  return (
    <div className="relative min-h-screen">
      <ParallaxBackground />

      <div className="relative z-10 mx-auto max-w-md px-4 py-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/curriculum"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-black/40 text-amber-300 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/60"
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
            <h1 className="text-lg font-bold text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {curriculum.title}
            </h1>
            <p className="text-xs text-amber-300/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {completedCount} / 10 完了
            </p>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mb-8 overflow-hidden rounded-full border border-amber-400/20 bg-black/30 shadow-inner backdrop-blur-sm">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.4)] transition-all duration-500"
            style={{
              width: `${(completedCount / 10) * 100}%`,
            }}
          />
        </div>

        {/* ステージマップ */}
        <StageMapClient stages={stages} avatarConfig={avatarConfig} />

        <div className="h-32" />
      </div>
    </div>
  );
}
