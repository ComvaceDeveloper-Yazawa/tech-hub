import type { Article } from '@/contexts/publishing/domain/article/Article';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';
import type { Slug } from '@/contexts/publishing/domain/article/Slug';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TagId } from '@/contexts/shared-kernel/TagId';
import type {
  PaginationParams,
  PaginatedResult,
} from '@/contexts/shared-kernel/Pagination';

export interface ArticleListFilter {
  status?: ArticleStatus;
  authorId?: UserId;
  tagId?: TagId;
}

export interface ArticleSortOption {
  field: 'publishedAt' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount';
  direction: 'asc' | 'desc';
}

export interface IArticleRepository {
  findById(id: ArticleId, tenantId: TenantId): Promise<Article | null>;
  findByIds(ids: ArticleId[], tenantId: TenantId): Promise<Article[]>;
  findBySlug(slug: Slug, tenantId: TenantId): Promise<Article | null>;
  findPaginated(
    tenantId: TenantId,
    pagination: PaginationParams,
    filter?: ArticleListFilter,
    sort?: ArticleSortOption
  ): Promise<PaginatedResult<Article>>;
  save(article: Article): Promise<void>;
  delete(id: ArticleId, tenantId: TenantId): Promise<void>;
  existsBySlug(slug: Slug, tenantId: TenantId): Promise<boolean>;
  incrementViewCount(id: ArticleId, tenantId: TenantId): Promise<void>;
}
