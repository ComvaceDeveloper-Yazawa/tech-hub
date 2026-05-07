import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListUsersUseCase } from '@/contexts/identity/application/ListUsersUseCase';
import type { IUserRepository } from '@/contexts/identity/domain/IUserRepository';
import { User } from '@/contexts/identity/domain/User';
import { UserRole } from '@/contexts/identity/domain/UserRole';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ulid } from 'ulid';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    useCase = new ListUsersUseCase(mockRepository);
  });

  describe('正常系', () => {
    it('テナント内の全ユーザーを取得できる', async () => {
      // Arrange
      const tenantId = TenantId.personal();
      const users = [
        User.reconstruct({
          id: UserId.fromString(ulid()),
          tenantId,
          role: UserRole.admin(),
        }),
        User.reconstruct({
          id: UserId.fromString(ulid()),
          tenantId,
          role: UserRole.employee(),
        }),
        User.reconstruct({
          id: UserId.fromString(ulid()),
          tenantId,
          role: UserRole.employee(),
        }),
      ];
      vi.mocked(mockRepository.findAll).mockResolvedValue(users);

      // Act
      const result = await useCase.execute({ tenantId });

      // Assert
      expect(result).toHaveLength(3);
      expect(mockRepository.findAll).toHaveBeenCalledWith(tenantId);
    });

    it('ユーザーが存在しない場合、空配列を返す', async () => {
      // Arrange
      vi.mocked(mockRepository.findAll).mockResolvedValue([]);

      // Act
      const result = await useCase.execute({ tenantId: TenantId.personal() });

      // Assert
      expect(result).toHaveLength(0);
    });
  });
});
