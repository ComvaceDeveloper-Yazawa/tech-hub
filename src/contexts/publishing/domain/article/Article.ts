import type { DomainEvent } from '@/contexts/shared-kernel/DomainEvent';
import { DomainError } from '@/contexts/shared-kernel/DomainError';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TagId } from '@/contexts/shared-kernel/TagId';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import type { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';
import type { Slug } from '@/contexts/publishing/domain/article/Slug';
import { ViewCount } from '@/contexts/publishing/domain/article/ViewCount';
import { LikeCount } from '@/contexts/publishing/domain/article/LikeCount';
import { ArticleCreated } from '@/contexts/publishing/domain/article/ArticleCreated';
import { ArticlePublished } from '@/contexts/publishing/domain/article/ArticlePublished';
import { ArticleUnpublished } from '@/contexts/publishing/domain/article/ArticleUnpublished';

export class Article {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    private readonly _id: ArticleId,
    private readonly _tenantId: TenantId,
    private _title: ArticleTitle,
    private _content: ArticleContent,
    private _status: ArticleStatus,
    private _slug: Slug,
    private readonly _authorId: UserId,
    private _tagIds: TagId[],
    private _viewCount: ViewCount,
    private _likeCount: LikeCount,
    private _publishedAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: ArticleId,
    tenantId: TenantId,
    title: ArticleTitle,
    content: ArticleContent,
    slug: Slug,
    authorId: UserId,
    tagIds?: TagId[]
  ): Article {
    const now = new Date();
    const article = new Article(
      id,
      tenantId,
      title,
      content,
      ArticleStatus.draft(),
      slug,
      authorId,
      tagIds ?? [],
      ViewCount.zero(),
      LikeCount.zero(),
      null,
      now,
      now
    );
    article.domainEvents.push(new ArticleCreated(id, tenantId, authorId));
    return article;
  }

  static reconstruct(params: {
    id: ArticleId;
    tenantId: TenantId;
    title: ArticleTitle;
    content: ArticleContent;
    status: ArticleStatus;
    slug: Slug;
    authorId: UserId;
    tagIds: TagId[];
    viewCount: ViewCount;
    likeCount: LikeCount;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Article {
    return new Article(
      params.id,
      params.tenantId,
      params.title,
      params.content,
      params.status,
      params.slug,
      params.authorId,
      params.tagIds,
      params.viewCount,
      params.likeCount,
      params.publishedAt,
      params.createdAt,
      params.updatedAt
    );
  }

  get id(): ArticleId {
    return this._id;
  }

  get tenantId(): TenantId {
    return this._tenantId;
  }

  get title(): ArticleTitle {
    return this._title;
  }

  get content(): ArticleContent {
    return this._content;
  }

  get status(): ArticleStatus {
    return this._status;
  }

  get slug(): Slug {
    return this._slug;
  }

  get authorId(): UserId {
    return this._authorId;
  }

  get tagIds(): TagId[] {
    return [...this._tagIds];
  }

  get viewCount(): ViewCount {
    return this._viewCount;
  }

  get likeCount(): LikeCount {
    return this._likeCount;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTitle(newTitle: ArticleTitle): void {
    this._title = newTitle;
    this._updatedAt = new Date();
  }

  updateContent(newContent: ArticleContent): void {
    this._content = newContent;
    this._updatedAt = new Date();
  }

  updateSlug(newSlug: Slug): void {
    this._slug = newSlug;
    this._updatedAt = new Date();
  }

  updateTags(tagIds: TagId[]): void {
    this._tagIds = [...tagIds];
    this._updatedAt = new Date();
  }

  publish(): void {
    if (this._status.isPublished()) {
      throw new DomainError('既に公開済みです');
    }
    if (this._title.isEmpty() || this._content.isEmpty()) {
      throw new DomainError('公開条件を満たしていません');
    }
    this._status = ArticleStatus.published();
    this._publishedAt = new Date();
    this.domainEvents.push(
      new ArticlePublished(this._id, this._tenantId, this._publishedAt)
    );
  }

  unpublish(): void {
    if (this._status.isDraft()) {
      throw new DomainError('既に下書き状態です');
    }
    this._status = ArticleStatus.draft();
    this.domainEvents.push(
      new ArticleUnpublished(this._id, this._tenantId, new Date())
    );
  }

  incrementViewCount(): void {
    this._viewCount = this._viewCount.increment();
  }

  incrementLikeCount(): void {
    this._likeCount = this._likeCount.increment();
  }

  decrementLikeCount(): void {
    this._likeCount = this._likeCount.decrement();
  }

  isDraft(): boolean {
    return this._status.isDraft();
  }

  isPublished(): boolean {
    return this._status.isPublished();
  }

  canBeEditedBy(requesterId: UserId): boolean {
    return this._authorId.equals(requesterId);
  }

  canBeDeletedBy(
    requesterId: UserId,
    options: { isPrivileged: boolean }
  ): boolean {
    return this._authorId.equals(requesterId) || options.isPrivileged;
  }

  canBeUnpublishedBy(
    requesterId: UserId,
    options: { isPrivileged: boolean }
  ): boolean {
    return this._authorId.equals(requesterId) || options.isPrivileged;
  }

  equals(other: Article): boolean {
    return this._id.equals(other._id);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
