import { DomainError } from '@/contexts/shared-kernel/DomainError';

export class LikeCount {
  private constructor(private readonly value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new DomainError('いいね数は0以上の整数です');
    }
  }

  static zero(): LikeCount {
    return new LikeCount(0);
  }

  static fromNumber(value: number): LikeCount {
    return new LikeCount(value);
  }

  increment(): LikeCount {
    return new LikeCount(this.value + 1);
  }

  decrement(): LikeCount {
    return new LikeCount(Math.max(0, this.value - 1));
  }

  equals(other: LikeCount): boolean {
    return this.value === other.value;
  }

  toNumber(): number {
    return this.value;
  }
}
