'use server';

import { ulid } from 'ulid';
import { prisma } from '@/lib/prisma';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

/**
 * タグ名の配列を受け取り、upsertしてIDの配列を返す
 * - 正規化名（lowercase）で重複チェック
 * - 新規なら作成、既存なら既存のIDを返す
 */
export async function upsertTags(tagNames: string[]): Promise<string[]> {
  if (tagNames.length === 0) return [];

  const tenantId = TenantId.personal().toString();
  const tagIds: string[] = [];

  for (const name of tagNames) {
    const normalizedName = name.trim().toLowerCase();
    if (!normalizedName) continue;

    // 既存タグを検索
    const existing = await prisma.tag.findUnique({
      where: { tenantId_normalizedName: { tenantId, normalizedName } },
    });

    if (existing) {
      tagIds.push(existing.id);
    } else {
      // 新規作成
      const newTag = await prisma.tag.create({
        data: {
          id: ulid(),
          tenantId,
          name: name.trim(), // 最初に入力された表示名を保持
          normalizedName,
        },
      });
      tagIds.push(newTag.id);
    }
  }

  return tagIds;
}
