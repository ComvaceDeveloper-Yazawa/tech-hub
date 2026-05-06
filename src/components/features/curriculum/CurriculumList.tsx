'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  CircleDashed,
  Lock,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

type CurriculumItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  completed_stages: number;
  total_stages: number;
};

type ChapterStatus = 'completed' | 'in_progress' | 'not_started' | 'locked';

type ChapterViewModel = CurriculumItem & {
  chapterNumber: number;
  progressPercent: number;
  status: ChapterStatus;
};

function resolveStatus(
  completed: number,
  total: number,
  previousCompleted: boolean
): ChapterStatus {
  if (total === 0) return 'not_started';
  if (completed >= total) return 'completed';
  if (completed > 0) return 'in_progress';
  if (!previousCompleted) return 'locked';
  return 'not_started';
}

const STATUS_META: Record<
  ChapterStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    badgeClass: string;
    iconClass: string;
    ringClass: string;
  }
> = {
  completed: {
    label: '完了',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    iconClass: 'text-emerald-500',
    ringClass: 'ring-emerald-500/30',
  },
  in_progress: {
    label: '進行中',
    icon: PlayCircle,
    badgeClass: 'bg-primary/10 text-primary',
    iconClass: 'text-primary',
    ringClass: 'ring-primary/40',
  },
  not_started: {
    label: '未着手',
    icon: CircleDashed,
    badgeClass: 'bg-muted text-muted-foreground',
    iconClass: 'text-muted-foreground',
    ringClass: 'ring-border',
  },
  locked: {
    label: 'ロック中',
    icon: Lock,
    badgeClass: 'bg-muted text-muted-foreground',
    iconClass: 'text-muted-foreground',
    ringClass: 'ring-border',
  },
};

function StatusBadge({ status }: { status: ChapterStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
        meta.badgeClass
      )}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}

function ChapterCard({
  chapter,
  onSelect,
}: {
  chapter: ChapterViewModel;
  onSelect: () => void;
}) {
  const meta = STATUS_META[chapter.status];
  const Icon = meta.icon;
  const isCurrent = chapter.status === 'in_progress';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${chapter.title}の詳細を表示`}
      className={cn(
        'border-border bg-card group relative w-full rounded-xl border p-4 text-left ring-1 ring-transparent transition-all md:p-5',
        'hover:border-border hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isCurrent && 'ring-primary/30'
      )}
    >
      <div className="flex items-start gap-4">
        {/* 章番号 + アイコン */}
        <div
          className={cn(
            'size-12 md:size-14 flex shrink-0 flex-col items-center justify-center rounded-lg ring-1',
            meta.ringClass,
            'bg-background'
          )}
        >
          <Icon className={cn('size-4 md:size-5', meta.iconClass)} />
          <span className="text-muted-foreground mt-0.5 font-mono text-[10px] tabular-nums">
            {String(chapter.chapterNumber).padStart(2, '0')}
          </span>
        </div>

        {/* テキスト */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
              Chapter {chapter.chapterNumber}
            </p>
            <StatusBadge status={chapter.status} />
          </div>
          <h3 className="truncate text-base font-semibold md:text-lg">
            {chapter.title}
          </h3>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs md:text-sm">
            {chapter.description}
          </p>

          {/* 進捗バー */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                {chapter.completed_stages} / {chapter.total_stages} ステージ
              </span>
              <span className="text-muted-foreground font-mono tabular-nums">
                {chapter.progressPercent}%
              </span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  chapter.status === 'completed'
                    ? 'bg-emerald-500'
                    : 'from-primary to-primary/70 bg-gradient-to-r'
                )}
                style={{ width: `${chapter.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <ArrowRight className="text-muted-foreground size-4 mt-1 hidden shrink-0 transition-transform group-hover:translate-x-0.5 md:block" />
      </div>
    </button>
  );
}

function CurrentChapterHighlight({
  chapter,
  onSelect,
}: {
  chapter: ChapterViewModel;
  onSelect: () => void;
}) {
  return (
    <section className="mb-8">
      <p className="text-muted-foreground mb-2 font-mono text-[10px] uppercase tracking-wider">
        Now Learning
      </p>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${chapter.title}の詳細を表示`}
        className={cn(
          'from-primary/5 to-primary/10 ring-primary/20 border-border group relative block w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left ring-1 transition-all md:p-7',
          'focus-visible:ring-ring hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge status={chapter.status} />
              <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                Chapter {chapter.chapterNumber}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              {chapter.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {chapter.description}
            </p>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">進捗</span>
                <span className="text-muted-foreground font-mono tabular-nums">
                  {chapter.completed_stages} / {chapter.total_stages} (
                  {chapter.progressPercent}%)
                </span>
              </div>
              <div className="bg-muted/70 h-2 overflow-hidden rounded-full">
                <div
                  className="from-primary to-primary/70 h-full rounded-full bg-gradient-to-r transition-all duration-700"
                  style={{ width: `${chapter.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <span className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-transform group-hover:translate-x-0.5">
              続きから学習する
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </button>
    </section>
  );
}

function ChapterDetailModal({
  chapter,
  open,
  onOpenChange,
}: {
  chapter: ChapterViewModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!chapter) return null;

  const meta = STATUS_META[chapter.status];
  const Icon = meta.icon;
  const ctaLabel =
    chapter.status === 'completed'
      ? 'もう一度学習する'
      : chapter.status === 'in_progress'
        ? '続きから学習する'
        : '学習を始める';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'size-10 flex shrink-0 items-center justify-center rounded-lg ring-1',
              meta.ringClass,
              'bg-background'
            )}
          >
            <Icon className={cn('size-5', meta.iconClass)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
              Chapter {chapter.chapterNumber}
            </p>
            <DialogTitle className="truncate text-lg">
              {chapter.title}
            </DialogTitle>
          </div>
        </div>

        <DialogDescription className="text-sm leading-relaxed">
          {chapter.description}
        </DialogDescription>

        <div className="border-border space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">ステータス</span>
            <StatusBadge status={chapter.status} />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">進捗</span>
              <span className="text-muted-foreground font-mono tabular-nums">
                {chapter.completed_stages} / {chapter.total_stages} (
                {chapter.progressPercent}%)
              </span>
            </div>
            <div className="bg-muted h-1.5 overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  chapter.status === 'completed'
                    ? 'bg-emerald-500'
                    : 'from-primary to-primary/70 bg-gradient-to-r'
                )}
                style={{ width: `${chapter.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {chapter.status === 'locked' ? (
          <Button disabled className="w-full">
            <Lock className="size-4" />
            前の章を完了すると解放されます
          </Button>
        ) : (
          <Link
            href={`/curriculum/${chapter.slug}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CurriculumList({
  curriculums,
}: {
  curriculums: CurriculumItem[];
}) {
  const chapters = useMemo<ChapterViewModel[]>(() => {
    let previousCompleted = true;
    return curriculums.map((c, i) => {
      const progressPercent =
        c.total_stages > 0
          ? Math.round((c.completed_stages / c.total_stages) * 100)
          : 0;
      const status = resolveStatus(
        c.completed_stages,
        c.total_stages,
        previousCompleted
      );
      const completedForChain =
        c.total_stages > 0 ? c.completed_stages >= c.total_stages : true;
      previousCompleted = previousCompleted && completedForChain;

      return {
        ...c,
        chapterNumber: i + 1,
        progressPercent,
        status,
      };
    });
  }, [curriculums]);

  const currentChapter =
    chapters.find((c) => c.status === 'in_progress') ??
    chapters.find((c) => c.status === 'not_started') ??
    null;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedChapter = chapters.find((c) => c.id === selectedId) ?? null;

  return (
    <>
      {currentChapter && (
        <CurrentChapterHighlight
          chapter={currentChapter}
          onSelect={() => setSelectedId(currentChapter.id)}
        />
      )}

      <section>
        <p className="text-muted-foreground mb-3 font-mono text-[10px] uppercase tracking-wider">
          All Chapters
        </p>
        <ol className="space-y-3">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <ChapterCard
                chapter={chapter}
                onSelect={() => setSelectedId(chapter.id)}
              />
            </li>
          ))}
        </ol>
      </section>

      <ChapterDetailModal
        chapter={selectedChapter}
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
