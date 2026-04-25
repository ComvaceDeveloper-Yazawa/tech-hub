'use client';

import { useState } from 'react';
import { Table } from 'lucide-react';
import type { EditorView } from '@codemirror/view';
import { insertBlock } from './editorCommands';

const GRID_SIZE = 6;

interface TableButtonProps {
  getView: () => EditorView | null;
}

function buildTable(cols: number, rows: number): string {
  const header =
    '| ' +
    Array.from({ length: cols }, (_, i) => `列${i + 1}`).join(' | ') +
    ' |';
  const separator =
    '| ' + Array.from({ length: cols }, () => '---').join(' | ') + ' |';
  const bodyRow =
    '| ' + Array.from({ length: cols }, () => '  ').join(' | ') + ' |';
  const bodyRows = Array.from({ length: rows }, () => bodyRow).join('\n');
  return `${header}\n${separator}\n${bodyRows}`;
}

export function TableButton({ getView }: TableButtonProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(
    null
  );

  function handleSelect(cols: number, rows: number) {
    const view = getView();
    if (!view) return;
    insertBlock(view, buildTable(cols, rows));
    setOpen(false);
    setHovered(null);
  }

  const label = hovered ? `${hovered.col} × ${hovered.row}` : 'サイズを選択';

  return (
    <div className="relative">
      {open && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setOpen(false);
            setHovered(null);
          }}
        />
      )}
      <button
        type="button"
        title="テーブルを挿入"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded text-[#abb2bf] hover:bg-[#3e4451] hover:text-white active:bg-[#528bff]/30"
      >
        <Table size={15} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 rounded border border-[#3e4451] bg-[#21252b] p-2 shadow-lg">
          <p className="mb-1.5 text-center text-xs text-[#abb2bf]">{label}</p>
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {Array.from({ length: GRID_SIZE }, (_, rowIdx) =>
              Array.from({ length: GRID_SIZE }, (_, colIdx) => {
                const col = colIdx + 1;
                const row = rowIdx + 1;
                const isHighlighted =
                  hovered !== null && col <= hovered.col && row <= hovered.row;
                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    className={`h-4 w-4 rounded-sm border transition-colors ${
                      isHighlighted
                        ? 'border-[#528bff] bg-[#528bff]/40'
                        : 'border-[#3e4451] bg-[#282c34]'
                    }`}
                    onMouseEnter={() => setHovered({ col, row })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleSelect(col, row)}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
