import type { PrismaClient } from '@prisma/client';
import type { IArticleLikeRepository } from '@/contexts/publishing/domain/IArticleLikeRepository';
import { ArticleLike } from '@/contexts/publishing/domain/like/ArticleLike';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ArticleId as ArticleIdClass } from '@/contexts/publishing/domain/article/ArticleId';

export class PrismaArticleLikeRepository implements IArticleLikeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByArticleAndUser(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<ArticleLike | null> {
    const row = await this.prisma.articleLike.findFirst({
      where: {
        articleId: articleId.toString(),
        userId: userId.toString(),
        tenantId: tenantId.toString(),
      },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async save(like: ArticleLike): Promise<void> {
    await this.prisma.articleLike.create({
      data: {
        articleId: like.articleId.toString(),
        userId: like.userId.toString(),
        tenantId: like.tenantId.toString(),
        createdAt: like.createdAt,
      },
    });
  }

  async delete(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<void> {
    await this.prisma.articleLike.deleteMany({
      where: {
        articleId: articleId.toString(),
        userId: userId.toString(),
        tenantId: tenantId.toString(),
      },
    });
  }

  async countByArticle(
    articleId: ArticleId,
    tenantId: TenantId
  ): Promise<number> {
    return this.prisma.articleLike.count({
      where: {
        articleId: articleId.toString(),
        tenantId: tenantId.toString(),
      },
    });
  }

  private toDomain(row: {
    articleId: string;
    userId: string;
    tenantId: string;
    createdAt: Date;
  }): ArticleLike {
    return ArticleLike.reconstruct({
      articleId: ArticleIdClass.fromString(row.articleId),
      userId: UserId.fromString(row.userId),
      tenantId: TenantId.fromString(row.tenantId),
      createdAt: row.createdAt,
    });
  }
}
