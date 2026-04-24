import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToggleBookmarkUseCase } from '@/contexts/publishing/application/ToggleBookmarkUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IArticleBookmarkRepository } from '@/contexts/publishing/domain/IArticleBookmarkRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import { ArticleBookmarked } from '@/contexts/publishing/domain/bookmark/ArticleBookmarked';
import { ArticleBookmarkRemoved } from '@/contexts/publishing/domain/bookmark/ArticleBookmarkRemoved';
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

describe('ToggleBookmarkUseCase', () => {
  let useCase: ToggleBookmarkUseCase;
  let mockArticleRepository: IArticleRepository;
  let mockBookmarkRepository: IArticleBookmarkRepository;
  let mockEventPublisher: IDomainEventPublisher;
  const userId = UserId.fromString('01JXGR5KXWT0001AAAAAAAAABB');

  beforeEach(() => {
    mockArticleRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      existsBySlug: vi.fn(),
      incrementViewCount: vi.fn(),
    };
    mockBookmarkRepository = {
      findByArticleAndUser: vi.fn(),
      findByUserPaginated: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    mockEventPublisher = {
      publishAll: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new ToggleBookmarkUseCase(
      mockArticleRepository,
      mockBookmarkRepository,
      mockEventPublisher
    );
  });

  describe('正常系', () => {
    it('未ブックマーク → ブックマーク追加 (bookmarked: true を返す)', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockBookmarkRepository.findByArticleAndUser).mockResolvedValue(
        null
      );

      // Act
      const result = await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(result.bookmarked).toBe(true);
      expect(mockBookmarkRepository.save).toHaveBeenCalledTimes(1);
    });

    it('ブックマーク済み → ブックマーク解除 (bookmarked: false を返す)', async () => {
      // Arrange
      const article = createTestArticle();
      const existingBookmark = ArticleBookmark.create(
        article.id,
        userId,
        TenantId.personal()
      );
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockBookmarkRepository.findByArticleAndUser).mockResolvedValue(
        existingBookmark
      );

      // Act
      const result = await useCase.execute({
        articleId: article.id,
        userId,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(result.bookmarked).toBe(false);
      expect(mockBookmarkRepository.delete).toHaveBeenCalledWith(
        article.id,
        userId,
        TenantId.personal()
      );
    });

    it('ブックマーク追加時に ArticleBookmarked イベントを発行する', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockBookmarkRepository.findByArticleAndUser).mockResolvedValue(
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
      expect(events.some((e) => e instanceof ArticleBookmarked)).toBe(true);
    });

    it('ブックマーク解除時に ArticleBookmarkRemoved イベントを発行する', async () => {
      // Arrange
      const article = createTestArticle();
      const existingBookmark = ArticleBookmark.create(
        article.id,
        userId,
        TenantId.personal()
      );
      vi.mocked(mockArticleRepository.findById).mockResolvedValue(article);
      vi.mocked(mockBookmarkRepository.findByArticleAndUser).mockResolvedValue(
        existingBookmark
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
      expect(events.some((e) => e instanceof ArticleBookmarkRemoved)).toBe(
        true
      );
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
