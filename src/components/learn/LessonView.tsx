'use client';

import type { LessonStep } from '@/types/step';
import { HeroLesson1 } from './lessons/HeroLesson1';
import { HeroLesson2 } from './lessons/HeroLesson2';
import { CafeCh0Lesson05Intro } from './lessons/CafeCh0Lesson05Intro';
import { CafeCh0Lesson06Intro } from './lessons/CafeCh0Lesson06Intro';
import { CafeCh0Lesson07Intro } from './lessons/CafeCh0Lesson07Intro';
import { CafeCh0Lesson09Intro } from './lessons/CafeCh0Lesson09Intro';
import { CafeCh0Lesson10Intro } from './lessons/CafeCh0Lesson10Intro';
import { CafeCh0Lesson11Intro } from './lessons/CafeCh0Lesson11Intro';
import { CafeCh0Lesson12Intro } from './lessons/CafeCh0Lesson12Intro';

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
  'cafe-ch0-06-lesson-1': CafeCh0Lesson06Intro,
  'cafe-ch0-07-lesson-1': CafeCh0Lesson07Intro,
  'cafe-ch0-09-lesson-1': CafeCh0Lesson09Intro,
  'cafe-ch0-10-lesson-1': CafeCh0Lesson10Intro,
  'cafe-ch0-11-lesson-1': CafeCh0Lesson11Intro,
  'cafe-ch0-12-lesson-1': CafeCh0Lesson12Intro,
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
