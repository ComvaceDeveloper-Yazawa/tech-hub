import { describe, it, expect } from 'vitest';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

describe('Slug', () => {
  describe('正常系', () => {
    it('有効なスラッグで値オブジェクトを作成できる', () => {
      // Arrange & Act
      const slug = Slug.fromString('my-first-post');

      // Assert
      expect(slug.toString()).toBe('my-first-post');
    });

    it('数字のみのスラッグを作成できる', () => {
      // Arrange & Act
      const slug = Slug.fromString('123');

      // Assert
      expect(slug.toString()).toBe('123');
    });

    it('英小文字のみのスラッグを作成できる', () => {
      // Arrange & Act
      const slug = Slug.fromString('hello');

      // Assert
      expect(slug.toString()).toBe('hello');
    });

    it('1文字のスラッグを作成できる', () => {
      // Arrange & Act
      const slug = Slug.fromString('a');

      // Assert
      expect(slug.toString()).toBe('a');
    });

    it('200文字ちょうどのスラッグを作成できる', () => {
      // Arrange
      const slug200 = 'a'.repeat(200);

      // Act
      const slug = Slug.fromString(slug200);

      // Assert
      expect(slug.toString()).toBe(slug200);
    });
  });

  describe('バリデーション', () => {
    it('空文字の場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('')).toThrow(DomainError);
      expect(() => Slug.fromString('')).toThrow(
        'スラッグは1〜200文字の英小文字・数字・ハイフンで指定してください'
      );
    });

    it('201文字以上の場合、エラーを投げる', () => {
      // Arrange
      const longSlug = 'a'.repeat(201);

      // Act & Assert
      expect(() => Slug.fromString(longSlug)).toThrow(DomainError);
      expect(() => Slug.fromString(longSlug)).toThrow(
        'スラッグは1〜200文字の英小文字・数字・ハイフンで指定してください'
      );
    });

    it('大文字を含む場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('My-Post')).toThrow(DomainError);
    });

    it('スペースを含む場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('my post')).toThrow(DomainError);
    });

    it('先頭がハイフンの場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('-my-post')).toThrow(DomainError);
    });

    it('末尾がハイフンの場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('my-post-')).toThrow(DomainError);
    });

    it('連続ハイフンを含む場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('my--post')).toThrow(DomainError);
    });

    it('日本語を含む場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('記事-slug')).toThrow(DomainError);
    });

    it('アンダースコアを含む場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => Slug.fromString('my_post')).toThrow(DomainError);
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const slug1 = Slug.fromString('my-post');
      const slug2 = Slug.fromString('my-post');

      // Act
      const result = slug1.equals(slug2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const slug1 = Slug.fromString('my-post');
      const slug2 = Slug.fromString('other-post');

      // Act
      const result = slug1.equals(slug2);

      // Assert
      expect(result).toBe(false);
    });
  });
});
