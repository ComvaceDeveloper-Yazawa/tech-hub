import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export interface PublishArticleInput {
  articleId: ArticleId;
  tenantId: TenantId;
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

    article.publish();

    await this.articleRepository.save(article);
    await this.eventPublisher.publishAll(article.getDomainEvents());
    article.clearDomainEvents();
  }
}
