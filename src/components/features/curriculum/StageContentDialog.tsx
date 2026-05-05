'use client';

import { useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            ステージ{stage.stage_number}: {stage.title}
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {stage.description}
          </ReactMarkdown>
        </div>
        <DialogFooter>
          {isCompleted ? (
            <Badge variant="secondary">クリア済み</Badge>
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
