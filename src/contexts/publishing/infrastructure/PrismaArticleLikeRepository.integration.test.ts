import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PrismaArticleLikeRepository } from '@/contexts/publishing/infrastructure/PrismaArticleLikeRepository';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { ArticleLike } from '@/contexts/publishing/domain/like/ArticleLike';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { ulid } from 'ulid';

const prisma = new PrismaClient();
const likeRepository = new PrismaArticleLikeRepository(prisma);
const articleRepository = new PrismaArticleRepository(prisma);

function createTestArticle(tenantId: TenantId): Article {
  return Article.create(
    ArticleId.fromString(ulid()),
    tenantId,
    ArticleTitle.fromString('いいねテスト記事'),
    ArticleContent.fromString('本文'),
    Slug.fromString(`like-test-${ulid().toLowerCase().slice(0, 10)}`),
    UserId.fromString(ulid())
  );
}

beforeEach(async () => {
  await prisma.articleLike.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.articleBookmark.deleteMany();
  await prisma.article.deleteMany();
});

afterAll(async () => {
  await prisma.articleLike.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.articleBookmark.deleteMany();
  await prisma.article.deleteMany();
  await prisma.$disconnect();
});

describe('PrismaArticleLikeRepository (統合テスト)', () => {
  describe('save と findByArticleAndUser', () => {
    it('いいねを保存し、記事とユーザーで取得できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const article = createTestArticle(tenantId);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const like = ArticleLike.create(article.id, userId, tenantId);
      await likeRepository.save(like);

      const found = await likeRepository.findByArticleAndUser(
        article.id,
        userId,
        tenantId
      );

      expect(found).not.toBeNull();
      expect(found!.articleId.equals(article.id)).toBe(true);
      expect(found!.userId.equals(userId)).toBe(true);
      expect(found!.tenantId.equals(tenantId)).toBe(true);
    });

    it('存在しないいいねはnullを返す', async () => {
      const found = await likeRepository.findByArticleAndUser(
        ArticleId.fromString(ulid()),
        UserId.fromString(ulid()),
        TenantId.personal()
      );

      expect(found).toBeNull();
    });
  });

  describe('delete', () => {
    it('いいねを削除できる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const article = createTestArticle(tenantId);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const like = ArticleLike.create(article.id, userId, tenantId);
      await likeRepository.save(like);

      await likeRepository.delete(article.id, userId, tenantId);

      const found = await likeRepository.findByArticleAndUser(
        article.id,
        userId,
        tenantId
      );
      expect(found).toBeNull();
    });
  });

  describe('countByArticle', () => {
    it('記事のいいね数をカウントできる', async () => {
      const tenantId = TenantId.fromString(ulid());
      const article = createTestArticle(tenantId);
      await articleRepository.save(article);

      const user1 = UserId.fromString(ulid());
      const user2 = UserId.fromString(ulid());
      await likeRepository.save(
        ArticleLike.create(article.id, user1, tenantId)
      );
      await likeRepository.save(
        ArticleLike.create(article.id, user2, tenantId)
      );

      const count = await likeRepository.countByArticle(article.id, tenantId);
      expect(count).toBe(2);
    });

    it('いいねがない場合は0を返す', async () => {
      const count = await likeRepository.countByArticle(
        ArticleId.fromString(ulid()),
        TenantId.personal()
      );
      expect(count).toBe(0);
    });
  });

  describe('テナント分離', () => {
    it('異なるテナントのいいねは取得できない', async () => {
      const tenantA = TenantId.fromString(ulid());
      const tenantB = TenantId.fromString(ulid());
      const article = createTestArticle(tenantA);
      await articleRepository.save(article);

      const userId = UserId.fromString(ulid());
      const like = ArticleLike.create(article.id, userId, tenantA);
      await likeRepository.save(like);

      const found = await likeRepository.findByArticleAndUser(
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
      const like1 = ArticleLike.create(article.id, userId, tenantId);
      await likeRepository.save(like1);

      const like2 = ArticleLike.create(article.id, userId, tenantId);
      await expect(likeRepository.save(like2)).rejects.toThrow();
    });
  });
});
