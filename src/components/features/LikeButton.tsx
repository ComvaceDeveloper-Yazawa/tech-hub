'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { toggleLike } from '@/presentation/actions/toggleLike';

interface LikeButtonProps {
  articleId: string;
  initialLikeCount: number;
  initialLiked: boolean;
}

export function LikeButton({
  articleId,
  initialLikeCount,
  initialLiked,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const prevLiked = liked;
    const prevCount = likeCount;

    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    startTransition(async () => {
      try {
        const result = await toggleLike({ articleId });
        setLiked(result.liked);
        setLikeCount(result.liked ? prevCount + 1 : prevCount - 1);
      } catch {
        // Revert on error
        setLiked(prevLiked);
        setLikeCount(prevCount);
        toast.error('いいねの更新に失敗しました');
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      aria-label={liked ? 'いいねを取り消す' : 'いいねする'}
      aria-pressed={liked}
    >
      <Heart
        className={cn('size-4', liked && 'fill-current text-red-500')}
        aria-hidden="true"
      />
      <span>{likeCount}</span>
    </Button>
  );
}
