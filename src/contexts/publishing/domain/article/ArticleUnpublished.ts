import type { DomainEvent } from '@/contexts/shared-kernel/DomainEvent';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export class ArticleUnpublished implements DomainEvent {
  constructor(
    public readonly articleId: ArticleId,
    public readonly tenantId: TenantId,
    public readonly unpublishedAt: Date,
    public readonly occurredAt: Date = new Date()
  ) {}
}
