import Link from 'next/link';
import { headers } from 'next/headers';
import { FileText, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { href: '/admin/articles', label: '記事一覧', icon: FileText },
  { href: '/admin/articles/new', label: '新規作成', icon: PlusCircle },
] as const;

export async function AdminSidebar() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  return (
    <aside className="bg-muted/30 hidden w-64 shrink-0 border-r md:block">
      <nav className="flex flex-col gap-1 p-4" aria-label="管理ナビゲーション">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin/articles'
              ? pathname === '/admin/articles'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
