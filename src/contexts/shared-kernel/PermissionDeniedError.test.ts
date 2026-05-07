import { describe, it, expect } from 'vitest';
import { PermissionDeniedError } from '@/contexts/shared-kernel/PermissionDeniedError';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

describe('PermissionDeniedError', () => {
  describe('継承関係', () => {
    it('ApplicationError を継承している', () => {
      const error = new PermissionDeniedError('操作する権限がありません');

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toBeInstanceOf(Error);
    });

    it('name プロパティが PermissionDeniedError になる', () => {
      const error = new PermissionDeniedError('操作する権限がありません');

      expect(error.name).toBe('PermissionDeniedError');
    });
  });

  describe('メッセージ', () => {
    it('指定したメッセージが保持される', () => {
      const error = new PermissionDeniedError('記事を削除する権限がありません');

      expect(error.message).toBe('記事を削除する権限がありません');
    });
  });
});
