'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import type { EditorView } from '@codemirror/view';
import { wrap } from './editorCommands';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Gray', hex: '#6b7280' },
];

interface ColorPickerProps {
  getView: () => EditorView | null;
}

export function ColorPicker({ getView }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(hex: string) {
    const view = getView();
    if (!view) return;
    wrap(view, `<span style="color:${hex}">`, '</span>', 'テキスト');
    setOpen(false);
  }

  return (
    <div className="relative">
      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
      <button
        type="button"
        title="文字色"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded text-[#abb2bf] hover:bg-[#3e4451] hover:text-white active:bg-[#528bff]/30"
      >
        <Palette size={15} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 rounded border border-[#3e4451] bg-[#21252b] p-2 shadow-lg">
          <div className="grid grid-cols-4 gap-1">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.name}
                onClick={() => handleSelect(c.hex)}
                className="h-6 w-6 rounded border border-[#3e4451] transition-transform hover:scale-110"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
