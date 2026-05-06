/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';

import { evaluateHtmlRules, type HtmlCheckRule } from '@/lib/htmlChecker';

/**
 * HTML 文字列から Document オブジェクトを生成するヘルパー。
 * jsdom 環境を前提とする（vitest のデフォルト環境）。
 */
function parseHtml(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('evaluateHtmlRules', () => {
  describe('element-exists', () => {
    it('対象セレクタの要素が存在するとき、合格する', () => {
      // Arrange
      const doc = parseHtml('<html><body><h1>Hello</h1></body></html>');
      const rules: HtmlCheckRule[] = [
        { kind: 'element-exists', selector: 'h1' },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(true);
      expect(result.failedHints).toEqual([]);
    });

    it('対象セレクタの要素が存在しないとき、失敗する', () => {
      // Arrange
      const doc = parseHtml('<html><body><p>Hello</p></body></html>');
      const rules: HtmlCheckRule[] = [
        {
          kind: 'element-exists',
          selector: 'h1',
          failureHint: 'h1 要素が見つかりません',
        },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual(['h1 要素が見つかりません']);
    });

    it('failureHint が未指定で失敗するとき、failedHints は空のまま passed=false', () => {
      // Arrange — 失敗ヒントが無いケースは既存 evaluateRules の挙動に揃える
      const doc = parseHtml('<html><body></body></html>');
      const rules: HtmlCheckRule[] = [
        { kind: 'element-exists', selector: 'h1' },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual([]);
    });
  });

  describe('text-equals', () => {
    it('対象要素のテキストが指定値と完全一致のとき、合格する', () => {
      // Arrange
      const doc = parseHtml('<html><body><h1>こんにちは</h1></body></html>');
      const rules: HtmlCheckRule[] = [
        { kind: 'text-equals', selector: 'h1', value: 'こんにちは' },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(true);
      expect(result.failedHints).toEqual([]);
    });

    it('対象要素のテキストの前後に空白があるとき、失敗する', () => {
      // Arrange — 厳格一致。空白は失敗扱いにする
      const doc = parseHtml(
        '<html><body><h1>  こんにちは  </h1></body></html>'
      );
      const rules: HtmlCheckRule[] = [
        {
          kind: 'text-equals',
          selector: 'h1',
          value: 'こんにちは',
          failureHint:
            'h1 の中身は「こんにちは」だけにしましょう（前後の空白も不要です）',
        },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual([
        'h1 の中身は「こんにちは」だけにしましょう（前後の空白も不要です）',
      ]);
    });

    it('対象要素のテキストが指定値と異なるとき、失敗する', () => {
      // Arrange
      const doc = parseHtml('<html><body><h1>こんばんは</h1></body></html>');
      const rules: HtmlCheckRule[] = [
        {
          kind: 'text-equals',
          selector: 'h1',
          value: 'こんにちは',
          failureHint: 'h1 の中身を「こんにちは」にしましょう',
        },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual([
        'h1 の中身を「こんにちは」にしましょう',
      ]);
    });

    it('対象要素が存在しないとき、text-equals は失敗する', () => {
      // Arrange
      const doc = parseHtml('<html><body></body></html>');
      const rules: HtmlCheckRule[] = [
        {
          kind: 'text-equals',
          selector: 'h1',
          value: 'こんにちは',
          failureHint: 'h1 が見つかりません',
        },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual(['h1 が見つかりません']);
    });
  });

  describe('text-includes', () => {
    it('対象要素のテキストに指定値が含まれるとき、合格する', () => {
      // Arrange
      const doc = parseHtml(
        '<html><body><p>今日はいい天気ですね</p></body></html>'
      );
      const rules: HtmlCheckRule[] = [
        { kind: 'text-includes', selector: 'p', value: 'いい天気' },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(true);
    });

    it('対象要素のテキストに指定値が含まれないとき、失敗する', () => {
      // Arrange
      const doc = parseHtml('<html><body><p>こんにちは</p></body></html>');
      const rules: HtmlCheckRule[] = [
        {
          kind: 'text-includes',
          selector: 'p',
          value: '天気',
          failureHint: 'p に「天気」という単語を含めましょう',
        },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual([
        'p に「天気」という単語を含めましょう',
      ]);
    });
  });

  describe('複数ルールの評価', () => {
    it('全ルールが合格のとき、passed=true で failedHints は空', () => {
      // Arrange
      const doc = parseHtml(
        '<html><body><h1>こんにちは</h1><p>今日の記事</p></body></html>'
      );
      const rules: HtmlCheckRule[] = [
        { kind: 'element-exists', selector: 'h1' },
        { kind: 'text-equals', selector: 'h1', value: 'こんにちは' },
        { kind: 'text-includes', selector: 'p', value: '記事' },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(true);
      expect(result.failedHints).toEqual([]);
    });

    it('複数ルールの一部が失敗のとき、passed=false で失敗分だけヒントが入る', () => {
      // Arrange
      const doc = parseHtml('<html><body><h1>こんばんは</h1></body></html>');
      const rules: HtmlCheckRule[] = [
        {
          kind: 'element-exists',
          selector: 'h1',
          failureHint: 'h1 が必要',
        },
        {
          kind: 'text-equals',
          selector: 'h1',
          value: 'こんにちは',
          failureHint: 'h1 の中身を「こんにちは」にしましょう',
        },
      ];

      // Act
      const result = evaluateHtmlRules(doc, rules);

      // Assert
      expect(result.passed).toBe(false);
      expect(result.failedHints).toEqual([
        'h1 の中身を「こんにちは」にしましょう',
      ]);
    });

    it('ルール配列が空のとき、passed=true で failedHints は空', () => {
      // Arrange
      const doc = parseHtml('<html><body></body></html>');

      // Act
      const result = evaluateHtmlRules(doc, []);

      // Assert
      expect(result.passed).toBe(true);
      expect(result.failedHints).toEqual([]);
    });
  });
});
