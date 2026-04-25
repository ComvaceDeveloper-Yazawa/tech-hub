'use server';

import { createClient } from '@/lib/supabase/server';
import { createStorageClient } from '@/lib/supabase/storage';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export interface MediaItem {
  name: string;
  path: string;
  url: string;
  size: number;
  createdAt: string;
  isFolder: boolean;
}

export async function listMedia(folder?: string): Promise<MediaItem[]> {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('認証が必要です');

  const storage = createStorageClient();
  const tenantId = TenantId.personal().toString();
  const listPath = folder ? `${tenantId}/${folder}` : tenantId;

  const { data, error } = await storage.from('article-images').list(listPath, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    throw new Error(`メディア一覧の取得に失敗しました: ${error.message}`);
  }

  const items: MediaItem[] = [];

  for (const item of data ?? []) {
    if (item.name === '.gitkeep') continue;

    const isFolder = item.metadata === null;
    const itemPath = folder ? `${folder}/${item.name}` : item.name;
    const storagePath = `${tenantId}/${itemPath}`;

    let url = '';
    if (!isFolder) {
      const { data: urlData } = storage
        .from('article-images')
        .getPublicUrl(storagePath);
      url = urlData.publicUrl;
    }

    items.push({
      name: item.name,
      path: itemPath,
      url,
      size: (item.metadata as { size?: number } | null)?.size ?? 0,
      createdAt: item.created_at ?? '',
      isFolder,
    });
  }

  return items;
}
