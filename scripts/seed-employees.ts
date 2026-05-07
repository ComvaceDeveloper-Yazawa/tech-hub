/**
 * 社員ユーザー 3 名を Supabase Auth に作成し、profiles テーブルに employee として登録するスクリプト。
 *
 * 前提条件:
 *   - .env に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が設定されていること
 *   - prisma/migrations/add_role_to_profiles.sql が適用済みであること
 *
 * 実行方法:
 *   npx tsx scripts/seed-employees.ts
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

// ---- 設定 ----------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env に設定してください'
  );
  process.exit(1);
}

/** 追加する社員の情報。メールアドレスとパスワードを変更してください。 */
const EMPLOYEES = [
  {
    email: 'employee1@example.com',
    password: 'ChangeMe1!',
    displayName: '社員 一郎',
  },
  {
    email: 'employee2@example.com',
    password: 'ChangeMe2!',
    displayName: '社員 二郎',
  },
  {
    email: 'employee3@example.com',
    password: 'ChangeMe3!',
    displayName: '社員 三郎',
  },
] as const;

const PERSONAL_TENANT_ID = '00000000000000000000000000';

// ---- Supabase UUID → ULID 変換 -------------------------------------------

const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function uuidToUlid(uuid: string): string {
  const hex = uuid.replace(/-/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }
  bits = bits.padStart(130, '0');
  let result = '';
  for (let i = 0; i < 130; i += 5) {
    const index = parseInt(bits.substring(i, i + 5), 2);
    result += CROCKFORD_ALPHABET[index]!;
  }
  return result;
}

// ---- メイン処理 -----------------------------------------------------------

async function main() {
  const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const prisma = new PrismaClient();

  try {
    for (const employee of EMPLOYEES) {
      console.log(`\n[${employee.email}] 作成中...`);

      // 1. Supabase Auth にユーザーを作成
      const { data, error } = await supabase.auth.admin.createUser({
        email: employee.email,
        password: employee.password,
        email_confirm: true, // メール確認をスキップ
      });

      if (error) {
        if (error.message.includes('already been registered')) {
          console.log(`  スキップ: ${employee.email} は既に登録済みです`);
          continue;
        }
        throw new Error(`Auth ユーザー作成失敗: ${error.message}`);
      }

      const authUser = data.user;
      if (!authUser) throw new Error('ユーザーデータが取得できませんでした');

      const userId = uuidToUlid(authUser.id);
      console.log(`  Auth ユーザー作成完了: UUID=${authUser.id}`);
      console.log(`  ULID (userId): ${userId}`);

      // 2. profiles テーブルに employee として登録
      await prisma.profile.upsert({
        where: { userId },
        update: {
          displayName: employee.displayName,
          // role は既存レコードがある場合は変更しない
        },
        create: {
          id: ulid(),
          userId,
          tenantId: PERSONAL_TENANT_ID,
          displayName: employee.displayName,
          // role カラムのデフォルト値 'employee' が適用される
        },
      });

      console.log(
        `  profile 登録完了: displayName="${employee.displayName}", role=employee`
      );
    }

    console.log('\n社員ユーザーの作成が完了しました。');
    console.log(
      '初回ログイン後、マイページからパスワードを変更するよう案内してください。'
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
