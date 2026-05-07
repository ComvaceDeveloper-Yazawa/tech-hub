import type { PrismaClient } from '@prisma/client';
import type { IUserRepository } from '@/contexts/identity/domain/IUserRepository';
import { User } from '@/contexts/identity/domain/User';
import { UserRole } from '@/contexts/identity/domain/UserRole';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import { UserId as UserIdClass } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import { TenantId as TenantIdClass } from '@/contexts/shared-kernel/TenantId';

// Prisma Client の型は schema 変更後の generate が必要なため、
// role フィールドは unknown として取り出し実行時に解決する
type ProfileRow = {
  userId: string;
  tenantId: string;
  [key: string]: unknown;
};

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(userId: UserId, tenantId: TenantId): Promise<User | null> {
    const row = (await this.prisma.profile.findFirst({
      where: {
        userId: userId.toString(),
        tenantId: tenantId.toString(),
      },
    })) as ProfileRow | null;

    if (!row) return null;
    return this.toDomain(row);
  }

  async findAll(tenantId: TenantId): Promise<User[]> {
    const rows = (await this.prisma.profile.findMany({
      where: { tenantId: tenantId.toString() },
      orderBy: { createdAt: 'asc' },
    })) as ProfileRow[];

    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: ProfileRow): User {
    const roleValue =
      typeof row['role'] === 'string' ? row['role'] : 'employee';

    return User.reconstruct({
      id: UserIdClass.fromString(row.userId),
      tenantId: TenantIdClass.fromString(row.tenantId),
      role: UserRole.fromString(roleValue),
    });
  }
}
