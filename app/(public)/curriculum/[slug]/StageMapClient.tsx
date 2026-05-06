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

/**
 * 「カリキュラム slug + ステージ番号」→ 学習ワークスペース chapterId のマップ。
 * ここに登録したステージだけが /learn/[chapterId] に遷移する。
 * 未登録のステージは StageContentDialog でダイアログ表示のみ。
 */
const STAGE_TO_CHAPTER: Readonly<Record<string, string>> = {
  'frontend:1': 'hero-section',
  'cafe-chapter-0:1': 'cafe-ch0-01-vscode-setup',
  'cafe-chapter-0:5': 'cafe-ch0-05-first-html',
};

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
    const stage = stages.find((s) => s.id === mapStage.id);
    if (!stage) return;
    if (stage.status === 'locked') return;

    // 学習ワークスペースが用意されているステージは /learn/[chapterId] へ
    const chapterId = STAGE_TO_CHAPTER[`${curriculumSlug}:${mapStage.number}`];
    if (chapterId) {
      const params = new URLSearchParams({
        stageId: mapStage.id,
        curriculumSlug,
      });
      router.push(`/learn/${chapterId}?${params.toString()}`);
      return;
    }

    // それ以外は既存どおりダイアログで説明を出す
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
