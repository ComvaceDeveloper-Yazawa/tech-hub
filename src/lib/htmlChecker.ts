/**
 * HTML 文字列に対する採点ルール。
 * 実習レッスンで、学習者が書いた HTML の DOM 構造・テキストを検査する。
 */
export type HtmlCheckRule =
  | {
      kind: 'element-exists';
      selector: string;
      failureHint?: string;
    }
  | {
      kind: 'text-equals';
      selector: string;
      /** 完全一致（前後の空白も一致させる必要がある） */
      value: string;
      failureHint?: string;
    }
  | {
      kind: 'text-includes';
      selector: string;
      value: string;
      failureHint?: string;
    };

export type HtmlGradeResult = {
  passed: boolean;
  failedHints: string[];
};

/**
 * HTML 採点ルールを評価する。
 *
 * - すべてのルールが合格なら `passed: true`
 * - 失敗ルールに `failureHint` があれば `failedHints` に追加される
 * - `failureHint` 未指定時は passed=false だが failedHints は増えない
 *   （既存 `evaluateRules`（CSS 用）と同じ挙動）
 */
export function evaluateHtmlRules(
  doc: Document,
  rules: HtmlCheckRule[]
): HtmlGradeResult {
  const failedHints: string[] = [];
  let passed = true;

  for (const rule of rules) {
    const element = doc.querySelector(rule.selector);
    const ruleOk = evaluateSingleRule(rule, element);

    if (!ruleOk) {
      passed = false;
      if (rule.failureHint) {
        failedHints.push(rule.failureHint);
      }
    }
  }

  return { passed, failedHints };
}

function evaluateSingleRule(
  rule: HtmlCheckRule,
  element: Element | null
): boolean {
  switch (rule.kind) {
    case 'element-exists':
      return element !== null;
    case 'text-equals':
      // 要素が無ければ即失敗。textContent は改行・空白もそのまま入るため厳格比較。
      return element !== null && (element.textContent ?? '') === rule.value;
    case 'text-includes':
      return (
        element !== null && (element.textContent ?? '').includes(rule.value)
      );
  }
}
