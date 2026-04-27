import { notFound } from 'next/navigation';
import { getSkillSheetById } from '@/presentation/actions/skillSheets';
import {
  calculateAgeFromDate,
  formatExperienceMonths,
  formatReiwaDate,
} from '@/lib/skill-sheet-format';
import { PrintButton } from './PrintButton';

type PrintSkillSheetPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrintSkillSheetPage({
  params,
}: PrintSkillSheetPageProps) {
  const { id } = await params;
  const skillSheet = await getSkillSheetById(id);

  if (!skillSheet) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-6 text-black print:p-0">
      <div className="mx-auto max-w-[960px] bg-white print:max-w-none">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h1 className="text-xl font-bold">スキルシート出力</h1>
          <PrintButton />
        </div>

        <section className="space-y-4 text-[12px] leading-relaxed">
          <h2 className="border border-black bg-neutral-100 py-2 text-center text-xl font-bold">
            スキルシート
          </h2>

          <table className="w-full border-collapse border border-black">
            <tbody>
              <tr>
                <th className="w-32 border border-black bg-neutral-100 p-2 text-left">
                  氏名
                </th>
                <td className="border border-black p-2">
                  {skillSheet.fullName}
                </td>
                <th className="w-24 border border-black bg-neutral-100 p-2 text-left">
                  性別
                </th>
                <td className="w-32 border border-black p-2">
                  {skillSheet.gender}
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-neutral-100 p-2 text-left">
                  年齢
                </th>
                <td className="border border-black p-2">
                  {calculateAgeFromDate(skillSheet.birthDate)}
                </td>
                <th className="border border-black bg-neutral-100 p-2 text-left">
                  国籍
                </th>
                <td className="border border-black p-2">
                  {skillSheet.nationality}
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-neutral-100 p-2 text-left">
                  最寄り駅
                </th>
                <td className="border border-black p-2">
                  {skillSheet.stationLine} {skillSheet.nearestStation}
                </td>
                <th className="border border-black bg-neutral-100 p-2 text-left">
                  希望参画日
                </th>
                <td className="border border-black p-2">
                  {formatReiwaDate(skillSheet.desiredStartDate)}
                </td>
              </tr>
              <tr>
                <th className="border border-black bg-neutral-100 p-2 text-left">
                  希望地域
                </th>
                <td className="border border-black p-2">
                  {skillSheet.desiredArea}
                </td>
                <th className="border border-black bg-neutral-100 p-2 text-left">
                  経験年数
                </th>
                <td className="border border-black p-2">
                  {formatExperienceMonths(skillSheet.experienceMonths)}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border-collapse border border-black">
            <tbody>
              <tr>
                <th className="w-32 border border-black bg-neutral-100 p-2 text-left">
                  自己PR
                </th>
                <td className="border border-black p-2 whitespace-pre-wrap">
                  {skillSheet.selfPr}
                </td>
              </tr>
            </tbody>
          </table>

          <section>
            <h3 className="border border-black bg-neutral-100 p-2 font-bold">
              案件経歴
            </h3>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="w-16 border border-black bg-neutral-100 p-2">
                    No.
                  </th>
                  <th className="w-36 border border-black bg-neutral-100 p-2">
                    期間
                  </th>
                  <th className="border border-black bg-neutral-100 p-2">
                    案件概要
                  </th>
                  <th className="w-44 border border-black bg-neutral-100 p-2">
                    使用スキル
                  </th>
                  <th className="w-44 border border-black bg-neutral-100 p-2">
                    使用環境・ツール
                  </th>
                  <th className="w-56 border border-black bg-neutral-100 p-2">
                    作業内容
                  </th>
                </tr>
              </thead>
              <tbody>
                {skillSheet.projects.map((project) => (
                  <tr key={project.id}>
                    <td className="border border-black p-2 text-center align-top">
                      {project.projectNumber}
                    </td>
                    <td className="border border-black p-2 align-top">
                      {project.periodStart} - {project.periodEnd}
                    </td>
                    <td className="border border-black p-2 align-top whitespace-pre-wrap">
                      {project.description}
                    </td>
                    <td className="border border-black p-2 align-top">
                      <ul className="list-disc space-y-1 pl-4">
                        {project.skills.map((skill) => (
                          <li key={skill.id}>
                            <span className="font-semibold">
                              {skill.category}:
                            </span>{' '}
                            {skill.skillName}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-black p-2 align-top">
                      <ul className="list-disc space-y-1 pl-4">
                        {project.environments.map((environment) => (
                          <li key={environment.id}>
                            <span className="font-semibold">
                              {environment.environmentType}:
                            </span>{' '}
                            {environment.value}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-black p-2 align-top">
                      <ul className="list-disc space-y-1 pl-4">
                        {project.tasks.map((task) => (
                          <li key={task.id}>
                            <span className="font-semibold">
                              {task.category}:
                            </span>{' '}
                            {task.taskDescription}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      </div>
    </main>
  );
}
