import { describe, it, expect } from 'vitest';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

describe('ArticleTitle', () => {
  describe('正常系', () => {
    it('有効なタイトルで値オブジェクトを作成できる', () => {
      // Arrange & Act
      const title = ArticleTitle.fromString('技術ブログ記事');

      // Assert
      expect(title.toString()).toBe('技術ブログ記事');
    });

    it('前後の空白がトリムされる', () => {
      // Arrange & Act
      const title = ArticleTitle.fromString('  技術ブログ記事  ');

      // Assert
      expect(title.toString()).toBe('技術ブログ記事');
    });
  });

  describe('バリデーション', () => {
    it('空文字の場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => ArticleTitle.fromString('')).toThrow(DomainError);
      expect(() => ArticleTitle.fromString('')).toThrow('タイトルは必須です');
    });

    it('101文字以上の場合、エラーを投げる', () => {
      // Arrange
      const longTitle = 'a'.repeat(101);

      // Act & Assert
      expect(() => ArticleTitle.fromString(longTitle)).toThrow(DomainError);
      expect(() => ArticleTitle.fromString(longTitle)).toThrow(
        'タイトルは100文字以内です'
      );
    });

    it('100文字ちょうどは作成できる', () => {
      // Arrange
      const title100 = 'a'.repeat(100);

      // Act
      const title = ArticleTitle.fromString(title100);

      // Assert
      expect(title.toString()).toBe(title100);
    });

    it('1文字は作成できる', () => {
      // Arrange & Act
      const title = ArticleTitle.fromString('a');

      // Assert
      expect(title.toString()).toBe('a');
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const title1 = ArticleTitle.fromString('タイトル');
      const title2 = ArticleTitle.fromString('タイトル');

      // Act
      const result = title1.equals(title2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const title1 = ArticleTitle.fromString('タイトル1');
      const title2 = ArticleTitle.fromString('タイトル2');

      // Act
      const result = title1.equals(title2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('不変性', () => {
    it('toString() は内部値を返す', () => {
      // Arrange
      const title = ArticleTitle.fromString('技術ブログ記事');

      // Act
      const result = title.toString();

      // Assert
      expect(result).toBe('技術ブログ記事');
    });
  });

  describe('isEmpty', () => {
    it('isEmpty() は false を返す', () => {
      // Arrange
      const title = ArticleTitle.fromString('タイトル');

      // Act
      const result = title.isEmpty();

      // Assert
      expect(result).toBe(false);
    });
  });
});
