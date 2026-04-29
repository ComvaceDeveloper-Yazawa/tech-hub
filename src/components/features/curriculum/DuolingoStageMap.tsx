'use client';

import { cn } from '@/lib/cn';

type StageStatus = 'completed' | 'current' | 'locked';

type Stage = {
  id: string;
  number: number;
  title: string;
  status: StageStatus;
  icon: string;
};

type DuolingoStageMapProps = {
  stages: Stage[];
  onStageClick: (stage: Stage) => void;
};

function StageNode({
  stage,
  offset,
  onClick,
}: {
  stage: Stage;
  offset: number;
  onClick: () => void;
}) {
  const isCompleted = stage.status === 'completed';
  const isCurrent = stage.status === 'current';
  const isLocked = stage.status === 'locked';

  return (
    <div
      className="flex flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {/* ステージボタン */}
      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={cn(
          'relative flex h-16 w-16 items-center justify-center rounded-full border-4 text-2xl shadow-lg transition-all duration-200',
          isCompleted &&
            'border-amber-400 bg-amber-400 text-white hover:scale-105 hover:shadow-xl',
          isCurrent &&
            'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(52,211,153,0.6)]',
          isLocked &&
            'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-400'
        )}
        aria-label={`ステージ${stage.number}: ${stage.title} - ${
          isCompleted ? '完了' : isCurrent ? '現在' : '未解放'
        }`}
      >
        {isLocked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <span>{stage.icon}</span>
        )}

        {/* 完了チェック */}
        {isCompleted && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-white shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}

        {/* 現在ステージのパルス */}
        {isCurrent && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
        )}
      </button>

      {/* ステージタイトル */}
      <span
        className={cn(
          'max-w-24 mt-2 text-center text-xs font-medium',
          isCompleted && 'text-amber-700',
          isCurrent && 'text-emerald-700',
          isLocked && 'text-slate-400'
        )}
      >
        {stage.title}
      </span>
    </div>
  );
}

function PathConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="flex h-10 items-center justify-center">
      <div
        className={cn(
          'h-full w-1 rounded-full',
          isCompleted ? 'bg-amber-300' : 'bg-slate-200'
        )}
      />
    </div>
  );
}

export function DuolingoStageMap({
  stages,
  onStageClick,
}: DuolingoStageMapProps) {
  // 蛇行パターン: 左→中央→右→中央→左...
  const offsets = [0, -50, 0, 50, 0, -50, 0, 50, 0, -50];

  return (
    <div className="flex flex-col items-center py-4">
      {stages.map((stage, i) => (
        <div key={stage.id}>
          <StageNode
            stage={stage}
            offset={offsets[i % offsets.length] ?? 0}
            onClick={() => onStageClick(stage)}
          />
          {i < stages.length - 1 && (
            <PathConnector isCompleted={stage.status === 'completed'} />
          )}
        </div>
      ))}
    </div>
  );
}
