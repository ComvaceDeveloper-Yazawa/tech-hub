import { redirect } from 'next/navigation';
import { createArticle } from '@/presentation/actions/createArticle';
import { listTags } from '@/presentation/actions/listTags';
import { ArticleForm } from '@/components/features/ArticleForm';

export default async function ArticleCreatePage() {
  const tags = await listTags();

  async function handleSubmit(data: {
    title: string;
    content: string;
    slug: string;
    tagNames?: string[];
  }) {
    'use server';
    await createArticle(data);
    redirect('/admin/articles');
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新規記事作成</h1>
      <ArticleForm
        mode="create"
        initialTagSuggestions={tags}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
