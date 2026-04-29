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
          'relative flex h-20 w-20 items-center justify-center rounded-full text-2xl transition-all duration-300',
          // 共通: 金色の二重ボーダー
          'ring-2 ring-offset-2',
          isCompleted &&
            'cursor-pointer bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 text-white shadow-[0_0_15px_rgba(251,191,36,0.5)] ring-amber-300/60 ring-offset-amber-900/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.7)]',
          isCurrent &&
            'cursor-pointer bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 text-white shadow-[0_0_20px_rgba(52,211,153,0.6)] ring-emerald-300/60 ring-offset-emerald-900/30 hover:scale-110',
          isLocked &&
            'cursor-not-allowed bg-gradient-to-b from-slate-400 via-slate-500 to-slate-700 text-slate-300 opacity-70 ring-slate-400/30 ring-offset-slate-800/20'
        )}
        aria-label={`ステージ${stage.number}: ${stage.title}`}
      >
        {/* 内側のハイライト（立体感） */}
        <span className="pointer-events-none absolute inset-1.5 rounded-full bg-gradient-to-b from-white/30 to-transparent" />

        {isLocked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <span className="relative text-3xl drop-shadow-md">{stage.icon}</span>
        )}

        {/* 完了チェック */}
        {isCompleted && (
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-500 text-xs text-white shadow-lg">
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
          'max-w-28 mt-3 rounded-lg px-2 py-0.5 text-center text-xs font-bold',
          isCompleted && 'bg-amber-900/60 text-amber-200',
          isCurrent && 'bg-emerald-900/60 text-emerald-200',
          isLocked && 'bg-slate-900/40 text-slate-400'
        )}
      >
        {stage.title}
      </span>

      {/* 星評価（完了ステージ） */}
      {isCompleted && (
        <div className="mt-1 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="text-xs text-amber-400 drop-shadow-sm">
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PathConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="flex h-12 items-center justify-center">
      <div
        className={cn(
          'h-full w-1 rounded-full',
          isCompleted
            ? 'bg-gradient-to-b from-amber-400 to-amber-500 shadow-[0_0_6px_rgba(251,191,36,0.4)]'
            : 'bg-white/20'
        )}
      />
    </div>
  );
}

export function DuolingoStageMap({
  stages,
  onStageClick,
}: DuolingoStageMapProps) {
  const offsets = [0, -60, 0, 60, 0, -60, 0, 60, 0, -60];

  return (
    <div className="flex flex-col items-center py-6">
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
