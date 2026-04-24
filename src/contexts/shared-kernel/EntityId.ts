export abstract class EntityId {
  private static readonly ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

  protected constructor(protected readonly value: string) {
    if (!EntityId.ULID_REGEX.test(value)) {
      throw new Error(`Invalid ULID: ${value}`);
    }
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
