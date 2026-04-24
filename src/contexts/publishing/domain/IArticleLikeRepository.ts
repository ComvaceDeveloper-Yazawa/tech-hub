import type { ArticleLike } from '@/contexts/publishing/domain/like/ArticleLike';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export interface IArticleLikeRepository {
  findByArticleAndUser(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<ArticleLike | null>;
  save(like: ArticleLike): Promise<void>;
  delete(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): Promise<void>;
  countByArticle(articleId: ArticleId, tenantId: TenantId): Promise<number>;
}
