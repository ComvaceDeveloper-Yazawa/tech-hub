import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export class ArticleLike {
  private constructor(
    private readonly _articleId: ArticleId,
    private readonly _userId: UserId,
    private readonly _tenantId: TenantId,
    private readonly _createdAt: Date
  ) {}

  static create(
    articleId: ArticleId,
    userId: UserId,
    tenantId: TenantId
  ): ArticleLike {
    return new ArticleLike(articleId, userId, tenantId, new Date());
  }

  static reconstruct(params: {
    articleId: ArticleId;
    userId: UserId;
    tenantId: TenantId;
    createdAt: Date;
  }): ArticleLike {
    return new ArticleLike(
      params.articleId,
      params.userId,
      params.tenantId,
      params.createdAt
    );
  }

  get articleId(): ArticleId {
    return this._articleId;
  }

  get userId(): UserId {
    return this._userId;
  }

  get tenantId(): TenantId {
    return this._tenantId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
