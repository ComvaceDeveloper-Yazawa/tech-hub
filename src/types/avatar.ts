export type AvatarStyle = 'avataaars' | 'bottts' | 'lorelei' | 'funEmoji';

export type AvatarConfig = {
  style: AvatarStyle;
  seed: string;
  backgroundColor?: string[];
};

export const AVATAR_STYLES: { id: AvatarStyle; label: string }[] = [
  { id: 'avataaars', label: 'アバター' },
  { id: 'bottts', label: 'ロボット' },
  { id: 'lorelei', label: 'ローレライ' },
  { id: 'funEmoji', label: '絵文字' },
];

export const AVATAR_COLORS = [
  { value: 'b6e3f4', label: 'ライトブルー' },
  { value: 'c0aede', label: 'ラベンダー' },
  { value: 'd1d4f9', label: 'ペリウィンクル' },
  { value: 'ffd5dc', label: 'ピンク' },
  { value: 'ffdfbf', label: 'ピーチ' },
];
