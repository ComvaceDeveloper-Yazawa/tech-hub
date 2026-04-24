import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteArticleUseCase } from '@/contexts/publishing/application/DeleteArticleUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ArticleDeleted } from '@/contexts/publishing/domain/article/ArticleDeleted';
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

describe('DeleteArticleUseCase', () => {
  let useCase: DeleteArticleUseCase;
  let mockRepository: IArticleRepository;
  let mockEventPublisher: IDomainEventPublisher;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
      existsBySlug: vi.fn(),
      incrementViewCount: vi.fn(),
    };
    mockEventPublisher = {
      publishAll: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new DeleteArticleUseCase(mockRepository, mockEventPublisher);
  });

  describe('正常系', () => {
    it('記事を削除できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(
        article.id,
        TenantId.personal()
      );
    });

    it('ArticleDeleted イベントを発行する', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);
      const events = vi.mocked(mockEventPublisher.publishAll).mock.calls[0]![0];
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ArticleDeleted);
    });
  });

  describe('異常系', () => {
    it('記事が見つからない場合、ApplicationError を投げる', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute({
          articleId: ArticleId.generate(),
          tenantId: TenantId.personal(),
        })
      ).rejects.toThrow(ApplicationError);
      await expect(
        useCase.execute({
          articleId: ArticleId.generate(),
          tenantId: TenantId.personal(),
        })
      ).rejects.toThrow('記事が見つかりません');
    });
  });
});
