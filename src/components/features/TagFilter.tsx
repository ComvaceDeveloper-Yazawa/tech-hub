'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagFilterProps {
  currentTagId?: string;
}

export function TagFilter({ currentTagId }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tagId');
    params.delete('cursor');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  if (!currentTagId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">
        タグフィルタ: {currentTagId}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={clearFilter}
        aria-label="タグフィルタを解除"
      >
        <X className="size-3" aria-hidden="true" />
      </Button>
    </div>
  );
}
