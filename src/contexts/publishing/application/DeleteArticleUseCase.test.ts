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
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';

const AUTHOR_ID = '01JXGR5KXWT0001AAAAAAAAAAA';
const OTHER_USER_ID = '01KQ06J562A70XFYHDVHRM0ZY1';

function createTestArticle() {
  const article = Article.create(
    ArticleId.generate(),
    TenantId.personal(),
    ArticleTitle.fromString('テスト記事'),
    ArticleContent.fromString('本文です'),
    Slug.fromString('test-article'),
    UserId.fromString(AUTHOR_ID)
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
      findByIds: vi.fn(),
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
    it('作成者は自分の記事を削除できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
        requesterId: UserId.fromString(AUTHOR_ID),
        isPrivilegedActor: false,
      });

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(
        article.id,
        TenantId.personal()
      );
    });

    it('管理者は他ユーザーの記事を削除できる', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act
      await useCase.execute({
        articleId: article.id,
        tenantId: TenantId.personal(),
        requesterId: UserId.fromString(OTHER_USER_ID),
        isPrivilegedActor: true,
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
        requesterId: UserId.fromString(AUTHOR_ID),
        isPrivilegedActor: false,
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
          requesterId: UserId.fromString(AUTHOR_ID),
          isPrivilegedActor: false,
        })
      ).rejects.toThrow(ApplicationError);
      await expect(
        useCase.execute({
          articleId: ArticleId.generate(),
          tenantId: TenantId.personal(),
          requesterId: UserId.fromString(AUTHOR_ID),
          isPrivilegedActor: false,
        })
      ).rejects.toThrow('記事が見つかりません');
    });

    it('管理者権限のない他ユーザーは他人の記事を削除できない', async () => {
      // Arrange
      const article = createTestArticle();
      vi.mocked(mockRepository.findById).mockResolvedValue(article);

      // Act & Assert
      await expect(
        useCase.execute({
          articleId: article.id,
          tenantId: TenantId.personal(),
          requesterId: UserId.fromString(OTHER_USER_ID),
          isPrivilegedActor: false,
        })
      ).rejects.toThrow(PermissionDeniedError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
