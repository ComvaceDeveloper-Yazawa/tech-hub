'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StageWithStatus } from '@/lib/curriculum/types';

interface StageContentDialogProps {
  stage: StageWithStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (stageId: string) => Promise<void>;
}

export function StageContentDialog({
  stage,
  open,
  onOpenChange,
  onComplete,
}: StageContentDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!stage) return null;

  const isCompleted = stage.status === 'completed';

  const handleComplete = () => {
    startTransition(async () => {
      try {
        await onComplete(stage.id);
        onOpenChange(false);
      } catch {
        toast.error('ステージの完了に失敗しました');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stage.title}</DialogTitle>
          <DialogDescription>{stage.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {isCompleted ? (
            <Badge variant="secondary">✅ クリア済み</Badge>
          ) : (
            <Button onClick={handleComplete} disabled={isPending}>
              {isPending ? '処理中...' : '完了する'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
