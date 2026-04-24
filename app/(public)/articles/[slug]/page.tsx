import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Eye, Calendar } from 'lucide-react';
import { getArticleBySlug } from '@/presentation/actions/getArticleBySlug';
import { recordView } from '@/presentation/actions/recordView';
import { LikeButton } from '@/components/features/LikeButton';
import { BookmarkButton } from '@/components/features/BookmarkButton';
import { Badge } from '@/components/ui/badge';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug({ slug });

  if (!article) {
    notFound();
  }

  await recordView({ articleId: article.id });

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>

        <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-4 text-sm">
          {article.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-4" aria-hidden="true" />
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
              </time>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="size-4" aria-hidden="true" />
            {article.viewCount} 閲覧
          </span>
        </div>

        {article.tagIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tagIds.map((tagId) => (
              <Link key={tagId} href={`/articles?tagId=${tagId}`}>
                <Badge variant="secondary">{tagId}</Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-8 flex items-center gap-2 border-t pt-4">
        <LikeButton
          articleId={article.id}
          initialLikeCount={article.likeCount}
          initialLiked={false}
        />
        <BookmarkButton articleId={article.id} initialBookmarked={false} />
      </footer>
    </article>
  );
}
