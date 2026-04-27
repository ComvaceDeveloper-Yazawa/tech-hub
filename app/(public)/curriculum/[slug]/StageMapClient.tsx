'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StageMap } from '@/components/features/curriculum/StageMap';
import { StageContentDialog } from '@/components/features/curriculum/StageContentDialog';
import { completeStage } from '@/presentation/actions/curriculum/completeStage';
import type { StageWithStatus } from '@/lib/curriculum/types';
import type { AvatarConfig } from '@/types/avatar';

interface StageMapClientProps {
  stages: StageWithStatus[];
  avatarConfig: AvatarConfig | null;
}

export function StageMapClient({ stages, avatarConfig }: StageMapClientProps) {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<StageWithStatus | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStageClick = (stage: StageWithStatus) => {
    setSelectedStage(stage);
    setDialogOpen(true);
  };

  const handleComplete = async (stageId: string) => {
    const result = await completeStage(stageId);
    if (!result.success) {
      toast.error(result.error ?? 'ステージの完了に失敗しました');
      throw new Error(result.error);
    }
    router.refresh();
  };

  return (
    <>
      <StageMap
        stages={stages}
        avatarConfig={avatarConfig}
        onStageClick={handleStageClick}
      />
      <StageContentDialog
        stage={selectedStage}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onComplete={handleComplete}
      />
    </>
  );
}
