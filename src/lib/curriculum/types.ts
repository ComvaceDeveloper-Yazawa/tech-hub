export type StageStatus = 'completed' | 'in_progress' | 'unlocked' | 'locked';

export type Curriculum = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Stage = {
  id: string;
  curriculum_id: string;
  stage_number: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type UserStageProgress = {
  id: string;
  user_id: string;
  stage_id: string;
  status: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StageWithStatus = Stage & {
  status: StageStatus;
};

export type CurriculumWithProgress = Curriculum & {
  total_stages: number;
  completed_stages: number;
};

export type StageCoordinate = {
  x: number;
  y: number;
  stageNumber: number;
};

export type ReferenceArticle = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
