import { redirect } from 'next/navigation';
import { listTags } from '@/presentation/actions/listTags';
import { handleArticleCreate } from '@/presentation/actions/handleArticleCreate';
import { ArticleForm } from '@/components/features/ArticleForm';
import { requireAuth } from '@/presentation/guards/requireAuth';
import { ApplicationError } from '@/contexts/shared-kernel/ApplicationError';

export default async function MyArticleCreatePage() {
  try {
    await requireAuth();
  } catch (error) {
    if (error instanceof ApplicationError) {
      redirect('/login');
    }
    redirect('/login');
  }

  const tags = await listTags();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">新規記事作成</h1>
      <ArticleForm
        mode="create"
        initialTagSuggestions={tags}
        onSubmit={handleArticleCreate}
      />
    </div>
  );
}
