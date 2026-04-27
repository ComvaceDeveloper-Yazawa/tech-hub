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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/curriculum"
        className="text-muted-foreground mb-4 inline-block text-sm hover:underline"
      >
        ← カリキュラム一覧に戻る
      </Link>
      <h1 className="mb-6 text-2xl font-bold">{curriculum.title}</h1>
      <StageMapClient stages={stages} avatarConfig={avatarConfig} />
    </div>
  );
}
