'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReferenceDrawer } from '@/components/features/curriculum/ReferenceDrawer';
import type { ReferenceArticle } from '@/lib/curriculum/types';

interface GearFabProps {
  articles: ReferenceArticle[];
}

export function GearFab({ articles }: GearFabProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg"
        aria-label="リファレンスを開く"
        onClick={() => setOpen(true)}
      >
        <Settings className="size-5" />
      </Button>
      <ReferenceDrawer
        articles={articles}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
