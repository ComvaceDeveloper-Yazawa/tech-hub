'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function completeStage(
  stageId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'ログインが必要です' };
  }

  const { error } = await supabase.from('user_stage_progress').upsert(
    {
      user_id: user.id,
      stage_id: stageId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,stage_id' }
  );

  if (error) {
    return { success: false, error: 'ステージの完了に失敗しました' };
  }

  revalidatePath('/curriculum');
  return { success: true };
}
