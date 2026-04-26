import { notFound } from 'next/navigation';
import { getArticleById } from '@/presentation/actions/getArticleById';
import { listTags } from '@/presentation/actions/listTags';
import { handleArticleUpdate } from '@/presentation/actions/handleArticleUpdate';
import { ArticleForm } from '@/components/features/ArticleForm';

interface ArticleEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleEditPage({
  params,
}: ArticleEditPageProps) {
  const { id } = await params;
  const [article, tags] = await Promise.all([
    getArticleById({ articleId: id }),
    listTags(),
  ]);

  if (!article) notFound();

  return (
    <div>
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
        onSubmit={(data) => handleArticleUpdate(id, data)}
      />
    </div>
  );
}
