import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { listSkillSheets } from '@/presentation/actions/skillSheets';
import {
  formatExperienceMonths,
  formatReiwaDate,
} from '@/lib/skill-sheet-format';
import { Copy, FileSpreadsheet, Plus, Printer } from 'lucide-react';

export default async function SkillSheetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const skillSheets = await listSkillSheets();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">スキルシート管理</h1>
        {skillSheets.length > 0 && (
          <Link href="/skill-sheets/new">
            <Button aria-label="新規スキルシートを作成">
              <Plus className="size-4" aria-hidden="true" />
              新規作成
            </Button>
          </Link>
        )}
      </div>

      {skillSheets.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-6 rounded-lg border p-16 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <FileSpreadsheet
              className="text-muted-foreground size-8"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">スキルシートがありません</p>
            <p className="text-muted-foreground mt-1 text-sm">
              最初のスキルシートを作成して経歴を管理しましょう
            </p>
          </div>
          <Link href="/skill-sheets/new">
            <Button size="lg" aria-label="最初のスキルシートを作成">
              <Plus className="size-5" aria-hidden="true" />
              スキルシートを作成する
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>作成日時</TableHead>
                <TableHead>案件参画希望日</TableHead>
                <TableHead>経験年数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillSheets.map((skillSheet) => (
                <TableRow key={skillSheet.id}>
                  <TableCell>
                    {new Date(skillSheet.createdAt).toLocaleString('ja-JP')}
                  </TableCell>
                  <TableCell>
                    {formatReiwaDate(skillSheet.desiredStartDate)}
                  </TableCell>
                  <TableCell>
                    {formatExperienceMonths(skillSheet.experienceMonths)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/skill-sheets/new?copyFrom=${skillSheet.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="コピーして編集"
                        >
                          <Copy className="size-4" aria-hidden="true" />
                          コピーして編集
                        </Button>
                      </Link>
                      <Link
                        href={`/skill-sheets/${skillSheet.id}/print`}
                        target="_blank"
                      >
                        <Button variant="outline" size="sm">
                          <Printer className="size-4" aria-hidden="true" />
                          PDF
                        </Button>
                      </Link>
                      <Link href={`/api/skill-sheets/${skillSheet.id}/excel`}>
                        <Button variant="outline" size="sm">
                          <FileSpreadsheet
                            className="size-4"
                            aria-hidden="true"
                          />
                          Excel
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
