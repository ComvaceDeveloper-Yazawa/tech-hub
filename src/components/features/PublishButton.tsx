'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { publishArticle } from '@/presentation/actions/publishArticle';
import { unpublishArticle } from '@/presentation/actions/unpublishArticle';

interface PublishButtonProps {
  articleId: string;
  currentStatus: 'draft' | 'published';
}

export function PublishButton({
  articleId,
  currentStatus,
}: PublishButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        if (currentStatus === 'draft') {
          await publishArticle({ articleId });
        } else {
          await unpublishArticle({ articleId });
        }
        router.refresh();
      } catch {
        toast.error(
          currentStatus === 'draft'
            ? '記事の公開に失敗しました'
            : '記事の非公開に失敗しました'
        );
      }
    });
  };

  return (
    <Button
      variant={currentStatus === 'draft' ? 'default' : 'outline'}
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      aria-label={
        currentStatus === 'draft' ? '記事を公開する' : '記事を非公開にする'
      }
    >
      {currentStatus === 'draft' ? '公開' : '非公開'}
    </Button>
  );
}
