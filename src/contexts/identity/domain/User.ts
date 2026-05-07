import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserRole } from '@/contexts/identity/domain/UserRole';

export class User {
  private constructor(
    private readonly _id: UserId,
    private readonly _tenantId: TenantId,
    private readonly _role: UserRole
  ) {}

  static reconstruct(params: {
    id: UserId;
    tenantId: TenantId;
    role: UserRole;
  }): User {
    return new User(params.id, params.tenantId, params.role);
  }

  get id(): UserId {
    return this._id;
  }

  get tenantId(): TenantId {
    return this._tenantId;
  }

  get role(): UserRole {
    return this._role;
  }

  isAdmin(): boolean {
    return this._role.isAdmin();
  }

  /**
   * 他ユーザーのコンテンツを非公開化・削除できるか (モデレーション権限)
   */
  canModerateContent(): boolean {
    return this._role.isAdmin();
  }

  equals(other: User): boolean {
    return this._id.equals(other._id);
  }
}
