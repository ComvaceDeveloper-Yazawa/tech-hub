import { notFound, redirect } from 'next/navigation';
import { getArticleById } from '@/presentation/actions/getArticleById';
import { listTags } from '@/presentation/actions/listTags';
import { handleArticleUpdate } from '@/presentation/actions/handleArticleUpdate';
import { ArticleForm } from '@/components/features/ArticleForm';
import { requireAuth } from '@/presentation/guards/requireAuth';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

interface MyArticleEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyArticleEditPage({
  params,
}: MyArticleEditPageProps) {
  let currentUser;
  try {
    currentUser = await requireAuth();
  } catch (error) {
    if (error instanceof ApplicationError) {
      redirect('/login');
    }
    redirect('/login');
  }

  const { id } = await params;
  const [article, tags] = await Promise.all([
    getArticleById({ articleId: id }),
    listTags(),
  ]);

  if (!article) notFound();

  // 本人以外はアクセス不可
  if (article.authorId !== currentUser.id.toString()) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">記事編集</h1>
      <ArticleForm
        mode="edit"
        defaultValues={{
          articleId: article.id,
          title: article.title,
          content: article.content,
          slug: article.slug,
          tagNames: article.tagNames,
        }}
        initialTagSuggestions={tags}
        onSubmit={handleArticleUpdate.bind(null, id)}
      />
    </div>
  );
}
