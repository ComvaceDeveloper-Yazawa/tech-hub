'use server';

import { redirect } from 'next/navigation';
import { updateArticle } from '@/presentation/actions/updateArticle';

export async function handleArticleUpdate(
  articleId: string,
  data: {
    title: string;
    content: string;
    slug: string;
    tagNames?: string[];
  }
) {
  await updateArticle({ articleId, ...data });
  redirect('/mypage/articles');
}
