'use server';

import { redirect } from 'next/navigation';
import { createArticle } from '@/presentation/actions/createArticle';

export async function handleArticleCreate(data: {
  title: string;
  content: string;
  slug: string;
  tagNames?: string[];
}) {
  await createArticle(data);
  redirect('/mypage/articles');
}
