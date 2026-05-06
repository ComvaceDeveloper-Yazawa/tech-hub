/**
 * 未経験者 → 実務レベル ロードマップ記事 18本の一括投入スクリプト
 *
 * 実行: npx tsx scripts/seed-roadmap-articles.ts
 * 既に同じ slug の記事があればスキップします。
 */
import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';
import { articles } from './articles/roadmap-articles';

const prisma = new PrismaClient();

const TENANT_ID = '00000000000000000000000000';
const AUTHOR_ID = '00000000000000000000000001';

async function upsertTags(names: string[]): Promise<string[]> {
  if (names.length === 0) return [];

  const ids: string[] = [];
  for (const name of names) {
    const normalizedName = name.toLowerCase().trim();
    const existing = await prisma.tag.findFirst({
      where: { tenantId: TENANT_ID, normalizedName },
    });
    if (existing) {
      ids.push(existing.id);
    } else {
      const tag = await prisma.tag.create({
        data: {
          id: ulid(),
          tenantId: TENANT_ID,
          name,
          normalizedName,
        },
      });
      ids.push(tag.id);
    }
  }
  return ids;
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (const article of articles) {
    const existing = await prisma.article.findFirst({
      where: { tenantId: TENANT_ID, slug: article.slug },
    });
    if (existing) {
      console.log(`[skip] ${article.slug} は既に存在します`);
      skipped++;
      continue;
    }

    const articleId = ulid();
    const now = new Date();
    const tagIds = await upsertTags(article.tags);

    await prisma.article.create({
      data: {
        id: articleId,
        tenantId: TENANT_ID,
        title: article.title,
        content: article.content,
        status: 'published',
        slug: article.slug,
        authorId: AUTHOR_ID,
        viewCount: 0,
        likeCount: 0,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
        tags:
          tagIds.length > 0
            ? {
                create: tagIds.map((tagId) => ({
                  tagId,
                  tenantId: TENANT_ID,
                })),
              }
            : undefined,
      },
    });

    console.log(`[created] ${article.slug}`);
    created++;
  }

  console.log('');
  console.log(`完了: created=${created} skipped=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
