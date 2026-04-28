'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { StageWithStatus } from '@/lib/curriculum/types';
import type { AvatarConfig } from '@/types/avatar';
import { findCurrentStageNumber } from '@/lib/curriculum/computeStageStatuses';
import { getMapConfig } from '@/lib/curriculum/stagePositions';
import { Avatar } from '@/components/features/Avatar';
import { cn } from '@/lib/cn';

interface StageMapProps {
  stages: StageWithStatus[];
  avatarConfig: AvatarConfig | null;
  onStageClick: (stage: StageWithStatus) => void;
}

function statusLabel(status: StageWithStatus['status']): string {
  switch (status) {
    case 'completed':
      return '完了';
    case 'in_progress':
      return '進行中';
    case 'unlocked':
      return '解放済み';
    case 'locked':
      return '未解放';
  }
}

/**
 * ノード間を繋ぐ道のSVGパスを生成する。
 * 各ノード間をベジェ曲線で滑らかに接続。
 */
function buildPathD(positions: { x: number; y: number }[]): string {
  if (positions.length < 2) return '';

  const parts: string[] = [];
  parts.push(`M ${positions[0]!.x} ${positions[0]!.y}`);

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]!;
    const curr = positions[i]!;
    // 制御点: 中間Y座標で水平方向を維持し、自然なS字カーブを作る
    const cpY = (prev.y + curr.y) / 2;
    parts.push(`C ${prev.x} ${cpY}, ${curr.x} ${cpY}, ${curr.x} ${curr.y}`);
  }

  return parts.join(' ');
}

export function StageMap({
  stages,
  avatarConfig,
  onStageClick,
}: StageMapProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTopRef = useRef(0);

  const { positions, backgroundImage } = getMapConfig(stages.length);
  const currentStageNumber = findCurrentStageNumber(stages);

  const effectiveAvatarConfig: AvatarConfig = avatarConfig ?? {
    style: 'avataaars',
    seed: 'default',
  };

  // 初期表示: スクロールを一番下（ステージ1）に合わせる
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // ドラッグスクロール
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startY.current = e.clientY;
    scrollTopRef.current = scrollRef.current.scrollTop;
    scrollRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dy = e.clientY - startY.current;
    scrollRef.current.scrollTop = scrollTopRef.current - dy;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleStageClick = (stage: StageWithStatus) => {
    if (stage.status !== 'locked') {
      onStageClick(stage);
    }
  };

  const maxDisplayHeight = 680;

  // SVG用のパスデータ生成
  const pathD = buildPathD(positions);

  return (
    <div className="relative mx-auto w-full max-w-lg select-none">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px 2px rgba(255,215,0,0.5); }
          50% { box-shadow: 0 0 20px 6px rgba(255,215,0,0.8); }
        }
        @keyframes bounce-avatar {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-10px) translateX(-50%); }
        }
        .stage-map-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .stage-map-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 上部フェード */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-10 rounded-t-2xl bg-gradient-to-b from-black/20 to-transparent" />

      <div
        ref={scrollRef}
        className="stage-map-scroll overflow-y-auto rounded-2xl shadow-xl"
        style={{ maxHeight: `${maxDisplayHeight}px`, cursor: 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* マップコンテナ */}
        <div
          className="relative w-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: '1086 / 1448',
          }}
        >
          {/* SVG道レイヤー */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* 道の影（奥行き感） */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 道の本体（土色） */}
            <path
              d={pathD}
              fill="none"
              stroke="#C4A265"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 道の中央線（明るいハイライト） */}
            <path
              d={pathD}
              fill="none"
              stroke="#E8D5A3"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 3"
            />
          </svg>

          {/* ステージノード */}
          {stages.map((stage, i) => {
            const pos = positions[i];
            if (!pos) return null;

            const isLocked = stage.status === 'locked';
            const isCompleted = stage.status === 'completed';
            const isCurrent =
              stage.status === 'unlocked' || stage.status === 'in_progress';
            const isHovered = hoveredIndex === i && !isLocked;

            return (
              <div
                key={stage.id}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* アバター（現在ステージの上に表示） */}
                {stage.stage_number === currentStageNumber && (
                  <div
                    className="absolute left-1/2 z-20"
                    style={{
                      top: '-52px',
                      animation: 'bounce-avatar 2s ease-in-out infinite',
                    }}
                  >
                    <div className="rounded-full border-2 border-white bg-white/90 p-0.5 shadow-lg">
                      <Avatar config={effectiveAvatarConfig} size={36} />
                    </div>
                  </div>
                )}

                {/* ステージボタン */}
                <button
                  type="button"
                  onClick={() => handleStageClick(stage)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  disabled={isLocked}
                  aria-label={`ステージ${stage.stage_number}: ${stage.title} - ${statusLabel(stage.status)}`}
                  className={cn(
                    'relative flex h-[52px] w-[52px] items-center justify-center rounded-full text-lg font-extrabold transition-transform duration-200',
                    'border-2 shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
                    isCompleted &&
                      'border-yellow-200/80 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 text-white drop-shadow-[0_0_6px_rgba(255,200,0,0.5)]',
                    isCurrent &&
                      'border-sky-200/80 bg-gradient-to-b from-sky-300 via-blue-400 to-blue-600 text-white',
                    !isCompleted &&
                      !isCurrent &&
                      !isLocked &&
                      'border-emerald-200/80 bg-gradient-to-b from-emerald-300 via-green-400 to-green-600 text-white',
                    isLocked &&
                      'cursor-not-allowed border-stone-400/60 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-600 text-stone-200 opacity-60',
                    isHovered && !isLocked && 'scale-115'
                  )}
                  style={
                    isCurrent
                      ? { animation: 'pulse-glow 2s ease-in-out infinite' }
                      : undefined
                  }
                >
                  {/* 内側ハイライト（立体感） */}
                  <span className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
                  <span className="relative">
                    {isLocked ? '🔒' : stage.stage_number}
                  </span>
                  {isCompleted && (
                    <span className="absolute -top-1.5 -right-1.5 text-base drop-shadow-sm">
                      ⭐
                    </span>
                  )}
                </button>

                {/* ステージ名ラベル */}
                <div className="mt-1 rounded-full bg-white/90 px-2.5 py-0.5 text-center text-[10px] font-semibold text-amber-900 shadow-sm backdrop-blur-sm">
                  {stage.title.length > 7
                    ? stage.title.slice(0, 7) + '…'
                    : stage.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 下部フェード */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-10 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent" />

      {/* スクロールヒント */}
      <div className="pointer-events-none absolute right-3 bottom-3 z-20 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white shadow-sm backdrop-blur-sm">
        <span className="animate-bounce text-sm">↕</span>
        スクロール
      </div>
    </div>
  );
}
