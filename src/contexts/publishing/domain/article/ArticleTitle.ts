import { DomainError } from '@/contexts/shared-kernel/DomainError';

export class ArticleTitle {
  private constructor(private readonly value: string) {
    if (value.length === 0) {
      throw new DomainError('タイトルは必須です');
    }
    if (value.length > 100) {
      throw new DomainError('タイトルは100文字以内です');
    }
  }

  static fromString(value: string): ArticleTitle {
    return new ArticleTitle(value.trim());
  }

  equals(other: ArticleTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return false;
  }
}
