'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  nextCursor: string | null;
  prevCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({
  nextCursor,
  prevCursor,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (cursor: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cursor) {
        params.set('cursor', cursor);
      } else {
        params.delete('cursor');
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <nav
      aria-label="ページネーション"
      className="flex items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrevPage}
        onClick={() => navigate(prevCursor)}
        aria-label="前のページ"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        前へ
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => navigate(nextCursor)}
        aria-label="次のページ"
      >
        次へ
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
