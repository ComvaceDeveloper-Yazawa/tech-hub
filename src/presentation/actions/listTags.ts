'use server';

import { prisma } from '@/lib/prisma';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export interface TagItem {
  id: string;
  name: string;
  normalizedName: string;
}

export async function listTags(): Promise<TagItem[]> {
  const tenantId = TenantId.personal().toString();
  const tags = await prisma.tag.findMany({
    where: { tenantId },
    orderBy: { name: 'asc' },
  });
  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    normalizedName: t.normalizedName,
  }));
}
