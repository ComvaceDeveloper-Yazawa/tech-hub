'use client';

import { cn } from '@/lib/cn';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  chapterTitle: string;
};

export function ProgressBar({
  currentStep,
  totalSteps,
  chapterTitle,
}: ProgressBarProps) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <h1 className="shrink-0 text-sm font-semibold text-slate-700">
        {chapterTitle}
      </h1>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 w-8 rounded-full transition-colors duration-300',
              i < currentStep
                ? 'bg-emerald-500'
                : i === currentStep
                  ? 'bg-indigo-500'
                  : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">
        {currentStep + 1} / {totalSteps}
      </span>
    </div>
  );
}
