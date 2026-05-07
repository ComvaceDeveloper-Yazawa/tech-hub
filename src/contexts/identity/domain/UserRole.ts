import { DomainError } from '@/contexts/shared-kernel/DomainError';

type RoleValue = 'admin' | 'employee';

export class UserRole {
  private constructor(private readonly value: RoleValue) {}

  static admin(): UserRole {
    return new UserRole('admin');
  }

  static employee(): UserRole {
    return new UserRole('employee');
  }

  static fromString(value: string): UserRole {
    if (value === 'admin' || value === 'employee') {
      return new UserRole(value);
    }
    throw new DomainError(`不正なユーザーロールです: ${value}`);
  }

  isAdmin(): boolean {
    return this.value === 'admin';
  }

  isEmployee(): boolean {
    return this.value === 'employee';
  }

  equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
