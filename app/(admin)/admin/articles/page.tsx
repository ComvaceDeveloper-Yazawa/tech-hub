import { Suspense } from 'react';
import Link from 'next/link';
import { listArticles } from '@/presentation/actions/listArticles';
import { Pagination } from '@/components/features/Pagination';
import { PublishButton } from '@/components/features/PublishButton';
import { DeleteButton } from '@/components/features/DeleteButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminArticleListPageProps {
  searchParams: Promise<{ cursor?: string; status?: string }>;
}

export default async function AdminArticleListPage({
  searchParams,
}: AdminArticleListPageProps) {
  const params = await searchParams;
  const statusFilter = params.status as 'draft' | 'published' | undefined;

  const result = await listArticles({
    cursor: params.cursor,
    limit: 20,
    status: statusFilter,
  });

  const activeTab = statusFilter ?? 'all';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">マイ記事管理</h1>
      </div>

      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value="all" render={<Link href="/admin/articles" />}>
            全て
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            render={<Link href="/admin/articles?status=draft" />}
          >
            下書き
          </TabsTrigger>
          <TabsTrigger
            value="published"
            render={<Link href="/admin/articles?status=published" />}
          >
            公開済み
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>タイトル</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>公開日時</TableHead>
                  <TableHead>閲覧数</TableHead>
                  <TableHead>いいね数</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground py-8 text-center"
                    >
                      記事がありません
                    </TableCell>
                  </TableRow>
                ) : (
                  result.items.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="max-w-[200px] truncate font-medium">
                        <Link
                          href={
                            article.status === 'published'
                              ? `/articles/${article.slug}`
                              : `/admin/articles/${article.id}/edit`
                          }
                          className="hover:text-primary hover:underline"
                        >
                          {article.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            article.status === 'published'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {article.status === 'published' ? '公開' : '下書き'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString(
                              'ja-JP'
                            )
                          : '—'}
                      </TableCell>
                      <TableCell>{article.viewCount}</TableCell>
                      <TableCell>{article.likeCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label="記事を編集"
                            >
                              編集
                            </Button>
                          </Link>
                          <PublishButton
                            articleId={article.id}
                            currentStatus={
                              article.status as 'draft' | 'published'
                            }
                          />
                          <DeleteButton
                            articleId={article.id}
                            articleTitle={article.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Suspense>
              <Pagination
                nextCursor={result.nextCursor}
                prevCursor={result.prevCursor}
                hasNextPage={result.hasNextPage}
                hasPrevPage={result.hasPrevPage}
              />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
