'use server';

import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

/**
 * 複数記事のいいね・ブックマーク状態を一括取得する
 */
export async function checkBulkStatus(articleIds: string[]): Promise<{
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}> {
  if (articleIds.length === 0) {
    return { likes: {}, bookmarks: {} };
  }

  const userId = await getAuthUserId();
  if (!userId) {
    return {
      likes: Object.fromEntries(articleIds.map((id) => [id, false])),
      bookmarks: Object.fromEntries(articleIds.map((id) => [id, false])),
    };
  }

  const tenantId = TenantId.personal().toString();
  const userIdStr = userId.toString();

  const [likeRows, bookmarkRows] = await Promise.all([
    prisma.articleLike.findMany({
      where: { articleId: { in: articleIds }, userId: userIdStr, tenantId },
      select: { articleId: true },
    }),
    prisma.articleBookmark.findMany({
      where: { articleId: { in: articleIds }, userId: userIdStr, tenantId },
      select: { articleId: true },
    }),
  ]);

  const likedSet = new Set(likeRows.map((r) => r.articleId));
  const bookmarkedSet = new Set(bookmarkRows.map((r) => r.articleId));

  return {
    likes: Object.fromEntries(articleIds.map((id) => [id, likedSet.has(id)])),
    bookmarks: Object.fromEntries(
      articleIds.map((id) => [id, bookmarkedSet.has(id)])
    ),
  };
}
