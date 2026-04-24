import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordViewUseCase } from '@/contexts/publishing/application/RecordViewUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
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

describe('RecordViewUseCase', () => {
  let useCase: RecordViewUseCase;
  let mockRepository: IArticleRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      existsBySlug: vi.fn(),
      incrementViewCount: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new RecordViewUseCase(mockRepository);
  });

  describe('正常系', () => {
    it('閲覧数を 1 増加させる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(mockRepository.incrementViewCount).toHaveBeenCalledWith(
        article.id,
        TenantId.personal()
      );
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
