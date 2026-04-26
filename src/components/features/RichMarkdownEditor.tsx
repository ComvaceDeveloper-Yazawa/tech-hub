'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdownKeymap } from '@/components/editor/markdownKeymap';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { SplitPreview } from '@/components/editor/SplitPreview';
import { slashCommandExtension } from '@/components/editor/slashCommands';
import { createImageHandlers } from '@/components/editor/imageHandlers';
import { createFormatOnPasteHandler } from '@/components/editor/formatOnPasteHandler';
import { useAutoSave } from '@/components/editor/useAutoSave';
import { DraftRestoreDialog } from '@/components/editor/DraftRestoreDialog';
import { MediaLibrary } from '@/components/features/MediaLibrary';
import { toast } from 'sonner';
import { EditorState } from '@codemirror/state';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center bg-[#282c34]">
      <span className="text-sm text-[#abb2bf]">エディタを読み込み中...</span>
    </div>
  ),
});

type Tab = 'split' | 'preview';

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  articleId: string;
}

const editorTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily:
      '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
  },
  '.cm-content': { padding: '16px', lineHeight: '1.8' },
  '.cm-line': { padding: '0 4px' },
  '.cm-gutters': {
    borderRight: '1px solid #3e4451',
    paddingRight: '8px',
    minWidth: '48px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 4px',
    color: '#4b5263',
    fontSize: '12px',
  },
  '.cm-activeLine': { backgroundColor: '#2c313c' },
  '.cm-activeLineGutter': { backgroundColor: '#2c313c', color: '#abb2bf' },
  '.cm-selectionBackground': { backgroundColor: '#3e4451 !important' },
  '.cm-cursor': { borderLeftColor: '#528bff', borderLeftWidth: '2px' },
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#4b5263 transparent',
  },
});

export function RichMarkdownEditor({
  value,
  onChange,
  height = 500,
  articleId,
}: RichMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('split');
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [mediaOpen, setMediaOpen] = useState(false);

  // 自動保存
  const {
    status,
    lastSavedAt,
    hasDraft,
    restoreDraft,
    discardDraft,
    savedContent,
  } = useAutoSave(articleId, value);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  useEffect(() => {
    if (hasDraft && savedContent && savedContent !== value) {
      setShowRestoreDialog(true);
    }
    // valueは依存配列に入れない（初回のみ評価）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDraft, savedContent]);

  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    history(),
    keymap.of([...markdownKeymap, ...defaultKeymap, ...historyKeymap]),
    EditorView.lineWrapping,
    editorTheme,
    EditorState.tabSize.of(2),
    slashCommandExtension,
    createImageHandlers((msg) => toast.error(msg)),
    createFormatOnPasteHandler((lang) =>
      toast.success(`${lang} コードをフォーマットしました`)
    ),
  ];

  const handleChange = useCallback((val: string) => onChange(val), [onChange]);

  const getView = useCallback(() => editorRef.current?.view ?? null, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'split', label: '分割' },
    { id: 'preview', label: 'プレビュー' },
  ];

  return (
    <div
      className="overflow-hidden rounded-lg border border-[#3e4451] shadow-lg"
      onDragOver={(e) => e.preventDefault()}
    >
      <DraftRestoreDialog
        open={showRestoreDialog}
        savedAt={lastSavedAt}
        preview={(savedContent ?? '').slice(0, 100)}
        onRestore={() => {
          const draft = restoreDraft();
          if (draft) onChange(draft);
          setShowRestoreDialog(false);
        }}
        onDiscard={() => {
          discardDraft();
          setShowRestoreDialog(false);
        }}
        onCancel={() => setShowRestoreDialog(false)}
      />
      {/* ヘッダー */}
      <div className="flex items-center border-b border-[#3e4451] bg-[#21252b]">
        {/* 信号機 */}
        <div className="flex items-center gap-1.5 px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-[#e06c75]" />
          <div className="h-3 w-3 rounded-full bg-[#e5c07b]" />
          <div className="h-3 w-3 rounded-full bg-[#98c379]" />
        </div>

        {/* タブ */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-[#528bff] bg-[#282c34] text-[#abb2bf]'
                  : 'border-transparent text-[#5c6370] hover:text-[#abb2bf]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 px-4 text-xs text-[#5c6370]">
          {/* 保存ステータス */}
          {status === 'saving' && (
            <span className="text-[#5c6370]">💾 保存中...</span>
          )}
          {status === 'saved' && lastSavedAt && (
            <span className="text-[#98c379]">
              ✅ 保存済{' '}
              {lastSavedAt.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          {status === 'error' && (
            <span className="text-[#e06c75]">⚠️ 保存失敗</span>
          )}
          <span>{value.split('\n').length} 行</span>
          <span>{value.length} 文字</span>
        </div>
      </div>

      {/* 分割タブ */}
      {activeTab === 'split' && (
        <>
          <EditorToolbar
            getView={getView}
            getFullContent={() => value}
            onMediaOpen={() => setMediaOpen(true)}
          />
          <SplitPreview
            value={value}
            onChange={handleChange}
            editorExtensions={extensions}
            editorRef={editorRef}
            height={height}
          />
        </>
      )}

      {/* プレビュータブ */}
      {activeTab === 'preview' && (
        <div
          className="overflow-y-auto bg-[#282c34] p-6"
          style={{ height: `${height}px` }}
        >
          {value.trim() ? (
            <div className="prose prose-invert prose-sm prose-headings:font-bold prose-code:bg-[#3e4451] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#21252b] prose-pre:border prose-pre:border-[#3e4451] prose-pre:rounded-lg prose-blockquote:border-l-[#528bff] prose-blockquote:bg-[#21252b] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r prose-a:no-underline hover:prose-a:underline prose-hr:border-[#3e4451] prose-th:bg-[#21252b] prose-img:rounded-lg prose-img:shadow-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-[#5c6370]">
              本文を入力するとプレビューが表示されます
            </p>
          )}
        </div>
      )}

      {/* メディアライブラリモーダル */}
      {mediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background border-border h-[80vh] w-[90vw] max-w-4xl overflow-hidden rounded-lg border shadow-lg">
            <MediaLibrary
              multiSelect
              onInsert={(urls) => {
                const view = getView();
                const mdText = urls.map((url) => `![image](${url})`).join('\n');
                if (view) {
                  const { from } = view.state.selection.main;
                  const line = view.state.doc.lineAt(from);
                  const prefix = from > line.from ? '\n' : '';
                  view.dispatch({
                    changes: { from, insert: prefix + mdText + '\n' },
                  });
                  view.focus();
                } else {
                  onChange(value + '\n' + mdText + '\n');
                }
                toast.success(`${urls.length}件の画像を挿入しました`);
                setMediaOpen(false);
              }}
              onClose={() => setMediaOpen(false)}
            />
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="flex items-center justify-between border-t border-[#3e4451] bg-[#21252b] px-4 py-1">
        <span className="text-xs text-[#5c6370]">
          {activeTab === 'preview'
            ? 'レンダリング済みプレビュー'
            : 'Ctrl+Z で元に戻す　Ctrl+F で検索'}
        </span>
        <span className="text-xs text-[#5c6370]">One Dark</span>
      </div>
    </div>
  );
}
