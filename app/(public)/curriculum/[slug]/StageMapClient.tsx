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
  'cafe-chapter-0:2': 'cafe-ch0-02-vscode-usage',
  'cafe-chapter-0:3': 'cafe-ch0-03-prettier',
  'cafe-chapter-0:4': 'cafe-ch0-04-terminal',
  'cafe-chapter-0:5': 'cafe-ch0-05-first-html',
  'cafe-chapter-0:6': 'cafe-ch0-06-tags',
  'cafe-chapter-0:7': 'cafe-ch0-07-html-rules',
  'cafe-chapter-0:8': 'cafe-ch0-08-devtools',
  'cafe-chapter-0:9': 'cafe-ch0-09-css-basics',
  'cafe-chapter-0:10': 'cafe-ch0-10-class-selector',
  'cafe-chapter-0:11': 'cafe-ch0-11-reset-css',
  'cafe-chapter-0:12': 'cafe-ch0-12-media-query',
  'cafe-chapter-0:13': 'cafe-ch0-13-git-setup',
  'cafe-chapter-0:14': 'cafe-ch0-14-repo-setup',
  'cafe-chapter-0:15': 'cafe-ch0-15-first-pr',
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
