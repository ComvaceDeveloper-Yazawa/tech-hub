'use client';

interface DraftRestoreDialogProps {
  open: boolean;
  savedAt: Date | null;
  preview: string;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DraftRestoreDialog({
  open,
  savedAt,
  preview,
  onRestore,
  onDiscard,
  onCancel,
}: DraftRestoreDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg border border-[#3e4451] bg-[#282c34] p-6 shadow-2xl">
        <h2 className="mb-1 text-base font-semibold text-[#abb2bf]">
          未保存の下書きがあります
        </h2>
        {savedAt && (
          <p className="mb-3 text-xs text-[#5c6370]">
            最終保存: {formatTime(savedAt)}
          </p>
        )}
        {preview && (
          <div className="mb-4 rounded border border-[#3e4451] bg-[#21252b] p-3">
            <p className="line-clamp-3 text-xs text-[#abb2bf]">{preview}</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onRestore}
            className="rounded bg-[#528bff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a7fee]"
          >
            復元する
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded bg-transparent px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10"
          >
            破棄する
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-transparent px-4 py-2 text-sm font-medium text-[#abb2bf] transition-colors hover:bg-[#3e4451]"
          >
            後で決める
          </button>
        </div>
      </div>
    </div>
  );
}
