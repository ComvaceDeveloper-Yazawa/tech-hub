import { NextResponse } from 'next/server';
import { DeleteArticleUseCase } from '@/contexts/publishing/application/DeleteArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'articleId required' }, { status: 400 });
  }

  try {
    const id = ArticleId.fromString(articleId);
    const tenantId = TenantId.personal();
    const repository = new PrismaArticleRepository(prisma);
    const eventPublisher = new NoopDomainEventPublisher();
    const useCase = new DeleteArticleUseCase(repository, eventPublisher);
    await useCase.execute({ articleId: id, tenantId });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
