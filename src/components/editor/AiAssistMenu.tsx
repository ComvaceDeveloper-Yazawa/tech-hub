'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { useAiAssist, type AiAction } from './useAiAssist';
import { AiResultModal } from './AiResultModal';

interface AiAssistMenuProps {
  getView: () => EditorView | null;
  getFullContent: () => string;
}

interface MenuItem {
  label: string;
  action: AiAction;
  targetLang?: 'en' | 'ja';
  scope: 'selection' | 'article';
}

const MENU_ITEMS: MenuItem[] = [
  { label: '✨ 校正する', action: 'proofread', scope: 'selection' },
  { label: '📝 要約する', action: 'summarize', scope: 'selection' },
  {
    label: '🌐 英訳する',
    action: 'translate',
    targetLang: 'en',
    scope: 'selection',
  },
  {
    label: '🇯🇵 和訳する',
    action: 'translate',
    targetLang: 'ja',
    scope: 'selection',
  },
  { label: '✍️ 書き直す', action: 'rewrite', scope: 'selection' },
  { label: '🏷 タイトル候補', action: 'generateTitle', scope: 'article' },
  { label: '🔖 タグ提案', action: 'suggestTags', scope: 'article' },
];

// 要約・タイトル・タグはモーダル表示
const MODAL_ACTIONS: AiAction[] = ['summarize', 'generateTitle', 'suggestTags'];

function parseJsonArray(text: string): string[] {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [text];
    const arr = JSON.parse(match[0]) as unknown;
    if (Array.isArray(arr)) {
      return arr.filter((x): x is string => typeof x === 'string');
    }
    return [text];
  } catch {
    return [text];
  }
}

export function AiAssistMenu({ getView, getFullContent }: AiAssistMenuProps) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState<string[]>([]);
  const { loading, execute } = useAiAssist();

  async function handleItem(item: MenuItem) {
    setOpen(false);
    const view = getView();

    if (item.scope === 'selection') {
      if (!view) return;
      const { from, to } = view.state.selection.main;
      if (from === to) {
        toast.info('テキストを選択してください');
        return;
      }
      const selectedText = view.state.sliceDoc(from, to);
      const result = await execute({
        action: item.action,
        text: selectedText,
        targetLang: item.targetLang,
      });
      if (!result) {
        toast.error('AI処理に失敗しました');
        return;
      }

      if (MODAL_ACTIONS.includes(item.action)) {
        setModalTitle(item.label);
        setModalItems([result]);
        setModalOpen(true);
        return;
      }

      // 選択範囲を置換
      view.dispatch({
        changes: { from, to, insert: result },
        selection: EditorSelection.cursor(from + result.length),
      });
      view.focus();
      toast.success('AIが処理しました');
    } else {
      // 記事全体対象
      const fullContent = getFullContent();
      const result = await execute({
        action: item.action,
        text: fullContent,
        articleContext: fullContent,
      });
      if (!result) {
        toast.error('AI処理に失敗しました');
        return;
      }
      const items = parseJsonArray(result);
      setModalTitle(item.label);
      setModalItems(items);
      setModalOpen(true);
    }
  }

  function handleModalSelect(item: string) {
    navigator.clipboard
      .writeText(item)
      .then(() => {
        toast.success('クリップボードにコピーしました');
      })
      .catch(() => {
        toast.error('コピーに失敗しました');
      });
    setModalOpen(false);
  }

  return (
    <>
      <div className="relative">
        {open && (
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        )}
        <button
          type="button"
          title="AIアシスト (Alt+A)"
          onClick={() => setOpen((v) => !v)}
          disabled={loading}
          className="flex h-8 items-center gap-1 rounded px-2 text-[#abb2bf] hover:bg-[#3e4451] hover:text-white active:bg-[#528bff]/30 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          <span className="text-xs">AI</span>
        </button>

        {open && (
          <div className="absolute top-full right-0 z-20 mt-1 min-w-[160px] rounded-md border border-[#3e4451] bg-[#282c34] p-1 shadow-xl">
            {MENU_ITEMS.map((item) => (
              <button
                key={`${item.action}-${item.targetLang ?? ''}`}
                type="button"
                onClick={() => handleItem(item)}
                disabled={loading}
                className="w-full rounded px-3 py-2 text-left text-sm text-[#abb2bf] transition-colors hover:bg-[#3e4451] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <AiResultModal
        open={modalOpen}
        title={modalTitle}
        items={modalItems}
        onSelect={handleModalSelect}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
