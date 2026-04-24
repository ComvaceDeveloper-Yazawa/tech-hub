import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateArticleUseCase } from '@/contexts/publishing/application/CreateArticleUseCase';
import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { IDomainEventPublisher } from '@/contexts/shared-kernel/IDomainEventPublisher';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ArticleCreated } from '@/contexts/publishing/domain/article/ArticleCreated';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

describe('CreateArticleUseCase', () => {
  let useCase: CreateArticleUseCase;
  let mockRepository: IArticleRepository;
  let mockEventPublisher: IDomainEventPublisher;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findPaginated: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn(),
      existsBySlug: vi.fn().mockResolvedValue(false),
      incrementViewCount: vi.fn(),
    };
    mockEventPublisher = {
      publishAll: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new CreateArticleUseCase(mockRepository, mockEventPublisher);
  });

  describe('正常系', () => {
    it('記事を作成し、リポジトリに保存する', async () => {
      // Arrange
      const input = {
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('テスト記事'),
        content: ArticleContent.fromString('本文です'),
        slug: Slug.fromString('test-article'),
        authorId: UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA'),
      };

      // Act
      await useCase.execute(input);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('ArticleId を返す', async () => {
      // Arrange
      const input = {
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('テスト記事'),
        content: ArticleContent.fromString('本文です'),
        slug: Slug.fromString('test-article'),
        authorId: UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA'),
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toBeInstanceOf(ArticleId);
    });

    it('ドメインイベントを発行する', async () => {
      // Arrange
      const input = {
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('テスト記事'),
        content: ArticleContent.fromString('本文です'),
        slug: Slug.fromString('test-article'),
        authorId: UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA'),
      };

      // Act
      await useCase.execute(input);

      // Assert
      expect(mockEventPublisher.publishAll).toHaveBeenCalledTimes(1);
      const events = vi.mocked(mockEventPublisher.publishAll).mock.calls[0]![0];
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ArticleCreated);
    });

    it('タグ付きで記事を作成できる', async () => {
      // Arrange
      const tagIds = [
        TagId.fromString('01JXGR5KXWT0001AAAAAAAAAAB'),
        TagId.fromString('01JXGR5KXWT0001AAAAAAAAAAC'),
      ];
      const input = {
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('テスト記事'),
        content: ArticleContent.fromString('本文です'),
        slug: Slug.fromString('test-article'),
        authorId: UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA'),
        tagIds,
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toBeInstanceOf(ArticleId);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('異常系', () => {
    it('スラッグが重複している場合、ApplicationError を投げる', async () => {
      // Arrange
      vi.mocked(mockRepository.existsBySlug).mockResolvedValue(true);
      const input = {
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('テスト記事'),
        content: ArticleContent.fromString('本文です'),
        slug: Slug.fromString('duplicate-slug'),
        authorId: UserId.fromString('01JXGR5KXWT0001AAAAAAAAAAA'),
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(ApplicationError);
      await expect(useCase.execute(input)).rejects.toThrow(
        'このスラッグは既に使用されています'
      );
    });
  });
});
