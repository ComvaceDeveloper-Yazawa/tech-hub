import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/cn';
import { Toaster } from 'sonner';
import { LoadingProvider } from '@/contexts/loading/LoadingContext';
import { RpgLoadingScreen } from '@/components/features/RpgLoadingScreen';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'YazawaBlog',
  description: 'Technical blog platform',
  icons: {
    icon: '/wolf-icon.jpeg',
    apple: '/wolf-icon.jpeg',
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
        <LoadingProvider>
          {children}
          <RpgLoadingScreen />
          <Toaster />
        </LoadingProvider>
      </body>
    </html>
  );
}
