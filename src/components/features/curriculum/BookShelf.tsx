'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';

type CurriculumBook = {
  id: string;
  slug: string;
  title: string;
  description: string;
  completedStages: number;
  totalStages: number;
};

const BOOK_COLORS = [
  {
    spine: 'from-red-800 via-red-700 to-red-900',
    cover: 'from-red-700 to-red-900',
  },
  {
    spine: 'from-blue-800 via-blue-700 to-blue-900',
    cover: 'from-blue-700 to-blue-900',
  },
  {
    spine: 'from-emerald-800 via-emerald-700 to-emerald-900',
    cover: 'from-emerald-700 to-emerald-900',
  },
  {
    spine: 'from-purple-800 via-purple-700 to-purple-900',
    cover: 'from-purple-700 to-purple-900',
  },
  {
    spine: 'from-amber-800 via-amber-700 to-amber-900',
    cover: 'from-amber-700 to-amber-900',
  },
];

type AnimPhase = 'idle' | 'pulling' | 'cover' | 'opening' | 'open';

function BookSpine({
  book,
  index,
  isSelected,
  phase,
  onClick,
}: {
  book: CurriculumBook;
  index: number;
  isSelected: boolean;
  phase: AnimPhase;
  onClick: () => void;
}) {
  const colors = BOOK_COLORS[index % BOOK_COLORS.length]!;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex h-48 w-11 cursor-pointer flex-col items-center justify-center rounded-sm transition-all sm:h-64 sm:w-14 md:w-16',
        `bg-gradient-to-b ${colors.spine}`,
        'border-r border-black/30 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3),2px_0_8px_rgba(0,0,0,0.2)]',
        isSelected && phase === 'pulling' && 'translate-y-[-40px] duration-500',
        isSelected &&
          (phase === 'cover' || phase === 'opening' || phase === 'open') &&
          'translate-y-[-40px] opacity-0 duration-300',
        !isSelected && 'duration-300 hover:translate-y-[-6px]'
      )}
      aria-label={`${book.title}を開く`}
      disabled={isSelected}
    >
      <div className="from-white/15 pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r to-transparent sm:w-2" />
      <span
        className="text-[10px] font-bold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-xs"
        style={{ writingMode: 'vertical-rl' }}
      >
        {book.title}
      </span>
      <div className="absolute left-1.5 right-1.5 top-2 h-px bg-amber-400/40 sm:left-2 sm:right-2 sm:top-3" />
      <div className="absolute bottom-2 left-1.5 right-1.5 h-px bg-amber-400/40 sm:bottom-3 sm:left-2 sm:right-2" />
    </button>
  );
}

// 開いた本のモーダル
function OpenBookModal({
  book,
  index,
  phase,
  onClose,
}: {
  book: CurriculumBook;
  index: number;
  phase: AnimPhase;
  onClose: () => void;
}) {
  const router = useRouter();
  const colors = BOOK_COLORS[index % BOOK_COLORS.length]!;
  const progress =
    book.totalStages > 0
      ? Math.round((book.completedStages / book.totalStages) * 100)
      : 0;

  const showCover = phase === 'cover';
  const showOpening = phase === 'opening';
  const showOpen = phase === 'open';
  const isVisible = showCover || showOpening || showOpen;

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={showOpen ? onClose : undefined}
    >
      {/* デスクトップ: 見開き本 */}
      <div
        className="relative hidden md:block"
        style={{ perspective: '1200px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* 右ページ（ステータス） */}
          <div
            className={cn(
              'absolute left-0 top-0 flex h-[380px] w-[300px] flex-col justify-between rounded-r-lg bg-[#f5e6c8] p-6 shadow-xl transition-all duration-700',
              showOpening || showOpen
                ? 'translate-x-0 opacity-100'
                : 'translate-x-[-20px] opacity-0'
            )}
          >
            <PageStatus progress={progress} book={book} showOpen={showOpen} />
            <StartButton
              book={book}
              onClick={() => router.push(`/curriculum/${book.slug}`)}
            />
          </div>

          {/* 表紙 */}
          <div
            className={cn(
              'relative z-10 flex h-[380px] w-[300px] flex-col justify-between rounded-lg p-6 shadow-2xl transition-all duration-700',
              `bg-gradient-to-br ${colors.cover}`
            )}
            style={{
              transformOrigin: 'right center',
              transform:
                showOpening || showOpen ? 'rotateY(-160deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <CoverContent book={book} index={index} />
          </div>

          {/* 左ページ（タイトル） */}
          {(showOpening || showOpen) && (
            <div
              className="absolute left-0 top-0 z-20 flex h-[380px] w-[300px] flex-col justify-between rounded-l-lg bg-[#f5e6c8] p-6 shadow-xl"
              style={{ transform: 'translateX(-100%)' }}
            >
              <PageTitle book={book} />
            </div>
          )}
        </div>

        {showOpen && <CloseButton onClick={onClose} />}
      </div>

      {/* モバイル: 縦スクロール1ページ */}
      <div
        className="relative block w-full max-w-sm md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="overflow-hidden rounded-xl bg-[#f5e6c8] shadow-2xl"
          style={{ animation: 'fadeSlideUp 0.4s ease-out' }}
        >
          {/* 表紙ヘッダー */}
          <div className={cn('p-5', `bg-gradient-to-br ${colors.cover}`)}>
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-br from-white/10 via-transparent to-black/20" />
            <p className="relative font-mono text-[10px] uppercase tracking-widest text-amber-300/50">
              Adventure Log — Vol. {index + 1}
            </p>
            <h2
              className="relative mt-2 text-xl font-black text-amber-100"
              style={{
                fontFamily: 'serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {book.title}
            </h2>
            <p className="relative mt-1 text-xs text-amber-200/60">
              {book.description}
            </p>
          </div>

          {/* ステータス */}
          <div className="p-5">
            <PageStatus progress={progress} book={book} showOpen={showOpen} />
            <div className="mt-4">
              <StartButton
                book={book}
                onClick={() => router.push(`/curriculum/${book.slug}`)}
              />
            </div>
          </div>
        </div>

        {showOpen && <CloseButton onClick={onClose} mobile />}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// 共通パーツ
function CoverContent({
  book,
  index,
}: {
  book: CurriculumBook;
  index: number;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 via-transparent to-black/20" />
      <div className="absolute inset-3 rounded border border-amber-400/30" />
      <div className="relative z-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-300/50">
          Adventure Log
        </p>
      </div>
      <div className="relative z-10 text-center">
        <h2
          className="text-2xl font-black text-amber-100"
          style={{
            fontFamily: 'serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {book.title}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-amber-400/40" />
          <span className="text-xs text-amber-400/40">✦</span>
          <div className="h-px w-8 bg-amber-400/40" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-amber-200/60">
          {book.description}
        </p>
      </div>
      <div className="relative z-10 text-center">
        <p className="text-[10px] text-amber-300/30">Vol. {index + 1}</p>
      </div>
    </>
  );
}

function PageTitle({ book }: { book: CurriculumBook }) {
  return (
    <>
      <div className="border-b border-amber-800/20 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-800/40">
          Adventure Log
        </p>
      </div>
      <div className="flex-1 pt-3">
        <h2
          className="mb-3 text-xl font-black text-amber-900"
          style={{ fontFamily: 'serif' }}
        >
          {book.title}
        </h2>
        <p className="text-xs leading-relaxed text-amber-800/70">
          {book.description}
        </p>
      </div>
      <p className="text-center text-[10px] text-amber-800/30">- i -</p>
    </>
  );
}

function PageStatus({
  progress,
  book,
  showOpen,
}: {
  progress: number;
  book: CurriculumBook;
  showOpen: boolean;
}) {
  return (
    <>
      <div className="border-b border-amber-800/20 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-800/40">
          Status
        </p>
      </div>
      <div className="flex-1 space-y-3 pt-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-amber-800/60">
            <span>進捗</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-amber-900/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-1000"
              style={{ width: showOpen ? `${progress}%` : '0%' }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-amber-800/40">
            {book.completedStages} / {book.totalStages} ステージ
          </p>
        </div>
        <div className="space-y-1.5">
          {[
            { label: '学習時間', value: '--:--' },
            { label: '最終プレイ', value: '---' },
            { label: '難易度', value: '★☆☆☆☆' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded bg-amber-900/5 px-3 py-2"
            >
              <span className="text-xs text-amber-800/50">{item.label}</span>
              <span className="text-xs font-bold text-amber-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function StartButton({
  book,
  onClick,
}: {
  book: CurriculumBook;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-500 active:scale-[0.98]"
    >
      {book.completedStages > 0 ? '冒険を続ける' : '冒険を始める'}
    </button>
  );
}

function CloseButton({
  onClick,
  mobile,
}: {
  onClick: () => void;
  mobile?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white/80 shadow-lg transition-colors hover:bg-black/70',
        mobile ? '-right-1 -top-3' : '-right-4 -top-4'
      )}
      aria-label="閉じる"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

export function BookShelf({
  curriculums,
}: {
  curriculums: {
    id: string;
    slug: string;
    title: string;
    description: string;
    completed_stages: number;
    total_stages: number;
  }[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<AnimPhase>('idle');

  const books: CurriculumBook[] = curriculums.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    completedStages: c.completed_stages,
    totalStages: c.total_stages,
  }));

  const selectedBook = books.find((b) => b.id === selectedId) ?? null;
  const selectedIndex = books.findIndex((b) => b.id === selectedId);

  const handleClick = useCallback((bookId: string) => {
    setSelectedId(bookId);
    setPhase('pulling');
    setTimeout(() => setPhase('cover'), 500);
    setTimeout(() => setPhase('opening'), 1200);
    setTimeout(() => setPhase('open'), 1900);
  }, []);

  const handleClose = useCallback(() => {
    setPhase('idle');
    setTimeout(() => setSelectedId(null), 300);
  }, []);

  return (
    <>
      <div className="mx-auto max-w-sm sm:max-w-md md:max-w-lg">
        <div className="relative rounded-t-lg bg-gradient-to-b from-amber-900/80 to-amber-950/80 px-4 pb-3 pt-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] backdrop-blur-sm sm:px-6 sm:pt-6">
          <div className="flex items-end justify-center gap-1 sm:gap-1.5">
            {books.map((book, i) => (
              <BookSpine
                key={book.id}
                book={book}
                index={i}
                isSelected={selectedId === book.id}
                phase={selectedId === book.id ? phase : 'idle'}
                onClick={() => handleClick(book.id)}
              />
            ))}
            {books.length < 5 &&
              Array.from({ length: 5 - books.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-48 w-11 items-center justify-center rounded-sm border border-dashed border-amber-700/20 bg-amber-900/10 sm:h-64 sm:w-14 md:w-16"
                >
                  <span
                    className="text-[8px] text-amber-700/30 sm:text-[10px]"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    Coming Soon
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="h-3 rounded-b-lg bg-gradient-to-b from-amber-800/90 to-amber-900/90 shadow-[0_4px_12px_rgba(0,0,0,0.4)] sm:h-4" />
        <div className="mx-1.5 h-1.5 rounded-b-lg bg-amber-950/60 shadow-[0_2px_8px_rgba(0,0,0,0.3)] sm:mx-2 sm:h-2" />
      </div>

      {selectedBook && (
        <OpenBookModal
          book={selectedBook}
          index={selectedIndex}
          phase={phase}
          onClose={handleClose}
        />
      )}
    </>
  );
}
