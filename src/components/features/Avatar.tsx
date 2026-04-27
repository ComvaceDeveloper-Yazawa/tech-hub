'use client';

import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars, bottts, lorelei, funEmoji } from '@dicebear/collection';
import type { AvatarConfig, AvatarStyle } from '@/types/avatar';
import { cn } from '@/lib/cn';

const styleMap: Record<AvatarStyle, Parameters<typeof createAvatar>[0]> = {
  avataaars,
  bottts,
  lorelei,
  funEmoji,
};

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export function Avatar({ config, size = 128, className }: AvatarProps) {
  const svg = useMemo(() => {
    const style = styleMap[config.style] ?? avataaars;
    const avatar = createAvatar(style, {
      seed: config.seed,
      backgroundColor: config.backgroundColor,
      size,
    });
    return avatar.toDataUri();
  }, [config.style, config.seed, config.backgroundColor, size]);

  return (
    <img
      src={svg}
      alt="アバター"
      width={size}
      height={size}
      className={cn('rounded-full', className)}
    />
  );
}
