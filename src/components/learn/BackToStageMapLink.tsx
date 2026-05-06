import Link from 'next/link';

type BackToStageMapLinkProps = {
  /** 戻り先のカリキュラム slug。未指定時は `/curriculum` へ戻る */
  curriculumSlug: string | null;
};

/**
 * 学習ワークスペース / 読み物ワークスペースの左上に置く
 * 「ステージマップへ戻る」リンク。
 * 進捗は記録せずに遷移のみ行う。
 */
export function BackToStageMapLink({
  curriculumSlug,
}: BackToStageMapLinkProps) {
  const href = curriculumSlug ? `/curriculum/${curriculumSlug}` : '/curriculum';

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
      aria-label="ステージマップへ戻る"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>ステージマップへ戻る</span>
    </Link>
  );
}
