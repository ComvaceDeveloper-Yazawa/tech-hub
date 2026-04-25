const PARSER_MAP: Record<string, string> = {
  js: 'babel',
  jsx: 'babel',
  javascript: 'babel',
  ts: 'typescript',
  tsx: 'typescript',
  typescript: 'typescript',
  json: 'json',
  css: 'css',
  scss: 'scss',
  less: 'less',
  html: 'html',
  vue: 'vue',
  md: 'markdown',
  markdown: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
};

const PRETTIER_OPTIONS = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all' as const,
  printWidth: 100,
};

async function loadParserPlugin(parser: string): Promise<object> {
  switch (parser) {
    case 'typescript':
      return (await import('prettier/plugins/typescript')).default;
    case 'babel':
      return (await import('prettier/plugins/babel')).default;
    case 'json':
      return (await import('prettier/plugins/babel')).default;
    case 'css':
    case 'scss':
    case 'less':
      return (await import('prettier/plugins/postcss')).default;
    case 'html':
    case 'vue':
      return (await import('prettier/plugins/html')).default;
    case 'markdown':
      return (await import('prettier/plugins/markdown')).default;
    case 'yaml':
      return (await import('prettier/plugins/yaml')).default;
    default:
      throw new Error(`Unsupported parser: ${parser}`);
  }
}

async function loadPrettier(parser: string) {
  const [{ format }, estreePlugin, langPlugin] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/estree'),
    loadParserPlugin(parser),
  ]);
  return { format, plugins: [estreePlugin.default, langPlugin] };
}

export function isFormattableLanguage(lang: string): boolean {
  return lang.toLowerCase() in PARSER_MAP;
}

/**
 * 指定コードをPrettierで整形する。失敗時は元のコードをそのまま返す。
 */
export async function formatCode(code: string, lang: string): Promise<string> {
  const parser = PARSER_MAP[lang.toLowerCase()];
  if (!parser) return code;

  try {
    const { format, plugins } = await loadPrettier(parser);
    const formatted = await format(code, {
      parser,
      plugins,
      ...PRETTIER_OPTIONS,
    });
    return formatted.trimEnd();
  } catch (err) {
    console.warn('[prettierFormat] フォーマット失敗:', err);
    return code;
  }
}
