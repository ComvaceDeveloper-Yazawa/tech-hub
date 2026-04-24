export class ArticleContent {
  private constructor(private readonly value: string) {}

  static fromString(value: string): ArticleContent {
    return new ArticleContent(value);
  }

  equals(other: ArticleContent): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  charCount(): number {
    return this.value.length;
  }
}
