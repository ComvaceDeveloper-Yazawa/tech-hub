import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export class PermissionDeniedError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}
