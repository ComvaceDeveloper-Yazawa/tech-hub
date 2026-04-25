'use client';

import { useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-lg bg-[#282c34]">
      <span className="text-sm text-[#abb2bf]">エディタを読み込み中...</span>
    </div>
  ),
});

interface RichMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onDrop?: (e: React.DragEvent) => void;
  height?: number;
}

const editorTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily:
      '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
  },
  '.cm-content': {
    padding: '16px',
    lineHeight: '1.8',
  },
  '.cm-line': {
    padding: '0 4px',
  },
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
  '.cm-activeLine': {
    backgroundColor: '#2c313c',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2c313c',
    color: '#abb2bf',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#3e4451 !important',
  },
  '.cm-cursor': {
    borderLeftColor: '#528bff',
    borderLeftWidth: '2px',
  },
  // Markdownスタイル
  '.cm-header': { color: '#e06c75', fontWeight: 'bold' },
  '.cm-strong': { color: '#e5c07b', fontWeight: 'bold' },
  '.cm-em': { color: '#c678dd', fontStyle: 'italic' },
  '.cm-link': { color: '#61afef', textDecoration: 'underline' },
  '.cm-url': { color: '#56b6c2' },
  '.cm-quote': { color: '#5c6370', fontStyle: 'italic' },
  '.cm-monospace': {
    fontFamily: '"JetBrains Mono", monospace',
    backgroundColor: '#3e4451',
    borderRadius: '3px',
    padding: '0 4px',
    color: '#e06c75',
  },
  // コードブロック
  '.cm-codeblock': {
    backgroundColor: '#21252b',
    display: 'block',
    borderLeft: '3px solid #528bff',
    paddingLeft: '12px',
  },
  // スクロールバー
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#4b5263 transparent',
  },
});

export function RichMarkdownEditor({
  value,
  onChange,
  onDrop,
  height = 500,
}: RichMarkdownEditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const extensions = [
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
    }),
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    EditorView.lineWrapping,
    editorTheme,
    EditorState.tabSize.of(2),
  ];

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  return (
    <div
      className="overflow-hidden rounded-lg border border-[#3e4451] shadow-lg"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* エディタヘッダー */}
      <div className="flex items-center gap-2 border-b border-[#3e4451] bg-[#21252b] px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#e06c75]" />
          <div className="h-3 w-3 rounded-full bg-[#e5c07b]" />
          <div className="h-3 w-3 rounded-full bg-[#98c379]" />
        </div>
        <span className="ml-2 text-xs text-[#5c6370]">Markdown</span>
        <div className="ml-auto flex items-center gap-3 text-xs text-[#5c6370]">
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
      </div>

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

      {/* フッター */}
      <div className="flex items-center justify-between border-t border-[#3e4451] bg-[#21252b] px-4 py-1">
        <span className="text-xs text-[#5c6370]">
          {value.split('\n').length} 行 / {value.length} 文字
        </span>
        <span className="text-xs text-[#5c6370]">
          Ctrl+Z で元に戻す　Ctrl+F で検索
        </span>
      </div>
    </div>
  );
}
