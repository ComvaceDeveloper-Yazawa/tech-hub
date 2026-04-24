import type { IArticleRepository } from '@/contexts/publishing/domain/IArticleRepository';
import type { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export interface RecordViewInput {
  articleId: ArticleId;
  tenantId: TenantId;
}

export class RecordViewUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(input: RecordViewInput): Promise<void> {
    const article = await this.articleRepository.findById(
      input.articleId,
      input.tenantId
    );
    if (!article) {
      throw new ApplicationError('記事が見つかりません');
    }

    await this.articleRepository.incrementViewCount(
      input.articleId,
      input.tenantId
    );
  }
}
