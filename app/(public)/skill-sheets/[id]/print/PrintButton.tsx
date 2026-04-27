'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      className="rounded border px-3 py-1 text-sm"
      onClick={() => window.print()}
    >
      PDF保存
    </button>
  );
}
