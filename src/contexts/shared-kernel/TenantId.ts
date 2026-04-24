import { EntityId } from './EntityId';

export class TenantId extends EntityId {
  private static readonly PERSONAL_TENANT_ID = '00000000000000000000000000';

  private constructor(value: string) {
    super(value);
  }

  static personal(): TenantId {
    return new TenantId(TenantId.PERSONAL_TENANT_ID);
  }

  static fromString(value: string): TenantId {
    return new TenantId(value);
  }
}
