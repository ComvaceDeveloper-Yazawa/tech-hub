'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/cn';

type CodeEditorProps = {
  html: string;
  css: string;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
  onReset: () => void;
};

export function CodeEditor({
  html,
  css,
  onHtmlChange,
  onCssChange,
  onReset,
}: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('css');

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab('html')}
            className={cn(
              'px-3 py-2 text-xs font-medium transition-colors',
              activeTab === 'html'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={cn(
              'px-3 py-2 text-xs font-medium transition-colors',
              activeTab === 'css'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            CSS
          </button>
        </div>
        <button
          onClick={onReset}
          className="rounded px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          リセット
        </button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={activeTab}
          value={activeTab === 'html' ? html : css}
          onChange={(value) => {
            if (activeTab === 'html') {
              onHtmlChange(value ?? '');
            } else {
              onCssChange(value ?? '');
            }
          }}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}
