'use server';

import { ulid } from 'ulid';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

export async function uploadImage(
  formData: FormData
): Promise<{ url: string }> {
  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new Error('ファイルが選択されていません');
  }

  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    throw new Error(
      '対応していないファイル形式です。JPEG, PNG, GIF, WebP のみアップロードできます'
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ファイルサイズが5MBを超えています');
  }

  const tenantId = TenantId.personal().toString();
  const ext = EXTENSION_MAP[file.type] ?? 'bin';
  const filePath = `${tenantId}/${ulid()}.${ext}`;

  const supabase = await createClient();

  const { error } = await supabase.storage
    .from('article-images')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('article-images').getPublicUrl(filePath);

  return { url: publicUrl };
}
