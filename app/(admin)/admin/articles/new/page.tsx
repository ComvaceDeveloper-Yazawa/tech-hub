import { listTags } from '@/presentation/actions/listTags';
import { handleArticleCreate } from '@/presentation/actions/handleArticleCreate';
import { ArticleForm } from '@/components/features/ArticleForm';

export default async function ArticleCreatePage() {
  const tags = await listTags();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">新規記事作成</h1>
      <ArticleForm
        mode="create"
        initialTagSuggestions={tags}
        onSubmit={handleArticleCreate}
      />
    </div>
  );
}
