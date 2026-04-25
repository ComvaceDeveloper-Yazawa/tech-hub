import {
  autocompletion,
  type CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import type { Extension } from '@codemirror/state';
import { EditorSelection } from '@codemirror/state';

interface SlashCommand {
  name: string;
  detail: string;
  info: string;
  template: string;
}

const table3x3 =
  '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n|   |   |   |\n|   |   |   |\n|   |   |   |';

const COMMANDS: SlashCommand[] = [
  {
    name: '/h1',
    detail: '見出し1',
    info: 'H1 見出しを挿入',
    template: '# $|$',
  },
  {
    name: '/h2',
    detail: '見出し2',
    info: 'H2 見出しを挿入',
    template: '## $|$',
  },
  {
    name: '/h3',
    detail: '見出し3',
    info: 'H3 見出しを挿入',
    template: '### $|$',
  },
  {
    name: '/code',
    detail: 'コードブロック(TS)',
    info: 'TypeScriptコードブロックを挿入',
    template: '```ts\n$|$\n```',
  },
  {
    name: '/code-js',
    detail: 'コードブロック(JS)',
    info: 'JavaScriptコードブロックを挿入',
    template: '```js\n$|$\n```',
  },
  {
    name: '/code-py',
    detail: 'コードブロック(Python)',
    info: 'Pythonコードブロックを挿入',
    template: '```python\n$|$\n```',
  },
  {
    name: '/code-sh',
    detail: 'コードブロック(Shell)',
    info: 'Bashコードブロックを挿入',
    template: '```bash\n$|$\n```',
  },
  {
    name: '/table',
    detail: 'テーブル(3x3)',
    info: '3列3行のMarkdownテーブルを挿入',
    template: table3x3,
  },
  {
    name: '/ul',
    detail: '箇条書き',
    info: '箇条書きリストを挿入',
    template: '- $|$項目1\n- 項目2\n- 項目3',
  },
  {
    name: '/ol',
    detail: '番号付きリスト',
    info: '番号付きリストを挿入',
    template: '1. $|$項目1\n2. 項目2\n3. 項目3',
  },
  {
    name: '/todo',
    detail: 'チェックリスト',
    info: 'チェックリストを挿入',
    template: '- [ ] $|$タスク1\n- [ ] タスク2',
  },
  {
    name: '/note',
    detail: 'GFM Note',
    info: 'Noteアラートブロックを挿入',
    template: '> [!NOTE]\n> $|$',
  },
  {
    name: '/tip',
    detail: 'GFM Tip',
    info: 'Tipアラートブロックを挿入',
    template: '> [!TIP]\n> $|$',
  },
  {
    name: '/warning',
    detail: 'GFM Warning',
    info: 'Warningアラートブロックを挿入',
    template: '> [!WARNING]\n> $|$',
  },
  {
    name: '/caution',
    detail: 'GFM Caution',
    info: 'Cautionアラートブロックを挿入',
    template: '> [!CAUTION]\n> $|$',
  },
  {
    name: '/quote',
    detail: '引用',
    info: '引用ブロックを挿入',
    template: '> $|$',
  },
  { name: '/hr', detail: '水平線', info: '水平線を挿入', template: '---' },
  {
    name: '/link',
    detail: 'リンク',
    info: 'リンクを挿入',
    template: '[$|$](https://)',
  },
  {
    name: '/img',
    detail: '画像',
    info: '画像を挿入',
    template: '![$|$](画像URL)',
  },
  {
    name: '/mermaid',
    detail: 'Mermaid図',
    info: 'Mermaid図を挿入',
    template: '```mermaid\n$|$\n```',
  },
  {
    name: '/math',
    detail: '数式ブロック',
    info: '数式ブロックを挿入',
    template: '$$\n$|$\n$$',
  },
];

const CURSOR_MARKER = '$|$';

function slashCompletions(context: CompletionContext): CompletionResult | null {
  const match = context.matchBefore(/\/\w*/);
  if (!match) return null;
  if (match.from === match.to && !context.explicit) return null;

  // 行頭または空白直後の / のみ反応
  if (match.from > 0) {
    const before = context.state.sliceDoc(match.from - 1, match.from);
    if (!/\s/.test(before)) return null;
  }

  return {
    from: match.from,
    options: COMMANDS.map((cmd) => ({
      label: cmd.name,
      detail: cmd.detail,
      info: cmd.info,
      apply: (view, _completion, from, to) => {
        const template = cmd.template;
        const cursorOffset = template.indexOf(CURSOR_MARKER);
        const insertText = template.replace(CURSOR_MARKER, '');

        // 行の途中なら改行を前置
        const line = view.state.doc.lineAt(from);
        const needsNewline = from > line.from && line.text.trim() !== '';
        const prefix = needsNewline ? '\n' : '';
        const finalInsert = prefix + insertText;
        const finalCursorOffset =
          cursorOffset >= 0 ? prefix.length + cursorOffset : finalInsert.length;

        view.dispatch({
          changes: { from, to, insert: finalInsert },
          selection: EditorSelection.cursor(from + finalCursorOffset),
        });
        view.focus();
      },
    })),
  };
}

export const slashCommandExtension: Extension = autocompletion({
  override: [slashCompletions],
  defaultKeymap: true,
  icons: false,
});
