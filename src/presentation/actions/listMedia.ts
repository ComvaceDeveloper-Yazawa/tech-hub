'use server';

import { createClient } from '@/lib/supabase/server';
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
  const supabase = await createClient();
  const tenantId = TenantId.personal().toString();
  const prefix = folder ? `${tenantId}/${folder}` : tenantId;

  const { data, error } = await supabase.storage
    .from('article-images')
    .list(prefix, { sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    throw new Error(`メディア一覧の取得に失敗しました: ${error.message}`);
  }

  return (data ?? []).map((item) => {
    const itemPath = folder ? `${folder}/${item.name}` : item.name;
    const storagePath = `${tenantId}/${itemPath}`;
    const isFolder = item.id === null;

    const { data: urlData } = supabase.storage
      .from('article-images')
      .getPublicUrl(storagePath);

    return {
      name: item.name,
      path: itemPath,
      url: isFolder ? '' : urlData.publicUrl,
      size: item.metadata?.size ?? 0,
      createdAt: item.created_at ?? '',
      isFolder,
    };
  });
}
