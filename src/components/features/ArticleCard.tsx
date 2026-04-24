import Link from 'next/link';
import { Eye, Heart, Calendar } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { cn } from '@/lib/cn';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string | null;
    viewCount: number;
    likeCount: number;
  };
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>
          <Link
            href={`/articles/${article.slug}`}
            className="focus-visible:ring-ring rounded hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardFooter className="text-muted-foreground mt-auto gap-4 text-xs">
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
        <span className="inline-flex items-center gap-1">
          <Heart className="size-3" aria-hidden="true" />
          {article.likeCount}
        </span>
      </CardFooter>
    </Card>
  );
}
