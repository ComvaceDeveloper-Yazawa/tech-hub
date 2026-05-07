import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCurrentUserUseCase } from '@/contexts/identity/application/GetCurrentUserUseCase';
import type { IUserRepository } from '@/contexts/identity/domain/IUserRepository';
import { User } from '@/contexts/identity/domain/User';
import { UserRole } from '@/contexts/identity/domain/UserRole';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { ulid } from 'ulid';

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
    };
    useCase = new GetCurrentUserUseCase(mockRepository);
  });

  describe('正常系', () => {
    it('存在するユーザーを取得できる', async () => {
      // Arrange
      const userId = UserId.fromString(ulid());
      const tenantId = TenantId.personal();
      const user = User.reconstruct({
        id: userId,
        tenantId,
        role: UserRole.admin(),
      });
      vi.mocked(mockRepository.findById).mockResolvedValue(user);

      // Act
      const result = await useCase.execute({ userId, tenantId });

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id.equals(userId)).toBe(true);
      expect(result!.isAdmin()).toBe(true);
    });
  });

  describe('異常系', () => {
    it('存在しないユーザーの場合、null を返す', async () => {
      // Arrange
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      // Act
      const result = await useCase.execute({
        userId: UserId.fromString(ulid()),
        tenantId: TenantId.personal(),
      });

      // Assert
      expect(result).toBeNull();
    });
  });
});
