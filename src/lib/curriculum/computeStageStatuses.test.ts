import { describe, it, expect } from 'vitest';

import {
  computeStageStatuses,
  findCurrentStageNumber,
} from '@/lib/curriculum/computeStageStatuses';
import type { Stage, UserStageProgress } from '@/lib/curriculum/types';

// ヘルパー: テスト用ステージを生成
function createStage(overrides: Partial<Stage> & { id: string; stage_number: number }): Stage {
  return {
    curriculum_id: 'curriculum-1',
    title: `ステージ${overrides.stage_number}`,
    description: `ステージ${overrides.stage_number}の説明`,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// ヘルパー: テスト用進捗レコードを生成
function createProgress(stageId: string): UserStageProgress {
  return {
    id: `progress-${stageId}`,
    user_id: 'user-1',
    stage_id: stageId,
    status: 'completed',
    completed_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };
}

describe('computeStageStatuses', () => {
  it('全ステージが未完了のとき、最初のステージが unlocked で残りが locked', () => {
    // Arrange
    const stages: Stage[] = [
      createStage({ id: 'stage-1', stage_number: 1 }),
      createStage({ id: 'stage-2', stage_number: 2 }),
      createStage({ id: 'stage-3', stage_number: 3 }),
    ];
    const progress: UserStageProgress[] = [];

    // Act
    const result = computeStageStatuses(stages, progress);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]?.status).toBe('unlocked');
    expect(result[1]?.status).toBe('locked');
    expect(result[2]?.status).toBe('locked');
  });

  it('最初のステージのみ完了のとき、2番目が unlocked で3番目が locked', () => {
    // Arrange
    const stages: Stage[] = [
      createStage({ id: 'stage-1', stage_number: 1 }),
      createStage({ id: 'stage-2', stage_number: 2 }),
      createStage({ id: 'stage-3', stage_number: 3 }),
    ];
    const progress: UserStageProgress[] = [createProgress('stage-1')];

    // Act
    const result = computeStageStatuses(stages, progress);

    // Assert
    expect(result[0]?.status).toBe('completed');
    expect(result[1]?.status).toBe('unlocked');
    expect(result[2]?.status).toBe('locked');
  });

  it('全ステージが完了のとき、すべて completed', () => {
    // Arrange
    const stages: Stage[] = [
      createStage({ id: 'stage-1', stage_number: 1 }),
      createStage({ id: 'stage-2', stage_number: 2 }),
      createStage({ id: 'stage-3', stage_number: 3 }),
    ];
    const progress: UserStageProgress[] = [
      createProgress('stage-1'),
      createProgress('stage-2'),
      createProgress('stage-3'),
    ];

    // Act
    const result = computeStageStatuses(stages, progress);

    // Assert
    expect(result[0]?.status).toBe('completed');
    expect(result[1]?.status).toBe('completed');
    expect(result[2]?.status).toBe('completed');
  });

  it('ステージが1個のとき、未完了なら unlocked', () => {
    // Arrange
    const stages: Stage[] = [createStage({ id: 'stage-1', stage_number: 1 })];
    const progress: UserStageProgress[] = [];

    // Act
    const result = computeStageStatuses(stages, progress);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('unlocked');
  });

  it('ステージが0個のとき、空配列を返す', () => {
    // Arrange
    const stages: Stage[] = [];
    const progress: UserStageProgress[] = [];

    // Act
    const result = computeStageStatuses(stages, progress);

    // Assert
    expect(result).toHaveLength(0);
  });

  it('stage_number が未ソートのとき、ソートして正しいステータスを計算する', () => {
    // Arrange
    const stages: Stage[] = [
      createStage({ id: 'stage-3', stage_number: 3 }),
      createStage({ id: 'stage-1', stage_number: 1 }),
      createStage({ id: 'stage-2', stage_number: 2 }),
    ];
    const progress: UserStageProgress[] = [createProgress('stage-1')];

    // Act
    const result = computeStageStatuses(stages, progress);

    // Assert
    expect(result[0]?.stage_number).toBe(1);
    expect(result[1]?.stage_number).toBe(2);
    expect(result[2]?.stage_number).toBe(3);
    expect(result[0]?.status).toBe('completed');
    expect(result[1]?.status).toBe('unlocked');
    expect(result[2]?.status).toBe('locked');
  });
});

describe('findCurrentStageNumber', () => {
  it('unlocked ステージがあるとき、その stage_number を返す', () => {
    // Arrange
    const stages: Stage[] = [
      createStage({ id: 'stage-1', stage_number: 1 }),
      createStage({ id: 'stage-2', stage_number: 2 }),
      createStage({ id: 'stage-3', stage_number: 3 }),
    ];
    const progress: UserStageProgress[] = [createProgress('stage-1')];
    const stagesWithStatus = computeStageStatuses(stages, progress);

    // Act
    const result = findCurrentStageNumber(stagesWithStatus);

    // Assert
    expect(result).toBe(2);
  });

  it('全完了のとき、null を返す', () => {
    // Arrange
    const stages: Stage[] = [
      createStage({ id: 'stage-1', stage_number: 1 }),
      createStage({ id: 'stage-2', stage_number: 2 }),
    ];
    const progress: UserStageProgress[] = [
      createProgress('stage-1'),
      createProgress('stage-2'),
    ];
    const stagesWithStatus = computeStageStatuses(stages, progress);

    // Act
    const result = findCurrentStageNumber(stagesWithStatus);

    // Assert
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests (fast-check)
// Feature: curriculum-management, Property 1: ステージステータス計算の正確性
// Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
// ---------------------------------------------------------------------------
import fc from 'fast-check';

/**
 * ランダムなステージ配列と完了パターンを生成するヘルパー。
 * stageCount: 1-20、completedIndices は 0-based のソート済みインデックス配列。
 */
function stagesArbitrary() {
  return fc
    .integer({ min: 1, max: 20 })
    .chain((stageCount) => {
      // 完了済みインデックスのサブセットを生成 (0-based)
      const completedIndicesArb = fc.subarray(
        Array.from({ length: stageCount }, (_, i) => i),
        { minLength: 0, maxLength: stageCount },
      );

      return completedIndicesArb.map((completedIndices) => {
        // stage_number をシャッフルして未ソート入力をシミュレート
        const stageNumbers = Array.from({ length: stageCount }, (_, i) => i + 1);

        const stages: Stage[] = stageNumbers.map((n) =>
          createStage({ id: `stage-${n}`, stage_number: n }),
        );

        // completedIndices は 0-based → stage_number = index + 1
        const progressRecords: UserStageProgress[] = completedIndices.map((idx) =>
          createProgress(`stage-${idx + 1}`),
        );

        return { stages, progressRecords, stageCount, completedIndices };
      });
    });
}

/** stage_number 昇順にソートされた完了フラグ配列を返す */
function completedFlags(
  stageCount: number,
  completedIndices: number[],
): boolean[] {
  const flags = Array.from({ length: stageCount }, () => false);
  for (const idx of completedIndices) {
    flags[idx] = true;
  }
  return flags;
}

describe('computeStageStatuses — Property Tests', () => {
  it('出力が常に stage_number 昇順にソートされるとき、ソート順を維持する', () => {
    fc.assert(
      fc.property(stagesArbitrary(), ({ stages, progressRecords }) => {
        // Arrange — provided by arbitrary

        // Act
        const result = computeStageStatuses(stages, progressRecords);

        // Assert
        for (let i = 1; i < result.length; i++) {
          const prev = result[i - 1]!;
          const curr = result[i]!;
          expect(curr.stage_number).toBeGreaterThan(prev.stage_number);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('完了済み進捗レコードがあるステージのとき、completed ステータスを返す', () => {
    fc.assert(
      fc.property(
        stagesArbitrary(),
        ({ stages, progressRecords, stageCount, completedIndices }) => {
          // Arrange
          const flags = completedFlags(stageCount, completedIndices);

          // Act
          const result = computeStageStatuses(stages, progressRecords);

          // Assert
          for (let i = 0; i < stageCount; i++) {
            if (flags[i]) {
              expect(result[i]?.status).toBe('completed');
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('最初のステージが未完了のとき、unlocked ステータスを返す', () => {
    fc.assert(
      fc.property(stagesArbitrary(), ({ stages, progressRecords, completedIndices }) => {
        // Arrange — first stage is index 0
        const firstCompleted = completedIndices.includes(0);

        // Act
        const result = computeStageStatuses(stages, progressRecords);

        // Assert
        if (!firstCompleted) {
          expect(result[0]?.status).toBe('unlocked');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('前のステージが completed かつ自身が未完了のとき、unlocked ステータスを返す', () => {
    fc.assert(
      fc.property(
        stagesArbitrary(),
        ({ stages, progressRecords, stageCount, completedIndices }) => {
          // Arrange
          const flags = completedFlags(stageCount, completedIndices);

          // Act
          const result = computeStageStatuses(stages, progressRecords);

          // Assert
          for (let i = 1; i < stageCount; i++) {
            if (flags[i - 1] && !flags[i]) {
              expect(result[i]?.status).toBe('unlocked');
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('前のステージが completed でなく自身も未完了のとき、locked ステータスを返す', () => {
    fc.assert(
      fc.property(
        stagesArbitrary(),
        ({ stages, progressRecords, stageCount, completedIndices }) => {
          // Arrange
          const flags = completedFlags(stageCount, completedIndices);

          // Act
          const result = computeStageStatuses(stages, progressRecords);

          // Assert
          for (let i = 1; i < stageCount; i++) {
            if (!flags[i - 1] && !flags[i]) {
              expect(result[i]?.status).toBe('locked');
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('出力の長さが入力のステージ数と一致するとき、同じ長さを返す', () => {
    fc.assert(
      fc.property(stagesArbitrary(), ({ stages, progressRecords, stageCount }) => {
        // Arrange — provided by arbitrary

        // Act
        const result = computeStageStatuses(stages, progressRecords);

        // Assert
        expect(result).toHaveLength(stageCount);
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests (fast-check)
// Feature: curriculum-management, Property 2: 現在のステージ特定
// Validates: Requirements 4.6
// ---------------------------------------------------------------------------

describe('findCurrentStageNumber — Property Tests', () => {
  it('computeStageStatuses の出力に unlocked ステージがあるとき、最初の unlocked の stage_number を返す', () => {
    fc.assert(
      fc.property(stagesArbitrary(), ({ stages, progressRecords }) => {
        // Arrange
        const result = computeStageStatuses(stages, progressRecords);

        // Act
        const currentStageNumber = findCurrentStageNumber(result);

        // Assert
        const firstUnlocked = result.find(
          (s) => s.status === 'unlocked' || s.status === 'in_progress',
        );
        if (firstUnlocked) {
          expect(currentStageNumber).toBe(firstUnlocked.stage_number);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('全ステージが completed のとき、null を返す', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (stageCount) => {
          // Arrange — 全ステージを完了済みにする
          const stages: Stage[] = Array.from({ length: stageCount }, (_, i) =>
            createStage({ id: `stage-${i + 1}`, stage_number: i + 1 }),
          );
          const progressRecords = stages.map((s) => createProgress(s.id));
          const result = computeStageStatuses(stages, progressRecords);

          // Act
          const currentStageNumber = findCurrentStageNumber(result);

          // Assert
          expect(currentStageNumber).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('unlocked ステージが存在するとき、findCurrentStageNumber は非 null を返す', () => {
    fc.assert(
      fc.property(stagesArbitrary(), ({ stages, progressRecords }) => {
        // Arrange
        const result = computeStageStatuses(stages, progressRecords);
        const hasUnlockedOrInProgress = result.some(
          (s) => s.status === 'unlocked' || s.status === 'in_progress',
        );

        // Act
        const currentStageNumber = findCurrentStageNumber(result);

        // Assert
        if (hasUnlockedOrInProgress) {
          expect(currentStageNumber).not.toBeNull();
          const matchingStage = result.find(
            (s) => s.stage_number === currentStageNumber,
          );
          expect(
            matchingStage?.status === 'unlocked' || matchingStage?.status === 'in_progress',
          ).toBe(true);
        }
      }),
      { numRuns: 100 },
    );
  });
});
