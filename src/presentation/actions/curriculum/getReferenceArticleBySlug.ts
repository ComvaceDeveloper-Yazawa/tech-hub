'use server';

import { createClient } from '@/lib/supabase/server';
import type { ReferenceArticle } from '@/lib/curriculum/types';

export async function getReferenceArticleBySlug(
  slug: string
): Promise<ReferenceArticle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reference_articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
