'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, ImageIcon, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { href: '/admin/users', label: 'ユーザー一覧', icon: Users },
  { href: '/admin/media', label: 'メディア', icon: ImageIcon },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-background hidden w-64 shrink-0 border-r md:block">
      <nav className="flex flex-col gap-1 p-4" aria-label="管理ナビゲーション">
        {NAV_ITEMS.map((item) => {
          let isActive = false;
          isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
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
