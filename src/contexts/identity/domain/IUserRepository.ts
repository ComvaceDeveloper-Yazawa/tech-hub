import type { User } from '@/contexts/identity/domain/User';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export interface IUserRepository {
  findById(userId: UserId, tenantId: TenantId): Promise<User | null>;
  findAll(tenantId: TenantId): Promise<User[]>;
}
