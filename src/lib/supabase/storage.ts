import { createClient } from '@supabase/supabase-js';

// Storage操作はservice roleキーを使用（RLSをバイパス）
// 認証チェックはServer Action側で別途行う
export function createStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
