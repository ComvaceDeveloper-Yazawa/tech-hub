import { ulid } from 'ulid';
import { EntityId } from '@/contexts/shared-kernel/EntityId';

export class ArticleId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static generate(): ArticleId {
    return new ArticleId(ulid());
  }

  static fromString(value: string): ArticleId {
    return new ArticleId(value);
  }
}
