import { DomainError } from '@/contexts/shared-kernel/DomainError';

export class ViewCount {
  private constructor(private readonly value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new DomainError('閲覧数は0以上の整数です');
    }
  }

  static zero(): ViewCount {
    return new ViewCount(0);
  }

  static fromNumber(value: number): ViewCount {
    return new ViewCount(value);
  }

  increment(): ViewCount {
    return new ViewCount(this.value + 1);
  }

  equals(other: ViewCount): boolean {
    return this.value === other.value;
  }

  toNumber(): number {
    return this.value;
  }
}
