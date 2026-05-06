'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { completeStage } from '@/presentation/actions/curriculum/completeStage';
import { BackToStageMapLink } from './BackToStageMapLink';

export type ReadingChapter = {
  id: string;
  title: string;
  /** 読み物の中身。React ノードで受け取る（各カリキュラム側で組み立てる） */
  body: React.ReactNode;
  /**
   * 完了条件。指定した場合、条件ごとのチェックボックスが表示され、
   * すべてチェックするまで完了ボタンは活性化しない。
   * 未指定または空配列の場合は従来どおり常に完了ボタンを押せる。
   */
  completionCriteria?: string[];
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

  const criteria = chapter.completionCriteria ?? [];
  const hasCriteria = criteria.length > 0;

  // 初期値: 全項目未チェック
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

  const allChecked = useMemo(() => {
    if (!hasCriteria) return true;
    return criteria.every((_, i) => checkedMap[i] === true);
  }, [criteria, checkedMap, hasCriteria]);

  const toggleChecked = useCallback((index: number) => {
    setCheckedMap((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

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

  const finishDisabled = isFinishing || !allChecked;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <BackToStageMapLink curriculumSlug={curriculumSlug} />
        <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
        <h1 className="text-sm font-semibold text-slate-700">
          {chapter.title}
        </h1>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {chapter.body}

        {hasCriteria && (
          <section className="mt-10 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              このレッスンを完了する条件
            </p>
            <p className="mt-1 text-xs text-emerald-700/80">
              できたものにチェックを入れてください。すべて揃うと完了ボタンが押せます。
            </p>

            <ul className="mt-4 space-y-2">
              {criteria.map((text, index) => {
                const checked = checkedMap[index] === true;
                return (
                  <li key={index}>
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        checked
                          ? 'border-emerald-300 bg-white'
                          : 'border-transparent bg-white/60 hover:border-emerald-200 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChecked(index)}
                        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-emerald-500"
                        aria-label={`完了条件: ${text}`}
                      />
                      <span
                        className={`text-sm leading-relaxed transition-colors ${
                          checked ? 'text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        {text}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 text-xs text-emerald-700/80">
              {allChecked
                ? 'すべての条件を満たしました。下のボタンで完了しましょう。'
                : `残り ${criteria.length - criteria.filter((_, i) => checkedMap[i]).length} 項目`}
            </p>
          </section>
        )}

        <div className="mt-10 border-t border-slate-200 pt-6">
          <button
            onClick={handleFinish}
            disabled={finishDisabled}
            className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-indigo-500"
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
