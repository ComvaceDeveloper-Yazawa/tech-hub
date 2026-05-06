import { notFound } from 'next/navigation';
import { heroSectionChapter } from '@/lib/steps/hero-section';
import { cafeCh0FirstHtmlChapter } from '@/lib/steps/cafe-ch0-05-first-html';
import { cafeCh0TagsChapter } from '@/lib/steps/cafe-ch0-06-tags';
import { cafeCh0HtmlRulesChapter } from '@/lib/steps/cafe-ch0-07-html-rules';
import { cafeCh0CssBasicsChapter } from '@/lib/steps/cafe-ch0-09-css-basics';
import { cafeCh0ClassSelectorChapter } from '@/lib/steps/cafe-ch0-10-class-selector';
import { cafeCh0ResetCssChapter } from '@/lib/steps/cafe-ch0-11-reset-css';
import { cafeCh0MediaQueryChapter } from '@/lib/steps/cafe-ch0-12-media-query';
import {
  cafeCh1FontsChapter,
  cafeCh1ImagesChapter,
  cafeCh1BoxModelChapter,
  cafeCh1ContainerChapter,
  cafeCh1FlexboxChapter,
  cafeCh1GridChapter,
  cafeCh1HoverChapter,
  cafeCh1FormChapter,
  cafeCh1MainViewChapter,
  cafeCh1ButtonBarChapter,
  cafeCh1ProductListsChapter,
  cafeCh1CtaChapter,
  cafeCh1ResponsiveChapter,
} from '@/lib/steps/cafe-ch1-chapters';
import { LearnWorkspace } from '@/components/learn/LearnWorkspace';
import {
  ReadingWorkspace,
  type ReadingChapter,
} from '@/components/learn/ReadingWorkspace';
import type { Chapter } from '@/types/step';
import { CafeCh0VsCodeSetup } from '@/components/learn/readings/CafeCh0VsCodeSetup';
import { CafeCh0VsCodeUsage } from '@/components/learn/readings/CafeCh0VsCodeUsage';
import { CafeCh0Prettier } from '@/components/learn/readings/CafeCh0Prettier';
import { CafeCh0Terminal } from '@/components/learn/readings/CafeCh0Terminal';
import { CafeCh0DevTools } from '@/components/learn/readings/CafeCh0DevTools';
import { CafeCh0GitSetup } from '@/components/learn/readings/CafeCh0GitSetup';
import { CafeCh0RepoSetup } from '@/components/learn/readings/CafeCh0RepoSetup';
import { CafeCh0FirstPullRequest } from '@/components/learn/readings/CafeCh0FirstPullRequest';
import { CafeCh1ReadDesign } from '@/components/learn/readings/CafeCh1ReadDesign';

/** コードエディタ付きの実習チャプター */
const practiceChapters = {
  'hero-section': heroSectionChapter,
  'cafe-ch0-05-first-html': cafeCh0FirstHtmlChapter,
  'cafe-ch0-06-tags': cafeCh0TagsChapter,
  'cafe-ch0-07-html-rules': cafeCh0HtmlRulesChapter,
  'cafe-ch0-09-css-basics': cafeCh0CssBasicsChapter,
  'cafe-ch0-10-class-selector': cafeCh0ClassSelectorChapter,
  'cafe-ch0-11-reset-css': cafeCh0ResetCssChapter,
  'cafe-ch0-12-media-query': cafeCh0MediaQueryChapter,
  'cafe-ch1-02-fonts': cafeCh1FontsChapter,
  'cafe-ch1-03-images': cafeCh1ImagesChapter,
  'cafe-ch1-04-box-model': cafeCh1BoxModelChapter,
  'cafe-ch1-05-container': cafeCh1ContainerChapter,
  'cafe-ch1-06-flexbox': cafeCh1FlexboxChapter,
  'cafe-ch1-07-grid': cafeCh1GridChapter,
  'cafe-ch1-08-hover': cafeCh1HoverChapter,
  'cafe-ch1-09-form': cafeCh1FormChapter,
  'cafe-ch1-10-mainview': cafeCh1MainViewChapter,
  'cafe-ch1-11-buttonbar': cafeCh1ButtonBarChapter,
  'cafe-ch1-12-productlists': cafeCh1ProductListsChapter,
  'cafe-ch1-13-cta': cafeCh1CtaChapter,
  'cafe-ch1-14-responsive': cafeCh1ResponsiveChapter,
} as const satisfies Record<string, Chapter>;

/** 実習コードを伴わない読み物チャプター */
const readingChapters = {
  'cafe-ch0-01-vscode-setup': {
    id: 'cafe-ch0-01-vscode-setup',
    title: 'VS Code のセットアップ',
    body: <CafeCh0VsCodeSetup />,
    completionCriteria: [
      'VS Code を起動できた',
      'メニューが日本語で表示されている',
    ],
  },
  'cafe-ch0-02-vscode-usage': {
    id: 'cafe-ch0-02-vscode-usage',
    title: 'VS Code の使い方',
    body: <CafeCh0VsCodeUsage />,
    completionCriteria: [
      'VS Code でフォルダを開けた',
      '新しいファイルを作って保存できた',
      '拡張機能の画面を開けた',
    ],
  },
  'cafe-ch0-03-prettier': {
    id: 'cafe-ch0-03-prettier',
    title: 'Prettier を設定しよう',
    body: <CafeCh0Prettier />,
    completionCriteria: [
      'Prettier 拡張機能をインストールできた',
      'Format On Save を有効にした',
      '保存時にコードが自動で整形されるのを見た',
    ],
  },
  'cafe-ch0-04-terminal': {
    id: 'cafe-ch0-04-terminal',
    title: 'ターミナルに慣れよう',
    body: <CafeCh0Terminal />,
    completionCriteria: [
      'ターミナルを起動できた',
      'pwd で現在地を表示できた',
      'cd と ls でフォルダ移動・一覧表示ができた',
      'mkdir で新しいフォルダを作れた',
    ],
  },
  'cafe-ch0-08-devtools': {
    id: 'cafe-ch0-08-devtools',
    title: 'Chrome の開発者ツールを使ってみよう',
    body: <CafeCh0DevTools />,
    completionCriteria: [
      '開発者ツールを開けた',
      'Elements パネルで HTML を確認できた',
      'Console パネルを表示できた',
      'デバイスモードでスマホ幅を表示できた',
    ],
  },
  'cafe-ch0-13-git-setup': {
    id: 'cafe-ch0-13-git-setup',
    title: 'GitHub と Git を準備しよう',
    body: <CafeCh0GitSetup />,
    completionCriteria: [
      'GitHub のアカウントを作れた',
      'PC に Git をインストールできた',
      'git config で名前とメールアドレスを設定した',
    ],
  },
  'cafe-ch0-14-repo-setup': {
    id: 'cafe-ch0-14-repo-setup',
    title: '学習用リポジトリを準備しよう',
    body: <CafeCh0RepoSetup />,
    completionCriteria: [
      'テンプレートから自分のリポジトリを作れた',
      'git clone で手元の PC に取得できた',
      'VS Code でフォルダを開けた',
    ],
  },
  'cafe-ch0-15-first-pr': {
    id: 'cafe-ch0-15-first-pr',
    title: '最初の Pull Request',
    body: <CafeCh0FirstPullRequest />,
    completionCriteria: [
      '作業用ブランチを作れた',
      'add と commit で変更を記録できた',
      'push で GitHub に反映できた',
      'Pull Request を作成できた',
    ],
  },
  'cafe-ch1-01-read-design': {
    id: 'cafe-ch1-01-read-design',
    title: 'デザインを読み解こう',
    body: <CafeCh1ReadDesign />,
    completionCriteria: [
      'Figma でホーム画面のフレームを開けた',
      '色・フォント・サイズを読み取る方法が分かった',
      '必要な画像をエクスポートできた',
    ],
  },
} as const satisfies Record<string, ReadingChapter>;

type Params = { chapterId: string };
type SearchParams = { stageId?: string; curriculumSlug?: string };

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { chapterId } = await params;
  const { stageId, curriculumSlug } = await searchParams;

  const practiceChapter =
    practiceChapters[chapterId as keyof typeof practiceChapters];
  if (practiceChapter) {
    return (
      <LearnWorkspace
        chapter={practiceChapter}
        stageId={stageId ?? null}
        curriculumSlug={curriculumSlug ?? null}
      />
    );
  }

  const readingChapter =
    readingChapters[chapterId as keyof typeof readingChapters];
  if (readingChapter) {
    return (
      <ReadingWorkspace
        chapter={readingChapter}
        stageId={stageId ?? null}
        curriculumSlug={curriculumSlug ?? null}
      />
    );
  }

  notFound();
}

export function generateStaticParams() {
  return [
    ...Object.keys(practiceChapters),
    ...Object.keys(readingChapters),
  ].map((chapterId) => ({ chapterId }));
}
