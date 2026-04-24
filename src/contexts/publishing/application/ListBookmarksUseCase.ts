import type { IArticleBookmarkRepository } from '@/contexts/publishing/domain/IArticleBookmarkRepository';
import type { ArticleBookmark } from '@/contexts/publishing/domain/bookmark/ArticleBookmark';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type {
  PaginationParams,
  PaginatedResult,
} from '@/contexts/shared-kernel/Pagination';

export interface ListBookmarksInput {
  userId: UserId;
  tenantId: TenantId;
  pagination: PaginationParams;
}

export class ListBookmarksUseCase {
  constructor(
    private readonly bookmarkRepository: IArticleBookmarkRepository
  ) {}

  async execute(
    input: ListBookmarksInput
  ): Promise<PaginatedResult<ArticleBookmark>> {
    return this.bookmarkRepository.findByUserPaginated(
      input.userId,
      input.tenantId,
      input.pagination
    );
  }
}
