# Supabase & Vercel セットアップ手順

## 1. Supabase セットアップ

### 1.1 プロジェクト作成

1. https://supabase.com にアクセスしてアカウント作成 (GitHub 連携が楽)
2. 「New Project」でプロジェクトを作成
   - Organization: 個人用を選択
   - Name: 任意 (例: `tech-hub`)
   - Database Password: 強力なパスワードを設定 (**必ずメモしておく**)
   - Region: **Northeast Asia (Tokyo)**
   - Plan: Free

### 1.2 接続情報の取得

プロジェクト作成後、以下の情報を取得する。

**DB 接続文字列** (Settings → Database → Connection string):

| 用途                 | 接続タイプ              | ポート | 環境変数       |
| -------------------- | ----------------------- | ------ | -------------- |
| Vercel Serverless 用 | Transaction (pgBouncer) | 6543   | `DATABASE_URL` |
| マイグレーション用   | Session                 | 5432   | `DIRECT_URL`   |

**API キー** (Settings → API):

| 項目             | 環境変数                        |
| ---------------- | ------------------------------- |
| Project URL      | `NEXT_PUBLIC_SUPABASE_URL`      |
| anon public キー | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

### 1.3 ローカル環境変数の設定

プロジェクトルートに `.env` を作成 (`.gitignore` に含まれているため Git にはコミットされない):

```bash
# pgBouncer 経由 (Vercel Serverless Functions 用)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# 直接接続 (マイグレーション用)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

`[project-ref]` と `[password]` は実際の値に置き換える。

### 1.4 DB 接続確認

```bash
npx prisma db push
```

エラーなく完了すれば接続成功。

---

## 2. Vercel セットアップ

### 2.1 GitHub リポジトリの準備

まだ GitHub にプッシュしていない場合:

```bash
git add .
git commit -m "chore: プロジェクト初期セットアップ"
git remote add origin https://github.com/[your-username]/[repo-name].git
git push -u origin main
```

### 2.2 Vercel プロジェクト作成

1. https://vercel.com にアクセスしてアカウント作成 (GitHub 連携)
2. 「Add New → Project」で GitHub リポジトリをインポート
3. 設定画面で確認:
   - Framework Preset: **Next.js** (自動検出されるはず)
   - Build Command: `prisma generate && next build` (`vercel.json` で設定済み)

### 2.3 環境変数の設定

Vercel Dashboard の「Settings → Environment Variables」に以下を追加:

| 変数名                          | 値                                      | 環境                             |
| ------------------------------- | --------------------------------------- | -------------------------------- |
| `DATABASE_URL`                  | Supabase の Transaction (pgBouncer) URI | Production, Preview, Development |
| `DIRECT_URL`                    | Supabase の Session URI                 | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase の Project URL                 | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase の anon public キー            | Production, Preview, Development |

### 2.4 デプロイ

「Deploy」をクリックしてデプロイを実行。

---

## 3. デプロイ後の確認

### 3.1 ヘルスチェック

デプロイ完了後、以下の URL にアクセス:

```
https://[your-app].vercel.app/api/health
```

### 3.2 期待するレスポンス

```json
{
  "status": "ok",
  "timestamp": "2026-04-25T12:00:00.000Z",
  "db": "connected"
}
```

### 3.3 トラブルシューティング

| 症状                           | 原因                            | 対処                                                                                          |
| ------------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------- |
| `db: "disconnected"`           | 環境変数が未設定または誤り      | Vercel Dashboard で環境変数を確認し、再デプロイ                                               |
| ビルドエラー `prisma generate` | `prisma` が dependencies にない | `package.json` の dependencies に `prisma` があることを確認                                   |
| 接続タイムアウト               | pgBouncer URI でない            | `DATABASE_URL` のポートが 6543 で `?pgbouncer=true&connection_limit=1` が付いていることを確認 |
| マイグレーションエラー         | Session URI でない              | `DIRECT_URL` のポートが 5432 であることを確認                                                 |

---

## 注意事項

- **Hobby プラン制限**: 商用利用不可、10秒タイムアウト、月間100GB帯域
- **Supabase Free プラン制限**: 500MB DB、1GB ストレージ、50,000 月間アクティブユーザー
- `.env` ファイルは絶対に Git にコミットしない (`.gitignore` に含まれていることを確認)
