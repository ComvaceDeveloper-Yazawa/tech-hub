'use server';

import { createClient } from '@/lib/supabase/server';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export async function deleteMedia(itemPath: string): Promise<void> {
  const tenantId = TenantId.personal().toString();
  const storagePath = `${tenantId}/${itemPath}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from('article-images')
    .remove([storagePath]);

  if (error) throw new Error(`削除に失敗しました: ${error.message}`);
}
