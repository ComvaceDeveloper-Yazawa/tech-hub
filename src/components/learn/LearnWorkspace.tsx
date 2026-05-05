'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Chapter } from '@/types/step';
import { evaluateRules, type GradeResult } from '@/lib/checker';
import { completeStage } from '@/presentation/actions/curriculum/completeStage';
import { ProgressBar } from './ProgressBar';
import { StepGuide } from './StepGuide';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { LessonView } from './LessonView';

type LearnWorkspaceProps = {
  chapter: Chapter;
  /** 呼び出し元のステージ ID。カリキュラムから来た場合のみ渡される。 */
  stageId: string | null;
  /** 呼び出し元のカリキュラム slug。戻り先の判定に使う。 */
  curriculumSlug: string | null;
};

export function LearnWorkspace({
  chapter,
  stageId,
  curriculumSlug,
}: LearnWorkspaceProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const currentStep = chapter.steps[currentStepIndex];

  const firstPractice = chapter.steps.find((s) => s.kind === 'practice');
  const [html, setHtml] = useState(
    firstPractice?.kind === 'practice' ? firstPractice.initialCode.html : ''
  );
  const [css, setCss] = useState(
    firstPractice?.kind === 'practice' ? firstPractice.initialCode.css : ''
  );

  const handleIframeReady = useCallback((iframe: HTMLIFrameElement) => {
    iframeRef.current = iframe;
  }, []);

  const handleGrade = useCallback((): GradeResult => {
    if (!currentStep || currentStep.kind !== 'practice') {
      return { passed: false, failedHints: [] };
    }
    const iframe = iframeRef.current;
    if (!iframe) return { passed: false, failedHints: [] };
    try {
      const selector = currentStep.targetSelector ?? '.hero';
      const targetEl = iframe.contentDocument?.querySelector(selector);
      if (!targetEl)
        return {
          passed: false,
          failedHints: [
            `\`${selector}\` 要素が見つかりません。HTMLを確認しましょう。`,
          ],
        };
      const style = iframe.contentWindow?.getComputedStyle(targetEl);
      if (!style) return { passed: false, failedHints: [] };
      const result = evaluateRules(style, currentStep.checkRules);
      return result;
    } catch {
      return { passed: false, failedHints: [] };
    }
  }, [currentStep]);

  /**
   * チャプター完了時の処理。
   * カリキュラムから来た場合は進捗を記録して呼び出し元のステージマップに戻る。
   * 直接 /learn/xxx にアクセスされた場合は /curriculum に戻る。
   */
  const handleFinish = useCallback(async () => {
    setIsFinishing(true);
    try {
      if (stageId) {
        const result = await completeStage(stageId);
        if (!result.success) {
          toast.error(result.error ?? 'チャプターの完了に失敗しました');
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
      toast.error('チャプターの完了に失敗しました');
      setIsFinishing(false);
    }
  }, [stageId, curriculumSlug, router]);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= chapter.steps.length) {
      // 最終ステップからの「次へ」= チャプター完了扱い
      void handleFinish();
      return;
    }

    const nextStep = chapter.steps[nextIndex];
    if (!nextStep) return;

    setCurrentStepIndex(nextIndex);

    if (nextStep.kind === 'practice') {
      setHtml(nextStep.initialCode.html);
      setCss(nextStep.initialCode.css);
    }
  }, [currentStepIndex, chapter.steps, handleFinish]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex < 0) return;

    const prevStep = chapter.steps[prevIndex];
    if (!prevStep) return;

    setCurrentStepIndex(prevIndex);

    if (prevStep.kind === 'practice') {
      setHtml(prevStep.initialCode.html);
      setCss(prevStep.initialCode.css);
    }
  }, [currentStepIndex, chapter.steps]);

  const handleReset = useCallback(() => {
    if (!currentStep || currentStep.kind !== 'practice') return;
    setHtml(currentStep.initialCode.html);
    setCss(currentStep.initialCode.css);
  }, [currentStep]);

  if (!currentStep) return null;

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <ProgressBar
        currentStep={currentStepIndex}
        totalSteps={chapter.steps.length}
        chapterTitle={chapter.title}
      />

      {currentStep.kind === 'lesson' ? (
        <div className="flex-1 overflow-y-auto">
          <LessonView
            step={currentStep}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirstStep={currentStepIndex === 0}
            isLastStep={currentStepIndex === chapter.steps.length - 1}
          />
        </div>
      ) : (
        <div className="flex flex-1 gap-3 overflow-hidden p-3">
          {/* 左: 解説エリア */}
          <div className="w-80 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <StepGuide
              step={currentStep}
              onGrade={handleGrade}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirstStep={currentStepIndex === 0}
              isLastStep={currentStepIndex === chapter.steps.length - 1}
              isFinishing={isFinishing}
            />
          </div>

          {/* 右: エディタ + プレビュー */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            <div className="flex-[2] overflow-hidden">
              <CodeEditor
                html={html}
                css={css}
                onHtmlChange={setHtml}
                onCssChange={setCss}
                onReset={handleReset}
              />
            </div>
            <div className="flex-[3] overflow-hidden">
              <Preview
                html={html}
                css={css}
                onIframeReady={handleIframeReady}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
