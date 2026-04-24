import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaArticleBookmarkRepository } from '@/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { ulid } from 'ulid';

const prisma = new PrismaClient();
const bookmarkRepository = new PrismaArticleBookmarkRepository(prisma);
const articleRepository = new PrismaArticleRepository(prisma);

function createTestArticle(tenantId: TenantId): Article {
  return Article.create(
    ArticleId.fromString(ulid()),
    tenantId,
    ArticleTitle.fromString('ブックマークテスト記事'),
    ArticleContent.fromString('本文'),
    Slug.fromString(`bm-test-${ulid().toLowerCase().slice(0, 10)}`),
    UserId.fromString(ulid())
  );
}

beforeEach(async () => {
  await prisma.articleBookmark.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
});

afterAll(async () => {
  await prisma.articleBookmark.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.$disconnect();
});

describe('PrismaArticleBookmarkRepository (統合テスト)', () => {
  describe('save と findByArticleAndUser', () => {
    it('ブックマークを保存し、記事とユーザーで取得できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const article = createTestArticle(tenantId);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const bookmark = ArticleBookmark.create(article.id, userId, tenantId);
      await bookmarkRepository.save(bookmark);

      const found = await bookmarkRepository.findByArticleAndUser(
        article.id,
        userId,
        tenantId
      );

      expect(found).not.toBeNull();
      expect(found!.articleId.equals(article.id)).toBe(true);
      expect(found!.userId.equals(userId)).toBe(true);
      expect(found!.tenantId.equals(tenantId)).toBe(true);
    });

    it('存在しないブックマークはnullを返す', async () => {
      const found = await bookmarkRepository.findByArticleAndUser(
        ArticleId.fromString(ulid()),
        UserId.fromString(ulid()),
        TenantId.personal()
      );

      expect(found).toBeNull();
    });
  });

  describe('delete', () => {
    it('ブックマークを削除できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const article = createTestArticle(tenantId);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const bookmark = ArticleBookmark.create(article.id, userId, tenantId);
      await bookmarkRepository.save(bookmark);

      await bookmarkRepository.delete(article.id, userId, tenantId);

      const found = await bookmarkRepository.findByArticleAndUser(
        article.id,
        userId,
        tenantId
      );
      expect(found).toBeNull();
    });
  });

  describe('findByUserPaginated', () => {
    it('ユーザーのブックマーク一覧をページネーションで取得できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const userId = UserId.fromString(ulid());
      const articles: Article[] = [];

      for (let i = 0; i < 5; i++) {
        const article = createTestArticle(tenantId);
        await articleRepository.save(article);
        articles.push(article);
      }

      // 異なる createdAt を保証するため直接 DB に挿入
      for (let i = 0; i < 5; i++) {
        const a = articles[i]!;
        await prisma.articleBookmark.create({
          data: {
            articleId: a.id.toString(),
            userId: userId.toString(),
            tenantId: tenantId.toString(),
            createdAt: new Date(Date.now() - (4 - i) * 1000),
          },
        });
      }

      const result = await bookmarkRepository.findByUserPaginated(
        userId,
        tenantId,
        { limit: 3 }
      );

      expect(result.items).toHaveLength(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.nextCursor).not.toBeNull();
    });

    it('カーソルを使って次ページを取得できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const userId = UserId.fromString(ulid());
      const articles: Article[] = [];

      for (let i = 0; i < 5; i++) {
        const article = createTestArticle(tenantId);
        await articleRepository.save(article);
        articles.push(article);
      }

      for (let i = 0; i < 5; i++) {
        const a = articles[i]!;
        await prisma.articleBookmark.create({
          data: {
            articleId: a.id.toString(),
            userId: userId.toString(),
            tenantId: tenantId.toString(),
            createdAt: new Date(Date.now() - (4 - i) * 1000),
          },
        });
      }

      const page1 = await bookmarkRepository.findByUserPaginated(
        userId,
        tenantId,
        { limit: 3 }
      );
      const page2 = await bookmarkRepository.findByUserPaginated(
        userId,
        tenantId,
        { limit: 3, cursor: page1.nextCursor! }
      );

      expect(page2.items).toHaveLength(2);
      expect(page2.hasNextPage).toBe(false);
    });
  });

  describe('テナント分離', () => {
    it('異なるテナントのブックマークは取得できない', async () => {
      const tenantA = TenantId.fromString(ulid());
      const tenantB = TenantId.fromString(ulid());
      const article = createTestArticle(tenantA);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const bookmark = ArticleBookmark.create(article.id, userId, tenantA);
      await bookmarkRepository.save(bookmark);

      const found = await bookmarkRepository.findByArticleAndUser(
        article.id,
        userId,
        tenantB
      );
      expect(found).toBeNull();
    });
  });

  describe('一意制約', () => {
    it('同じ記事・ユーザーの組み合わせで重複保存するとエラーになる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const article = createTestArticle(tenantId);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const bm1 = ArticleBookmark.create(article.id, userId, tenantId);
      await bookmarkRepository.save(bm1);

      const bm2 = ArticleBookmark.create(article.id, userId, tenantId);
      await expect(bookmarkRepository.save(bm2)).rejects.toThrow();
    });
  });
});
