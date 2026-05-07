import { getAuthUserId } from '@/lib/supabase/auth-helpers';
import { PrismaUserRepository } from '@/contexts/identity/infrastructure/PrismaUserRepository';
import { GetCurrentUserUseCase } from '@/contexts/identity/application/GetCurrentUserUseCase';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { prisma } from '@/lib/prisma';
import type { User } from '@/contexts/identity/domain/User';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

/**
 * ログイン済みユーザーを取得する。未認証または profile 未作成の場合は ApplicationError を投げる。
 * Server Actions / Server Components から呼び出す。
 */
export async function requireAuth(): Promise<User> {
  const userId = await getAuthUserId();
  if (!userId) {
    throw new ApplicationError('ログインが必要です');
  }

  const repository = new PrismaUserRepository(prisma);
  const useCase = new GetCurrentUserUseCase(repository);
  const user = await useCase.execute({
    userId,
    tenantId: TenantId.personal(),
  });

  if (!user) {
    throw new ApplicationError('ユーザー情報が見つかりません');
  }

  return user;
}
