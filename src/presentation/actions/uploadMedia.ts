'use server';

import { ulid } from 'ulid';
import { createClient } from '@/lib/supabase/server';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

const ALLOWED_TYPES = [
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
  const file = formData.get('file');
  const folder = formData.get('folder');
  const folderPath =
    typeof folder === 'string' && folder.trim() ? folder.trim() : '';

  if (!(file instanceof File)) throw new Error('ファイルが選択されていません');
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error(
      '対応していないファイル形式です。JPEG, PNG, GIF, WebP のみアップロードできます'
    );
  }
  if (file.size > MAX_FILE_SIZE)
    throw new Error('ファイルサイズが5MBを超えています');

  const tenantId = TenantId.personal().toString();
  const ext = EXTENSION_MAP[file.type] ?? 'bin';
  const fileName = `${ulid()}.${ext}`;
  const filePath = folderPath
    ? `${tenantId}/${folderPath}/${fileName}`
    : `${tenantId}/${fileName}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from('article-images')
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`アップロードに失敗しました: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from('article-images').getPublicUrl(filePath);

  return { url: publicUrl, path: filePath };
}
