'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ReferenceArticle } from '@/lib/curriculum/types';

interface ReferenceArticleModalProps {
  article: ReferenceArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferenceArticleModal({
  article,
  open,
  onOpenChange,
}: ReferenceArticleModalProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {article.icon} {article.title}
          </DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </DialogContent>
    </Dialog>
  );
}
