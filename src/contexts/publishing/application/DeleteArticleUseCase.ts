import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import { ArticleDeleted } from '@/contexts/publishing/domain/article/ArticleDeleted';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';

export interface DeleteArticleInput {
  articleId: ArticleId;
  tenantId: TenantId;
  requesterId: UserId;
  isPrivilegedActor: boolean;
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

    if (
      !article.canBeDeletedBy(input.requesterId, {
        isPrivileged: input.isPrivilegedActor,
      })
    ) {
      throw new PermissionDeniedError('記事を削除する権限がありません');
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
