import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '@/contexts/identity/infrastructure/PrismaUserRepository';
import { UserRole } from '@/contexts/identity/domain/UserRole';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ulid } from 'ulid';

const prisma = new PrismaClient();
const repository = new PrismaUserRepository(prisma);

async function seedProfile(params: {
  userId: string;
  tenantId: string;
  role: 'admin' | 'employee';
  displayName?: string;
}) {
  await prisma.profile.create({
    data: {
      id: ulid(),
      userId: params.userId,
      tenantId: params.tenantId,
      displayName: params.displayName ?? 'テストユーザー',
      role: params.role,
    },
  });
}

beforeEach(async () => {
  await prisma.profile.deleteMany();
});

afterAll(async () => {
  await prisma.profile.deleteMany();
  await prisma.$disconnect();
});

describe('PrismaUserRepository (統合テスト)', () => {
  describe('findById', () => {
    it('存在するユーザーを User 集約として取得できる', async () => {
      const userId = ulid();
      const tenantId = TenantId.personal();
      await seedProfile({
        userId,
        tenantId: tenantId.toString(),
        role: 'admin',
      });

      const user = await repository.findById(
        UserId.fromString(userId),
        tenantId
      );

      expect(user).not.toBeNull();
      expect(user!.id.toString()).toBe(userId);
      expect(user!.isAdmin()).toBe(true);
    });

    it('employee ロールで取得できる', async () => {
      const userId = ulid();
      const tenantId = TenantId.personal();
      await seedProfile({
        userId,
        tenantId: tenantId.toString(),
        role: 'employee',
      });

      const user = await repository.findById(
        UserId.fromString(userId),
        tenantId
      );

      expect(user!.role.equals(UserRole.employee())).toBe(true);
    });

    it('存在しないユーザーの場合、null を返す', async () => {
      const user = await repository.findById(
        UserId.fromString(ulid()),
        TenantId.personal()
      );

      expect(user).toBeNull();
    });

    it('異なるテナントのユーザーは取得できない', async () => {
      const userId = ulid();
      const otherTenantId = ulid();
      await seedProfile({
        userId,
        tenantId: otherTenantId,
        role: 'admin',
      });

      const user = await repository.findById(
        UserId.fromString(userId),
        TenantId.personal()
      );

      expect(user).toBeNull();
    });
  });

  describe('findAll', () => {
    it('テナント内の全ユーザーを返す', async () => {
      const tenantId = TenantId.personal();
      await seedProfile({
        userId: ulid(),
        tenantId: tenantId.toString(),
        role: 'admin',
      });
      await seedProfile({
        userId: ulid(),
        tenantId: tenantId.toString(),
        role: 'employee',
      });
      await seedProfile({
        userId: ulid(),
        tenantId: tenantId.toString(),
        role: 'employee',
      });

      const users = await repository.findAll(tenantId);

      expect(users).toHaveLength(3);
    });

    it('異なるテナントのユーザーは含まれない', async () => {
      const tenantId = TenantId.personal();
      await seedProfile({
        userId: ulid(),
        tenantId: tenantId.toString(),
        role: 'admin',
      });
      await seedProfile({
        userId: ulid(),
        tenantId: ulid(),
        role: 'employee',
      });

      const users = await repository.findAll(tenantId);

      expect(users).toHaveLength(1);
    });

    it('ユーザーが存在しない場合、空配列を返す', async () => {
      const users = await repository.findAll(TenantId.personal());

      expect(users).toHaveLength(0);
    });
  });
});
