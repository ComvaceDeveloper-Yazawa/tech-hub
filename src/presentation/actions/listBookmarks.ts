'use server';

import { listBookmarksInputSchema } from '@/schemas/article';
import { ListBookmarksUseCase } from '@/contexts/publishing/application/ListBookmarksUseCase';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleBookmarkRepository } from '@/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';

export async function listBookmarks(input: {
  cursor?: string;
  limit?: number;
}): Promise<{
  items: Array<{
    articleId: string;
    userId: string;
    createdAt: string;
  }>;
  nextCursor: string | null;
  prevCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const validated = listBookmarksInputSchema.parse(input);

  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error('ログインが必要です');
  }

  const tenantId = TenantId.personal();

  const bookmarkRepository = new PrismaArticleBookmarkRepository(prisma);
  const useCase = new ListBookmarksUseCase(bookmarkRepository);

  const result = await useCase.execute({
    userId,
    tenantId,
    pagination: { cursor: validated.cursor, limit: validated.limit },
  });

  return {
    items: result.items.map((bookmark) => ({
      articleId: bookmark.articleId.toString(),
      userId: bookmark.userId.toString(),
      createdAt: bookmark.createdAt.toISOString(),
    })),
    nextCursor: result.nextCursor,
    prevCursor: result.prevCursor,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  };
}
