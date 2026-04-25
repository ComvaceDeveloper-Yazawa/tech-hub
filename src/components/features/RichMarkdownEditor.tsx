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

type Tab = 'edit' | 'split' | 'preview' | 'guide';

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onDrop?: (e: React.DragEvent) => void;
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

const MARKDOWN_GUIDE = `
# Markdown 記法ガイド

## 見出し

\`\`\`
# 見出し1
## 見出し2
### 見出し3
\`\`\`

## テキスト装飾

| 記法 | 表示 |
|------|------|
| \`**太字**\` | **太字** |
| \`*斜体*\` | *斜体* |
| \`~~打ち消し~~\` | ~~打ち消し~~ |
| \`\`インラインコード\`\` | \`インラインコード\` |

## リスト

\`\`\`
- 箇条書き1
- 箇条書き2
  - ネスト

1. 番号付き1
2. 番号付き2
\`\`\`

## コードブロック

\`\`\`
\`\`\`typescript
const hello = "world";
console.log(hello);
\`\`\`
\`\`\`

## リンク・画像

\`\`\`
[リンクテキスト](https://example.com)
![代替テキスト](画像URL)
\`\`\`

## 引用

\`\`\`
> 引用テキスト
> 複数行も可能
\`\`\`

## 水平線

\`\`\`
---
\`\`\`

## テーブル

\`\`\`
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| D   | E   | F   |
\`\`\`

## チェックボックス

\`\`\`
- [x] 完了タスク
- [ ] 未完了タスク
\`\`\`
`;

export function RichMarkdownEditor({
  value,
  onChange,
  onDrop,
  height = 500,
  articleId,
}: RichMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const editorRef = useRef<ReactCodeMirrorRef>(null);

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
    { id: 'edit', label: '✏️ 編集' },
    { id: 'split', label: '🔀 分割' },
    { id: 'preview', label: '👁 プレビュー' },
    { id: 'guide', label: '📖 記法ガイド' },
  ];

  return (
    <div
      className="overflow-hidden rounded-lg border border-[#3e4451] shadow-lg"
      onDrop={activeTab === 'edit' ? onDrop : undefined}
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

      {/* 編集タブ */}
      {activeTab === 'edit' && (
        <>
          <EditorToolbar getView={getView} getFullContent={() => value} />
          <CodeMirror
            ref={editorRef}
            value={value}
            height={`${height}px`}
            theme={oneDark}
            extensions={extensions}
            onChange={handleChange}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: false,
              rectangularSelection: true,
              crosshairCursor: false,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: false,
              lintKeymap: false,
            }}
          />
        </>
      )}

      {/* 分割タブ */}
      {activeTab === 'split' && (
        <>
          <EditorToolbar getView={getView} getFullContent={() => value} />
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
            <div className="prose prose-invert prose-sm prose-headings:text-[#e06c75] prose-headings:font-bold prose-p:text-[#abb2bf] prose-p:leading-relaxed prose-strong:text-[#e5c07b] prose-em:text-[#c678dd] prose-code:text-[#e06c75] prose-code:bg-[#3e4451] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#21252b] prose-pre:border prose-pre:border-[#3e4451] prose-pre:rounded-lg prose-blockquote:border-l-[#528bff] prose-blockquote:text-[#5c6370] prose-blockquote:bg-[#21252b] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r prose-a:text-[#61afef] prose-a:no-underline hover:prose-a:underline prose-hr:border-[#3e4451] prose-th:text-[#abb2bf] prose-th:bg-[#21252b] prose-td:text-[#abb2bf] prose-li:text-[#abb2bf] prose-img:rounded-lg prose-img:shadow-lg max-w-none">
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

      {/* 記法ガイドタブ */}
      {activeTab === 'guide' && (
        <div
          className="overflow-y-auto bg-[#282c34] p-6"
          style={{ height: `${height}px` }}
        >
          <div className="prose prose-invert prose-sm prose-headings:text-[#e06c75] prose-headings:font-bold prose-p:text-[#abb2bf] prose-strong:text-[#e5c07b] prose-code:text-[#e06c75] prose-code:bg-[#3e4451] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#21252b] prose-pre:border prose-pre:border-[#3e4451] prose-pre:rounded-lg prose-th:text-[#abb2bf] prose-th:bg-[#21252b] prose-td:text-[#abb2bf] prose-li:text-[#abb2bf] prose-hr:border-[#3e4451] max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {MARKDOWN_GUIDE}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="flex items-center justify-between border-t border-[#3e4451] bg-[#21252b] px-4 py-1">
        <span className="text-xs text-[#5c6370]">
          {activeTab === 'edit'
            ? 'Ctrl+Z で元に戻す　Ctrl+F で検索'
            : activeTab === 'preview'
              ? 'レンダリング済みプレビュー'
              : 'Markdown 記法リファレンス'}
        </span>
        <span className="text-xs text-[#5c6370]">One Dark</span>
      </div>
    </div>
  );
}
