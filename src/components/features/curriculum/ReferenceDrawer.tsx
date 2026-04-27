'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ReferenceArticleModal } from '@/components/features/curriculum/ReferenceArticleModal';
import type { ReferenceArticle } from '@/lib/curriculum/types';

interface ReferenceDrawerProps {
  articles: ReferenceArticle[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferenceDrawer({
  articles,
  open,
  onOpenChange,
}: ReferenceDrawerProps) {
  const [selectedArticle, setSelectedArticle] =
    useState<ReferenceArticle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleArticleClick = (article: ReferenceArticle) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>リファレンス</SheetTitle>
          </SheetHeader>
          <ul className="flex flex-col gap-1 px-4 pb-4">
            {articles.map((article) => (
              <li key={article.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  onClick={() => handleArticleClick(article)}
                >
                  <span className="text-lg">{article.icon}</span>
                  <span>{article.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
      <ReferenceArticleModal
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
