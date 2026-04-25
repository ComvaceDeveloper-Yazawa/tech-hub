'use server';

import { ulid } from 'ulid';
import { createClient } from '@/lib/supabase/server';
import { createStorageClient } from '@/lib/supabase/storage';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

export async function uploadMedia(
  formData: FormData
): Promise<{ url: string; path: string }> {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('認証が必要です');

  const file = formData.get('file');
  const folder = formData.get('folder');
  const isPlaceholder = formData.get('placeholder') === 'true';
  const folderPath =
    typeof folder === 'string' && folder.trim() ? folder.trim() : '';

  if (!(file instanceof File)) throw new Error('ファイルが選択されていません');

  if (!isPlaceholder) {
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      )
    ) {
      throw new Error(
        '対応していないファイル形式です。JPEG, PNG, GIF, WebP のみアップロードできます'
      );
    }
    if (file.size > MAX_FILE_SIZE)
      throw new Error('ファイルサイズが5MBを超えています');
  }

  const tenantId = TenantId.personal().toString();
  const ext = isPlaceholder ? 'gitkeep' : (EXTENSION_MAP[file.type] ?? 'bin');
  const fileName = isPlaceholder ? '.gitkeep' : `${ulid()}.${ext}`;
  const filePath = folderPath
    ? `${tenantId}/${folderPath}/${fileName}`
    : `${tenantId}/${fileName}`;

  const storage = createStorageClient();
  const { error } = await storage
    .from('article-images')
    .upload(filePath, file, {
      contentType: isPlaceholder ? 'text/plain' : file.type,
      upsert: true,
    });

  if (error) throw new Error(`アップロードに失敗しました: ${error.message}`);

  const {
    data: { publicUrl },
  } = storage.from('article-images').getPublicUrl(filePath);

  return { url: publicUrl, path: filePath };
}
