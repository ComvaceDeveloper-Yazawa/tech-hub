import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { ulid } from 'ulid';

const prisma = new PrismaClient();
const repository = new PrismaArticleRepository(prisma);

function createTestArticle(overrides?: {
  id?: ArticleId;
  tenantId?: TenantId;
  slug?: Slug;
  authorId?: UserId;
  tagIds?: TagId[];
}): Article {
  return Article.create(
    overrides?.id ?? ArticleId.fromString(ulid()),
    overrides?.tenantId ?? TenantId.personal(),
    ArticleTitle.fromString('テスト記事タイトル'),
    ArticleContent.fromString('テスト記事の本文です。'),
    overrides?.slug ??
      Slug.fromString(`test-slug-${ulid().toLowerCase().slice(0, 10)}`),
    overrides?.authorId ?? UserId.fromString(ulid()),
    overrides?.tagIds
  );
}

beforeEach(async () => {
  await prisma.articleTag.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.articleBookmark.deleteMany();
  await prisma.article.deleteMany();
});

afterAll(async () => {
  await prisma.articleTag.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.articleBookmark.deleteMany();
  await prisma.article.deleteMany();
  await prisma.$disconnect();
});

describe('PrismaArticleRepository (統合テスト)', () => {
  describe('save と findById', () => {
    it('記事を保存し、IDで取得できる', async () => {
      const article = createTestArticle();

      await repository.save(article);
      const found = await repository.findById(article.id, article.tenantId);

      expect(found).not.toBeNull();
      expect(found!.id.equals(article.id)).toBe(true);
      expect(found!.title.toString()).toBe('テスト記事タイトル');
      expect(found!.content.toString()).toBe('テスト記事の本文です。');
      expect(found!.isDraft()).toBe(true);
      expect(found!.viewCount.toNumber()).toBe(0);
      expect(found!.likeCount.toNumber()).toBe(0);
      expect(found!.publishedAt).toBeNull();
    });

    it('タグ付き記事を保存し、タグも取得できる', async () => {
      const tagId1 = TagId.fromString(ulid());
      const tagId2 = TagId.fromString(ulid());
      const article = createTestArticle({ tagIds: [tagId1, tagId2] });

      await repository.save(article);
      const found = await repository.findById(article.id, article.tenantId);

      expect(found).not.toBeNull();
      expect(found!.tagIds).toHaveLength(2);
      const tagIdStrings = found!.tagIds.map((t) => t.toString()).sort();
      expect(tagIdStrings).toEqual(
        [tagId1.toString(), tagId2.toString()].sort()
      );
    });

    it('記事を更新できる', async () => {
      const article = createTestArticle();
      await repository.save(article);

      const found = await repository.findById(article.id, article.tenantId);
      found!.updateTitle(ArticleTitle.fromString('更新後タイトル'));
      await repository.save(found!);

      const updated = await repository.findById(article.id, article.tenantId);
      expect(updated!.title.toString()).toBe('更新後タイトル');
    });
  });

  describe('findBySlug', () => {
    it('記事を保存し、スラッグで取得できる', async () => {
      const slug = Slug.fromString('unique-slug-for-test');
      const article = createTestArticle({ slug });

      await repository.save(article);
      const found = await repository.findBySlug(slug, article.tenantId);

      expect(found).not.toBeNull();
      expect(found!.slug.toString()).toBe('unique-slug-for-test');
      expect(found!.id.equals(article.id)).toBe(true);
    });
  });

  describe('findById — 存在しない記事', () => {
    it('存在しない記事はnullを返す', async () => {
      const found = await repository.findById(
        ArticleId.fromString(ulid()),
        TenantId.personal()
      );

      expect(found).toBeNull();
    });
  });

  describe('delete', () => {
    it('記事を削除できる', async () => {
      const article = createTestArticle();
      await repository.save(article);

      await repository.delete(article.id, article.tenantId);
      const found = await repository.findById(article.id, article.tenantId);

      expect(found).toBeNull();
    });
  });

  describe('existsBySlug', () => {
    it('スラッグの存在確認ができる', async () => {
      const slug = Slug.fromString('exists-check-slug');
      const article = createTestArticle({ slug });
      await repository.save(article);

      const exists = await repository.existsBySlug(slug, article.tenantId);
      expect(exists).toBe(true);

      const notExists = await repository.existsBySlug(
        Slug.fromString('non-existent-slug'),
        article.tenantId
      );
      expect(notExists).toBe(false);
    });
  });

  describe('incrementViewCount', () => {
    it('閲覧数をインクリメントできる', async () => {
      const article = createTestArticle();
      await repository.save(article);

      await repository.incrementViewCount(article.id, article.tenantId);
      const found = await repository.findById(article.id, article.tenantId);

      expect(found!.viewCount.toNumber()).toBe(1);
    });
  });

  describe('テナント分離', () => {
    it('異なるテナントの記事は取得できない', async () => {
      const tenantA = TenantId.fromString(ulid());
      const tenantB = TenantId.fromString(ulid());
      const article = createTestArticle({ tenantId: tenantA });
      await repository.save(article);

      const found = await repository.findById(article.id, tenantB);

      expect(found).toBeNull();
    });
  });

  describe('findPaginated', () => {
    it('ページネーションで記事を取得できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      for (let i = 0; i < 5; i++) {
        const article = createTestArticle({ tenantId });
        await repository.save(article);
      }

      const result = await repository.findPaginated(tenantId, { limit: 3 });

      expect(result.items).toHaveLength(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.nextCursor).not.toBeNull();
    });

    it('カーソルを使って次ページを取得できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      for (let i = 0; i < 5; i++) {
        const article = createTestArticle({ tenantId });
        await repository.save(article);
      }

      const page1 = await repository.findPaginated(tenantId, { limit: 3 });
      const page2 = await repository.findPaginated(tenantId, {
        limit: 3,
        cursor: page1.nextCursor!,
      });

      expect(page2.items).toHaveLength(2);
      expect(page2.hasNextPage).toBe(false);
    });
  });
});
