-- カリキュラム管理テーブル作成
-- Supabase クライアント直接利用（Prisma スキーマには追加しない）

-- curriculums テーブル
CREATE TABLE IF NOT EXISTS public.curriculums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(100) NOT NULL UNIQUE,
  title varchar(200) NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- stages テーブル
CREATE TABLE IF NOT EXISTS public.stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id uuid NOT NULL REFERENCES public.curriculums(id) ON DELETE CASCADE,
  stage_number int NOT NULL,
  title varchar(200) NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(curriculum_id, stage_number)
);

CREATE INDEX idx_stages_curriculum_id ON public.stages(curriculum_id);

-- user_stage_progress テーブル
CREATE TABLE IF NOT EXISTS public.user_stage_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  status varchar(20) NOT NULL DEFAULT 'completed',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, stage_id)
);

CREATE INDEX idx_user_stage_progress_user_id ON public.user_stage_progress(user_id);
CREATE INDEX idx_user_stage_progress_stage_id ON public.user_stage_progress(stage_id);

-- reference_articles テーブル
CREATE TABLE IF NOT EXISTS public.reference_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(100) NOT NULL UNIQUE,
  title varchar(200) NOT NULL,
  icon varchar(10) NOT NULL DEFAULT '📄',
  content text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS ポリシー
ALTER TABLE public.curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stage_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_articles ENABLE ROW LEVEL SECURITY;

-- curriculums: 認証ユーザーは公開カリキュラムを読み取り可能
CREATE POLICY "Authenticated users can read published curriculums"
  ON public.curriculums FOR SELECT
  TO authenticated
  USING (is_published = true);

-- stages: 認証ユーザーは読み取り可能
CREATE POLICY "Authenticated users can read stages"
  ON public.stages FOR SELECT
  TO authenticated
  USING (true);

-- user_stage_progress: 自分の進捗のみ読み書き可能
CREATE POLICY "Users can read own progress"
  ON public.user_stage_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON public.user_stage_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON public.user_stage_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- reference_articles: 認証ユーザーは読み取り可能
CREATE POLICY "Authenticated users can read reference articles"
  ON public.reference_articles FOR SELECT
  TO authenticated
  USING (true);
