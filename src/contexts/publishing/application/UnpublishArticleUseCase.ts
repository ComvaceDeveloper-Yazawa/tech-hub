import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';

export interface UnpublishArticleInput {
  articleId: ArticleId;
  tenantId: TenantId;
  requesterId: UserId;
  isPrivilegedActor: boolean;
}

export class UnpublishArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(input: UnpublishArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    if (
      !article.canBeUnpublishedBy(input.requesterId, {
        isPrivileged: input.isPrivilegedActor,
      })
    ) {
      throw new PermissionDeniedError('記事を非公開にする権限がありません');
    }

    article.unpublish();

    await this.articleRepository.save(article);
    await this.eventPublisher.publishAll(article.getDomainEvents());
    article.clearDomainEvents();
  }
}
