import { EntityId } from './EntityId';

export class TagId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static fromString(value: string): TagId {
    return new TagId(value);
  }
}
