'use server';

import { ulid } from 'ulid';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { AvatarConfig } from '@/types/avatar';

export type ProfileData = {
  displayName: string;
  avatarConfig: AvatarConfig | null;
};

export async function getProfile(): Promise<ProfileData | null> {
  const userId = await getAuthUserId();
  if (!userId) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: userId.toString() },
      select: { displayName: true, avatarConfig: true },
    });

    if (!profile) return null;
    return {
      displayName: profile.displayName,
      avatarConfig: profile.avatarConfig as AvatarConfig | null,
    };
  } catch {
    return null;
  }
}

export async function saveProfile(input: {
  displayName: string;
  avatarConfig: AvatarConfig;
}): Promise<void> {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('ログインが必要です');

  const userIdStr = userId.toString();
  const tenantId = TenantId.personal().toString();

  await prisma.profile.upsert({
    where: { userId: userIdStr },
    update: {
      displayName: input.displayName,
      avatarConfig: JSON.parse(JSON.stringify(input.avatarConfig)),
    },
    create: {
      id: ulid(),
      userId: userIdStr,
      tenantId,
      displayName: input.displayName,
      avatarConfig: JSON.parse(JSON.stringify(input.avatarConfig)),
    },
  });
}
