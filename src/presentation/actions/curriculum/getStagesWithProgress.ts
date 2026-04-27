'use server';

import { createClient } from '@/lib/supabase/server';
import { computeStageStatuses } from '@/lib/curriculum/computeStageStatuses';
import type {
  Stage,
  UserStageProgress,
  StageWithStatus,
} from '@/lib/curriculum/types';

export async function getStagesWithProgress(
  curriculumId: string
): Promise<StageWithStatus[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: stages, error: stagesError } = await supabase
    .from('stages')
    .select('*')
    .eq('curriculum_id', curriculumId)
    .order('stage_number', { ascending: true });

  if (stagesError || !stages || stages.length === 0) {
    return [];
  }

  let progressRecords: UserStageProgress[] = [];

  if (user) {
    const stageIds = stages.map((s) => s.id);
    const { data: progress } = await supabase
      .from('user_stage_progress')
      .select('*')
      .eq('user_id', user.id)
      .in('stage_id', stageIds);

    progressRecords = (progress as UserStageProgress[]) ?? [];
  }

  return computeStageStatuses(stages as Stage[], progressRecords);
}
