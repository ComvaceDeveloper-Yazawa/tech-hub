import { EntityId } from './EntityId';

export class UserId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static fromString(value: string): UserId {
    return new UserId(value);
  }
}
