'use client';

import { useState, useTransition } from 'react';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { toggleBookmark } from '@/presentation/actions/toggleBookmark';

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({
  articleId,
  initialBookmarked,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const prevBookmarked = bookmarked;

    // Optimistic update
    setBookmarked(!bookmarked);

    startTransition(async () => {
      try {
        const result = await toggleBookmark({ articleId });
        setBookmarked(result.bookmarked);
      } catch {
        // Revert on error
        setBookmarked(prevBookmarked);
        toast.error('ブックマークの更新に失敗しました');
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      aria-label={bookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
      aria-pressed={bookmarked}
    >
      <Bookmark
        className={cn('size-4', bookmarked && 'fill-current')}
        aria-hidden="true"
      />
    </Button>
  );
}
