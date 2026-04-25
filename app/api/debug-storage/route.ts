import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TenantId } from '@/contexts/shared-kernel/TenantId';

export async function GET() {
  try {
    const supabase = await createClient();
    const tenantId = TenantId.personal().toString();

    // セッション確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ファイル一覧
    const { data: files, error: filesError } = await supabase.storage
      .from('article-images')
      .list(tenantId, { limit: 10 });

    // アップロードテスト
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(`${tenantId}/.test-write`, testContent, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (!uploadError) {
      await supabase.storage
        .from('article-images')
        .remove([`${tenantId}/.test-write`]);
    }

    return NextResponse.json({
      sessionUser: user?.email ?? null,
      files: files?.length ?? filesError?.message,
      uploadTest: uploadError ? `FAIL: ${uploadError.message}` : 'OK',
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
