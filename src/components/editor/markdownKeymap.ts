import type { KeyBinding } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { wrap, prefixLine, insertBlock } from './editorCommands';

function handleLink(view: EditorView): boolean {
  const { state } = view;
  const range = state.selection.main;
  const selectedText = range.empty
    ? 'リンクテキスト'
    : state.sliceDoc(range.from, range.to);

  navigator.clipboard
    .readText()
    .then((clipText) => {
      if (/^https?:\/\//.test(clipText)) {
        const insert = `[${selectedText}](${clipText})`;
        view.dispatch({
          changes: { from: range.from, to: range.to, insert },
          selection: EditorSelection.cursor(range.from + insert.length),
        });
      } else {
        const placeholder = 'リンクテキスト';
        const insert = `[${placeholder}](https://)`;
        view.dispatch({
          changes: { from: range.from, to: range.to, insert },
          selection: EditorSelection.range(
            range.from + 1,
            range.from + 1 + placeholder.length
          ),
        });
      }
      view.focus();
    })
    .catch(() => {
      const placeholder = 'リンクテキスト';
      const insert = `[${placeholder}](https://)`;
      view.dispatch({
        changes: { from: range.from, to: range.to, insert },
        selection: EditorSelection.range(
          range.from + 1,
          range.from + 1 + placeholder.length
        ),
      });
      view.focus();
    });

  return true;
}

function handleCheckboxToggle(view: EditorView): boolean {
  const { state } = view;
  const line = state.doc.lineAt(state.selection.main.head);
  const text = line.text;

  if (/^- \[ \] /.test(text)) {
    view.dispatch({
      changes: { from: line.from, to: line.from + 6, insert: '- [x] ' },
    });
  } else if (/^- \[[xX]\] /.test(text)) {
    view.dispatch({
      changes: { from: line.from, to: line.from + 6, insert: '- [ ] ' },
    });
  } else {
    view.dispatch({
      changes: { from: line.from, to: line.from, insert: '- [ ] ' },
    });
  }

  view.focus();
  return true;
}

export const markdownKeymap: KeyBinding[] = [
  {
    key: 'Mod-1',
    run(view) {
      prefixLine(view, '# ');
      return true;
    },
  },
  {
    key: 'Mod-2',
    run(view) {
      prefixLine(view, '## ');
      return true;
    },
  },
  {
    key: 'Mod-3',
    run(view) {
      prefixLine(view, '### ');
      return true;
    },
  },
  {
    key: 'Mod-b',
    run(view) {
      wrap(view, '**', '**', '太字');
      return true;
    },
  },
  {
    key: 'Mod-i',
    run(view) {
      wrap(view, '*', '*', '斜体');
      return true;
    },
  },
  {
    key: 'Mod-e',
    run(view) {
      wrap(view, '`', '`', 'code');
      return true;
    },
  },
  {
    key: 'Mod-Shift-x',
    run(view) {
      wrap(view, '~~', '~~', '打消し');
      return true;
    },
  },
  {
    key: 'Mod-k',
    run: handleLink,
  },
  {
    key: 'Mod-Shift-c',
    run(view) {
      insertBlock(view, '```ts\n$|$\n```');
      return true;
    },
  },
  {
    key: 'Mod-Shift-k',
    run: handleCheckboxToggle,
  },
  {
    key: 'Mod-Shift-.',
    run(view) {
      prefixLine(view, '> ');
      return true;
    },
  },
];
