'use client';

import type { LessonStep } from '@/types/step';
import { HeroLesson1 } from './lessons/HeroLesson1';
import { HeroLesson2 } from './lessons/HeroLesson2';
import { CafeCh0Lesson05Intro } from './lessons/CafeCh0Lesson05Intro';

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
  'hero-lesson-1': HeroLesson1,
  'hero-lesson-2': HeroLesson2,
  'cafe-ch0-05-lesson-1': CafeCh0Lesson05Intro,
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
