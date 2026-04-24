import { DomainError } from '@/contexts/shared-kernel/DomainError';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_LENGTH = 200;

export class Slug {
  private constructor(private readonly value: string) {
    if (
      value.length === 0 ||
      value.length > MAX_LENGTH ||
      !SLUG_PATTERN.test(value)
    ) {
      throw new DomainError(
        'スラッグは1〜200文字の英小文字・数字・ハイフンで指定してください'
      );
    }
  }

  static fromString(value: string): Slug {
    return new Slug(value);
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
