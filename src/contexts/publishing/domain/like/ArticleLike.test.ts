import { describe, it, expect } from 'vitest';
import { ArticleLike } from '@/contexts/publishing/domain/like/ArticleLike';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

describe('ArticleLike', () => {
  const articleId = ArticleId.generate();
  const userId = UserId.fromString('01JXGQ00000000000000000001');
  const tenantId = TenantId.personal();

  describe('create()', () => {
    it('いいねを作成できる', () => {
      // Arrange & Act
      const like = ArticleLike.create(articleId, userId, tenantId);

      // Assert
      expect(like.articleId.equals(articleId)).toBe(true);
      expect(like.userId.equals(userId)).toBe(true);
      expect(like.tenantId.equals(tenantId)).toBe(true);
    });

    it('createdAt が設定される', () => {
      // Arrange
      const before = new Date();

      // Act
      const like = ArticleLike.create(articleId, userId, tenantId);

      // Assert
      const after = new Date();
      expect(like.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(like.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('reconstruct()', () => {
    it('復元できる', () => {
      // Arrange
      const createdAt = new Date('2025-01-01T00:00:00Z');

      // Act
      const like = ArticleLike.reconstruct({
        articleId,
        userId,
        tenantId,
        createdAt,
      });

      // Assert
      expect(like.articleId.equals(articleId)).toBe(true);
      expect(like.userId.equals(userId)).toBe(true);
      expect(like.tenantId.equals(tenantId)).toBe(true);
      expect(like.createdAt).toBe(createdAt);
    });
  });

  describe('getter', () => {
    it('プロパティにアクセスできる', () => {
      // Arrange
      const createdAt = new Date('2025-06-01T12:00:00Z');
      const like = ArticleLike.reconstruct({
        articleId,
        userId,
        tenantId,
        createdAt,
      });

      // Assert
      expect(like.articleId).toBe(articleId);
      expect(like.userId).toBe(userId);
      expect(like.tenantId).toBe(tenantId);
      expect(like.createdAt).toBe(createdAt);
    });
  });
});
