import { getSkillSheetById } from '@/presentation/actions/skillSheets';
import { NewSkillSheetClient } from './NewSkillSheetClient';

interface NewSkillSheetPageProps {
  searchParams: Promise<{ copyFrom?: string }>;
}

export default async function NewSkillSheetPage({
  searchParams,
}: NewSkillSheetPageProps) {
  const { copyFrom } = await searchParams;

  const source = copyFrom ? await getSkillSheetById(copyFrom) : null;

  return <NewSkillSheetClient source={source} />;
}
