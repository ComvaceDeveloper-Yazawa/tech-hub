import { getReferenceArticles } from '@/presentation/actions/curriculum/getReferenceArticles';
import { GearFab } from '@/components/features/curriculum/GearFab';

export default async function CurriculumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles = await getReferenceArticles();

  return (
    <>
      {children}
      <GearFab articles={articles} />
    </>
  );
}
