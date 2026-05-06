import type { HtmlCheckRule } from '@/lib/htmlChecker';

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
  /** 対象要素（デフォルト `.hero`）の computed CSS を検査するルール */
  checkRules: CheckRule[];
  /** 学習者が書いた HTML の DOM 構造・テキストを検査するルール */
  htmlCheckRules?: HtmlCheckRule[];
  successMessage: string;
  targetSelector?: string;
};

export type Step = LessonStep | PracticeStep;

export type Chapter = {
  id: string;
  title: string;
  steps: Step[];
};
