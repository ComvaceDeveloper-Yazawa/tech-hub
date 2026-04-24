import { createClient } from '@/lib/supabase/server';
import { UserId } from '@/contexts/shared-kernel/UserId';

/**
 * Supabase Auth の UUID (128-bit) を ULID 互換の Crockford Base32 (26文字) に変換する。
 * UUID と ULID はどちらも 128-bit なので、可逆変換が可能。
 */
const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function uuidToUlid(uuid: string): string {
  const hex = uuid.replace(/-/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }

  // 128 bits → 26 Crockford Base32 characters (130 bits capacity, 2 bits padding)
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }

  // Pad to 130 bits (26 * 5)
  bits = bits.padStart(130, '0');

  let result = '';
  for (let i = 0; i < 130; i += 5) {
    const index = parseInt(bits.substring(i, i + 5), 2);
    result += CROCKFORD_ALPHABET[index]!;
  }

  return result;
}

/**
 * Server Action / Server Component から認証済みユーザーの UserId を取得する。
 * 未認証の場合は null を返す。
 */
export async function getAuthUserId(): Promise<UserId | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const ulidString = uuidToUlid(user.id);
  return UserId.fromString(ulidString);
}
