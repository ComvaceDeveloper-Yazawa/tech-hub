import type { EditorView } from '@codemirror/view';
import { uploadImage as uploadImageAction } from '@/presentation/actions/uploadImage';

// Server Action の上限に合わせる
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * 画像ファイルをアップロードしてURLを返す。失敗時は例外をthrow。
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('画像ファイルのみアップロード可能です');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      '対応していないファイル形式です。JPEG, PNG, GIF, WebP のみアップロードできます'
    );
  }
  if (file.size > MAX_SIZE) {
    throw new Error('ファイルサイズが5MBを超えています');
  }

  const formData = new FormData();
  formData.append('file', file);
  const { url } = await uploadImageAction(formData);
  return url;
}

/**
 * エディタに画像を楽観的UIで挿入する。
 * - 即座にプレースホルダを挿入
 * - 非同期でアップロード実行
 * - 成功時: プレースホルダを実URLに置換
 * - 失敗時: プレースホルダを削除してonErrorを呼ぶ
 */
export function insertImageWithUpload(
  view: EditorView,
  file: File,
  onError?: (message: string) => void
): void {
  const placeholderId = `uploading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const placeholder = `![アップロード中...](${placeholderId})`;

  const { from } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  const needsNewline = from > line.from;
  const insertText = (needsNewline ? '\n' : '') + placeholder + '\n';

  view.dispatch({
    changes: { from, insert: insertText },
    selection: { anchor: from + insertText.length },
  });
  view.focus();

  uploadImage(file)
    .then((url) => {
      const doc = view.state.doc.toString();
      const idx = doc.indexOf(placeholder);
      if (idx < 0) return; // ユーザーが消した場合は何もしない
      const altText = file.name.replace(/\.[^.]+$/, '');
      view.dispatch({
        changes: {
          from: idx,
          to: idx + placeholder.length,
          insert: `![${altText}](${url})`,
        },
      });
    })
    .catch((err: unknown) => {
      const doc = view.state.doc.toString();
      const idx = doc.indexOf(placeholder);
      if (idx >= 0) {
        view.dispatch({
          changes: { from: idx, to: idx + placeholder.length, insert: '' },
        });
      }
      const message =
        err instanceof Error ? err.message : '画像のアップロードに失敗しました';
      onError?.(message);
    });
}
