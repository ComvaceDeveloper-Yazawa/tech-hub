'use client';

import { useEffect } from 'react';

interface AiResultModalProps {
  open: boolean;
  title: string;
  items: string[];
  onSelect: (item: string) => void;
  onClose: () => void;
}

export function AiResultModal({
  open,
  title,
  items,
  onSelect,
  onClose,
}: AiResultModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-[#3e4451] bg-[#282c34] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#abb2bf]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5c6370] transition-colors hover:text-[#abb2bf]"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
        <p className="mb-3 text-xs text-[#5c6370]">
          クリックするとクリップボードにコピーされます
        </p>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="w-full rounded border border-[#3e4451] bg-[#21252b] px-3 py-2 text-left text-sm text-[#abb2bf] transition-colors hover:border-[#528bff] hover:text-white"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
