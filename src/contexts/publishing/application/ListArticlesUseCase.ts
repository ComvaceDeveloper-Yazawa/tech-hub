import type {
  IArticleRepository,
  ArticleListFilter,
  ArticleSortOption,
} from '@/contexts/publishing/domain/IArticleRepository';
import type { Article } from '@/contexts/publishing/domain/article/Article';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type {
  PaginationParams,
  PaginatedResult,
} from '@/contexts/shared-kernel/Pagination';

export interface ListArticlesInput {
  tenantId: TenantId;
  pagination: PaginationParams;
  filter?: ArticleListFilter;
  sort?: ArticleSortOption;
}

export class ListArticlesUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  async execute(input: ListArticlesInput): Promise<PaginatedResult<Article>> {
    return this.articleRepository.findPaginated(
      input.tenantId,
      input.pagination,
      input.filter,
      input.sort
    );
  }
}
