import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListArticlesUseCase } from '@/contexts/publishing/application/ListArticlesUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type {
  ArticleListFilter,
  ArticleSortOption,
} from '@/contexts/publishing/domain/IArticleRepository';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import type {
  PaginatedResult,
  PaginationParams,
} from '@/contexts/shared-kernel/Pagination';

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

describe('ListArticlesUseCase', () => {
  let useCase: ListArticlesUseCase;
  let mockRepository: IArticleRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findByIds: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      existsBySlug: vi.fn(),
      incrementViewCount: vi.fn(),
    };
    useCase = new ListArticlesUseCase(mockRepository);
  });

  describe('正常系', () => {
    it('ページネーション付きで記事一覧を返す', async () => {
      // Arrange
      const article = createTestArticle();
      const paginatedResult: PaginatedResult<Article> = {
        items: [article],
        nextCursor: null,
        prevCursor: null,
        hasNextPage: false,
        hasPrevPage: false,
      };
      vi.mocked(mockRepository.findPaginated).mockResolvedValue(
        paginatedResult
      );
      const pagination: PaginationParams = { limit: 10 };

      // Act
      const result = await useCase.execute({
        tenantId: TenantId.personal(),
        pagination,
      });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.hasNextPage).toBe(false);
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        TenantId.personal(),
        pagination,
        undefined,
        undefined
      );
    });

    it('フィルタを適用できる', async () => {
      // Arrange
      const paginatedResult: PaginatedResult<Article> = {
        items: [],
        nextCursor: null,
        prevCursor: null,
        hasNextPage: false,
        hasPrevPage: false,
      };
      vi.mocked(mockRepository.findPaginated).mockResolvedValue(
        paginatedResult
      );
      const pagination: PaginationParams = { limit: 10 };
      const filter: ArticleListFilter = {
        status: ArticleStatus.published(),
      };

      // Act
      await useCase.execute({
        tenantId: TenantId.personal(),
        pagination,
        filter,
      });

      // Assert
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        TenantId.personal(),
        pagination,
        filter,
        undefined
      );
    });

    it('ソートを適用できる', async () => {
      // Arrange
      const paginatedResult: PaginatedResult<Article> = {
        items: [],
        nextCursor: null,
        prevCursor: null,
        hasNextPage: false,
        hasPrevPage: false,
      };
      vi.mocked(mockRepository.findPaginated).mockResolvedValue(
        paginatedResult
      );
      const pagination: PaginationParams = { limit: 10 };
      const sort: ArticleSortOption = {
        field: 'publishedAt',
        direction: 'desc',
      };

      // Act
      await useCase.execute({
        tenantId: TenantId.personal(),
        pagination,
        sort,
      });

      // Assert
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        TenantId.personal(),
        pagination,
        undefined,
        sort
      );
    });
  });
});
