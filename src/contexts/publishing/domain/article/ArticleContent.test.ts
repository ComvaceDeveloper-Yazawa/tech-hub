import { describe, it, expect } from 'vitest';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';

describe('ArticleContent', () => {
  describe('正常系', () => {
    it('有効な本文で値オブジェクトを作成できる', () => {
      // Arrange & Act
      const content = ArticleContent.fromString('技術ブログの本文です');

      // Assert
      expect(content.toString()).toBe('技術ブログの本文です');
    });

    it('空文字で値オブジェクトを作成できる', () => {
      // Arrange & Act
      const content = ArticleContent.fromString('');

      // Assert
      expect(content.toString()).toBe('');
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const content1 = ArticleContent.fromString('本文');
      const content2 = ArticleContent.fromString('本文');

      // Act
      const result = content1.equals(content2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const content1 = ArticleContent.fromString('本文1');
      const content2 = ArticleContent.fromString('本文2');

      // Act
      const result = content1.equals(content2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('空文字の場合、isEmpty() は true を返す', () => {
      // Arrange
      const content = ArticleContent.fromString('');

      // Act
      const result = content.isEmpty();

      // Assert
      expect(result).toBe(true);
    });

    it('本文がある場合、isEmpty() は false を返す', () => {
      // Arrange
      const content = ArticleContent.fromString('本文があります');

      // Act
      const result = content.isEmpty();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('charCount', () => {
    it('charCount() は文字数を返す', () => {
      // Arrange
      const content = ArticleContent.fromString('こんにちは');

      // Act
      const result = content.charCount();

      // Assert
      expect(result).toBe(5);
    });

    it('空文字の場合、charCount() は 0 を返す', () => {
      // Arrange
      const content = ArticleContent.fromString('');

      // Act
      const result = content.charCount();

      // Assert
      expect(result).toBe(0);
    });
  });
});
