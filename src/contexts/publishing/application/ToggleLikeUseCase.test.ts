import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleLikeUseCase } from '@/contexts/publishing/application/ToggleLikeUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IArticleLikeRepository } from '@/contexts/publishing/domain/IArticleLikeRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ArticleLike } from '@/contexts/publishing/domain/like/ArticleLike';
import { ArticleLiked } from '@/contexts/publishing/domain/like/ArticleLiked';
import { ArticleLikeRemoved } from '@/contexts/publishing/domain/like/ArticleLikeRemoved';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

function createTestArticle() {
  const article = Article.create(
    ArticleId.generate(),
    TenantId.personal(),
    ArticleTitle.fromString('テスト記事'),
    ArticleContent.fromString('本文です'),
    Slug.fromString('test-article'),
    UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA')
  );
  article.clearDomainEvents();
  return article;
}

describe('ToggleLikeUseCase', () => {
  let useCase: ToggleLikeUseCase;
  let mockArticleRepository: IArticleRepository;
  let mockLikeRepository: IArticleLikeRepository;
  let mockEventPublisher: IDomainEventPublisher;
  const userId = UserId.fromString('01JXGR5KXWT0001AAAAAAAAABB');

  beforeEach(() => {
    mockArticleRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      existsBySlug: vi.fn(),
      incrementViewCount: vi.fn(),
    };
    mockLikeRepository = {
      findByArticleAndUser: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      countByArticle: vi.fn(),
    };
    mockEventPublisher = {
      publishAll: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new ToggleLikeUseCase(
      mockArticleRepository,
      mockLikeRepository,
      mockEventPublisher
    );
  });

  describe('正常系', () => {
    it('未いいね → いいね追加 (liked: true を返す)', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockLikeRepository.findByArticleAndUser).mockResolvedValue(
        null
      );

      // Act
      const result = await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(result.liked).toBe(true);
      expect(mockLikeRepository.save).toHaveBeenCalledTimes(1);
    });

    it('いいね済み → いいね解除 (liked: false を返す)', async () => {
      // Arrange
      const article = createTestArticle();
      const existingLike = ArticleLike.create(
        article.id,
        userId,
        TenantId.personal()
      );
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockLikeRepository.findByArticleAndUser).mockResolvedValue(
        existingLike
      );

      // Act
      const result = await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(result.liked).toBe(false);
      expect(mockLikeRepository.delete).toHaveBeenCalledWith(
        article.id,
        userId,
        TenantId.personal()
      );
    });

    it('いいね追加時に likeCount が増加する', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockLikeRepository.findByArticleAndUser).mockResolvedValue(
        null
      );

      // Act
      await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(article.likeCount.toNumber()).toBe(1);
      expect(mockArticleRepository.save).toHaveBeenCalledWith(article);
    });

    it('いいね解除時に likeCount が減少する', async () => {
      // Arrange
      const article = createTestArticle();
      article.incrementLikeCount(); // likeCount = 1
      const existingLike = ArticleLike.create(
        article.id,
        userId,
        TenantId.personal()
      );
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockLikeRepository.findByArticleAndUser).mockResolvedValue(
        existingLike
      );

      // Act
      await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(article.likeCount.toNumber()).toBe(0);
      expect(mockArticleRepository.save).toHaveBeenCalledWith(article);
    });

    it('いいね追加時に ArticleLiked イベントを発行する', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockLikeRepository.findByArticleAndUser).mockResolvedValue(
        null
      );

      // Act
      await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);
      const events = vi.mocked(mockEventPublisher.publishAll).mock.calls[0]![0];
      expect(events.some((e) => e instanceof ArticleLiked)).toBe(true);
    });

    it('いいね解除時に ArticleLikeRemoved イベントを発行する', async () => {
      // Arrange
      const article = createTestArticle();
      const existingLike = ArticleLike.create(
        article.id,
        userId,
        TenantId.personal()
      );
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockLikeRepository.findByArticleAndUser).mockResolvedValue(
        existingLike
      );

      // Act
      await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);
      const events = vi.mocked(mockEventPublisher.publishAll).mock.calls[0]![0];
      expect(events.some((e) => e instanceof ArticleLikeRemoved)).toBe(true);
    });
  });

  describe('異常系', () => {
    it('記事が見つからない場合、ApplicationError を投げる', async () => {
      // Arrange
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute({
          articleId: ArticleId.generate(),
          userId,
          tenantId: TenantId.personal(),
        })
      ).rejects.toThrow(ApplicationError);
      await expect(
        useCase.execute({
          articleId: ArticleId.generate(),
          userId,
          tenantId: TenantId.personal(),
        })
      ).rejects.toThrow('記事が見つかりません');
    });
  });
});
