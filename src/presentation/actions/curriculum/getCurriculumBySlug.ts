'use server';

import { createClient } from '@/lib/supabase/server';
import type { Curriculum } from '@/lib/curriculum/types';

export async function getCurriculumBySlug(
  slug: string
): Promise<Curriculum | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('curriculums')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
