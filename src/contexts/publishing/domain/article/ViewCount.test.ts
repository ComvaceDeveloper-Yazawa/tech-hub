import { describe, it, expect } from 'vitest';
import { ViewCount } from '@/contexts/publishing/domain/article/ViewCount';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

describe('ViewCount', () => {
  describe('ファクトリメソッド', () => {
    it('zero() で閲覧数 0 を作成できる', () => {
      // Arrange & Act
      const viewCount = ViewCount.zero();

      // Assert
      expect(viewCount.toNumber()).toBe(0);
    });

    it('fromNumber() で有効な数値から作成できる', () => {
      // Arrange & Act
      const viewCount = ViewCount.fromNumber(42);

      // Assert
      expect(viewCount.toNumber()).toBe(42);
    });
  });

  describe('バリデーション', () => {
    it('負の値の場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => ViewCount.fromNumber(-1)).toThrow(DomainError);
      expect(() => ViewCount.fromNumber(-1)).toThrow('閲覧数は0以上の整数です');
    });

    it('小数の場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => ViewCount.fromNumber(1.5)).toThrow(DomainError);
      expect(() => ViewCount.fromNumber(1.5)).toThrow(
        '閲覧数は0以上の整数です'
      );
    });
  });

  describe('increment', () => {
    it('increment() で値が 1 増加した新しいインスタンスを返す', () => {
      // Arrange
      const viewCount = ViewCount.fromNumber(5);

      // Act
      const incremented = viewCount.increment();

      // Assert
      expect(incremented.toNumber()).toBe(6);
    });

    it('increment() は元のインスタンスを変更しない (不変性)', () => {
      // Arrange
      const original = ViewCount.fromNumber(5);

      // Act
      const incremented = original.increment();

      // Assert
      expect(original.toNumber()).toBe(5);
      expect(incremented.toNumber()).toBe(6);
      expect(original).not.toBe(incremented);
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const viewCount1 = ViewCount.fromNumber(10);
      const viewCount2 = ViewCount.fromNumber(10);

      // Act
      const result = viewCount1.equals(viewCount2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const viewCount1 = ViewCount.fromNumber(10);
      const viewCount2 = ViewCount.fromNumber(20);

      // Act
      const result = viewCount1.equals(viewCount2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toNumber', () => {
    it('toNumber() で数値を返す', () => {
      // Arrange
      const viewCount = ViewCount.fromNumber(100);

      // Act
      const result = viewCount.toNumber();

      // Assert
      expect(result).toBe(100);
    });
  });
});
