'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortSelectorProps {
  currentSort?: string;
  currentDirection?: string;
}

const SORT_OPTIONS = [
  { value: 'publishedAt-desc', label: '公開日時（新しい順）' },
  { value: 'publishedAt-asc', label: '公開日時（古い順）' },
  { value: 'viewCount-desc', label: '閲覧数（多い順）' },
  { value: 'viewCount-asc', label: '閲覧数（少ない順）' },
  { value: 'likeCount-desc', label: 'いいね数（多い順）' },
  { value: 'likeCount-asc', label: 'いいね数（少ない順）' },
] as const;

export function SortSelector({
  currentSort = 'publishedAt',
  currentDirection = 'desc',
}: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentValue = `${currentSort}-${currentDirection}`;

  const handleChange = useCallback(
    (value: string | null) => {
      if (!value) return;
      const [sort, dir] = value.split('-');
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', sort ?? 'publishedAt');
      params.set('dir', dir ?? 'desc');
      params.delete('cursor');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger aria-label="ソート順を選択">
        <SelectValue placeholder="ソート順" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
