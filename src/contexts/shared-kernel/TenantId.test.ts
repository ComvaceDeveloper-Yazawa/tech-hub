import { describe, it, expect } from 'vitest';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

describe('TenantId', () => {
  const validUlid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

  describe('personal()', () => {
    it('personal() で固定値の TenantId を作成できる', () => {
      // Arrange & Act
      const tenantId = TenantId.personal();

      // Assert
      expect(tenantId.toString()).toBe('00000000000000000000000000');
    });
  });

  describe('fromString()', () => {
    it('fromString() で有効な ULID から TenantId を作成できる', () => {
      // Arrange & Act
      const tenantId = TenantId.fromString(validUlid);

      // Assert
      expect(tenantId.toString()).toBe(validUlid);
    });

    it('無効な ULID でエラーを投げる', () => {
      // Arrange
      const invalidUlid = 'invalid-ulid';

      // Act & Assert
      expect(() => TenantId.fromString(invalidUlid)).toThrow('Invalid ULID');
    });
  });

  describe('等価性', () => {
    it('同じ値の場合、等価と判定される', () => {
      // Arrange
      const id1 = TenantId.fromString(validUlid);
      const id2 = TenantId.fromString(validUlid);

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('異なる値の場合、非等価と判定される', () => {
      // Arrange
      const id1 = TenantId.fromString('01ARZ3NDEKTSV4RRFFQ69G5FAV');
      const id2 = TenantId.fromString('01BX5ZZKBKACTAV9WEVGEMMVRY');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('文字列変換', () => {
    it('toString() で ULID 文字列を返す', () => {
      // Arrange
      const tenantId = TenantId.fromString(validUlid);

      // Act
      const result = tenantId.toString();

      // Assert
      expect(result).toBe(validUlid);
    });
  });
});
