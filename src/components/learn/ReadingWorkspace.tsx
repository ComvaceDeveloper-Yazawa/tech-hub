'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { completeStage } from '@/presentation/actions/curriculum/completeStage';

export type ReadingChapter = {
  id: string;
  title: string;
  /** 読み物の中身。React ノードで受け取る（各カリキュラム側で組み立てる） */
  body: React.ReactNode;
};

type ReadingWorkspaceProps = {
  chapter: ReadingChapter;
  /** 呼び出し元のステージ ID（カリキュラム経由の場合のみ） */
  stageId: string | null;
  /** 呼び出し元のカリキュラム slug */
  curriculumSlug: string | null;
};

/**
 * 実習コードを伴わない座学レッスンを表示する読み物ワークスペース。
 * 「完了する」ボタンで進捗を記録し、ステージマップに戻る。
 */
export function ReadingWorkspace({
  chapter,
  stageId,
  curriculumSlug,
}: ReadingWorkspaceProps) {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = useCallback(async () => {
    setIsFinishing(true);
    try {
      if (stageId) {
        const result = await completeStage(stageId);
        if (!result.success) {
          toast.error(result.error ?? 'レッスンの完了に失敗しました');
          setIsFinishing(false);
          return;
        }
      }
      const destination = curriculumSlug
        ? `/curriculum/${curriculumSlug}`
        : '/curriculum';
      router.push(destination);
      router.refresh();
    } catch {
      toast.error('レッスンの完了に失敗しました');
      setIsFinishing(false);
    }
  }, [stageId, curriculumSlug, router]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <h1 className="text-sm font-semibold text-slate-700">
          {chapter.title}
        </h1>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {chapter.body}

        <div className="mt-10 border-t border-slate-200 pt-6">
          <button
            onClick={handleFinish}
            disabled={isFinishing}
            className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFinishing ? '完了処理中...' : 'レッスンを完了する'}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            完了するとステージマップに戻ります
          </p>
        </div>
      </div>
    </div>
  );
}
