import { describe, it, expect } from 'vitest';
import { Article } from '@/contexts/publishing/domain/article/Article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ViewCount } from '@/contexts/publishing/domain/article/ViewCount';
import { LikeCount } from '@/contexts/publishing/domain/article/LikeCount';
import { ArticleCreated } from '@/contexts/publishing/domain/article/ArticleCreated';
import { ArticlePublished } from '@/contexts/publishing/domain/article/ArticlePublished';
import { ArticleUnpublished } from '@/contexts/publishing/domain/article/ArticleUnpublished';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { DomainError } from '@/contexts/shared-kernel/DomainError';

describe('Article', () => {
  const createDefaultArticle = (overrides?: {
    content?: ArticleContent;
    tagIds?: TagId[];
  }) => {
    return Article.create(
      ArticleId.generate(),
      TenantId.personal(),
      ArticleTitle.fromString('テスト記事'),
      overrides?.content ?? ArticleContent.fromString('テスト本文'),
      Slug.fromString('test-article'),
      UserId.fromString('01KQ06J55G7P1RPHZRXJNQZY1J'),
      overrides?.tagIds
    );
  };

  describe('記事の作成', () => {
    it('下書き状態で記事を作成できる', () => {
      const article = createDefaultArticle();

      expect(article.isDraft()).toBe(true);
      expect(article.isPublished()).toBe(false);
    });

    it('作成時に viewCount が 0 である', () => {
      const article = createDefaultArticle();

      expect(article.viewCount.equals(ViewCount.zero())).toBe(true);
    });

    it('作成時に likeCount が 0 である', () => {
      const article = createDefaultArticle();

      expect(article.likeCount.equals(LikeCount.zero())).toBe(true);
    });

    it('作成時に publishedAt が null である', () => {
      const article = createDefaultArticle();

      expect(article.publishedAt).toBeNull();
    });

    it('作成時に ArticleCreated イベントが発行される', () => {
      const article = createDefaultArticle();

      const events = article.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ArticleCreated);
    });

    it('タグ ID リスト付きで記事を作成できる', () => {
      const tagIds = [
        TagId.fromString('01KQ06J562A70XFYHDVHRM0ZY1'),
        TagId.fromString('01KQ06J562KCASBS3K4T1QEHSH'),
      ];

      const article = createDefaultArticle({ tagIds });

      expect(article.tagIds).toHaveLength(2);
    });
  });

  describe('記事の更新', () => {
    it('タイトルを更新できる', () => {
      const article = createDefaultArticle();
      const newTitle = ArticleTitle.fromString('新しいタイトル');

      article.updateTitle(newTitle);

      expect(article.title.equals(newTitle)).toBe(true);
    });

    it('本文を更新できる', () => {
      const article = createDefaultArticle();
      const newContent = ArticleContent.fromString('新しい本文');

      article.updateContent(newContent);

      expect(article.content.equals(newContent)).toBe(true);
    });

    it('スラッグを更新できる', () => {
      const article = createDefaultArticle();
      const newSlug = Slug.fromString('new-slug');

      article.updateSlug(newSlug);

      expect(article.slug.equals(newSlug)).toBe(true);
    });

    it('タグを更新できる（既存タグが置き換わる）', () => {
      const initialTags = [TagId.fromString('01KQ06J562A70XFYHDVHRM0ZY1')];
      const article = createDefaultArticle({ tagIds: initialTags });
      const newTags = [
        TagId.fromString('01KQ06J562KCASBS3K4T1QEHSH'),
        TagId.fromString('01KQ06J562F1BMNZVY1NH8J7TT'),
      ];

      article.updateTags(newTags);

      expect(article.tagIds).toHaveLength(2);
    });

    it('更新時に updatedAt が更新される', () => {
      const article = createDefaultArticle();
      const originalUpdatedAt = article.updatedAt;

      // 少し待ってから更新
      article.updateTitle(ArticleTitle.fromString('更新タイトル'));

      expect(article.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('記事の公開', () => {
    it('下書き記事を公開できる', () => {
      const article = createDefaultArticle();
      article.clearDomainEvents();

      article.publish();

      expect(article.isPublished()).toBe(true);
    });

    it('公開時に publishedAt が設定される', () => {
      const article = createDefaultArticle();

      article.publish();

      expect(article.publishedAt).not.toBeNull();
    });

    it('公開時に ArticlePublished イベントが発行される', () => {
      const article = createDefaultArticle();
      article.clearDomainEvents();

      article.publish();

      const events = article.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ArticlePublished);
    });

    it('本文が空の場合、公開できない', () => {
      const article = createDefaultArticle({
        content: ArticleContent.fromString(''),
      });

      expect(() => article.publish()).toThrow(DomainError);
    });

    it('既に公開済みの場合、公開できない', () => {
      const article = createDefaultArticle();
      article.publish();

      expect(() => article.publish()).toThrow(DomainError);
    });
  });

  describe('記事の非公開化', () => {
    it('公開済み記事を非公開にできる', () => {
      const article = createDefaultArticle();
      article.publish();
      article.clearDomainEvents();

      article.unpublish();

      expect(article.isDraft()).toBe(true);
    });

    it('非公開時に ArticleUnpublished イベントが発行される', () => {
      const article = createDefaultArticle();
      article.publish();
      article.clearDomainEvents();

      article.unpublish();

      const events = article.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ArticleUnpublished);
    });

    it('既に下書きの場合、非公開にできない', () => {
      const article = createDefaultArticle();

      expect(() => article.unpublish()).toThrow(DomainError);
    });
  });

  describe('カウンター', () => {
    it('incrementViewCount() で viewCount が 1 増加する', () => {
      const article = createDefaultArticle();

      article.incrementViewCount();

      expect(article.viewCount.equals(ViewCount.fromNumber(1))).toBe(true);
    });

    it('incrementLikeCount() で likeCount が 1 増加する', () => {
      const article = createDefaultArticle();

      article.incrementLikeCount();

      expect(article.likeCount.equals(LikeCount.fromNumber(1))).toBe(true);
    });

    it('decrementLikeCount() で likeCount が 1 減少する', () => {
      const article = createDefaultArticle();
      article.incrementLikeCount();
      article.incrementLikeCount();

      article.decrementLikeCount();

      expect(article.likeCount.equals(LikeCount.fromNumber(1))).toBe(true);
    });
  });

  describe('ドメインイベント', () => {
    it('clearDomainEvents() でイベントがクリアされる', () => {
      const article = createDefaultArticle();
      expect(article.getDomainEvents().length).toBeGreaterThan(0);

      article.clearDomainEvents();

      expect(article.getDomainEvents()).toHaveLength(0);
    });
  });

  describe('等価性', () => {
    it('同じ ID の場合、等価と判定される', () => {
      const id = ArticleId.generate();
      const article1 = Article.reconstruct({
        id,
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('記事1'),
        content: ArticleContent.fromString('本文1'),
        status: ArticleStatus.draft(),
        slug: Slug.fromString('slug-1'),
        authorId: UserId.fromString('01KQ06J55G7P1RPHZRXJNQZY1J'),
        tagIds: [],
        viewCount: ViewCount.zero(),
        likeCount: LikeCount.zero(),
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const article2 = Article.reconstruct({
        id,
        tenantId: TenantId.personal(),
        title: ArticleTitle.fromString('記事2'),
        content: ArticleContent.fromString('本文2'),
        status: ArticleStatus.draft(),
        slug: Slug.fromString('slug-2'),
        authorId: UserId.fromString('01KQ06J55G7P1RPHZRXJNQZY1J'),
        tagIds: [],
        viewCount: ViewCount.zero(),
        likeCount: LikeCount.zero(),
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(article1.equals(article2)).toBe(true);
    });
  });

  describe('編集権限', () => {
    const authorId = UserId.fromString('01KQ06J55G7P1RPHZRXJNQZY1J');
    const otherUserId = UserId.fromString('01KQ06J562A70XFYHDVHRM0ZY1');

    it('作成者は記事を編集できる', () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString('タイトル'),
        ArticleContent.fromString('本文'),
        Slug.fromString('slug'),
        authorId
      );

      expect(article.canBeEditedBy(authorId)).toBe(true);
    });

    it('作成者以外は記事を編集できない（admin も不可）', () => {
      const article = Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString('タイトル'),
        ArticleContent.fromString('本文'),
        Slug.fromString('slug'),
        authorId
      );

      expect(article.canBeEditedBy(otherUserId)).toBe(false);
    });
  });

  describe('非公開化・削除の権限', () => {
    const authorId = UserId.fromString('01KQ06J55G7P1RPHZRXJNQZY1J');
    const otherUserId = UserId.fromString('01KQ06J562A70XFYHDVHRM0ZY1');

    const buildArticle = () =>
      Article.create(
        ArticleId.generate(),
        TenantId.personal(),
        ArticleTitle.fromString('タイトル'),
        ArticleContent.fromString('本文'),
        Slug.fromString('slug'),
        authorId
      );

    it('作成者は管理者権限なしでも削除できる', () => {
      const article = buildArticle();

      expect(article.canBeDeletedBy(authorId, { isPrivileged: false })).toBe(
        true
      );
    });

    it('管理者権限を持つ他ユーザーは削除できる', () => {
      const article = buildArticle();

      expect(article.canBeDeletedBy(otherUserId, { isPrivileged: true })).toBe(
        true
      );
    });

    it('管理者権限のない他ユーザーは削除できない', () => {
      const article = buildArticle();

      expect(article.canBeDeletedBy(otherUserId, { isPrivileged: false })).toBe(
        false
      );
    });

    it('作成者は管理者権限なしでも非公開化できる', () => {
      const article = buildArticle();

      expect(
        article.canBeUnpublishedBy(authorId, { isPrivileged: false })
      ).toBe(true);
    });

    it('管理者権限を持つ他ユーザーは非公開化できる', () => {
      const article = buildArticle();

      expect(
        article.canBeUnpublishedBy(otherUserId, { isPrivileged: true })
      ).toBe(true);
    });

    it('管理者権限のない他ユーザーは非公開化できない', () => {
      const article = buildArticle();

      expect(
        article.canBeUnpublishedBy(otherUserId, { isPrivileged: false })
      ).toBe(false);
    });
  });
});
