import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { LikeButton } from '@/components/features/LikeButton';
import { BookmarkButton } from '@/components/features/BookmarkButton';
import { CopyLinkButton } from '@/components/features/CopyLinkButton';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string | null;
    viewCount: number;
    likeCount: number;
  };
  likeStatus?: { liked: boolean };
  bookmarkStatus?: { bookmarked: boolean };
  className?: string;
}

export function ArticleCard({
  article,
  likeStatus,
  bookmarkStatus,
  className,
}: ArticleCardProps) {
  return (
    <Card
      className={cn(
        'glow-card border-border bg-card/80 flex flex-col shadow-none backdrop-blur-sm transition-all duration-300',
        className
      )}
    >
      <CardHeader>
        <CardTitle>
          <Link
            href={`/articles/${article.slug}`}
            className="focus-visible:ring-ring text-foreground rounded hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardFooter className="mt-auto flex items-center justify-between gap-2">
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          {article.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" aria-hidden="true" />
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </time>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3" aria-hidden="true" />
            {article.viewCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <LikeButton
            articleId={article.id}
            initialLikeCount={article.likeCount}
            initialLiked={likeStatus?.liked ?? false}
          />
          <BookmarkButton
            articleId={article.id}
            initialBookmarked={bookmarkStatus?.bookmarked ?? false}
          />
          <CopyLinkButton slug={article.slug} />
        </div>
      </CardFooter>
    </Card>
  );
}
