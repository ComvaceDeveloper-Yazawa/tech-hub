'use client';

import { useState } from 'react';
import { Type } from 'lucide-react';
import type { EditorView } from '@codemirror/view';
import { wrap } from './editorCommands';

const SIZES = [
  { label: 'S (小)', value: '12px' },
  { label: 'M (標準)', value: '16px' },
  { label: 'L (大)', value: '20px' },
  { label: 'XL (特大)', value: '28px' },
];

interface SizePickerProps {
  getView: () => EditorView | null;
}

export function SizePicker({ getView }: SizePickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(value: string) {
    const view = getView();
    if (!view) return;
    wrap(view, `<span style="font-size:${value}">`, '</span>', 'テキスト');
    setOpen(false);
  }

  return (
    <div className="relative">
      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
      <button
        type="button"
        title="文字サイズ"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded text-[#abb2bf] hover:bg-[#3e4451] hover:text-white active:bg-[#528bff]/30"
      >
        <Type size={15} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 min-w-[120px] rounded border border-[#3e4451] bg-[#21252b] shadow-lg">
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => handleSelect(s.value)}
              className="w-full px-3 py-1.5 text-left text-sm text-[#abb2bf] hover:bg-[#3e4451] hover:text-white"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
