import type { DomainEvent } from '@/contexts/shared-kernel/DomainEvent';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export class ArticlePublished implements DomainEvent {
  constructor(
    public readonly articleId: ArticleId,
    public readonly tenantId: TenantId,
    public readonly publishedAt: Date,
    public readonly occurredAt: Date = new Date()
  ) {}
}
