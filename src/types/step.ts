export type CheckRule = {
  property: string;
  condition: 'not-equals' | 'equals' | 'includes';
  value: string;
  failureHint?: string;
};

/** 解説のみのステップ（コードエディタなし） */
export type LessonStep = {
  kind: 'lesson';
  id: string;
  title: string;
};

/** 実践ステップ（コードエディタあり） */
export type PracticeStep = {
  kind: 'practice';
  id: string;
  title: string;
  description: string;
  initialCode: {
    html: string;
    css: string;
  };
  hints: string[];
  checkRules: CheckRule[];
  successMessage: string;
  targetSelector?: string;
};

export type Step = LessonStep | PracticeStep;

export type Chapter = {
  id: string;
  title: string;
  steps: Step[];
};
