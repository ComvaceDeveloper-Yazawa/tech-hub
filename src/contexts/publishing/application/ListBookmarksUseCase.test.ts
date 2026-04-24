import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListBookmarksUseCase } from '@/contexts/publishing/application/ListBookmarksUseCase';
import type { IArticleBookmarkRepository } from '@/contexts/publishing/domain/IArticleBookmarkRepository';
import { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import type {
  PaginatedResult,
  PaginationParams,
} from '@/contexts/shared-kernel/Pagination';

describe('ListBookmarksUseCase', () => {
  let useCase: ListBookmarksUseCase;
  let mockBookmarkRepository: IArticleBookmarkRepository;

  beforeEach(() => {
    mockBookmarkRepository = {
      findByArticleAndUser: vi.fn(),
      findByUserPaginated: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new ListBookmarksUseCase(mockBookmarkRepository);
  });

  describe('正常系', () => {
    it('ブックマーク一覧をページネーション付きで返す', async () => {
      // Arrange
      const bookmark = ArticleBookmark.create(
        ArticleId.generate(),
        UserId.fromString('01JXGR5KXWT0001AAAAAAAAABB'),
        TenantId.personal()
      );
      const paginatedResult: PaginatedResult<ArticleBookmark> = {
        items: [bookmark],
        nextCursor: null,
        prevCursor: null,
        hasNextPage: false,
        hasPrevPage: false,
      };
      vi.mocked(mockBookmarkRepository.findByUserPaginated).mockResolvedValue(
        paginatedResult
      );
      const pagination: PaginationParams = { limit: 10 };
      const userId = UserId.fromString('01JXGR5KXWT0001AAAAAAAAABB');

      // Act
      const result = await useCase.execute({
        userId,
        tenantId: TenantId.personal(),
        pagination,
      });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.hasNextPage).toBe(false);
      expect(mockBookmarkRepository.findByUserPaginated).toHaveBeenCalledWith(
        userId,
        TenantId.personal(),
        pagination
      );
    });
  });
});
