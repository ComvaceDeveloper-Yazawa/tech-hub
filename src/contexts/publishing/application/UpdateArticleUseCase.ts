import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import type { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import type { Slug } from '@/contexts/publishing/domain/article/Slug';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TagId } from '@/contexts/shared-kernel/TagId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';

export interface UpdateArticleInput {
  articleId: ArticleId;
  tenantId: TenantId;
  requesterId: UserId;
  title?: ArticleTitle;
  content?: ArticleContent;
  slug?: Slug;
  tagIds?: TagId[];
}

export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(input: UpdateArticleInput): Promise<void> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    if (!article.canBeEditedBy(input.requesterId)) {
      throw new PermissionDeniedError('記事を編集する権限がありません');
    }

    if (input.slug !== undefined) {
      const slugExists = await this.articleRepository.existsBySlug(
        input.slug,
        input.tenantId
      );
      if (slugExists) {
        throw new ApplicationError('このスラッグは既に使用されています');
      }
      article.updateSlug(input.slug);
    }

    if (input.title !== undefined) {
      article.updateTitle(input.title);
    }

    if (input.content !== undefined) {
      article.updateContent(input.content);
    }

    if (input.tagIds !== undefined) {
      article.updateTags(input.tagIds);
    }

    await this.articleRepository.save(article);
  }
}
