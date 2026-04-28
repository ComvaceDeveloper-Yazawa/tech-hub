-- サンプルカリキュラム: 5, 10, 15 ステージ

-- ========================================
-- カリキュラム2: バックエンド基礎 (5ステージ)
-- ========================================
INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'backend',
  'バックエンド基礎',
  'Node.js、Express、データベースの基礎を学ぶカリキュラムです。',
  2,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'backend'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  ((SELECT id FROM curriculum), 1, 'Node.js入門', 'Node.jsの基本とnpmの使い方を学びます'),
  ((SELECT id FROM curriculum), 2, 'Express基礎', 'Expressフレームワークでサーバーを構築します'),
  ((SELECT id FROM curriculum), 3, 'REST API設計', 'RESTful APIの設計原則を学びます'),
  ((SELECT id FROM curriculum), 4, 'DB基礎', 'PostgreSQLの基本操作を学びます'),
  ((SELECT id FROM curriculum), 5, 'CRUD実装', 'データベースと連携したCRUD APIを実装します')
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- ========================================
-- カリキュラム3: フルスタック開発 (10ステージ)
-- ========================================
INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'fullstack',
  'フルスタック開発',
  'フロントからバックエンドまで一気通貫で学ぶカリキュラムです。',
  3,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'fullstack'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  ((SELECT id FROM curriculum), 1, '環境構築', '開発環境のセットアップを行います'),
  ((SELECT id FROM curriculum), 2, 'HTML/CSS復習', 'HTML/CSSの基礎を復習します'),
  ((SELECT id FROM curriculum), 3, 'React入門', 'Reactの基本概念を学びます'),
  ((SELECT id FROM curriculum), 4, 'コンポーネント設計', 'コンポーネント分割の考え方を学びます'),
  ((SELECT id FROM curriculum), 5, '状態管理', 'useStateとuseEffectを使いこなします'),
  ((SELECT id FROM curriculum), 6, 'API連携', 'フロントからAPIを呼び出す方法を学びます'),
  ((SELECT id FROM curriculum), 7, 'Next.js基礎', 'Next.jsのApp Routerを学びます'),
  ((SELECT id FROM curriculum), 8, '認証実装', 'Supabase Authで認証を実装します'),
  ((SELECT id FROM curriculum), 9, 'デプロイ', 'Vercelへのデプロイ方法を学びます'),
  ((SELECT id FROM curriculum), 10, 'ポートフォリオ', 'オリジナルアプリを作成します')
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- ========================================
-- カリキュラム4: エンジニア実践 (15ステージ)
-- ========================================
INSERT INTO public.curriculums (slug, title, description, sort_order, is_published)
VALUES (
  'engineer-practice',
  'エンジニア実践',
  'チーム開発からアーキテクチャまで実践的なスキルを身につけるカリキュラムです。',
  4,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = now();

WITH curriculum AS (
  SELECT id FROM public.curriculums WHERE slug = 'engineer-practice'
)
INSERT INTO public.stages (curriculum_id, stage_number, title, description)
VALUES
  ((SELECT id FROM curriculum), 1, 'Git基礎', 'Gitの基本操作とブランチ戦略を学びます'),
  ((SELECT id FROM curriculum), 2, 'チーム開発', 'プルリクエストとコードレビューの作法を学びます'),
  ((SELECT id FROM curriculum), 3, 'テスト入門', 'ユニットテストの書き方を学びます'),
  ((SELECT id FROM curriculum), 4, 'CI/CD', 'GitHub Actionsで自動テスト・デプロイを構築します'),
  ((SELECT id FROM curriculum), 5, 'TypeScript', 'TypeScriptの型システムを深く学びます'),
  ((SELECT id FROM curriculum), 6, 'DB設計', 'リレーショナルDBの設計原則を学びます'),
  ((SELECT id FROM curriculum), 7, 'API設計', 'RESTとGraphQLの設計パターンを学びます'),
  ((SELECT id FROM curriculum), 8, 'セキュリティ', 'Webアプリのセキュリティ対策を学びます'),
  ((SELECT id FROM curriculum), 9, 'パフォーマンス', 'フロントエンドの最適化手法を学びます'),
  ((SELECT id FROM curriculum), 10, 'アーキテクチャ', 'クリーンアーキテクチャの基礎を学びます'),
  ((SELECT id FROM curriculum), 11, 'DDD入門', 'ドメイン駆動設計の基本概念を学びます'),
  ((SELECT id FROM curriculum), 12, 'インフラ基礎', 'Docker/コンテナの基礎を学びます'),
  ((SELECT id FROM curriculum), 13, 'モニタリング', 'ログ・メトリクス・アラートの設計を学びます'),
  ((SELECT id FROM curriculum), 14, 'チーム設計', 'アジャイル開発とスクラムを学びます'),
  ((SELECT id FROM curriculum), 15, '卒業制作', 'チームでプロダクトを開発します')
ON CONFLICT (curriculum_id, stage_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();
