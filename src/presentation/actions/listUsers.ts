'use server';

import { ListUsersUseCase } from '@/contexts/identity/application/ListUsersUseCase';
import { PrismaUserRepository } from '@/contexts/identity/infrastructure/PrismaUserRepository';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/presentation/guards/requireAdmin';

export async function listUsers(): Promise<
  Array<{
    userId: string;
    displayName: string;
    role: string;
    createdAt: string;
  }>
> {
  await requireAdmin();

  const repository = new PrismaUserRepository(prisma);
  const useCase = new ListUsersUseCase(repository);
  const users = await useCase.execute({ tenantId: TenantId.personal() });

  // displayName と createdAt は profiles テーブルから直接取得
  const userIds = users.map((u) => u.id.toString());
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: userIds } },
    select: { userId: true, displayName: true, createdAt: true },
  });
  const profileMap = new Map(profiles.map((p) => [p.userId, p]));

  return users.map((user) => {
    const profile = profileMap.get(user.id.toString());
    return {
      userId: user.id.toString(),
      displayName: profile?.displayName ?? '',
      role: user.role.toString(),
      createdAt: profile?.createdAt.toISOString() ?? '',
    };
  });
}
