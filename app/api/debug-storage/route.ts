import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export async function GET() {
  try {
    const supabase = await createClient();
    const tenantId = TenantId.personal().toString();

    // バケット一覧
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    // tenantId パスで list
    const { data: files, error: filesError } = await supabase.storage
      .from('article-images')
      .list(tenantId, { limit: 10 });

    // ルートで list
    const { data: root, error: rootError } = await supabase.storage
      .from('article-images')
      .list('', { limit: 10 });

    return NextResponse.json({
      tenantId,
      buckets: buckets?.map((b) => b.name) ?? bucketsError?.message,
      files: files ?? filesError?.message,
      root: root ?? rootError?.message,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
