import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { EditorSelection } from '@codemirror/state';
import { insertImageWithUpload } from './imageUpload';

/**
 * paste / drop イベントで画像を処理するCodeMirror拡張を生成する。
 */
export function createImageHandlers(
  onError?: (message: string) => void
): Extension {
  return EditorView.domEventHandlers({
    paste(event, view) {
      const items = event.clipboardData?.items;
      if (!items) return false;

      const imageItems: DataTransferItem[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.type.startsWith('image/')) {
          imageItems.push(item);
        }
      }

      if (imageItems.length === 0) return false;

      event.preventDefault();
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) insertImageWithUpload(view, file, onError);
      }
      return true;
    },

    drop(event, view) {
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return false;

      const imageFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.type.startsWith('image/')) {
          imageFiles.push(file);
        }
      }

      if (imageFiles.length === 0) return false;

      event.preventDefault();
      event.stopPropagation();

      // ドロップ位置にカーソルを移動
      const dropPos = view.posAtCoords({
        x: event.clientX,
        y: event.clientY,
      });
      if (dropPos !== null) {
        view.dispatch({
          selection: EditorSelection.cursor(dropPos),
        });
      }

      for (const file of imageFiles) {
        insertImageWithUpload(view, file, onError);
      }
      return true;
    },
  });
}
