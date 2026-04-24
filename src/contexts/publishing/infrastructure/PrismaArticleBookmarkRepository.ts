import type { PrismaClient } from '@prisma/client';
import type { IArticleBookmarkRepository } from '@/contexts/publishing/domain/IArticleBookmarkRepository';
import { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleId as ArticleIdClass } from '@/contexts/publishing/domain/article/ArticleId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import type {
  PaginationParams,
  PaginatedResult,
} from '@/contexts/shared-kernel/Pagination';

export class PrismaArticleBookmarkRepository implements IArticleBookmarkRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByArticleAndUser(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<ArticleBookmark | null> {
    const row = await this.prisma.articleBookmark.findFirst({
      where: {
        articleId: articleId.toString(),
        userId: userId.toString(),
        tenantId: tenantId.toString(),
      },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByUserPaginated(
    userId: UserId,
    tenantId: TenantId,
    pagination: PaginationParams
  ): Promise<PaginatedResult<ArticleBookmark>> {
    const where: Record<string, unknown> = {
      userId: userId.toString(),
      tenantId: tenantId.toString(),
    };

    if (pagination.cursor) {
      const cursorRow = await this.prisma.articleBookmark.findUnique({
        where: {
          articleId_userId: {
            articleId: pagination.cursor,
            userId: userId.toString(),
          },
        },
      });
      if (cursorRow) {
        where['createdAt'] = { lt: cursorRow.createdAt };
      }
    }

    const items = await this.prisma.articleBookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' as const },
      take: pagination.limit + 1,
    });

    const hasNextPage = items.length > pagination.limit;
    if (hasNextPage) items.pop();

    const lastItem = items[items.length - 1];

    return {
      items: items.map((row) => this.toDomain(row)),
      nextCursor: hasNextPage && lastItem ? lastItem.articleId : null,
      prevCursor: pagination.cursor ?? null,
      hasNextPage,
      hasPrevPage: !!pagination.cursor,
    };
  }

  async save(bookmark: ArticleBookmark): Promise<void> {
    await this.prisma.articleBookmark.create({
      data: {
        articleId: bookmark.articleId.toString(),
        userId: bookmark.userId.toString(),
        tenantId: bookmark.tenantId.toString(),
        createdAt: bookmark.createdAt,
      },
    });
  }

  async delete(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<void> {
    await this.prisma.articleBookmark.deleteMany({
      where: {
        articleId: articleId.toString(),
        userId: userId.toString(),
        tenantId: tenantId.toString(),
      },
    });
  }

  private toDomain(row: {
    articleId: string;
    userId: string;
    tenantId: string;
    createdAt: Date;
  }): ArticleBookmark {
    return ArticleBookmark.reconstruct({
      articleId: ArticleIdClass.fromString(row.articleId),
      userId: UserId.fromString(row.userId),
      tenantId: TenantId.fromString(row.tenantId),
      createdAt: row.createdAt,
    });
  }
}
