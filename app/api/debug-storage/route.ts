import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export async function GET() {
  try {
    const tenantId = TenantId.personal().toString();

    // anon キー（通常のサーバーアクションと同じ）
    const supabase = await createClient();
    const { data: anonFiles, error: anonError } = await supabase.storage
      .from('article-images')
      .list(tenantId, { limit: 10 });

    // セッション確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // service role キー
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: serviceFiles, error: serviceError } =
      await serviceClient.storage
        .from('article-images')
        .list(tenantId, { limit: 10 });

    return NextResponse.json({
      tenantId,
      sessionUser: user?.email ?? null,
      anonFiles: anonFiles ?? anonError?.message,
      serviceFiles: serviceFiles ?? serviceError?.message,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
