import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IArticleLikeRepository } from '@/contexts/publishing/domain/IArticleLikeRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import { ArticleLike } from '@/contexts/publishing/domain/like/ArticleLike';
import { ArticleLiked } from '@/contexts/publishing/domain/like/ArticleLiked';
import { ArticleLikeRemoved } from '@/contexts/publishing/domain/like/ArticleLikeRemoved';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export interface ToggleLikeInput {
  articleId: ArticleId;
  userId: UserId;
  tenantId: TenantId;
}

export interface ToggleLikeOutput {
  liked: boolean;
}

export class ToggleLikeUseCase {
  constructor(
    private readonly articleRepository: IArticleRepository,
    private readonly likeRepository: IArticleLikeRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(input: ToggleLikeInput): Promise<ToggleLikeOutput> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    const existingLike = await this.likeRepository.findByArticleAndUser(
      input.articleId,
      input.userId,
      input.tenantId
    );

    if (existingLike) {
      article.decrementLikeCount();
      await this.likeRepository.delete(
        input.articleId,
        input.userId,
        input.tenantId
      );
      await this.articleRepository.save(article);
      await this.eventPublisher.publishAll([
        new ArticleLikeRemoved(
          input.articleId,
          input.userId,
          input.tenantId,
          new Date()
        ),
      ]);
      return { liked: false };
    }

    const like = ArticleLike.create(
      input.articleId,
      input.userId,
      input.tenantId
    );
    article.incrementLikeCount();
    await this.likeRepository.save(like);
    await this.articleRepository.save(article);
    await this.eventPublisher.publishAll([
      new ArticleLiked(
        input.articleId,
        input.userId,
        input.tenantId,
        like.createdAt
      ),
    ]);
    return { liked: true };
  }
}
