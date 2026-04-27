'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createSkillSheet } from '@/presentation/actions/skillSheets';
import type { SkillSheetDetail } from '@/presentation/actions/skillSheets';
import type { CreateSkillSheetInput } from '@/schemas/skillSheet';

type ProjectForm = {
  projectNumber: number;
  periodStart: string;
  periodEnd: string;
  description: string;
  tasks: { category: string; taskDescription: string }[];
  skills: { category: string; skillName: string }[];
  environments: { environmentType: string; value: string }[];
};

const createEmptyProject = (projectNumber: number): ProjectForm => ({
  projectNumber,
  periodStart: '',
  periodEnd: '',
  description: '',
  tasks: [{ category: '', taskDescription: '' }],
  skills: [{ category: '', skillName: '' }],
  environments: [{ environmentType: '', value: '' }],
});

function toDateString(date: Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return [
    String(d.getFullYear()).padStart(4, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function calculateAge(birthDate: string) {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return String(age);
}

function toDateValue(year: number, month: number, day: number) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function getDateParts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function getInitialMonth(value: string) {
  const parts = getDateParts(value);
  if (parts) return new Date(parts.year, parts.month - 1, 1);
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

function formatDateForDisplay(value: string) {
  const parts = getDateParts(value);
  if (!parts) return '選択してください';
  return `${parts.year}年${parts.month}月${parts.day}日`;
}

function DatePicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getInitialMonth(value)
  );

  const selectedParts = getDateParts(value);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="relative mt-1">
      <Button
        id={id}
        type="button"
        variant="outline"
        className="h-8 w-full justify-between px-2.5 font-normal"
        onClick={() => {
          setVisibleMonth(getInitialMonth(value));
          setIsOpen((c) => !c);
        }}
      >
        <span>{formatDateForDisplay(value)}</span>
        <CalendarDays className="size-4" aria-hidden="true" />
      </Button>

      {isOpen && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-2 w-72 rounded-lg border p-3 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
              aria-label="前の月"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <div className="text-sm font-semibold">
              {year}年{month + 1}月
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
              aria-label="次の月"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="text-muted-foreground mb-1 grid grid-cols-7 text-center text-xs">
            {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`b-${i}`} className="size-8" />
            ))}
            {days.map((day) => {
              const isSelected =
                selectedParts?.year === year &&
                selectedParts.month === month + 1 &&
                selectedParts.day === day;
              return (
                <Button
                  key={day}
                  type="button"
                  variant={isSelected ? 'default' : 'ghost'}
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    onChange(toDateValue(year, month + 1, day));
                    setIsOpen(false);
                  }}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// source から ProjectForm[] を生成
function sourceToProjects(source: SkillSheetDetail): ProjectForm[] {
  if (source.projects.length === 0) return [createEmptyProject(1)];
  return source.projects.map((p, i) => ({
    projectNumber: i + 1,
    periodStart: p.periodStart,
    periodEnd: p.periodEnd,
    description: p.description,
    tasks:
      p.tasks.length > 0
        ? p.tasks.map((t) => ({
            category: t.category,
            taskDescription: t.taskDescription,
          }))
        : [{ category: '', taskDescription: '' }],
    skills:
      p.skills.length > 0
        ? p.skills.map((s) => ({
            category: s.category,
            skillName: s.skillName,
          }))
        : [{ category: '', skillName: '' }],
    environments:
      p.environments.length > 0
        ? p.environments.map((e) => ({
            environmentType: e.environmentType,
            value: e.value,
          }))
        : [{ environmentType: '', value: '' }],
  }));
}

interface NewSkillSheetClientProps {
  source: SkillSheetDetail | null;
}

export function NewSkillSheetClient({ source }: NewSkillSheetClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState(source?.fullName ?? '');
  const [gender, setGender] = useState(source?.gender ?? '');
  const [birthDate, setBirthDate] = useState(toDateString(source?.birthDate));
  const [nationality, setNationality] = useState(source?.nationality ?? '');
  const [stationLine, setStationLine] = useState(source?.stationLine ?? '');
  const [nearestStation, setNearestStation] = useState(
    source?.nearestStation ?? ''
  );
  const [desiredStartDate, setDesiredStartDate] = useState(
    toDateString(source?.desiredStartDate)
  );
  const [desiredArea, setDesiredArea] = useState(source?.desiredArea ?? '');
  const [experienceYears, setExperienceYears] = useState(
    source ? String(Math.floor(source.experienceMonths / 12)) : ''
  );
  const [experienceRemainingMonths, setExperienceRemainingMonths] = useState(
    source ? String(source.experienceMonths % 12) : ''
  );
  const [selfPr, setSelfPr] = useState(source?.selfPr ?? '');
  const [projects, setProjects] = useState<ProjectForm[]>(
    source ? sourceToProjects(source) : [createEmptyProject(1)]
  );

  const handleAddProject = () =>
    setProjects([...projects, createEmptyProject(projects.length + 1)]);

  const handleRemoveProject = (index: number) => {
    setProjects(
      projects
        .filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, projectNumber: i + 1 }))
    );
  };

  const handleUpdateProject = (
    index: number,
    field: keyof Omit<ProjectForm, 'tasks' | 'skills' | 'environments'>,
    value: string
  ) => {
    const updated = [...projects];
    const current = updated[index];
    if (!current) return;
    updated[index] = {
      ...current,
      [field]: field === 'projectNumber' ? Number(value) : value,
    };
    setProjects(updated);
  };

  const handleAddTask = (pi: number) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? { ...p, tasks: [...p.tasks, { category: '', taskDescription: '' }] }
          : p
      )
    );
  const handleRemoveTask = (pi: number, ti: number) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi ? { ...p, tasks: p.tasks.filter((_, j) => j !== ti) } : p
      )
    );
  const handleUpdateTask = (
    pi: number,
    ti: number,
    field: 'category' | 'taskDescription',
    value: string
  ) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? {
              ...p,
              tasks: p.tasks.map((t, j) =>
                j === ti ? { ...t, [field]: value } : t
              ),
            }
          : p
      )
    );

  const handleAddSkill = (pi: number) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? { ...p, skills: [...p.skills, { category: '', skillName: '' }] }
          : p
      )
    );
  const handleRemoveSkill = (pi: number, si: number) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi ? { ...p, skills: p.skills.filter((_, j) => j !== si) } : p
      )
    );
  const handleUpdateSkill = (
    pi: number,
    si: number,
    field: 'category' | 'skillName',
    value: string
  ) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? {
              ...p,
              skills: p.skills.map((s, j) =>
                j === si ? { ...s, [field]: value } : s
              ),
            }
          : p
      )
    );

  const handleAddEnvironment = (pi: number) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? {
              ...p,
              environments: [
                ...p.environments,
                { environmentType: '', value: '' },
              ],
            }
          : p
      )
    );
  const handleRemoveEnvironment = (pi: number, ei: number) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? { ...p, environments: p.environments.filter((_, j) => j !== ei) }
          : p
      )
    );
  const handleUpdateEnvironment = (
    pi: number,
    ei: number,
    field: 'environmentType' | 'value',
    value: string
  ) =>
    setProjects((c) =>
      c.map((p, i) =>
        i === pi
          ? {
              ...p,
              environments: p.environments.map((e, j) =>
                j === ei ? { ...e, [field]: value } : e
              ),
            }
          : p
      )
    );

  const handleSubmit = () => {
    setErrorMessage(null);
    const input: CreateSkillSheetInput = {
      fullName,
      gender,
      birthDate,
      nationality,
      stationLine,
      nearestStation,
      desiredStartDate,
      desiredArea,
      experienceMonths:
        Number(experienceYears || 0) * 12 +
        Number(experienceRemainingMonths || 0),
      selfPr,
      projects: projects.map((project, index) => ({
        ...project,
        projectNumber: index + 1,
        tasks: project.tasks.filter(
          (t) => t.category.trim() && t.taskDescription.trim()
        ),
        skills: project.skills.filter(
          (s) => s.category.trim() && s.skillName.trim()
        ),
        environments: project.environments.filter(
          (e) => e.environmentType.trim() && e.value.trim()
        ),
      })),
    };
    startTransition(async () => {
      try {
        await createSkillSheet(input);
        router.push('/skill-sheets');
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'スキルシートの保存に失敗しました'
        );
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">スキルシート作成</h1>
          {source && (
            <p className="text-muted-foreground mt-1 text-sm">
              既存のスキルシートをコピーして新規作成しています（保存すると新しいバージョンとして追加されます）
            </p>
          )}
        </div>
        <Link href="/skill-sheets">
          <Button variant="outline">一覧へ戻る</Button>
        </Link>
      </div>

      {errorMessage && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive mb-6 rounded-lg border p-4 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">基本情報</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">氏名</Label>
                  <Input
                    id="fullName"
                    placeholder="例: 山田 太郎"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">性別</Label>
                  <Select
                    value={gender}
                    onValueChange={(v) => setGender(v ?? '')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="男性">男性</SelectItem>
                      <SelectItem value="女性">女性</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                      <SelectItem value="回答しない">回答しない</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="birthDate">生年月日</Label>
                  <DatePicker
                    id="birthDate"
                    value={birthDate}
                    onChange={setBirthDate}
                  />
                </div>
                <div>
                  <Label htmlFor="age">年齢</Label>
                  <Input
                    id="age"
                    value={calculateAge(birthDate)}
                    readOnly
                    placeholder="生年月日から自動計算"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">国籍</Label>
                  <Input
                    id="nationality"
                    placeholder="例: 日本"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="stationLine">最寄り線</Label>
                  <Input
                    id="stationLine"
                    placeholder="例: JR山手線"
                    value={stationLine}
                    onChange={(e) => setStationLine(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nearestStation">最寄駅</Label>
                  <Input
                    id="nearestStation"
                    placeholder="例: 渋谷駅"
                    value={nearestStation}
                    onChange={(e) => setNearestStation(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="desiredStartDate">希望参画日</Label>
                  <DatePicker
                    id="desiredStartDate"
                    value={desiredStartDate}
                    onChange={setDesiredStartDate}
                  />
                </div>
                <div>
                  <Label htmlFor="desiredArea">希望地域</Label>
                  <Input
                    id="desiredArea"
                    placeholder="例: 東京都内、リモート"
                    value={desiredArea}
                    onChange={(e) => setDesiredArea(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="experienceYears">経験年数（年）</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    placeholder="4"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="experienceMonths">経験年数（月）</Label>
                  <Input
                    id="experienceMonths"
                    type="number"
                    min="0"
                    max="11"
                    placeholder="7"
                    value={experienceRemainingMonths}
                    onChange={(e) =>
                      setExperienceRemainingMonths(e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="selfPr">自己PR</Label>
                <Textarea
                  id="selfPr"
                  placeholder="これまでの経験や強み、プロジェクト推進に向けて貢献できることを記入してください"
                  value={selfPr}
                  onChange={(e) => setSelfPr(e.target.value)}
                  rows={8}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">案件情報</h2>
            <Button onClick={handleAddProject} variant="outline">
              <Plus className="size-4" aria-hidden="true" />
              案件情報を追加
            </Button>
          </div>

          <div className="space-y-4">
            {projects.map((project, projectIndex) => (
              <Card key={project.projectNumber} className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    案件情報 {project.projectNumber}
                  </h3>
                  {projects.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveProject(projectIndex)}
                      aria-label={`案件情報 ${project.projectNumber} を削除`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      削除
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`periodStart-${projectIndex}`}>
                        期間開始
                      </Label>
                      <DatePicker
                        id={`periodStart-${projectIndex}`}
                        value={project.periodStart}
                        onChange={(v) =>
                          handleUpdateProject(projectIndex, 'periodStart', v)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`periodEnd-${projectIndex}`}>
                        期間終了
                      </Label>
                      <DatePicker
                        id={`periodEnd-${projectIndex}`}
                        value={project.periodEnd}
                        onChange={(v) =>
                          handleUpdateProject(projectIndex, 'periodEnd', v)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`description-${projectIndex}`}>
                      案件概要
                    </Label>
                    <Textarea
                      id={`description-${projectIndex}`}
                      placeholder="案件概要、体制、担当範囲などを記入してください"
                      value={project.description}
                      onChange={(e) =>
                        handleUpdateProject(
                          projectIndex,
                          'description',
                          e.target.value
                        )
                      }
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>作業内容</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTask(projectIndex)}
                      >
                        <Plus className="size-4" aria-hidden="true" />
                        作業内容を追加
                      </Button>
                    </div>
                    {project.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[180px_1fr_auto]"
                      >
                        <Input
                          placeholder="例: 設計"
                          value={task.category}
                          onChange={(e) =>
                            handleUpdateTask(
                              projectIndex,
                              taskIndex,
                              'category',
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="例: 詳細設計書の作成"
                          value={task.taskDescription}
                          onChange={(e) =>
                            handleUpdateTask(
                              projectIndex,
                              taskIndex,
                              'taskDescription',
                              e.target.value
                            )
                          }
                        />
                        {project.tasks.length > 1 && (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() =>
                              handleRemoveTask(projectIndex, taskIndex)
                            }
                            aria-label="作業内容を削除"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label>使用スキル</Label>
                        <Button
                          onClick={() => handleAddSkill(projectIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="size-4" aria-hidden="true" />
                          追加
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {project.skills.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[180px_1fr_auto] lg:grid-cols-1 xl:grid-cols-[180px_1fr_auto]"
                          >
                            <Select
                              value={skill.category}
                              onValueChange={(v) =>
                                handleUpdateSkill(
                                  projectIndex,
                                  skillIndex,
                                  'category',
                                  v ?? ''
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="カテゴリ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="言語">言語</SelectItem>
                                <SelectItem value="フレームワーク">
                                  フレームワーク
                                </SelectItem>
                                <SelectItem value="ライブラリ">
                                  ライブラリ
                                </SelectItem>
                                <SelectItem value="インフラ">
                                  インフラ
                                </SelectItem>
                                <SelectItem value="ツール">ツール</SelectItem>
                                <SelectItem value="OS">OS</SelectItem>
                                <SelectItem value="その他">その他</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="例: TypeScript, React, AWS"
                              value={skill.skillName}
                              onChange={(e) =>
                                handleUpdateSkill(
                                  projectIndex,
                                  skillIndex,
                                  'skillName',
                                  e.target.value
                                )
                              }
                            />
                            {project.skills.length > 1 && (
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() =>
                                  handleRemoveSkill(projectIndex, skillIndex)
                                }
                                aria-label="使用スキルを削除"
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label>使用環境・ツール</Label>
                        <Button
                          onClick={() => handleAddEnvironment(projectIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="size-4" aria-hidden="true" />
                          追加
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {project.environments.map(
                          (environment, environmentIndex) => (
                            <div
                              key={environmentIndex}
                              className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[180px_1fr_auto] lg:grid-cols-1 xl:grid-cols-[180px_1fr_auto]"
                            >
                              <Select
                                value={environment.environmentType}
                                onValueChange={(v) =>
                                  handleUpdateEnvironment(
                                    projectIndex,
                                    environmentIndex,
                                    'environmentType',
                                    v ?? ''
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="種類" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OS">OS</SelectItem>
                                  <SelectItem value="エディタ">
                                    エディタ
                                  </SelectItem>
                                  <SelectItem value="ツール">ツール</SelectItem>
                                  <SelectItem value="フレームワーク">
                                    フレームワーク
                                  </SelectItem>
                                  <SelectItem value="その他">その他</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="例: Windows, VS Code, Git"
                                value={environment.value}
                                onChange={(e) =>
                                  handleUpdateEnvironment(
                                    projectIndex,
                                    environmentIndex,
                                    'value',
                                    e.target.value
                                  )
                                }
                              />
                              {project.environments.length > 1 && (
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveEnvironment(
                                      projectIndex,
                                      environmentIndex
                                    )
                                  }
                                  aria-label="使用環境・ツールを削除"
                                >
                                  <Trash2
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                </Button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/skill-sheets" className="flex-1">
          <Button variant="outline" className="w-full">
            キャンセル
          </Button>
        </Link>
        <Button className="flex-1" onClick={handleSubmit} disabled={isPending}>
          <Save className="size-4" aria-hidden="true" />
          {isPending ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  );
}
