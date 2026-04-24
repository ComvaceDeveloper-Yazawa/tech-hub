import { describe, it, expect } from 'vitest';
import { EntityId } from '@/contexts/shared-kernel/EntityId';

// テスト用の具象クラス
class TestEntityId extends EntityId {
  constructor(value: string) {
    super(value);
  }
}

describe('EntityId', () => {
  const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

  describe('バリデーション', () => {
    it('有効な ULID 文字列で EntityId を作成できる', () => {
      // Arrange & Act
      const id = new TestEntityId(validUlid);

      // Assert
      expect(id.toString()).toBe(validUlid);
    });

    it('無効な ULID 文字列の場合、エラーを投げる', () => {
      // Arrange
      const invalidUlid = 'invalid-ulid';

      // Act & Assert
      expect(() => new TestEntityId(invalidUlid)).toThrow('Invalid ULID');
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const id1 = new TestEntityId(validUlid);
      const id2 = new TestEntityId(validUlid);

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const id1 = new TestEntityId('01ARZ3NDEKTSV4RRFFQ69G5FAV');
      const id2 = new TestEntityId('01BX5ZZKBKACTAV9WEVGEMMVRY');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('文字列変換', () => {
    it('toString() で ULID 文字列を返す', () => {
      // Arrange
      const id = new TestEntityId(validUlid);

      // Act
      const result = id.toString();

      // Assert
      expect(result).toBe(validUlid);
    });
  });
});
