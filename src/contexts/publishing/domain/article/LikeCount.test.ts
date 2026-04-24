import { describe, it, expect } from 'vitest';
import { LikeCount } from '@/contexts/publishing/domain/article/LikeCount';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

describe('LikeCount', () => {
  describe('ファクトリメソッド', () => {
    it('zero() でいいね数 0 を作成できる', () => {
      // Arrange & Act
      const likeCount = LikeCount.zero();

      // Assert
      expect(likeCount.toNumber()).toBe(0);
    });

    it('fromNumber() で有効な数値から作成できる', () => {
      // Arrange & Act
      const likeCount = LikeCount.fromNumber(42);

      // Assert
      expect(likeCount.toNumber()).toBe(42);
    });
  });

  describe('バリデーション', () => {
    it('負の値の場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => LikeCount.fromNumber(-1)).toThrow(DomainError);
      expect(() => LikeCount.fromNumber(-1)).toThrow(
        'いいね数は0以上の整数です'
      );
    });

    it('小数の場合、エラーを投げる', () => {
      // Arrange & Act & Assert
      expect(() => LikeCount.fromNumber(1.5)).toThrow(DomainError);
      expect(() => LikeCount.fromNumber(1.5)).toThrow(
        'いいね数は0以上の整数です'
      );
    });
  });

  describe('increment', () => {
    it('increment() で値が 1 増加した新しいインスタンスを返す', () => {
      // Arrange
      const likeCount = LikeCount.fromNumber(5);

      // Act
      const incremented = likeCount.increment();

      // Assert
      expect(incremented.toNumber()).toBe(6);
    });

    it('increment() は元のインスタンスを変更しない (不変性)', () => {
      // Arrange
      const original = LikeCount.fromNumber(5);

      // Act
      const incremented = original.increment();

      // Assert
      expect(original.toNumber()).toBe(5);
      expect(incremented.toNumber()).toBe(6);
      expect(original).not.toBe(incremented);
    });
  });

  describe('decrement', () => {
    it('decrement() で値が 1 減少した新しいインスタンスを返す', () => {
      // Arrange
      const likeCount = LikeCount.fromNumber(5);

      // Act
      const decremented = likeCount.decrement();

      // Assert
      expect(decremented.toNumber()).toBe(4);
    });

    it('decrement() は元のインスタンスを変更しない (不変性)', () => {
      // Arrange
      const original = LikeCount.fromNumber(5);

      // Act
      const decremented = original.decrement();

      // Assert
      expect(original.toNumber()).toBe(5);
      expect(decremented.toNumber()).toBe(4);
      expect(original).not.toBe(decremented);
    });

    it('0 の場合、decrement() は 0 を返す (下限クランプ)', () => {
      // Arrange
      const likeCount = LikeCount.zero();

      // Act
      const decremented = likeCount.decrement();

      // Assert
      expect(decremented.toNumber()).toBe(0);
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const likeCount1 = LikeCount.fromNumber(10);
      const likeCount2 = LikeCount.fromNumber(10);

      // Act
      const result = likeCount1.equals(likeCount2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const likeCount1 = LikeCount.fromNumber(10);
      const likeCount2 = LikeCount.fromNumber(20);

      // Act
      const result = likeCount1.equals(likeCount2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('toNumber', () => {
    it('toNumber() で数値を返す', () => {
      // Arrange
      const likeCount = LikeCount.fromNumber(100);

      // Act
      const result = likeCount.toNumber();

      // Assert
      expect(result).toBe(100);
    });
  });
});
