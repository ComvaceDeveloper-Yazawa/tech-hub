'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileNavProps {
  isAuthenticated: boolean;
}

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="メニューを開く" />
          }
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>メニュー</SheetTitle>
          </SheetHeader>
          <nav
            className="flex flex-col gap-2 px-4"
            aria-label="モバイルナビゲーション"
          >
            <Link
              href="/articles"
              className="hover:bg-muted focus-visible:ring-ring rounded px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
              onClick={() => setOpen(false)}
            >
              記事一覧
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/curriculum"
                  className="hover:bg-muted focus-visible:ring-ring rounded px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                  onClick={() => setOpen(false)}
                >
                  カリキュラム
                </Link>
                <Link
                  href="/mypage"
                  className="hover:bg-muted focus-visible:ring-ring rounded px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                  onClick={() => setOpen(false)}
                >
                  マイページ
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="hover:bg-muted focus-visible:ring-ring rounded px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                onClick={() => setOpen(false)}
              >
                ログイン
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
