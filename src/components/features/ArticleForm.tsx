'use client';

import { useState, useTransition, useCallback } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaLibrary } from '@/components/features/MediaLibrary';
import { RichMarkdownEditor } from '@/components/features/RichMarkdownEditor';
import { uploadImage } from '@/presentation/actions/uploadImage';

const articleFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内です'),
  content: z.string().min(1, '本文は必須です'),
  slug: z
    .string()
    .min(1, 'スラッグは必須です')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'スラッグは英小文字・数字・ハイフンのみです'
    ),
  tagIds: z.string().optional(),
});

interface ArticleFormProps {
  mode: 'create' | 'edit';
  defaultValues?: {
    articleId?: string;
    title?: string;
    content?: string;
    slug?: string;
    tagIds?: string[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    slug: string;
    tagIds?: string[];
  }) => Promise<void>;
}

export function ArticleForm({
  mode,
  defaultValues,
  onSubmit,
}: ArticleFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [content, setContent] = useState(defaultValues?.content ?? '');
  const [slug, setSlug] = useState(defaultValues?.slug ?? '');
  const [tagIdsInput, setTagIdsInput] = useState(
    defaultValues?.tagIds?.join(', ') ?? ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mediaOpen, setMediaOpen] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { url } = await uploadImage(formData);
      setContent((prev) => `${prev}\n![image](${url})\n`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : '画像のアップロードに失敗しました'
      );
    }
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        await handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const parsed = articleFormSchema.safeParse({
      title,
      content,
      slug,
      tagIds: tagIdsInput,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field && typeof field === 'string') {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    const tagIds = tagIdsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      try {
        await onSubmit({
          title,
          content,
          slug,
          tagIds: tagIds.length > 0 ? tagIds : undefined,
        });
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : '保存に失敗しました'
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
        >
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="記事のタイトル"
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p role="alert" className="text-destructive text-sm">
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">スラッグ</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="article-slug"
          aria-invalid={!!errors.slug}
        />
        {errors.slug && (
          <p role="alert" className="text-destructive text-sm">
            {errors.slug}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">本文</Label>
          <button
            type="button"
            onClick={() => setMediaOpen(true)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded text-xs transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="3" width="18" height="14" rx="2" />
              <circle cx="6.5" cy="8.5" r="1.5" />
              <path d="M1 14l5-5 3 3 3-3 7 7" />
            </svg>
            メディア挿入
          </button>
        </div>
        <RichMarkdownEditor
          value={content}
          onChange={setContent}
          onDrop={handleDrop}
          height={500}
        />
        {errors.content && (
          <p role="alert" className="text-destructive text-sm">
            {errors.content}
          </p>
        )}
      </div>

      {mediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border-border h-[80vh] w-[90vw] max-w-4xl overflow-hidden rounded-lg border shadow-lg">
            <MediaLibrary
              multiSelect
              onInsert={(urls) => {
                const markdown = urls
                  .map((url) => `![image](${url})`)
                  .join('\n');
                setContent((prev) => `${prev}\n${markdown}\n`);
                toast.success(`${urls.length}件の画像を挿入しました`);
              }}
              onClose={() => setMediaOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tagIds">タグ ID（カンマ区切り）</Label>
        <Input
          id="tagIds"
          value={tagIdsInput}
          onChange={(e) => setTagIdsInput(e.target.value)}
          placeholder="TAG_ID_1, TAG_ID_2"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending
          ? '保存中...'
          : mode === 'create'
            ? '記事を作成'
            : '記事を更新'}
      </Button>
    </form>
  );
}
