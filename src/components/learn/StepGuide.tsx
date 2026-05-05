'use client';

import { useState } from 'react';
import React from 'react';
import type { PracticeStep } from '@/types/step';
import type { GradeResult } from '@/lib/checker';
import { cn } from '@/lib/cn';

type StepGuideProps = {
  step: PracticeStep;
  onGrade: () => GradeResult;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  /** 最終ステップ完了時の進捗記録処理中フラグ。ボタンを無効化する。 */
  isFinishing?: boolean;
};

type HintModalProps = {
  hints: string[];
  onClose: () => void;
};

type GradeModalProps = {
  state: 'grading' | 'passed' | 'failed';
  failedHints: string[];
  successMessage: string;
  onClose: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isFinishing: boolean;
};

function GradeModal({
  state,
  failedHints,
  successMessage,
  onClose,
  onNext,
  isLastStep,
  isFinishing,
}: GradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {state === 'grading' && (
          <div className="flex flex-col items-center gap-4 px-6 py-12">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full bg-indigo-400"
                  style={{
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500">採点中...</p>
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); opacity: 0.4; }
                50% { transform: translateY(-8px); opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {state === 'passed' && (
          <>
            <div className="flex flex-col items-center gap-3 px-6 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-600"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-xl font-bold text-emerald-700">正解！</p>
              <p className="text-center text-sm text-slate-600">
                {successMessage}
              </p>
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                onClick={onNext}
                disabled={isFinishing}
                className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLastStep
                  ? isFinishing
                    ? '完了処理中...'
                    : 'チャプター完了！'
                  : '次のステップへ →'}
              </button>
            </div>
          </>
        )}

        {state === 'failed' && (
          <>
            <div className="px-6 py-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <p className="font-bold text-slate-800">もう少しです</p>
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                確認してほしいポイント
              </p>
              <ul className="space-y-2">
                {failedHints.map((hint, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  >
                    <span className="shrink-0 font-bold">{i + 1}.</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-[0.98]"
              >
                コードを修正する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/`([^`]+)`/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-700"
      >
        {part}
      </code>
    ) : (
      part
    )
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative my-2 rounded-lg bg-slate-800">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
        aria-label="コードをコピー"
      >
        {copied ? '✓ コピー済み' : 'コピー'}
      </button>
      <pre className="overflow-x-auto px-4 py-3 pr-16 text-xs leading-relaxed text-emerald-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderDescription(description: string): React.ReactNode {
  const lines = description.split('\n');
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    // コードブロック開始
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i++;
      }
      result.push(<CodeBlock key={i} code={codeLines.join('\n')} />);
      i++; // 閉じる ``` をスキップ
      continue;
    }

    // リスト
    if (line.startsWith('- ')) {
      result.push(
        <li key={i} className="text-sm text-slate-600">
          {renderInlineCode(line.slice(2))}
        </li>
      );
      i++;
      continue;
    }

    // 空行
    if (line.trim() === '') {
      result.push(<br key={i} />);
      i++;
      continue;
    }

    // 通常テキスト
    result.push(
      <p key={i} className="text-sm leading-relaxed text-slate-600">
        {renderInlineCode(line)}
      </p>
    );
    i++;
  }

  return result;
}

function HintModal({ hints, onClose }: HintModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hint = hints[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === hints.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-amber-600">ヒント</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {currentIndex + 1} / {hints.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ヒント本文 */}
        <div className="min-h-32 px-6 py-6">
          <p className="text-base leading-relaxed text-slate-700">{hint}</p>
        </div>

        {/* ステップインジケーター */}
        {hints.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {hints.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-200',
                  i === currentIndex
                    ? 'w-6 bg-amber-500'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                )}
                aria-label={`ヒント ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* フッター */}
        <div className="flex gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={isFirst}
            className={cn(
              'rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
              !isFirst
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-[0.98]'
                : 'cursor-not-allowed bg-slate-50 text-slate-300'
            )}
          >
            ← 戻る
          </button>
          {!isLast ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-amber-600 active:scale-[0.98]"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-amber-600 active:scale-[0.98]"
            >
              閉じる
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepGuide({
  step,
  onGrade,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
  isFinishing = false,
}: StepGuideProps) {
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [gradeModalState, setGradeModalState] = useState<
    'grading' | 'passed' | 'failed' | null
  >(null);
  const [failedHints, setFailedHints] = useState<string[]>([]);

  const handleGrade = () => {
    setGradeModalState('grading');
    // 採点中アニメーションを見せるため少し遅延
    setTimeout(() => {
      const result = onGrade();
      setFailedHints(result.failedHints);
      setGradeModalState(result.passed ? 'passed' : 'failed');
    }, 800);
  };

  const handleNext = () => {
    setGradeModalState(null);
    onNext();
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          {step.id === 'checkpoint'
            ? 'チェックポイント'
            : step.id.replace('step-', 'Step ')}
        </span>
      </div>

      <h2 className="mb-4 text-lg font-bold text-slate-800">{step.title}</h2>

      <div className="prose prose-sm prose-slate mb-6 flex-1">
        {renderDescription(step.description)}
      </div>

      {step.hints.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setHintModalOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-left text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <span>ヒントを見る ({step.hints.length}件)</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className={cn(
            'rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
            !isFirstStep
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-[0.98]'
              : 'cursor-not-allowed bg-slate-50 text-slate-300'
          )}
        >
          ← 前へ
        </button>
        <button
          onClick={handleGrade}
          className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-600 active:scale-[0.98]"
        >
          採点する
        </button>
      </div>

      {hintModalOpen && (
        <HintModal hints={step.hints} onClose={() => setHintModalOpen(false)} />
      )}

      {gradeModalState !== null && (
        <GradeModal
          state={gradeModalState}
          failedHints={failedHints}
          successMessage={step.successMessage}
          onClose={() => setGradeModalState(null)}
          onNext={handleNext}
          isLastStep={isLastStep}
          isFinishing={isFinishing}
        />
      )}
    </div>
  );
}
