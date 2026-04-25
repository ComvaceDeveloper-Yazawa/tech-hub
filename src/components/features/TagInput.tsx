'use client';

import { useState, useRef, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import type { TagItem } from '@/presentation/actions/listTags';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: TagItem[];
}

export function TagInput({ value, onChange, suggestions }: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 入力に一致するサジェスト（既に選択済みは除外）
  const filtered = input.trim()
    ? suggestions.filter(
        (s) =>
          s.normalizedName.includes(input.trim().toLowerCase()) &&
          !value.some((v) => v.toLowerCase() === s.normalizedName)
      )
    : suggestions.filter(
        (s) => !value.some((v) => v.toLowerCase() === s.normalizedName)
      );

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    // 重複チェック（大文字小文字無視）
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...value, trimmed]);
    setInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 外側クリックでサジェストを閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="border-input bg-background focus-within:ring-ring flex min-h-10 cursor-text flex-wrap items-center gap-1.5 rounded-md border px-3 py-2 focus-within:ring-2 focus-within:outline-none"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, i) => (
          <span
            key={i}
            className="bg-primary/15 text-primary flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              className="hover:text-destructive ml-0.5 transition-colors"
              aria-label={`${tag}を削除`}
            >
              <XIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'タグを入力してEnter...' : ''}
          className="placeholder:text-muted-foreground min-w-24 flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      {/* サジェストドロップダウン */}
      {showSuggestions && filtered.length > 0 && (
        <div className="border-border bg-popover absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-md border shadow-lg">
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="hover:bg-accent w-full px-3 py-1.5 text-left text-sm transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault(); // フォーカスを奪わない
                  addTag(tag.name);
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <div className="border-border text-muted-foreground border-t px-3 py-1.5 text-xs">
            Enter または , で新規タグを追加
          </div>
        </div>
      )}

      <p className="text-muted-foreground mt-1 text-xs">
        Enter・カンマで確定。既存タグはリストから選択可能。
      </p>
    </div>
  );
}
