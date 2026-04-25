'use client';

import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListChecks,
  Link2,
  Image,
  Quote,
  Braces,
  Minus,
  Info,
  Lightbulb,
  AlertTriangle,
  OctagonAlert,
} from 'lucide-react';
import type { EditorView } from '@codemirror/view';
import { wrap, prefixLine, insertBlock } from './editorCommands';
import { ColorPicker } from './ColorPicker';
import { SizePicker } from './SizePicker';
import { TableButton } from './TableButton';
import { AiAssistMenu } from './AiAssistMenu';

interface EditorToolbarProps {
  getView: () => EditorView | null;
  getFullContent?: () => string;
  onMediaOpen?: () => void;
}

interface ToolButtonProps {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolButton({ title, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded text-[#abb2bf] hover:bg-[#3e4451] hover:text-white active:bg-[#528bff]/30"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-0.5 h-5 w-px bg-[#3e4451]" />;
}

export function EditorToolbar({
  getView,
  getFullContent,
  onMediaOpen,
}: EditorToolbarProps) {
  function v(fn: (view: EditorView) => void) {
    return () => {
      const view = getView();
      if (view) fn(view);
    };
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[#3e4451] bg-[#21252b] px-2 py-1.5">
      {/* 見出し */}
      <ToolButton
        title="見出し1 (Ctrl+1)"
        onClick={v((view) => prefixLine(view, '# '))}
      >
        <Heading1 size={15} />
      </ToolButton>
      <ToolButton
        title="見出し2 (Ctrl+2)"
        onClick={v((view) => prefixLine(view, '## '))}
      >
        <Heading2 size={15} />
      </ToolButton>
      <ToolButton
        title="見出し3 (Ctrl+3)"
        onClick={v((view) => prefixLine(view, '### '))}
      >
        <Heading3 size={15} />
      </ToolButton>

      <Divider />

      {/* 装飾 */}
      <ToolButton
        title="太字 (Ctrl+B)"
        onClick={v((view) => wrap(view, '**', '**', '太字'))}
      >
        <Bold size={15} />
      </ToolButton>
      <ToolButton
        title="斜体 (Ctrl+I)"
        onClick={v((view) => wrap(view, '*', '*', '斜体'))}
      >
        <Italic size={15} />
      </ToolButton>
      <ToolButton
        title="打ち消し (Ctrl+Shift+X)"
        onClick={v((view) => wrap(view, '~~', '~~', '打消し'))}
      >
        <Strikethrough size={15} />
      </ToolButton>
      <ToolButton
        title="インラインコード (Ctrl+E)"
        onClick={v((view) => wrap(view, '`', '`', 'code'))}
      >
        <Code size={15} />
      </ToolButton>

      <Divider />

      {/* 色・サイズ */}
      <ColorPicker getView={getView} />
      <SizePicker getView={getView} />

      <Divider />

      {/* リスト */}
      <ToolButton
        title="箇条書きリスト"
        onClick={v((view) => insertBlock(view, '- $|$項目1\n- 項目2\n- 項目3'))}
      >
        <List size={15} />
      </ToolButton>
      <ToolButton
        title="番号付きリスト"
        onClick={v((view) =>
          insertBlock(view, '1. $|$項目1\n2. 項目2\n3. 項目3')
        )}
      >
        <ListOrdered size={15} />
      </ToolButton>
      <ToolButton
        title="チェックリスト"
        onClick={v((view) =>
          insertBlock(view, '- [ ] $|$タスク1\n- [ ] タスク2\n- [ ] タスク3')
        )}
      >
        <ListChecks size={15} />
      </ToolButton>

      <Divider />

      {/* 挿入 */}
      <ToolButton
        title="リンク (Ctrl+K)"
        onClick={v((view) => wrap(view, '[', '](https://)', 'リンクテキスト'))}
      >
        <Link2 size={15} />
      </ToolButton>
      <ToolButton
        title="メディアライブラリから画像を挿入"
        onClick={() => onMediaOpen?.()}
      >
        <Image size={15} />
      </ToolButton>
      <ToolButton
        title="引用 (Ctrl+Shift+.)"
        onClick={v((view) => prefixLine(view, '> '))}
      >
        <Quote size={15} />
      </ToolButton>
      <ToolButton
        title="コードブロック (Ctrl+Shift+C)"
        onClick={v((view) => insertBlock(view, '```ts\n$|$\n```'))}
      >
        <Braces size={15} />
      </ToolButton>

      <Divider />

      {/* ブロック */}
      <TableButton getView={getView} />
      <ToolButton
        title="水平線"
        onClick={v((view) => insertBlock(view, '---'))}
      >
        <Minus size={15} />
      </ToolButton>

      <Divider />

      {/* GFM Alert */}
      <ToolButton
        title="Note"
        onClick={v((view) => insertBlock(view, '> [!NOTE]\n> $|$補足情報'))}
      >
        <Info size={15} className="text-blue-400" />
      </ToolButton>
      <ToolButton
        title="Tip"
        onClick={v((view) => insertBlock(view, '> [!TIP]\n> $|$ヒント'))}
      >
        <Lightbulb size={15} className="text-green-400" />
      </ToolButton>
      <ToolButton
        title="Warning"
        onClick={v((view) => insertBlock(view, '> [!WARNING]\n> $|$注意事項'))}
      >
        <AlertTriangle size={15} className="text-yellow-400" />
      </ToolButton>
      <ToolButton
        title="Caution"
        onClick={v((view) =>
          insertBlock(view, '> [!CAUTION]\n> $|$危険な操作')
        )}
      >
        <OctagonAlert size={15} className="text-red-400" />
      </ToolButton>

      <Divider />

      {/* AIアシスト */}
      <AiAssistMenu
        getView={getView}
        getFullContent={getFullContent ?? (() => '')}
      />
    </div>
  );
}
