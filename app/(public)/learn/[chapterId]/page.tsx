import { notFound } from 'next/navigation';
import { backgroundImageChapter } from '@/lib/steps/background-image';
import { LearnWorkspace } from '@/components/learn/LearnWorkspace';

const chapters = {
  'background-image': backgroundImageChapter,
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
