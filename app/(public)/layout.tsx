import { Header } from '@/components/features/Header';
import { Footer } from '@/components/features/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="geo-bg grid-pattern flex min-h-screen flex-col">
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
