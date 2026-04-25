'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tag {
  id: string;
  name: string;
}

interface TagFilterProps {
  currentTagId?: string;
  tags?: Tag[];
}

export function TagFilter({ currentTagId, tags = [] }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const currentTagName =
    tags.find((t) => t.id === currentTagId)?.name ?? currentTagId;

  const filtered = query.trim()
    ? tags.filter((t) =>
        t.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : tags;

  const applyTag = useCallback(
    (tagId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tagId', tagId);
      params.delete('cursor');
      router.push(`?${params.toString()}`);
      setQuery('');
    },
    [router, searchParams]
  );

  const clearFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tagId');
    params.delete('cursor');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* タグ検索フォーム */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="タグで絞り込む..."
          className="border-input bg-background placeholder:text-muted-foreground h-9 w-44 rounded-md border py-1 pr-3 pl-8 text-sm focus:ring-2 focus:ring-[#528bff]/50 focus:outline-none"
        />
        {query && filtered.length > 0 && (
          <div className="border-border bg-popover absolute top-full left-0 z-50 mt-1 w-48 overflow-hidden rounded-md border shadow-lg">
            {filtered.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => applyTag(tag.id)}
                className="hover:bg-accent w-full px-3 py-1.5 text-left text-sm transition-colors"
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 現在のフィルタ表示 */}
      {currentTagId && (
        <div className="flex items-center gap-1.5 rounded-full bg-[#528bff]/15 px-3 py-1 text-sm text-[#528bff]">
          <span>{currentTagName}</span>
          <button
            type="button"
            onClick={clearFilter}
            aria-label="タグフィルタを解除"
            className="transition-colors hover:text-[#e06c75]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
