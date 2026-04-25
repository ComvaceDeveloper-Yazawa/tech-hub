'use server';

import { createClient } from '@/lib/supabase/server';
import { createStorageClient } from '@/lib/supabase/storage';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export async function deleteMedia(itemPath: string): Promise<void> {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('認証が必要です');

  const tenantId = TenantId.personal().toString();
  const storagePath = `${tenantId}/${itemPath}`;

  const storage = createStorageClient();
  const { error } = await storage.from('article-images').remove([storagePath]);

  if (error) throw new Error(`削除に失敗しました: ${error.message}`);
}
