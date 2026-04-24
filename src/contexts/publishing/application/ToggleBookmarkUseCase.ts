import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IArticleBookmarkRepository } from '@/contexts/publishing/domain/IArticleBookmarkRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import { ArticleBookmarked } from '@/contexts/publishing/domain/bookmark/ArticleBookmarked';
import { ArticleBookmarkRemoved } from '@/contexts/publishing/domain/bookmark/ArticleBookmarkRemoved';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export interface ToggleBookmarkInput {
  articleId: ArticleId;
  userId: UserId;
  tenantId: TenantId;
}

export interface ToggleBookmarkOutput {
  bookmarked: boolean;
}

export class ToggleBookmarkUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly bookmarkRepository: IArticleBookmarkRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(input: ToggleBookmarkInput): Promise<ToggleBookmarkOutput> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    const existingBookmark = await this.bookmarkRepository.findByArticleAndUser(
      input.articleId,
      input.userId,
      input.tenantId
    );

    if (existingBookmark) {
      await this.bookmarkRepository.delete(
        input.articleId,
        input.userId,
        input.tenantId
      );
      await this.eventPublisher.publishAll([
        new ArticleBookmarkRemoved(
          input.articleId,
          input.userId,
          input.tenantId,
          new Date()
        ),
      ]);
      return { bookmarked: false };
    }

    const bookmark = ArticleBookmark.create(
      input.articleId,
      input.userId,
      input.tenantId
    );
    await this.bookmarkRepository.save(bookmark);
    await this.eventPublisher.publishAll([
      new ArticleBookmarked(
        input.articleId,
        input.userId,
        input.tenantId,
        bookmark.createdAt
      ),
    ]);
    return { bookmarked: true };
  }
}
