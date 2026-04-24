import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnpublishArticleUseCase } from '@/contexts/publishing/application/UnpublishArticleUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ArticleUnpublished } from '@/contexts/publishing/domain/article/ArticleUnpublished';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

function createPublishedArticle() {
  const article = Article.create(
    ArticleId.generate(),
    TenantId.personal(),
    ArticleTitle.fromString('テスト記事'),
    ArticleContent.fromString('本文です'),
    Slug.fromString('test-article'),
    UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA')
  );
  article.publish();
  article.clearDomainEvents();
  return article;
}

describe('UnpublishArticleUseCase', () => {
  let useCase: UnpublishArticleUseCase;
  let mockRepository: IArticleRepository;
  let mockEventPublisher: IDomainEventPublisher;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      existsBySlug: vi.fn(),
      incrementViewCount: vi.fn(),
    };
    mockEventPublisher = {
      publishAll: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new UnpublishArticleUseCase(mockRepository, mockEventPublisher);
  });

  describe('正常系', () => {
    it('記事を非公開にできる', async () => {
      // Arrange
      const article = createPublishedArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(article.isDraft()).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(article);
    });

    it('ドメインイベントを発行する', async () => {
      // Arrange
      const article = createPublishedArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);
      const events = vi.mocked(mockEventPublisher.publishAll).mock.calls[0]![0];
      expect(events.some((e) => e instanceof ArticleUnpublished)).toBe(true);
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

    it('既に下書きの場合、DomainError が伝播する', async () => {
      // Arrange
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString('テスト記事'),
        ArticleContent.fromString('本文です'),
        Slug.fromString('test-article'),
        UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA')
      );
      article.clearDomainEvents();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act & Assert
      await expect(
        useCase.execute({
          articleId: article.id,
          tenantId: TenantId.personal(),
        })
      ).rejects.toThrow(DomainError);
      await expect(
        useCase.execute({
          articleId: article.id,
          tenantId: TenantId.personal(),
        })
      ).rejects.toThrow('既に下書き状態です');
    });
  });
});
