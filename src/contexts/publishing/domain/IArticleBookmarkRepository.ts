import type { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type {
  PaginationParams,
  PaginatedResult,
} from '@/contexts/shared-kernel/Pagination';

export interface IArticleBookmarkRepository {
  findByArticleAndUser(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<ArticleBookmark | null>;
  findByUserPaginated(
    userId: UserId,
    tenantId: TenantId,
    pagination: PaginationParams
  ): Promise<PaginatedResult<ArticleBookmark>>;
  save(bookmark: ArticleBookmark): Promise<void>;
  delete(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<void>;
}
