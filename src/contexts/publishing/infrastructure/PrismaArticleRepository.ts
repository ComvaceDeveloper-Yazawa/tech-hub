import type { PrismaClient } from '@prisma/client';
import type {
  IArticleRepository,
  ArticleListFilter,
  ArticleSortOption,
} from '@/contexts/publishing/domain/IArticleRepository';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ViewCount } from '@/contexts/publishing/domain/article/ViewCount';
import { LikeCount } from '@/contexts/publishing/domain/article/LikeCount';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import type {
  PaginationParams,
  PaginatedResult,
} from '@/contexts/shared-kernel/Pagination';

interface PrismaArticleRow {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  status: string;
  slug: string;
  authorId: string;
  viewCount: number;
  likeCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: { tagId: string }[];
}

export class PrismaArticleRepository implements IArticleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: ArticleId, tenantId: TenantId): Promise<Article | null> {
    const row = await this.prisma.article.findFirst({
      where: { id: id.toString(), tenantId: tenantId.toString() },
      include: { tags: true },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findBySlug(slug: Slug, tenantId: TenantId): Promise<Article | null> {
    const row = await this.prisma.article.findFirst({
      where: { slug: slug.toString(), tenantId: tenantId.toString() },
      include: { tags: true },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findPaginated(
    tenantId: TenantId,
    pagination: PaginationParams,
    filter?: ArticleListFilter,
    sort?: ArticleSortOption
  ): Promise<PaginatedResult<Article>> {
    const where: Record<string, unknown> = {
      tenantId: tenantId.toString(),
    };

    if (filter?.status) {
      where['status'] = filter.status.toString();
    }
    if (filter?.authorId) {
      where['authorId'] = filter.authorId.toString();
    }
    if (filter?.tagId) {
      where['tags'] = { some: { tagId: filter.tagId.toString() } };
    }

    const sortField = sort?.field ?? 'createdAt';
    const sortDirection = sort?.direction ?? 'desc';
    const orderBy = { [sortField]: sortDirection };

    const items = await this.prisma.article.findMany({
      where,
      orderBy,
      take: pagination.limit + 1,
      ...(pagination.cursor
        ? { cursor: { id: pagination.cursor }, skip: 1 }
        : {}),
      include: { tags: true },
    });

    const hasNextPage = items.length > pagination.limit;
    if (hasNextPage) items.pop();

    const lastItem = items[items.length - 1];

    return {
      items: items.map((row) => this.toDomain(row)),
      nextCursor: hasNextPage && lastItem ? lastItem.id : null,
      prevCursor: pagination.cursor ?? null,
      hasNextPage,
      hasPrevPage: !!pagination.cursor,
    };
  }

  async save(article: Article): Promise<void> {
    const data = this.toPersistence(article);

    await this.prisma.$transaction(async (tx) => {
      await tx.article.upsert({
        where: { id: data.id },
        update: {
          tenantId: data.tenantId,
          title: data.title,
          content: data.content,
          status: data.status,
          slug: data.slug,
          authorId: data.authorId,
          viewCount: data.viewCount,
          likeCount: data.likeCount,
          publishedAt: data.publishedAt,
          updatedAt: data.updatedAt,
        },
        create: data,
      });

      await tx.articleTag.deleteMany({
        where: { articleId: data.id },
      });

      const tagIds = article.tagIds;
      if (tagIds.length > 0) {
        await tx.articleTag.createMany({
          data: tagIds.map((tagId) => ({
            articleId: data.id,
            tagId: tagId.toString(),
            tenantId: data.tenantId,
          })),
        });
      }
    });
  }

  async delete(id: ArticleId, tenantId: TenantId): Promise<void> {
    await this.prisma.article.deleteMany({
      where: { id: id.toString(), tenantId: tenantId.toString() },
    });
  }

  async existsBySlug(slug: Slug, tenantId: TenantId): Promise<boolean> {
    const count = await this.prisma.article.count({
      where: { slug: slug.toString(), tenantId: tenantId.toString() },
    });
    return count > 0;
  }

  async incrementViewCount(id: ArticleId, tenantId: TenantId): Promise<void> {
    await this.prisma.article.updateMany({
      where: { id: id.toString(), tenantId: tenantId.toString() },
      data: { viewCount: { increment: 1 } },
    });
  }

  private toDomain(row: PrismaArticleRow): Article {
    return Article.reconstruct({
      id: ArticleId.fromString(row.id),
      tenantId: TenantId.fromString(row.tenantId),
      title: ArticleTitle.fromString(row.title),
      content: ArticleContent.fromString(row.content),
      status:
        row.status === 'published'
          ? ArticleStatus.published()
          : ArticleStatus.draft(),
      slug: Slug.fromString(row.slug),
      authorId: UserId.fromString(row.authorId),
      tagIds: (row.tags ?? []).map((t) => TagId.fromString(t.tagId)),
      viewCount: ViewCount.fromNumber(row.viewCount),
      likeCount: LikeCount.fromNumber(row.likeCount),
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPersistence(article: Article) {
    return {
      id: article.id.toString(),
      tenantId: article.tenantId.toString(),
      title: article.title.toString(),
      content: article.content.toString(),
      status: article.status.toString(),
      slug: article.slug.toString(),
      authorId: article.authorId.toString(),
      viewCount: article.viewCount.toNumber(),
      likeCount: article.likeCount.toNumber(),
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
