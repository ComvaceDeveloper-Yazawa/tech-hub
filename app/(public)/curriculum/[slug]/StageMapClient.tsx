'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DuolingoStageMap } from '@/components/features/curriculum/DuolingoStageMap';
import { StageContentDialog } from '@/components/features/curriculum/StageContentDialog';
import { completeStage } from '@/presentation/actions/curriculum/completeStage';
import type { StageWithStatus } from '@/lib/curriculum/types';
import type { AvatarConfig } from '@/types/avatar';

interface StageMapClientProps {
  curriculumSlug: string;
  stages: StageWithStatus[];
  avatarConfig: AvatarConfig | null;
}

type MapStatus = 'completed' | 'current' | 'locked';

function toMapStatus(status: StageWithStatus['status']): MapStatus {
  if (status === 'completed') return 'completed';
  if (status === 'locked') return 'locked';
  return 'current';
}

export function StageMapClient({
  curriculumSlug,
  stages,
}: StageMapClientProps) {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<StageWithStatus | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const mapStages = stages.map((stage) => ({
    id: stage.id,
    number: stage.stage_number,
    title: stage.title,
    status: toMapStatus(stage.status),
    icon: String(stage.stage_number),
  }));

  const handleStageClick = (mapStage: { id: string; number: number }) => {
    // サンプルフロントエンドのステージ1だけは既存の学習ワークスペースへ
    if (curriculumSlug === 'frontend' && mapStage.number === 1) {
      router.push('/learn/hero-section');
      return;
    }

    const stage = stages.find((s) => s.id === mapStage.id);
    if (!stage) return;
    if (stage.status === 'locked') return;

    setSelectedStage(stage);
    setDialogOpen(true);
  };

  const handleComplete = async (stageId: string) => {
    const result = await completeStage(stageId);
    if (!result.success) {
      toast.error(result.error ?? 'ステージの完了に失敗しました');
      throw new Error(result.error ?? 'failed');
    }
    router.refresh();
  };

  return (
    <>
      <DuolingoStageMap stages={mapStages} onStageClick={handleStageClick} />
      <StageContentDialog
        stage={selectedStage}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onComplete={handleComplete}
      />
    </>
  );
}
