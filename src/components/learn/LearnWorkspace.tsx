'use client';

import { useState, useCallback, useRef } from 'react';
import type { Chapter } from '@/types/step';
import { evaluateRules, type GradeResult } from '@/lib/checker';
import { ProgressBar } from './ProgressBar';
import { StepGuide } from './StepGuide';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { LessonView } from './LessonView';

type LearnWorkspaceProps = {
  chapter: Chapter;
};

export function LearnWorkspace({ chapter }: LearnWorkspaceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCleared, setIsCleared] = useState(false);
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
      const heroEl = iframe.contentDocument?.querySelector('.hero');
      if (!heroEl)
        return {
          passed: false,
          failedHints: ['`.hero` 要素が見つかりません。HTMLを確認しましょう。'],
        };
      const style = iframe.contentWindow?.getComputedStyle(heroEl);
      if (!style) return { passed: false, failedHints: [] };
      const result = evaluateRules(style, currentStep.checkRules);
      setIsCleared(result.passed);
      return result;
    } catch {
      setIsCleared(false);
      return { passed: false, failedHints: [] };
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= chapter.steps.length) return;

    const nextStep = chapter.steps[nextIndex];
    if (!nextStep) return;

    setCurrentStepIndex(nextIndex);
    setIsCleared(false);

    if (nextStep.kind === 'practice') {
      setHtml(nextStep.initialCode.html);
      setCss(nextStep.initialCode.css);
    }
  }, [currentStepIndex, chapter.steps]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex < 0) return;

    const prevStep = chapter.steps[prevIndex];
    if (!prevStep) return;

    setCurrentStepIndex(prevIndex);
    setIsCleared(false);

    if (prevStep.kind === 'practice') {
      setHtml(prevStep.initialCode.html);
      setCss(prevStep.initialCode.css);
    }
  }, [currentStepIndex, chapter.steps]);

  const handleReset = useCallback(() => {
    if (!currentStep || currentStep.kind !== 'practice') return;
    setHtml(currentStep.initialCode.html);
    setCss(currentStep.initialCode.css);
    setIsCleared(false);
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
              isCleared={isCleared}
              onGrade={handleGrade}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirstStep={currentStepIndex === 0}
              isLastStep={currentStepIndex === chapter.steps.length - 1}
            />
          </div>

          {/* 右: エディタ + プレビュー */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                html={html}
                css={css}
                onHtmlChange={setHtml}
                onCssChange={setCss}
                onReset={handleReset}
              />
            </div>
            <div className="flex-1 overflow-hidden">
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
