import { describe, it, expect } from 'vitest';
import { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

describe('ArticleBookmark', () => {
  const articleId = ArticleId.generate();
  const userId = UserId.fromString('01JXGQ00000000000000000001');
  const tenantId = TenantId.personal();

  describe('create()', () => {
    it('ブックマークを作成できる', () => {
      // Arrange & Act
      const bookmark = ArticleBookmark.create(articleId, userId, tenantId);

      // Assert
      expect(bookmark.articleId.equals(articleId)).toBe(true);
      expect(bookmark.userId.equals(userId)).toBe(true);
      expect(bookmark.tenantId.equals(tenantId)).toBe(true);
    });

    it('createdAt が設定される', () => {
      // Arrange
      const before = new Date();

      // Act
      const bookmark = ArticleBookmark.create(articleId, userId, tenantId);

      // Assert
      const after = new Date();
      expect(bookmark.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
      expect(bookmark.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('reconstruct()', () => {
    it('復元できる', () => {
      // Arrange
      const createdAt = new Date('2025-01-01T00:00:00Z');

      // Act
      const bookmark = ArticleBookmark.reconstruct({
        articleId,
        userId,
        tenantId,
        createdAt,
      });

      // Assert
      expect(bookmark.articleId.equals(articleId)).toBe(true);
      expect(bookmark.userId.equals(userId)).toBe(true);
      expect(bookmark.tenantId.equals(tenantId)).toBe(true);
      expect(bookmark.createdAt).toBe(createdAt);
    });
  });

  describe('getter', () => {
    it('プロパティにアクセスできる', () => {
      // Arrange
      const createdAt = new Date('2025-06-01T12:00:00Z');
      const bookmark = ArticleBookmark.reconstruct({
        articleId,
        userId,
        tenantId,
        createdAt,
      });

      // Assert
      expect(bookmark.articleId).toBe(articleId);
      expect(bookmark.userId).toBe(userId);
      expect(bookmark.tenantId).toBe(tenantId);
      expect(bookmark.createdAt).toBe(createdAt);
    });
  });
});
