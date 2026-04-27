'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, PlusCircle, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { href: '/admin/articles', label: 'マイ記事管理', icon: FileText },
  { href: '/admin/articles/new', label: '新規作成', icon: PlusCircle },
  { href: '/admin/media', label: 'メディア', icon: ImageIcon },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-background hidden w-64 shrink-0 border-r md:block">
      <nav className="flex flex-col gap-1 p-4" aria-label="管理ナビゲーション">
        {NAV_ITEMS.map((item) => {
          let isActive = false;

          if (item.href === '/admin/articles/new') {
            isActive =
              pathname === '/admin/articles/new' ||
              (pathname.startsWith('/admin/articles/') &&
                !pathname.startsWith('/admin/articles/new'));
          } else if (item.href === '/admin/articles') {
            isActive = pathname === '/admin/articles';
          } else {
            isActive = pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'border-primary bg-accent text-accent-foreground border-l-4'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
