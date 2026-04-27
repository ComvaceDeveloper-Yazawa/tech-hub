-- profiles テーブル作成
CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(26) PRIMARY KEY,
  user_id CHAR(26) NOT NULL UNIQUE,
  tenant_id CHAR(26) NOT NULL,
  avatar_config JSONB,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_tenant_user ON profiles (tenant_id, user_id);

-- RLS: 本人のみ更新可能
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));
