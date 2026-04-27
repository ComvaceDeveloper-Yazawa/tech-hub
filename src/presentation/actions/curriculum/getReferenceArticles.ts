'use server';

import { createClient } from '@/lib/supabase/server';
import type { ReferenceArticle } from '@/lib/curriculum/types';

export async function getReferenceArticles(): Promise<ReferenceArticle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reference_articles')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}
