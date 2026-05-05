import { notFound } from 'next/navigation';
import { heroSectionChapter } from '@/lib/steps/hero-section';
import { LearnWorkspace } from '@/components/learn/LearnWorkspace';

const chapters = {
  'hero-section': heroSectionChapter,
} as const;

type Params = { chapterId: string };
type SearchParams = { stageId?: string; curriculumSlug?: string };

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { chapterId } = await params;
  const { stageId, curriculumSlug } = await searchParams;
  const chapter = chapters[chapterId as keyof typeof chapters];

  if (!chapter) {
    notFound();
  }

  return (
    <LearnWorkspace
      chapter={chapter}
      stageId={stageId ?? null}
      curriculumSlug={curriculumSlug ?? null}
    />
  );
}

export function generateStaticParams() {
  return Object.keys(chapters).map((chapterId) => ({ chapterId }));
}
