import { describe, it, expect } from 'vitest';
import { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';

describe('ArticleStatus', () => {
  describe('ファクトリメソッド', () => {
    it('draft() で下書きステータスを作成できる', () => {
      // Arrange & Act
      const status = ArticleStatus.draft();

      // Assert
      expect(status.toString()).toBe('draft');
    });

    it('published() で公開済みステータスを作成できる', () => {
      // Arrange & Act
      const status = ArticleStatus.published();

      // Assert
      expect(status.toString()).toBe('published');
    });
  });

  describe('状態判定', () => {
    it('draft の場合、isDraft() は true を返す', () => {
      // Arrange
      const status = ArticleStatus.draft();

      // Act
      const result = status.isDraft();

      // Assert
      expect(result).toBe(true);
    });

    it('draft の場合、isPublished() は false を返す', () => {
      // Arrange
      const status = ArticleStatus.draft();

      // Act
      const result = status.isPublished();

      // Assert
      expect(result).toBe(false);
    });

    it('published の場合、isPublished() は true を返す', () => {
      // Arrange
      const status = ArticleStatus.published();

      // Act
      const result = status.isPublished();

      // Assert
      expect(result).toBe(true);
    });

    it('published の場合、isDraft() は false を返す', () => {
      // Arrange
      const status = ArticleStatus.published();

      // Act
      const result = status.isDraft();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('等価性', () => {
    it('同じステータスの場合、等価と判定される', () => {
      // Arrange
      const status1 = ArticleStatus.draft();
      const status2 = ArticleStatus.draft();

      // Act
      const result = status1.equals(status2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なるステータスの場合、非等価と判定される', () => {
      // Arrange
      const status1 = ArticleStatus.draft();
      const status2 = ArticleStatus.published();

      // Act
      const result = status1.equals(status2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('文字列変換', () => {
    it('draft の toString() は "draft" を返す', () => {
      // Arrange
      const status = ArticleStatus.draft();

      // Act
      const result = status.toString();

      // Assert
      expect(result).toBe('draft');
    });

    it('published の toString() は "published" を返す', () => {
      // Arrange
      const status = ArticleStatus.published();

      // Act
      const result = status.toString();

      // Assert
      expect(result).toBe('published');
    });
  });
});
