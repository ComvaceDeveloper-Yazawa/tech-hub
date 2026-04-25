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

  // Supabase Storage の list() に渡すプレフィックス
  // ルートは tenantId、サブフォルダは tenantId/folder
  const listPath = folder ? `${tenantId}/${folder}` : tenantId;

  const { data, error } = await supabase.storage
    .from('article-images')
    .list(listPath, {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    throw new Error(`メディア一覧の取得に失敗しました: ${error.message}`);
  }

  const items: MediaItem[] = [];

  for (const item of data ?? []) {
    // .gitkeep は非表示
    if (item.name === '.gitkeep') continue;

    // metadata が null = フォルダ
    const isFolder = item.metadata === null;
    const itemPath = folder ? `${folder}/${item.name}` : item.name;
    const storagePath = `${tenantId}/${itemPath}`;

    let url = '';
    if (!isFolder) {
      const { data: urlData } = supabase.storage
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
