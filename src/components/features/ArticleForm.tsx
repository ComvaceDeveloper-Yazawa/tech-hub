'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { HelpCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaLibrary } from '@/components/features/MediaLibrary';
import { RichMarkdownEditor } from '@/components/features/RichMarkdownEditor';
import { TagInput } from '@/components/features/TagInput';
import { uploadImage } from '@/presentation/actions/uploadImage';
import { listTags, type TagItem } from '@/presentation/actions/listTags';
import { useLoading } from '@/contexts/loading/LoadingContext';

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
});

interface ArticleFormProps {
  mode: 'create' | 'edit';
  defaultValues?: {
    articleId?: string;
    title?: string;
    content?: string;
    slug?: string;
    tagNames?: string[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    slug: string;
    tagNames?: string[];
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
  const [tags, setTags] = useState<string[]>(defaultValues?.tagNames ?? []);
  const [tagSuggestions, setTagSuggestions] = useState<TagItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [showSlugTooltip, setShowSlugTooltip] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  // 既存タグを取得
  useEffect(() => {
    listTags()
      .then(setTagSuggestions)
      .catch(() => {});
  }, []);

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
      if (file?.type.startsWith('image/')) await handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const parsed = articleFormSchema.safeParse({ title, content, slug });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field && typeof field === 'string')
          fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      showLoading();
      try {
        await onSubmit({
          title,
          content,
          slug,
          tagNames: tags.length > 0 ? tags : undefined,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message === 'NEXT_REDIRECT' ||
            (error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT'))
        ) {
          throw error;
        }
        hideLoading();
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

      {/* タイトル */}
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

      {/* スラッグ */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="slug">スラッグ</Label>
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowSlugTooltip(true)}
              onMouseLeave={() => setShowSlugTooltip(false)}
              onFocus={() => setShowSlugTooltip(true)}
              onBlur={() => setShowSlugTooltip(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="スラッグとは"
            >
              <HelpCircleIcon className="h-4 w-4" />
            </button>
            {showSlugTooltip && (
              <div className="bg-popover border-border absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-lg border p-3 text-xs shadow-lg">
                <p className="text-foreground mb-1 font-medium">
                  スラッグとは？
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  URLに使われる識別子です。例えばスラッグが{' '}
                  <code className="bg-muted rounded px-1">my-first-post</code>{' '}
                  の場合、記事のURLは
                  <code className="bg-muted rounded px-1">
                    /articles/my-first-post
                  </code>{' '}
                  になります。
                </p>
                <p className="text-muted-foreground mt-1.5 leading-relaxed">
                  英小文字・数字・ハイフンのみ使用可能です。
                </p>
                {/* 吹き出しの矢印 */}
                <div className="border-popover absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-current" />
              </div>
            )}
          </div>
        </div>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-first-post"
          aria-invalid={!!errors.slug}
        />
        {errors.slug && (
          <p role="alert" className="text-destructive text-sm">
            {errors.slug}
          </p>
        )}
      </div>

      {/* 本文 */}
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

      {/* メディアライブラリ */}
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

      {/* タグ */}
      <div className="space-y-2">
        <Label>タグ</Label>
        <TagInput
          value={tags}
          onChange={setTags}
          suggestions={tagSuggestions}
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
