'use client';

import { useRouter } from 'next/navigation';
import { DuolingoStageMap } from '@/components/features/curriculum/DuolingoStageMap';
import type { StageWithStatus } from '@/lib/curriculum/types';
import type { AvatarConfig } from '@/types/avatar';

interface StageMapClientProps {
  stages: StageWithStatus[];
  avatarConfig: AvatarConfig | null;
}

// ダミー10ステージ（DBのステージ1 + ダミー9ステージ）
const STAGE_ICONS = [
  '⭐',
  '🎨',
  '📐',
  '🖼️',
  '📦',
  '🧩',
  '🎯',
  '🚀',
  '💎',
  '🏆',
];
const STAGE_TITLES = [
  'ヒーローセクションを作ろう',
  'テキスト装飾',
  'ボックスモデル',
  'Flexbox基礎',
  'Grid基礎',
  'レスポンシブ',
  'アニメーション',
  'フォーム設計',
  'レイアウト実践',
  '総合テスト',
];

function buildStages(dbStages: StageWithStatus[]) {
  const totalStages = 10;
  const completedCount = dbStages.filter(
    (s) => s.status === 'completed'
  ).length;

  return Array.from({ length: totalStages }, (_, i) => {
    const dbStage = dbStages.find((s) => s.stage_number === i + 1);
    let status: 'completed' | 'current' | 'locked';

    if (dbStage?.status === 'completed') {
      status = 'completed';
    } else if (i === completedCount) {
      status = 'current';
    } else {
      status = 'locked';
    }

    return {
      id: dbStage?.id ?? `dummy-${i + 1}`,
      number: i + 1,
      title: STAGE_TITLES[i] ?? `ステージ ${i + 1}`,
      status,
      icon: STAGE_ICONS[i] ?? '⭐',
    };
  });
}

export function StageMapClient({ stages }: StageMapClientProps) {
  const router = useRouter();
  const allStages = buildStages(stages);

  const handleStageClick = (stage: {
    id: string;
    number: number;
    status: string;
  }) => {
    if (stage.number === 1) {
      router.push('/learn/hero-section');
      return;
    }
    // 将来的に各ステージの学習ページへ遷移
    alert(`ステージ${stage.number}は準備中です`);
  };

  return (
    <DuolingoStageMap stages={allStages} onStageClick={handleStageClick} />
  );
}
