import { z } from 'zod';

// ULID pattern
const ulidSchema = z.string().regex(/^[0-9A-HJKMNP-TV-Z]{26}$/);

// Slug pattern
const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .min(1)
  .max(200);

export const createArticleInputSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string(),
  slug: slugSchema,
  tagIds: z.array(ulidSchema).optional(),
});

export const updateArticleInputSchema = z.object({
  articleId: ulidSchema,
  title: z.string().min(1).max(100).optional(),
  content: z.string().optional(),
  slug: slugSchema.optional(),
  tagIds: z.array(ulidSchema).optional(),
});

export const publishArticleInputSchema = z.object({
  articleId: ulidSchema,
});

export const unpublishArticleInputSchema = z.object({
  articleId: ulidSchema,
});

export const deleteArticleInputSchema = z.object({
  articleId: ulidSchema,
});

export const recordViewInputSchema = z.object({
  articleId: ulidSchema,
});

export const toggleLikeInputSchema = z.object({
  articleId: ulidSchema,
});

export const toggleBookmarkInputSchema = z.object({
  articleId: ulidSchema,
});

export const listArticlesInputSchema = z.object({
  cursor: ulidSchema.optional(),
  limit: z.number().int().min(1).max(50).default(20),
  status: z.enum(['draft', 'published']).optional(),
  authorId: ulidSchema.optional(),
  tagId: ulidSchema.optional(),
  sortField: z
    .enum(['publishedAt', 'createdAt', 'updatedAt', 'viewCount', 'likeCount'])
    .optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export const listBookmarksInputSchema = z.object({
  cursor: ulidSchema.optional(),
  limit: z.number().int().min(1).max(50).default(20),
});
