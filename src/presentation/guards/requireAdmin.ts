import { requireAuth } from '@/presentation/guards/requireAuth';
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';
import type { User } from '@/contexts/identity/domain/User';

/**
 * admin ロールのユーザーを取得する。employee の場合は PermissionDeniedError を投げる。
 * admin 専用の Server Actions / Server Components から呼び出す。
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();

  if (!user.isAdmin()) {
    throw new PermissionDeniedError('管理者権限が必要です');
  }

  return user;
}
