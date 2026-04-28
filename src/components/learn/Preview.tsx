'use client';

import { useRef, useEffect, useCallback } from 'react';

type PreviewProps = {
  html: string;
  css: string;
  onIframeReady: (iframe: HTMLIFrameElement) => void;
};

export function Preview({ html, css, onIframeReady }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const buildSrcdoc = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }
${css}
</style>
</head>
<body>
${html}
</body>
</html>`;
  }, [html, css]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = buildSrcdoc();
    iframe.onload = () => {
      onIframeReady(iframe);
    };
  }, [buildSrcdoc, onIframeReady]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="text-xs font-medium text-slate-500">プレビュー</span>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin"
          title="プレビュー"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
