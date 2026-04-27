'use server';

import { createClient } from '@/lib/supabase/server';
import type { CurriculumWithProgress } from '@/lib/curriculum/types';

export async function getCurriculums(): Promise<CurriculumWithProgress[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: curriculums, error } = await supabase
    .from('curriculums')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error || !curriculums) {
    return [];
  }

  const result: CurriculumWithProgress[] = [];

  for (const curriculum of curriculums) {
    const { count: totalStages } = await supabase
      .from('stages')
      .select('*', { count: 'exact', head: true })
      .eq('curriculum_id', curriculum.id);

    const { data: stages } = await supabase
      .from('stages')
      .select('id')
      .eq('curriculum_id', curriculum.id);

    let completedStages = 0;

    if (stages && stages.length > 0) {
      const stageIds = stages.map((s) => s.id);
      const { count } = await supabase
        .from('user_stage_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('stage_id', stageIds);

      completedStages = count ?? 0;
    }

    result.push({
      ...curriculum,
      total_stages: totalStages ?? 0,
      completed_stages: completedStages,
    });
  }

  return result;
}
