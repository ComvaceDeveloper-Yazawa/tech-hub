'use client';

import { useState } from 'react';
import type { StageWithStatus } from '@/lib/curriculum/types';
import type { AvatarConfig } from '@/types/avatar';
import { computeStageCoordinates } from '@/lib/curriculum/computeStageCoordinates';
import { findCurrentStageNumber } from '@/lib/curriculum/computeStageStatuses';
import { Avatar } from '@/components/features/Avatar';

interface StageMapProps {
  stages: StageWithStatus[];
  avatarConfig: AvatarConfig | null;
  onStageClick: (stage: StageWithStatus) => void;
}

const STATUS_COLORS: Record<StageWithStatus['status'], string> = {
  completed: '#22c55e',
  in_progress: '#3b82f6',
  unlocked: '#3b82f6',
  locked: '#94a3b8',
};

export function StageMap({ stages, avatarConfig, onStageClick }: StageMapProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const coords = computeStageCoordinates(stages.length, 600, 400);
  const currentStageNumber = findCurrentStageNumber(stages);

  const effectiveAvatarConfig: AvatarConfig = avatarConfig ?? {
    style: 'avataaars',
    seed: 'default',
  };

  const handleStageClick = (stage: StageWithStatus) => {
    if (stage.status !== 'locked') {
      onStageClick(stage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, stage: StageWithStatus) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStageClick(stage);
    }
  };

  const statusLabel = (status: StageWithStatus['status']): string => {
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
  };

  return (
    <svg viewBox="0 0 600 400" className="h-auto w-full">
      <defs>
        <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>

      <rect
        width="600"
        height="400"
        rx="12"
        fill="url(#bg-gradient)"
      />

      {/* Connection lines */}
      {coords.map((coord, i) => {
        if (i === 0) return null;
        const prev = coords[i - 1];
        if (!prev) return null;
        const prevStage = stages[i - 1];
        const isCompletedSegment = prevStage?.status === 'completed';

        return (
          <line
            key={`line-${i}`}
            x1={prev.x}
            y1={prev.y}
            x2={coord.x}
            y2={coord.y}
            stroke={isCompletedSegment ? '#22c55e' : '#94a3b8'}
            strokeWidth={isCompletedSegment ? 3 : 2}
            strokeDasharray={isCompletedSegment ? undefined : '6 4'}
          />
        );
      })}

      {/* Stage circles */}
      {coords.map((coord, i) => {
        const stage = stages[i];
        if (!stage) return null;
        const isLocked = stage.status === 'locked';
        const isHovered = hoveredIndex === i && !isLocked;

        return (
          <g
            key={stage.id}
            role="button"
            tabIndex={isLocked ? -1 : 0}
            aria-label={`ステージ${stage.stage_number}: ${stage.title} - ${statusLabel(stage.status)}`}
            onClick={() => handleStageClick(stage)}
            onKeyDown={(e) => handleKeyDown(e, stage)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              cursor: isLocked ? 'not-allowed' : 'pointer',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transformOrigin: `${coord.x}px ${coord.y}px`,
              transition: 'transform 0.2s ease',
            }}
          >
            <circle
              cx={coord.x}
              cy={coord.y}
              r={28}
              fill={STATUS_COLORS[stage.status]}
            />
            <text
              x={coord.x}
              y={coord.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={14}
              fontWeight="bold"
            >
              {stage.stage_number}
            </text>
            <text
              x={coord.x}
              y={coord.y + 42}
              textAnchor="middle"
              fill="#475569"
              fontSize={11}
            >
              {stage.title}
            </text>
          </g>
        );
      })}

      {/* Avatar indicator above current stage */}
      {currentStageNumber != null &&
        (() => {
          const currentCoord = coords.find(
            (c) => c.stageNumber === currentStageNumber
          );
          if (!currentCoord) return null;
          return (
            <foreignObject
              x={currentCoord.x - 24}
              y={currentCoord.y - 72}
              width={48}
              height={48}
              style={{ overflow: 'visible' }}
            >
              <Avatar config={effectiveAvatarConfig} size={48} />
            </foreignObject>
          );
        })()}
    </svg>
  );
}
