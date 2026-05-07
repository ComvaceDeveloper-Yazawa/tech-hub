import type { IUserRepository } from '@/contexts/identity/domain/IUserRepository';
import type { User } from '@/contexts/identity/domain/User';
import type { UserId } from '@/contexts/shared-kernel/UserId';
import type { TenantId } from '@/contexts/shared-kernel/TenantId';

export interface GetCurrentUserInput {
  userId: UserId;
  tenantId: TenantId;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetCurrentUserInput): Promise<User | null> {
    return this.userRepository.findById(input.userId, input.tenantId);
  }
}
