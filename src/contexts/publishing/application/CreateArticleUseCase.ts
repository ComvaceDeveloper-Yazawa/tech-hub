import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import type { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import type { Slug } from '@/contexts/publishing/domain/article/Slug';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TagId } from '@/contexts/shared-kernel/TagId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export interface CreateArticleInput {
  tenantId: TenantId;
  title: ArticleTitle;
  content: ArticleContent;
  slug: Slug;
  authorId: UserId;
  tagIds?: TagId[];
}

export class CreateArticleUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(input: CreateArticleInput): Promise<ArticleId> {
    const slugExists = await this.articleRepository.existsBySlug(
      input.slug,
      input.tenantId
    );
    if (slugExists) {
      throw new ApplicationError('このスラッグは既に使用されています');
    }

    const articleId = ArticleId.generate();
    const article = Article.create(
      articleId,
      input.tenantId,
      input.title,
      input.content,
      input.slug,
      input.authorId,
      input.tagIds
    );

    await this.articleRepository.save(article);
    await this.eventPublisher.publishAll(article.getDomainEvents());
    article.clearDomainEvents();

    return articleId;
  }
}
