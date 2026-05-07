import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';

export interface PublishArticleInput {
  articleId: ArticleId;
  tenantId: TenantId;
  requesterId: UserId;
}

export class PublishArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(input: PublishArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    if (!article.canBeEditedBy(input.requesterId)) {
      throw new PermissionDeniedError('記事を公開する権限がありません');
    }

    article.publish();

    await this.articleRepository.save(article);
    await this.eventPublisher.publishAll(article.getDomainEvents());
    article.clearDomainEvents();
  }
}
