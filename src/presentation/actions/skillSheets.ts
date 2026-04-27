'use server';

import { revalidatePath } from 'next/cache';
import { ulid } from 'ulid';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import {
  createSkillSheetInputSchema,
  type CreateSkillSheetInput,
} from '@/schemas/skillSheet';

const skillSheetInclude = {
  projects: {
    orderBy: { projectNumber: 'asc' },
    include: {
      tasks: {
        orderBy: { createdAt: 'asc' },
      },
      skills: {
        orderBy: [{ category: 'asc' }, { skillName: 'asc' }],
      },
      environments: {
        orderBy: [{ environmentType: 'asc' }, { value: 'asc' }],
      },
    },
  },
} as const;

type SkillSheetDb = typeof prisma & {
  skillSheet: {
    create: (args: unknown) => Promise<{ id: string }>;
    findMany: (args: unknown) => Promise<SkillSheetListItem[]>;
    findFirst: (args: unknown) => Promise<SkillSheetDetail | null>;
  };
};

export type SkillSheetListItem = {
  id: string;
  fullName: string;
  desiredStartDate: Date;
  experienceMonths: number;
  gender: string;
  updatedAt: Date;
  _count: {
    projects: number;
  };
};

export type SkillSheetDetail = {
  id: string;
  tenantId: string;
  userId: string;
  fullName: string;
  gender: string;
  birthDate: Date | null;
  nationality: string;
  stationLine: string;
  nearestStation: string;
  desiredStartDate: Date;
  desiredArea: string;
  experienceMonths: number;
  selfPr: string;
  updatedAt: Date;
  projects: {
    id: string;
    projectNumber: number;
    periodStart: string;
    periodEnd: string;
    description: string;
    tasks: {
      id: string;
      category: string;
      taskDescription: string;
    }[];
    skills: {
      id: string;
      category: string;
      skillName: string;
    }[];
    environments: {
      id: string;
      environmentType: string;
      value: string;
    }[];
  }[];
};

async function getOwnerScope() {
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error('ログインが必要です');
  }

  return {
    tenantId: TenantId.personal().toString(),
    userId: userId.toString(),
  };
}

export async function createSkillSheet(
  input: CreateSkillSheetInput
): Promise<{ skillSheetId: string }> {
  const { tenantId, userId } = await getOwnerScope();
  const validated = createSkillSheetInputSchema.parse(input);
  const db = prisma as SkillSheetDb;

  const skillSheet = await db.skillSheet.create({
    data: {
      id: ulid(),
      tenantId,
      userId,
      fullName: validated.fullName,
      gender: validated.gender,
      birthDate: validated.birthDate,
      nationality: validated.nationality,
      stationLine: validated.stationLine,
      nearestStation: validated.nearestStation,
      desiredStartDate: validated.desiredStartDate,
      desiredArea: validated.desiredArea,
      experienceMonths: validated.experienceMonths,
      selfPr: validated.selfPr,
      projects: {
        create: validated.projects.map((project) => ({
          id: ulid(),
          projectNumber: project.projectNumber,
          periodStart: project.periodStart,
          periodEnd: project.periodEnd,
          description: project.description,
          tasks: {
            create: project.tasks.map((task) => ({
              id: ulid(),
              category: task.category,
              taskDescription: task.taskDescription,
            })),
          },
          skills: {
            create: project.skills.map((skill) => ({
              id: ulid(),
              category: skill.category,
              skillName: skill.skillName,
            })),
          },
          environments: {
            create: project.environments.map((environment) => ({
              id: ulid(),
              environmentType: environment.environmentType,
              value: environment.value,
            })),
          },
        })),
      },
    },
    select: { id: true },
  });

  revalidatePath('/skill-sheets');

  return { skillSheetId: skillSheet.id };
}

export async function listSkillSheets(): Promise<SkillSheetListItem[]> {
  const { tenantId, userId } = await getOwnerScope();
  const db = prisma as SkillSheetDb;

  return db.skillSheet.findMany({
    where: { tenantId, userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      desiredStartDate: true,
      experienceMonths: true,
      gender: true,
      updatedAt: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });
}

export async function getSkillSheetById(
  skillSheetId: string
): Promise<SkillSheetDetail | null> {
  const { tenantId, userId } = await getOwnerScope();
  const db = prisma as SkillSheetDb;

  return db.skillSheet.findFirst({
    where: {
      id: skillSheetId,
      tenantId,
      userId,
    },
    include: skillSheetInclude,
  });
}
