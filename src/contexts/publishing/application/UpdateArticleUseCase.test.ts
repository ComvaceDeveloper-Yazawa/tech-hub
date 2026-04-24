import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateArticleUseCase } from '@/contexts/publishing/application/UpdateArticleUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

function createTestArticle(overrides?: { slug?: Slug }) {
  return Article.create(
    ArticleId.generate(),
    TenantId.personal(),
    ArticleTitle.fromString('元のタイトル'),
    ArticleContent.fromString('元の本文'),
    overrides?.slug ?? Slug.fromString('original-slug'),
    UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA')
  );
}

describe('UpdateArticleUseCase', () => {
  let useCase: UpdateArticleUseCase;
  let mockRepository: IArticleRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByIds: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      existsBySlug: vi.fn().mockResolvedValue(false),
      incrementViewCount: vi.fn(),
    };
    useCase = new UpdateArticleUseCase(mockRepository);
  });

  describe('正常系', () => {
    it('タイトルを更新できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);
      const newTitle = ArticleTitle.fromString('新しいタイトル');

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
        title: newTitle,
      });

      // Assert
      expect(article.title.equals(newTitle)).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(article);
    });

    it('本文を更新できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);
      const newContent = ArticleContent.fromString('新しい本文');

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
        content: newContent,
      });

      // Assert
      expect(article.content.equals(newContent)).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(article);
    });

    it('スラッグを更新できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);
      const newSlug = Slug.fromString('new-slug');

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
        slug: newSlug,
      });

      // Assert
      expect(article.slug.equals(newSlug)).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(article);
    });

    it('タグを更新できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);
      const newTagIds = [
        TagId.fromString('01JXGR5KXWT0001AAAAAAAAAAB'),
        TagId.fromString('01JXGR5KXWT0001AAAAAAAAAAC'),
      ];

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
        tagIds: newTagIds,
      });

      // Assert
      expect(article.tagIds).toHaveLength(2);
      expect(mockRepository.save).toHaveBeenCalledWith(article);
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
          title: ArticleTitle.fromString('新しいタイトル'),
        })
      ).rejects.toThrow(ApplicationError);
      await expect(
        useCase.execute({
          articleId: ArticleId.generate(),
          tenantId: TenantId.personal(),
          title: ArticleTitle.fromString('新しいタイトル'),
        })
      ).rejects.toThrow('記事が見つかりません');
    });

    it('スラッグが重複している場合、ApplicationError を投げる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);
      vi.mocked(mockRepository.existsBySlug).mockResolvedValue(true);

      // Act & Assert
      await expect(
        useCase.execute({
          articleId: article.id,
          tenantId: TenantId.personal(),
          slug: Slug.fromString('duplicate-slug'),
        })
      ).rejects.toThrow(ApplicationError);
      await expect(
        useCase.execute({
          articleId: article.id,
          tenantId: TenantId.personal(),
          slug: Slug.fromString('duplicate-slug'),
        })
      ).rejects.toThrow('このスラッグは既に使用されています');
    });
  });
});
