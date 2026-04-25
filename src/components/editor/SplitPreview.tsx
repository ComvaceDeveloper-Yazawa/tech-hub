'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { oneDark } from '@codemirror/theme-one-dark';
import type { Extension } from '@codemirror/state';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#282c34]">
      <span className="text-sm text-[#abb2bf]">エディタを読み込み中...</span>
    </div>
  ),
});

interface SplitPreviewProps {
  value: string;
  onChange: (value: string) => void;
  editorExtensions: Extension[];
  editorRef: React.RefObject<ReactCodeMirrorRef | null>;
  height: number;
}

export function SplitPreview({
  value,
  onChange,
  editorExtensions,
  editorRef,
  height,
}: SplitPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex" style={{ height: `${height}px` }}>
      {/* 左: エディタ */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          ref={editorRef}
          value={value}
          height={`${height}px`}
          theme={oneDark}
          extensions={editorExtensions}
          onChange={onChange}
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
      </div>

      {/* Divider */}
      <div className="w-px bg-[#3e4451]" />

      {/* 右: プレビュー */}
      <div
        ref={previewRef}
        className="flex-1 overflow-auto bg-[#282c34] p-6"
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
    </div>
  );
}
