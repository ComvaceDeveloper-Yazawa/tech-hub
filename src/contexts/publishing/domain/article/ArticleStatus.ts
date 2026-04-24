export class ArticleStatus {
  private constructor(private readonly value: 'draft' | 'published') {}

  static draft(): ArticleStatus {
    return new ArticleStatus('draft');
  }

  static published(): ArticleStatus {
    return new ArticleStatus('published');
  }

  isDraft(): boolean {
    return this.value === 'draft';
  }

  isPublished(): boolean {
    return this.value === 'published';
  }

  equals(other: ArticleStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
