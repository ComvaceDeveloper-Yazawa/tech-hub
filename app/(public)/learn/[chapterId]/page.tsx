import { notFound } from 'next/navigation';
import { heroSectionChapter } from '@/lib/steps/hero-section';
import { LearnWorkspace } from '@/components/learn/LearnWorkspace';

const chapters = {
  'hero-section': heroSectionChapter,
} as const;

type Params = { chapterId: string };

export default async function LearnPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { chapterId } = await params;
  const chapter = chapters[chapterId as keyof typeof chapters];

  if (!chapter) {
    notFound();
  }

  return <LearnWorkspace chapter={chapter} />;
}

export function generateStaticParams() {
  return Object.keys(chapters).map((chapterId) => ({ chapterId }));
}
