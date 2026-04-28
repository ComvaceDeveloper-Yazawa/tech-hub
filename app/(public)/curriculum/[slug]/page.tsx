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
    <div className="mx-auto max-w-lg px-4 py-6">
      <Link
        href="/curriculum"
        className="mb-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-sm text-green-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
      >
        ← もどる
      </Link>
      <h1 className="mb-4 text-center text-xl font-bold text-white">
        {curriculum.title}
      </h1>
      <StageMapClient stages={stages} avatarConfig={avatarConfig} />
    </div>
  );
}
