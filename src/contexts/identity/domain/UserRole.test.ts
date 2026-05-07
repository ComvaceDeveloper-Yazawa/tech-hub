import { describe, it, expect } from 'vitest';
import { UserRole } from '@/contexts/identity/domain/UserRole';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

describe('UserRole', () => {
  describe('ファクトリメソッド', () => {
    it('admin ロールを作成できる', () => {
      const role = UserRole.admin();

      expect(role.isAdmin()).toBe(true);
      expect(role.isEmployee()).toBe(false);
    });

    it('employee ロールを作成できる', () => {
      const role = UserRole.employee();

      expect(role.isEmployee()).toBe(true);
      expect(role.isAdmin()).toBe(false);
    });
  });

  describe('fromString', () => {
    it('"admin" 文字列から admin ロールを作成できる', () => {
      const role = UserRole.fromString('admin');

      expect(role.isAdmin()).toBe(true);
    });

    it('"employee" 文字列から employee ロールを作成できる', () => {
      const role = UserRole.fromString('employee');

      expect(role.isEmployee()).toBe(true);
    });

    it('不正な文字列の場合、DomainError を投げる', () => {
      expect(() => UserRole.fromString('superuser')).toThrow(DomainError);
      expect(() => UserRole.fromString('superuser')).toThrow(
        '不正なユーザーロールです: superuser'
      );
    });

    it('空文字の場合、DomainError を投げる', () => {
      expect(() => UserRole.fromString('')).toThrow(DomainError);
    });
  });

  describe('toString', () => {
    it('admin ロールは "admin" を返す', () => {
      expect(UserRole.admin().toString()).toBe('admin');
    });

    it('employee ロールは "employee" を返す', () => {
      expect(UserRole.employee().toString()).toBe('employee');
    });
  });

  describe('等価性', () => {
    it('同じロールの場合、等価と判定される', () => {
      const role1 = UserRole.admin();
      const role2 = UserRole.admin();

      expect(role1.equals(role2)).toBe(true);
    });

    it('異なるロールの場合、非等価と判定される', () => {
      const admin = UserRole.admin();
      const employee = UserRole.employee();

      expect(admin.equals(employee)).toBe(false);
    });
  });

  describe('不変性', () => {
    it('fromString と ファクトリメソッドは毎回新しいインスタンスを返す', () => {
      const role1 = UserRole.admin();
      const role2 = UserRole.admin();

      expect(role1).not.toBe(role2);
      expect(role1.equals(role2)).toBe(true);
    });
  });
});
