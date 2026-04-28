/**
 * ステージ配置座標。
 * 座標は画像の幅・高さに対するパーセンテージ (0-100) で指定。
 * 道はSVGで描画するため、背景画像は風景のみでOK。
 * ノード間はベジェ曲線で自動接続される。
 */

export type StagePosition = {
  /** X座標 (% of width, 0=左端, 100=右端) */
  x: number;
  /** Y座標 (% of height, 0=上端, 100=下端) */
  y: number;
};

/**
 * ショートマップ (3〜5ステージ) の座標。
 * 道の蛇行に合わせて配置。
 */
export const SHORT_MAP_POSITIONS: StagePosition[] = [
  { x: 50, y: 88 },
  { x: 58, y: 70 },
  { x: 40, y: 52 },
  { x: 55, y: 34 },
  { x: 45, y: 16 },
];

/**
 * ミディアムマップ (10ステージ) の座標。
 * 画像の道のS字カーブに合わせて調整。
 */
export const MEDIUM_MAP_POSITIONS: StagePosition[] = [
  { x: 50, y: 93 },
  { x: 60, y: 84 },
  { x: 40, y: 75 },
  { x: 57, y: 66 },
  { x: 38, y: 57 },
  { x: 55, y: 48 },
  { x: 40, y: 39 },
  { x: 57, y: 30 },
  { x: 45, y: 21 },
  { x: 50, y: 11 },
];

/**
 * ロングマップ (15ステージ) の座標。
 */
export const LONG_MAP_POSITIONS: StagePosition[] = [
  { x: 50, y: 95 },
  { x: 60, y: 89 },
  { x: 38, y: 83 },
  { x: 57, y: 77 },
  { x: 38, y: 71 },
  { x: 57, y: 65 },
  { x: 38, y: 59 },
  { x: 57, y: 53 },
  { x: 38, y: 47 },
  { x: 57, y: 41 },
  { x: 38, y: 35 },
  { x: 55, y: 29 },
  { x: 42, y: 23 },
  { x: 55, y: 16 },
  { x: 48, y: 8 },
];

/**
 * ステージ数に応じて適切な座標リストと背景画像を返す。
 * 背景画像は風景のみ（道はSVGで描画）。
 */
export function getMapConfig(stageCount: number): {
  positions: StagePosition[];
  backgroundImage: string;
} {
  if (stageCount <= 5) {
    return {
      positions: SHORT_MAP_POSITIONS.slice(0, stageCount),
      backgroundImage: '/map-short.png',
    };
  }
  if (stageCount <= 10) {
    return {
      positions: MEDIUM_MAP_POSITIONS.slice(0, stageCount),
      backgroundImage: '/map-short.png',
    };
  }
  return {
    positions: LONG_MAP_POSITIONS.slice(0, stageCount),
    backgroundImage: '/map-short.png',
  };
}
