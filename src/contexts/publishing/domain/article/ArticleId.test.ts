import { describe, it, expect } from 'vitest';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';

describe('ArticleId', () => {
  const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

  describe('generate()', () => {
    it('generate() で有効な ArticleId を生成できる', () => {
      // Arrange & Act
      const id = ArticleId.generate();

      // Assert
      expect(id.toString()).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    });

    it('generate() は毎回異なる ID を生成する', () => {
      // Arrange & Act
      const id1 = ArticleId.generate();
      const id2 = ArticleId.generate();

      // Assert
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('fromString()', () => {
    it('fromString() で有効な ULID から ArticleId を作成できる', () => {
      // Arrange & Act
      const id = ArticleId.fromString(validUlid);

      // Assert
      expect(id.toString()).toBe(validUlid);
    });

    it('無効な ULID でエラーを投げる', () => {
      // Arrange
      const invalidUlid = 'invalid-ulid';

      // Act & Assert
      expect(() => ArticleId.fromString(invalidUlid)).toThrow('Invalid ULID');
    });
  });

  describe('equals()', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const id1 = ArticleId.fromString(validUlid);
      const id2 = ArticleId.fromString(validUlid);

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const id1 = ArticleId.fromString('01ARZ3NDEKTSV4RRFFQ69G5FAV');
      const id2 = ArticleId.fromString('01BX5ZZKBKACTAV9WEVGEMMVRY');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });
});
