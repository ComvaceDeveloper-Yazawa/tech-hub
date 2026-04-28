import type { StageCoordinate } from '@/lib/curriculum/types';

/**
 * ツムツムランド風の蛇行パスでステージ座標を計算する。
 * 下から上へジグザグに配置し、ゲームマップ感を出す。
 * ステージ数に応じてSVG高さも返す。
 */
export interface StageLayout {
  coords: StageCoordinate[];
  svgWidth: number;
  svgHeight: number;
}

export function computeStageLayout(
  stageCount: number,
  svgWidth: number = 600
): StageLayout {
  if (stageCount === 0) return { coords: [], svgWidth, svgHeight: 400 };

  const paddingX = 90;
  const paddingTop = 80;
  const paddingBottom = 80;
  const rowSpacing = 100; // 各ステージ間の縦間隔

  const svgHeight = paddingTop + paddingBottom + (stageCount - 1) * rowSpacing;
  const centerX = svgWidth / 2;
  const amplitude = (svgWidth - paddingX * 2) / 2;

  const coords = Array.from({ length: stageCount }, (_, i) => {
    // 下から上へ
    const y = svgHeight - paddingBottom - i * rowSpacing;
    // 蛇行: sin カーブで左右に振る
    const offsetX = Math.sin((i * Math.PI) / 2) * amplitude * 0.6;
    const x = centerX + offsetX;

    return { x, y, stageNumber: i + 1 };
  });

  return { coords, svgWidth, svgHeight };
}

/**
 * @deprecated computeStageLayout を使用してください
 */
export function computeStageCoordinates(
  stageCount: number,
  svgWidth: number,
  _svgHeight: number
): StageCoordinate[] {
  return computeStageLayout(stageCount, svgWidth).coords;
}
