import type { StageCoordinate } from '@/lib/curriculum/types';

export function computeStageCoordinates(
  stageCount: number,
  svgWidth: number,
  svgHeight: number
): StageCoordinate[] {
  if (stageCount === 0) return [];

  const padding = 80;
  const usableWidth = svgWidth - padding * 2;
  const usableHeight = svgHeight - padding * 2;

  const cols = 3;
  const rows = Math.ceil(stageCount / cols);
  const rowHeight = rows > 1 ? usableHeight / (rows - 1) : 0;

  return Array.from({ length: stageCount }, (_, i) => {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const isEvenRow = row % 2 === 0;

    const colPosition = isEvenRow ? colInRow : cols - 1 - colInRow;
    const x =
      padding +
      (cols > 1 ? (colPosition / (cols - 1)) * usableWidth : usableWidth / 2);
    const y = padding + row * rowHeight;

    return { x, y, stageNumber: i + 1 };
  });
}
