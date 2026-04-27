import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);

export const skillSheetProjectTaskSchema = z.object({
  category: nonEmptyString.max(100),
  taskDescription: nonEmptyString,
});

export const skillSheetProjectSchema = z.object({
  projectNumber: z.number().int().min(1),
  periodStart: nonEmptyString.max(100),
  periodEnd: nonEmptyString.max(100),
  description: nonEmptyString,
  tasks: z.array(skillSheetProjectTaskSchema).default([]),
  skills: z
    .array(
      z.object({
        category: nonEmptyString.max(50),
        skillName: nonEmptyString.max(100),
      })
    )
    .default([]),
  environments: z
    .array(
      z.object({
        environmentType: nonEmptyString.max(50),
        value: nonEmptyString.max(100),
      })
    )
    .default([]),
});

export const createSkillSheetInputSchema = z.object({
  fullName: nonEmptyString.max(255),
  gender: nonEmptyString.max(50),
  birthDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined)),
  nationality: nonEmptyString.max(100),
  stationLine: nonEmptyString.max(100),
  nearestStation: nonEmptyString.max(100),
  desiredStartDate: nonEmptyString.pipe(z.coerce.date()),
  desiredArea: nonEmptyString.max(255),
  experienceMonths: z.coerce.number().int().min(0).max(1200),
  selfPr: nonEmptyString,
  projects: z.array(skillSheetProjectSchema).min(1),
});

export type CreateSkillSheetInput = z.input<typeof createSkillSheetInputSchema>;
