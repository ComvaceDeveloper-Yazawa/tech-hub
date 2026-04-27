import type { Stage, UserStageProgress, StageWithStatus } from '@/lib/curriculum/types';

export function computeStageStatuses(
  stages: Stage[],
  progressRecords: UserStageProgress[]
): StageWithStatus[] {
  // 1. stage_number 昇順でソート
  const sorted = [...stages].sort((a, b) => a.stage_number - b.stage_number);

  // 2. progress を stage_id でインデックス化
  const progressMap = new Map(
    progressRecords.map((p) => [p.stage_id, p])
  );

  // 3. 各ステージのステータスを計算
  return sorted.map((stage, index) => {
    const progress = progressMap.get(stage.id);

    if (progress?.status === 'completed') {
      return { ...stage, status: 'completed' as const };
    }

    if (index === 0) {
      return { ...stage, status: 'unlocked' as const };
    }

    const prevStage = sorted[index - 1];
    if (prevStage) {
      const prevProgress = progressMap.get(prevStage.id);
      if (prevProgress?.status === 'completed') {
        return { ...stage, status: 'unlocked' as const };
      }
    }

    return { ...stage, status: 'locked' as const };
  });
}

export function findCurrentStageNumber(
  stagesWithStatus: StageWithStatus[]
): number | null {
  const current = stagesWithStatus.find(
    (s) => s.status === 'unlocked' || s.status === 'in_progress'
  );
  return current?.stage_number ?? null;
}
