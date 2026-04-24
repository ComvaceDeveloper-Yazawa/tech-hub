import { describe, it, expect } from 'vitest';
import { TagId } from '@/contexts/shared-kernel/TagId';

describe('TagId', () => {
  const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

  describe('fromString()', () => {
    it('fromString() で有効な ULID から TagId を作成できる', () => {
      // Arrange & Act
      const tagId = TagId.fromString(validUlid);

      // Assert
      expect(tagId.toString()).toBe(validUlid);
    });

    it('無効な ULID でエラーを投げる', () => {
      // Arrange
      const invalidUlid = 'invalid-ulid';

      // Act & Assert
      expect(() => TagId.fromString(invalidUlid)).toThrow('Invalid ULID');
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const id1 = TagId.fromString(validUlid);
      const id2 = TagId.fromString(validUlid);

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const id1 = TagId.fromString('01ARZ3NDEKTSV4RRFFQ69G5FAV');
      const id2 = TagId.fromString('01BX5ZZKBKACTAV9WEVGEMMVRY');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });
});
