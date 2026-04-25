import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/cn';
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'YazawaBlog',
  description: 'Technical blog platform',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={cn('dark font-sans', geist.variable)}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
