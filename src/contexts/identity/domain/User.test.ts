import { describe, it, expect } from 'vitest';
import { User } from '@/contexts/identity/domain/User';
import { UserRole } from '@/contexts/identity/domain/UserRole';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ulid } from 'ulid';

function createUser(overrides?: {
  id?: UserId;
  tenantId?: TenantId;
  role?: UserRole;
}): User {
  return User.reconstruct({
    id: overrides?.id ?? UserId.fromString(ulid()),
    tenantId: overrides?.tenantId ?? TenantId.personal(),
    role: overrides?.role ?? UserRole.employee(),
  });
}

describe('User', () => {
  describe('再構築', () => {
    it('id, tenantId, role を指定して User を再構築できる', () => {
      const id = UserId.fromString(ulid());
      const tenantId = TenantId.personal();
      const role = UserRole.admin();

      const user = User.reconstruct({ id, tenantId, role });

      expect(user.id.equals(id)).toBe(true);
      expect(user.tenantId.equals(tenantId)).toBe(true);
      expect(user.role.equals(role)).toBe(true);
    });
  });

  describe('権限判定', () => {
    it('admin ユーザーは isAdmin() が true を返す', () => {
      const user = createUser({ role: UserRole.admin() });

      expect(user.isAdmin()).toBe(true);
    });

    it('employee ユーザーは isAdmin() が false を返す', () => {
      const user = createUser({ role: UserRole.employee() });

      expect(user.isAdmin()).toBe(false);
    });

    it('admin ユーザーは他人の記事を非公開化・削除できる', () => {
      const user = createUser({ role: UserRole.admin() });

      expect(user.canModerateContent()).toBe(true);
    });

    it('employee ユーザーは他人の記事を非公開化・削除できない', () => {
      const user = createUser({ role: UserRole.employee() });

      expect(user.canModerateContent()).toBe(false);
    });
  });

  describe('等価性', () => {
    it('同じ ID の場合、等価と判定される', () => {
      const id = UserId.fromString(ulid());
      const user1 = User.reconstruct({
        id,
        tenantId: TenantId.personal(),
        role: UserRole.admin(),
      });
      const user2 = User.reconstruct({
        id,
        tenantId: TenantId.personal(),
        role: UserRole.employee(),
      });

      expect(user1.equals(user2)).toBe(true);
    });

    it('異なる ID の場合、非等価と判定される', () => {
      const user1 = createUser();
      const user2 = createUser();

      expect(user1.equals(user2)).toBe(false);
    });
  });
});
