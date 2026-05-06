import { notFound } from 'next/navigation';
import { heroSectionChapter } from '@/lib/steps/hero-section';
import { cafeCh0FirstHtmlChapter } from '@/lib/steps/cafe-ch0-05-first-html';
import { LearnWorkspace } from '@/components/learn/LearnWorkspace';
import {
  ReadingWorkspace,
  type ReadingChapter,
} from '@/components/learn/ReadingWorkspace';
import type { Chapter } from '@/types/step';
import { CafeCh0VsCodeSetup } from '@/components/learn/readings/CafeCh0VsCodeSetup';

/** コードエディタ付きの実習チャプター */
const practiceChapters = {
  'hero-section': heroSectionChapter,
  'cafe-ch0-05-first-html': cafeCh0FirstHtmlChapter,
} as const satisfies Record<string, Chapter>;

/** 実習コードを伴わない読み物チャプター */
const readingChapters = {
  'cafe-ch0-01-vscode-setup': {
    id: 'cafe-ch0-01-vscode-setup',
    title: 'VS Code のセットアップ',
    body: <CafeCh0VsCodeSetup />,
  },
} as const satisfies Record<string, ReadingChapter>;

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

  const practiceChapter =
    practiceChapters[chapterId as keyof typeof practiceChapters];
  if (practiceChapter) {
    return (
      <LearnWorkspace
        chapter={practiceChapter}
        stageId={stageId ?? null}
        curriculumSlug={curriculumSlug ?? null}
      />
    );
  }

  const readingChapter =
    readingChapters[chapterId as keyof typeof readingChapters];
  if (readingChapter) {
    return (
      <ReadingWorkspace
        chapter={readingChapter}
        stageId={stageId ?? null}
        curriculumSlug={curriculumSlug ?? null}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return [
    ...Object.keys(practiceChapters),
    ...Object.keys(readingChapters),
  ].map((chapterId) => ({ chapterId }));
}
