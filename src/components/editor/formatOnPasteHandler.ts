import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { getCodeBlockContext } from './editorCommands';
import { isFormattableLanguage, formatCode } from './prettierFormat';

/**
 * コードブロック内でペーストしたとき、Prettierで自動フォーマットする拡張を生成する。
 * createImageHandlers より後に登録すること（画像ハンドラが先に評価される）。
 */
export function createFormatOnPasteHandler(
  onFormatted?: (lang: string) => void
): Extension {
  return EditorView.domEventHandlers({
    paste(event, view) {
      // 画像が含まれる場合は画像ハンドラに委譲
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && item.type.startsWith('image/')) return false;
        }
      }

      const pastedText = event.clipboardData?.getData('text/plain');
      if (!pastedText) return false;

      const ctx = getCodeBlockContext(view);
      if (!ctx) return false;

      if (!isFormattableLanguage(ctx.lang)) return false;

      event.preventDefault();

      // 楽観的UI: まず整形前テキストを挿入
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: pastedText },
        selection: { anchor: from + pastedText.length },
      });

      // 挿入範囲を記録（整形後に置換するため）
      const insertFrom = from;
      const insertTo = from + pastedText.length;

      formatCode(pastedText, ctx.lang)
        .then((formatted) => {
          if (formatted === pastedText) return; // 変化なし
          // 現在のドキュメントで挿入範囲のテキストを確認
          const currentText = view.state.doc.sliceString(insertFrom, insertTo);
          if (currentText !== pastedText) return; // ユーザーが編集済み
          view.dispatch({
            changes: { from: insertFrom, to: insertTo, insert: formatted },
            selection: { anchor: insertFrom + formatted.length },
          });
          onFormatted?.(ctx.lang);
        })
        .catch(() => {
          // formatCode は例外を飲み込むので通常ここには来ない
        });

      return true;
    },
  });
}
