import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ArticleDeleted } from '@/contexts/publishing/domain/article/ArticleDeleted';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export interface DeleteArticleInput {
  articleId: ArticleId;
  tenantId: TenantId;
}

export class DeleteArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(input: DeleteArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    const event = new ArticleDeleted(
      input.articleId,
      input.tenantId,
      new Date()
    );

    await this.articleRepository.delete(input.articleId, input.tenantId);
    await this.eventPublisher.publishAll([event]);
  }
}
