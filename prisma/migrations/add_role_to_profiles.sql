-- profiles テーブルに role カラムを追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'employee';

-- ロール値の制約 (既存の場合はスキップ)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_role_check'
      AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('admin', 'employee'));
  END IF;
END;
$$;

-- 管理者一覧・ロール検索用インデックス
CREATE INDEX IF NOT EXISTS profiles_tenant_role_idx
  ON profiles (tenant_id, role);

-- 既存ユーザーを全員 admin に昇格
UPDATE profiles SET role = 'admin';
