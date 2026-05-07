import type { IUserRepository } from '@/contexts/identity/domain/IUserRepository';
import type { User } from '@/contexts/identity/domain/User';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export interface ListUsersInput {
  tenantId: TenantId;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<User[]> {
    return this.userRepository.findAll(input.tenantId);
  }
}
