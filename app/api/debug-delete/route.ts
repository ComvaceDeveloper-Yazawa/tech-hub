import { NextResponse } from 'next/server';
import { DeleteArticleUseCase } from '@/contexts/publishing/application/DeleteArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'articleId required' }, { status: 400 });
  }

  const requesterId = await getAuthUserId();
  if (!requesterId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = ArticleId.fromString(articleId);
    const tenantId = TenantId.personal();
    const repository = new PrismaArticleRepository(prisma);
    const eventPublisher = new NoopDomainEventPublisher();
    const useCase = new DeleteArticleUseCase(repository, eventPublisher);
    await useCase.execute({
      articleId: id,
      tenantId,
      requesterId,
      isPrivilegedActor: true, // debug endpoint: admin only
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
