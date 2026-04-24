'use server';

import { listBookmarksInputSchema } from '@/schemas/article';
import { ListBookmarksUseCase } from '@/contexts/publishing/application/ListBookmarksUseCase';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { PrismaArticleBookmarkRepository } from '@/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository';
import { prisma } from '@/lib/prisma';

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

  const tenantId = TenantId.personal();
  // TODO: Get userId from Supabase Auth session
  const userId = UserId.fromString('00000000000000000000000001');

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
