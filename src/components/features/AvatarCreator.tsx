'use client';

import { useState, useTransition } from 'react';
import { Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/features/Avatar';
import { saveProfile } from '@/presentation/actions/avatar';
import { cn } from '@/lib/cn';
import {
  AVATAR_STYLES,
  AVATAR_COLORS,
  type AvatarConfig,
  type AvatarStyle,
} from '@/types/avatar';

interface AvatarCreatorProps {
  initialConfig: AvatarConfig;
  initialDisplayName: string;
}

function randomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function AvatarCreator({ initialConfig, initialDisplayName }: AvatarCreatorProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [style, setStyle] = useState<AvatarStyle>(initialConfig.style);
  const [seed, setSeed] = useState(initialConfig.seed);
  const [bgColor, setBgColor] = useState(initialConfig.backgroundColor?.[0] ?? '');
  const [isPending, startTransition] = useTransition();

  const config: AvatarConfig = {
    style,
    seed,
    ...(bgColor ? { backgroundColor: [bgColor] } : {}),
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveProfile({ displayName, avatarConfig: config });
        toast.success('プロフィールを保存しました');
      } catch {
        toast.error('プロフィールの保存に失敗しました');
      }
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        {/* プレビュー */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <Avatar config={config} size={160} className="shadow-lg" />
          <p className="text-muted-foreground text-xs">プレビュー</p>
        </div>

        {/* 設定 */}
        <div className="w-full space-y-6">
          {/* ユーザー名 */}
          <div className="space-y-2">
            <Label htmlFor="display-name">ユーザー名</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名を入力"
              maxLength={50}
            />
          </div>

          {/* スタイル選択 */}
          <div className="space-y-2">
            <Label>スタイル</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {AVATAR_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    'cursor-pointer rounded-lg border p-3 text-center text-sm font-medium transition-all',
                    style === s.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  )}
                  aria-pressed={style === s.id}
                  aria-label={`スタイル: ${s.label}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 顔をランダム変更 */}
          <div className="space-y-2">
            <Label>顔のバリエーション</Label>
            <p className="text-muted-foreground text-xs">
              ボタンを押すたびにランダムで見た目が変わります
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSeed(randomSeed())}
              aria-label="ランダムで変更"
            >
              <Shuffle className="size-4" aria-hidden="true" />
              ランダムで変更
            </Button>
          </div>

          {/* 背景色 */}
          <div className="space-y-2">
            <Label>背景色</Label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setBgColor('')}
                className={cn(
                  'flex size-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all',
                  bgColor === ''
                    ? 'border-primary scale-110'
                    : 'border-border hover:scale-105'
                )}
                aria-pressed={bgColor === ''}
                aria-label="背景色なし"
              >
                <span className="text-muted-foreground text-xs">なし</span>
              </button>
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setBgColor(c.value)}
                  className={cn(
                    'size-10 cursor-pointer rounded-full border-2 transition-all',
                    bgColor === c.value
                      ? 'border-primary scale-110'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: `#${c.value}` }}
                  aria-pressed={bgColor === c.value}
                  aria-label={`背景色: ${c.label}`}
                />
              ))}
            </div>
          </div>

          {/* 保存ボタン */}
          <Button onClick={handleSave} disabled={isPending} className="w-full sm:w-auto">
            {isPending ? '保存中...' : 'プロフィールを保存'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
