import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';

/**
 * 選択範囲を before/after で囲む。未選択時は placeholder を挿入して選択状態にする。
 */
export function wrap(
  view: EditorView,
  before: string,
  after?: string,
  placeholder?: string
): void {
  const suffix = after ?? before;
  const { state } = view;
  const changes: { from: number; to: number; insert: string }[] = [];
  const newSelections: { anchor: number; head: number }[] = [];

  for (const range of state.selection.ranges) {
    if (range.empty) {
      const ph = placeholder ?? '';
      const insert = `${before}${ph}${suffix}`;
      changes.push({ from: range.from, to: range.to, insert });
      const anchor = range.from + before.length;
      newSelections.push({ anchor, head: anchor + ph.length });
    } else {
      const selected = state.sliceDoc(range.from, range.to);
      const insert = `${before}${selected}${suffix}`;
      changes.push({ from: range.from, to: range.to, insert });
      newSelections.push({
        anchor: range.from + before.length,
        head: range.from + before.length + selected.length,
      });
    }
  }

  view.dispatch({
    changes,
    selection: EditorSelection.create(
      newSelections.map((s) => EditorSelection.range(s.anchor, s.head))
    ),
  });
  view.focus();
}

const PREFIX_PATTERN = /^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s)/;

/**
 * 現在行の先頭に prefix を挿入。既に同じ prefix があればトグル除去。別種 prefix があれば置換。
 */
export function prefixLine(view: EditorView, prefix: string): void {
  const { state } = view;
  const line = state.doc.lineAt(state.selection.main.head);
  const lineText = line.text;

  const existingMatch = PREFIX_PATTERN.exec(lineText);

  if (existingMatch) {
    const existing = existingMatch[1] ?? '';
    if (existing === prefix) {
      // トグル除去
      view.dispatch({
        changes: {
          from: line.from,
          to: line.from + existing.length,
          insert: '',
        },
        selection: EditorSelection.cursor(
          Math.max(line.from, state.selection.main.head - existing.length)
        ),
      });
    } else {
      // 別種 prefix を置換
      view.dispatch({
        changes: {
          from: line.from,
          to: line.from + existing.length,
          insert: prefix,
        },
        selection: EditorSelection.cursor(
          state.selection.main.head - existing.length + prefix.length
        ),
      });
    }
  } else {
    // prefix を追加
    view.dispatch({
      changes: { from: line.from, to: line.from, insert: prefix },
      selection: EditorSelection.cursor(
        state.selection.main.head + prefix.length
      ),
    });
  }

  view.focus();
}

/**
 * カーソル位置に複数行テンプレートを挿入。$|$ がカーソル移動先マーカー。
 */
export function insertBlock(
  view: EditorView,
  template: string,
  cursorMarker = '$|$'
): void {
  const { state } = view;
  const pos = state.selection.main.head;
  const line = state.doc.lineAt(pos);

  // 行の途中なら改行を前置
  const prefix = pos > line.from ? '\n' : '';
  const fullInsert = prefix + template;

  const markerIndex = fullInsert.indexOf(cursorMarker);
  const insertText = fullInsert.replace(cursorMarker, '');

  const cursorPos =
    markerIndex >= 0 ? pos + markerIndex : pos + insertText.length;

  view.dispatch({
    changes: { from: pos, to: pos, insert: insertText },
    selection: EditorSelection.cursor(cursorPos),
  });
  view.focus();
}

/**
 * 現在カーソルがコードブロック内にいるか判定。
 * 内側なら { lang, from, to } を返す。外側なら null。
 */
export function getCodeBlockContext(
  view: EditorView
): { lang: string; from: number; to: number } | null {
  const { state } = view;
  const pos = state.selection.main.head;
  const docText = state.doc.toString();

  const fencePattern = /^```(\w*)\n([\s\S]*?)^```/gm;
  let match: RegExpExecArray | null;

  while ((match = fencePattern.exec(docText)) !== null) {
    const blockStart = match.index;
    const blockEnd = match.index + match[0].length;
    const lang = match[1] ?? '';
    // コード本文の範囲（``` の次行から closing ``` の前まで）
    const codeFrom = blockStart + 3 + lang.length + 1; // skip ```lang\n
    const codeTo = blockEnd - 4; // skip \n```

    if (pos > codeFrom && pos <= codeTo) {
      return { lang, from: codeFrom, to: codeTo };
    }
  }

  return null;
}
