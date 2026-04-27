import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurriculums } from '@/presentation/actions/curriculum/getCurriculums';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';

export default async function CurriculumListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const curriculums = await getCurriculums();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">カリキュラム</h1>

      {curriculums.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          カリキュラムがありません
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {curriculums.map((curriculum) => (
            <Link
              key={curriculum.id}
              href={`/curriculum/${curriculum.slug}`}
              className="transition-opacity hover:opacity-80"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{curriculum.title}</CardTitle>
                  <CardDescription>{curriculum.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <span className="text-muted-foreground text-sm">
                    {curriculum.completed_stages}/{curriculum.total_stages}{' '}
                    ステージ完了
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
