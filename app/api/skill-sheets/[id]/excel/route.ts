import { NextResponse } from 'next/server';
import { getSkillSheetById } from '@/presentation/actions/skillSheets';
import {
  calculateAgeFromDate,
  formatExperienceMonths,
  formatReiwaDate,
} from '@/lib/skill-sheet-format';

type ExcelRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cell(value: string | number) {
  return `<td style="border:1px solid #000;padding:6px;">${escapeHtml(value)}</td>`;
}

function heading(value: string) {
  return `<th style="border:1px solid #000;background:#eee;padding:6px;text-align:left;">${escapeHtml(value)}</th>`;
}

export async function GET(_request: Request, { params }: ExcelRouteContext) {
  const { id } = await params;
  const skillSheet = await getSkillSheetById(id);

  if (!skillSheet) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const projectRows = skillSheet.projects
    .map((project) => {
      const tasks = project.tasks
        .map((task) => `${task.category}: ${task.taskDescription}`)
        .join('\n');
      const skills = project.skills
        .map((skill) => `${skill.category}: ${skill.skillName}`)
        .join('\n');
      const environments = project.environments
        .map(
          (environment) =>
            `${environment.environmentType}: ${environment.value}`
        )
        .join('\n');

      return `<tr>${cell(project.projectNumber)}${cell(`${project.periodStart} - ${project.periodEnd}`)}${cell(project.description)}${cell(skills)}${cell(environments)}${cell(tasks)}</tr>`;
    })
    .join('');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    table { border-collapse: collapse; }
    td, th { mso-number-format:"\\@"; vertical-align: top; }
  </style>
</head>
<body>
  <table>
    <tr><th colspan="4" style="border:1px solid #000;background:#ddd;padding:8px;font-size:18px;">スキルシート</th></tr>
    <tr>${heading('氏名')}${cell(skillSheet.fullName)}${heading('性別')}${cell(skillSheet.gender)}</tr>
    <tr>${heading('年齢')}${cell(calculateAgeFromDate(skillSheet.birthDate))}${heading('国籍')}${cell(skillSheet.nationality)}</tr>
    <tr>${heading('最寄り駅')}${cell(`${skillSheet.stationLine} ${skillSheet.nearestStation}`)}${heading('希望参画日')}${cell(formatReiwaDate(skillSheet.desiredStartDate))}</tr>
    <tr>${heading('希望地域')}${cell(skillSheet.desiredArea)}${heading('経験年数')}${cell(formatExperienceMonths(skillSheet.experienceMonths))}</tr>
    <tr>${heading('自己PR')}<td colspan="3" style="border:1px solid #000;padding:6px;white-space:pre-wrap;">${escapeHtml(skillSheet.selfPr)}</td></tr>
  </table>
  <br />
  <table>
    <tr><th colspan="6" style="border:1px solid #000;background:#ddd;padding:6px;">案件経歴</th></tr>
    <tr>${heading('No.')}${heading('期間')}${heading('案件概要')}${heading('使用スキル')}${heading('使用環境・ツール')}${heading('作業内容')}</tr>
    ${projectRows}
  </table>
</body>
</html>`;

  const filename = encodeURIComponent(`${skillSheet.fullName}_skill_sheet.xls`);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
      'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
    },
  });
}
