import { redirect } from 'next/navigation';
import { createArticle } from '@/presentation/actions/createArticle';
import { ArticleForm } from '@/components/features/ArticleForm';

export default function ArticleCreatePage() {
  async function handleSubmit(data: {
    title: string;
    content: string;
    slug: string;
    tagIds?: string[];
  }) {
    'use server';
    await createArticle(data);
    redirect('/admin/articles');
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新規記事作成</h1>
      <ArticleForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
