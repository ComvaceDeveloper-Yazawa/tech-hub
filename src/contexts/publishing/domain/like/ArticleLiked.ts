import type { DomainEvent } from '@/contexts/shared-kernel/DomainEvent';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export class ArticleLiked implements DomainEvent {
  constructor(
    public readonly articleId: ArticleId,
    public readonly userId: UserId,
    public readonly tenantId: TenantId,
    public readonly likedAt: Date,
    public readonly occurredAt: Date = new Date()
  ) {}
}
