'use client';

import type { LessonStep } from '@/types/step';
import { LessonIntro1 } from './lessons/LessonIntro1';
import { LessonIntro2 } from './lessons/LessonIntro2';
import { LessonIntro3 } from './lessons/LessonIntro3';

type LessonViewProps = {
  step: LessonStep;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const lessonComponents: Record<
  string,
  React.ComponentType<{
    onNext: () => void;
    onPrev: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
  }>
> = {
  'intro-1': LessonIntro1,
  'intro-2': LessonIntro2,
  'intro-3': LessonIntro3,
};

export function LessonView({
  step,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: LessonViewProps) {
  const Component = lessonComponents[step.id];

  if (!Component) return null;

  return (
    <Component
      onNext={onNext}
      onPrev={onPrev}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
    />
  );
}
