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
import { Badge } from '@/components/ui/badge';
import { listSkillSheets } from '@/presentation/actions/skillSheets';
import {
  formatExperienceMonths,
  formatReiwaDate,
} from '@/lib/skill-sheet-format';
import { Download, FileSpreadsheet, Plus, Printer } from 'lucide-react';

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
        <Link href="/skill-sheets/new">
          <Button aria-label="新規スキルシートを作成">
            <Plus className="size-4" aria-hidden="true" />
            新規作成
          </Button>
        </Link>
      </div>

      {skillSheets.length === 0 ? (
        <div className="border-border rounded-lg border p-6">
          <p className="text-muted-foreground text-center">
            スキルシートはまだありません
          </p>
        </div>
      ) : (
        <div className="border-border rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>氏名</TableHead>
                <TableHead>希望参画日</TableHead>
                <TableHead>経験年数</TableHead>
                <TableHead>性別</TableHead>
                <TableHead>登録内容</TableHead>
                <TableHead className="text-right">出力</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillSheets.map((skillSheet) => (
                <TableRow key={skillSheet.id}>
                  <TableCell className="font-medium">
                    {skillSheet.fullName}
                  </TableCell>
                  <TableCell>
                    {formatReiwaDate(skillSheet.desiredStartDate)}
                  </TableCell>
                  <TableCell>
                    {formatExperienceMonths(skillSheet.experienceMonths)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{skillSheet.gender}</Badge>
                  </TableCell>
                  <TableCell>案件 {skillSheet._count.projects}件</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
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
                      <Link href={`/skill-sheets/${skillSheet.id}/print`}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="表示"
                        >
                          <Download className="size-4" aria-hidden="true" />
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
