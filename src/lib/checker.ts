import type { CheckRule } from '@/types/step';

export type GradeResult = {
  passed: boolean;
  failedHints: string[];
};

export function evaluateRules(
  style: CSSStyleDeclaration,
  rules: CheckRule[]
): GradeResult {
  const failedHints: string[] = [];

  for (const rule of rules) {
    const actual =
      style.getPropertyValue(camelToDash(rule.property)) ||
      (style as Record<string, string>)[rule.property] ||
      '';

    let passed = false;
    switch (rule.condition) {
      case 'equals':
        passed = actual === rule.value;
        break;
      case 'not-equals':
        passed = actual !== rule.value && actual !== '';
        break;
      case 'includes':
        passed = actual.includes(rule.value);
        break;
    }

    if (!passed && rule.failureHint) {
      failedHints.push(rule.failureHint);
    }
  }

  return { passed: failedHints.length === 0, failedHints };
}

function camelToDash(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
