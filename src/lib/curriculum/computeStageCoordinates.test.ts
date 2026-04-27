import { describe, it, expect } from 'vitest';

import { computeStageCoordinates } from '@/lib/curriculum/computeStageCoordinates';

describe('computeStageCoordinates', () => {
  it('ステージが0個のとき、空配列を返す', () => {
    // Arrange
    const stageCount = 0;
    const svgWidth = 600;
    const svgHeight = 400;

    // Act
    const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

    // Assert
    expect(result).toEqual([]);
  });

  it('ステージが1個のとき、1つの座標を返す（境界内）', () => {
    // Arrange
    const stageCount = 1;
    const svgWidth = 600;
    const svgHeight = 400;

    // Act
    const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]?.x).toBeGreaterThanOrEqual(0);
    expect(result[0]?.x).toBeLessThanOrEqual(svgWidth);
    expect(result[0]?.y).toBeGreaterThanOrEqual(0);
    expect(result[0]?.y).toBeLessThanOrEqual(svgHeight);
    expect(result[0]?.stageNumber).toBe(1);
  });

  it('ステージが3個のとき、3つの座標を返す（全て境界内、stageNumber が 1,2,3）', () => {
    // Arrange
    const stageCount = 3;
    const svgWidth = 600;
    const svgHeight = 400;

    // Act
    const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

    // Assert
    expect(result).toHaveLength(3);
    for (const coord of result) {
      expect(coord.x).toBeGreaterThanOrEqual(0);
      expect(coord.x).toBeLessThanOrEqual(svgWidth);
      expect(coord.y).toBeGreaterThanOrEqual(0);
      expect(coord.y).toBeLessThanOrEqual(svgHeight);
    }
    expect(result.map((c) => c.stageNumber)).toEqual([1, 2, 3]);
  });

  it('全座標が SVG 境界内に収まる（0 ≤ x ≤ width, 0 ≤ y ≤ height）', () => {
    // Arrange
    const stageCount = 10;
    const svgWidth = 800;
    const svgHeight = 600;

    // Act
    const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

    // Assert
    for (const coord of result) {
      expect(coord.x).toBeGreaterThanOrEqual(0);
      expect(coord.x).toBeLessThanOrEqual(svgWidth);
      expect(coord.y).toBeGreaterThanOrEqual(0);
      expect(coord.y).toBeLessThanOrEqual(svgHeight);
    }
  });

  it('stageNumber が連番（1から始まる）', () => {
    // Arrange
    const stageCount = 5;
    const svgWidth = 600;
    const svgHeight = 400;

    // Act
    const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

    // Assert
    const stageNumbers = result.map((c) => c.stageNumber);
    expect(stageNumbers).toEqual([1, 2, 3, 4, 5]);
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests (fast-check)
// Feature: curriculum-management, Property 3: ステージ座標の境界内配置
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------
import fc from 'fast-check';

describe('computeStageCoordinates — Property Tests', () => {
  it('ランダムなステージ数・SVGサイズのとき、全座標が SVG 境界内に収まる', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 200, max: 1200 }),
        fc.integer({ min: 200, max: 1200 }),
        (stageCount, svgWidth, svgHeight) => {
          // Arrange — provided by arbitrary

          // Act
          const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

          // Assert
          for (const coord of result) {
            expect(coord.x).toBeGreaterThanOrEqual(0);
            expect(coord.x).toBeLessThanOrEqual(svgWidth);
            expect(coord.y).toBeGreaterThanOrEqual(0);
            expect(coord.y).toBeLessThanOrEqual(svgHeight);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('ランダムなステージ数のとき、座標数がステージ数と一致する', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 200, max: 1200 }),
        fc.integer({ min: 200, max: 1200 }),
        (stageCount, svgWidth, svgHeight) => {
          // Arrange — provided by arbitrary

          // Act
          const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

          // Assert
          expect(result).toHaveLength(stageCount);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('ランダムなステージ数のとき、stageNumber が 1 から始まる連番である', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 200, max: 1200 }),
        fc.integer({ min: 200, max: 1200 }),
        (stageCount, svgWidth, svgHeight) => {
          // Arrange
          const expected = Array.from({ length: stageCount }, (_, i) => i + 1);

          // Act
          const result = computeStageCoordinates(stageCount, svgWidth, svgHeight);

          // Assert
          const stageNumbers = result.map((c) => c.stageNumber);
          expect(stageNumbers).toEqual(expected);
        },
      ),
      { numRuns: 100 },
    );
  });
});
