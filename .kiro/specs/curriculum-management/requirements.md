# Requirements Document

## Introduction

カリキュラム管理機能（MVP）の要件定義。ユーザーがゲームスタイルのステージマップ上で学習カリキュラムを進行できる機能を提供する。MVP ではフロントエンドカリキュラム（3ステージ）のみを実装し、カリキュラム作成 UI は将来対応とする。

## Glossary

- **Curriculum_System**: カリキュラムの一覧表示、ステージマップ表示、進捗管理を行うシステム全体
- **Header**: サイト上部のナビゲーションバーコンポーネント（既存）
- **Curriculum_List_Page**: `/curriculum` に表示されるカリキュラム一覧ページ
- **Stage_Map_Page**: `/curriculum/[slug]` に表示されるステージマップページ
- **Stage_Map**: SVG ベースのステージマップ。ステージを円で表示し、線で接続する
- **Stage**: カリキュラム内の個別学習ステップ。stage_number で順序付けされる
- **Stage_Status**: ステージの状態。completed（完了）、in_progress（進行中）、unlocked（解放済み）、locked（未解放）の4種
- **Current_Stage**: 最初の in_progress または unlocked 状態のステージ
- **Avatar_Indicator**: Current_Stage の上に表示される DiceBear アバター画像（既存 Avatar コンポーネントを再利用）
- **Stage_Content_Dialog**: ステージクリック時に表示されるコンテンツダイアログ
- **Reference_Drawer**: 参考記事一覧を表示する左スライドインドロワー
- **Gear_FAB**: Reference_Drawer を開くための固定位置の歯車アイコンボタン
- **Reference_Article_Modal**: 参考記事の Markdown コンテンツを表示するモーダル
- **User**: Supabase Auth で認証されたログインユーザー
- **Progress_Record**: user_stage_progress テーブルに保存されるユーザーのステージ進捗レコード

## Requirements

### Requirement 1: ヘッダーにカリキュラムリンクを追加

**User Story:** As a User, I want to see a "カリキュラム" navigation link in the Header, so that I can access the curriculum feature easily.

#### Acceptance Criteria

1. WHILE a User is authenticated, THE Header SHALL display a "カリキュラム" navigation link that navigates to `/curriculum`
2. WHILE a User is not authenticated, THE Header SHALL hide the "カリキュラム" navigation link
3. THE Header SHALL display the "カリキュラム" link in both desktop navigation and mobile navigation menus

### Requirement 2: カリキュラム一覧ページ

**User Story:** As a User, I want to view a list of available curriculums with my progress, so that I can choose which curriculum to study.

#### Acceptance Criteria

1. WHEN an authenticated User navigates to `/curriculum`, THE Curriculum_List_Page SHALL display published curriculums as cards sorted by sort_order
2. THE Curriculum_List_Page SHALL display each curriculum card with title, description, and progress indicator in the format "{completed_count}/{total_count} ステージ完了"
3. WHEN a User clicks a curriculum card, THE Curriculum_List_Page SHALL navigate to `/curriculum/{slug}`
4. WHEN an unauthenticated user navigates to `/curriculum`, THE Curriculum_System SHALL redirect the user to `/login`
5. WHEN no published curriculums exist, THE Curriculum_List_Page SHALL display an empty state message

### Requirement 3: ステージマップ表示

**User Story:** As a User, I want to see a game-style stage map for a curriculum, so that I can visualize my learning progress.

#### Acceptance Criteria

1. WHEN an authenticated User navigates to `/curriculum/[slug]`, THE Stage_Map_Page SHALL display an SVG-based Stage_Map with stages rendered as numbered circles connected by lines
2. THE Stage_Map SHALL use a responsive SVG with viewBox for consistent rendering across screen sizes
3. THE Stage_Map SHALL calculate stage coordinates dynamically based on the number of stages
4. THE Stage_Map SHALL render completed stages with green fill, in_progress and unlocked stages with blue fill, and locked stages with gray fill
5. THE Stage_Map SHALL display the Avatar_Indicator above the Current_Stage using an SVG `<foreignObject>` element
6. WHEN a User has no profile avatar configuration, THE Avatar_Indicator SHALL use a default avatar seed

### Requirement 4: ステージステータス計算

**User Story:** As a User, I want stages to unlock sequentially, so that I follow the intended learning path.

#### Acceptance Criteria

1. THE Curriculum_System SHALL sort stages by stage_number in ascending order before computing status
2. WHEN a Progress_Record with status "completed" exists for a Stage, THE Curriculum_System SHALL assign completed status to that Stage
3. WHEN a Stage is the first stage in a curriculum and has no completed Progress_Record, THE Curriculum_System SHALL assign unlocked status to that Stage
4. WHEN the previous Stage has completed status and the current Stage has no completed Progress_Record, THE Curriculum_System SHALL assign unlocked status to the current Stage
5. WHEN the previous Stage does not have completed status, THE Curriculum_System SHALL assign locked status to the current Stage
6. THE Curriculum_System SHALL identify the Current_Stage as the first Stage with in_progress or unlocked status

### Requirement 5: ステージコンテンツ表示とインタラクション

**User Story:** As a User, I want to view stage content and mark stages as complete, so that I can progress through the curriculum.

#### Acceptance Criteria

1. WHEN a User clicks a completed Stage, THE Stage_Content_Dialog SHALL display the stage title, description content, and a "✅ クリア済み" badge without a complete button
2. WHEN a User clicks an in_progress or unlocked Stage, THE Stage_Content_Dialog SHALL display the stage title, description content, and a "完了する" button
3. WHEN a User clicks a locked Stage, THE Stage_Map SHALL apply a not-allowed cursor and take no action
4. WHEN a User clicks the "完了する" button, THE Curriculum_System SHALL create a Progress_Record with completed status and the current timestamp
5. WHEN the "完了する" action succeeds, THE Stage_Map_Page SHALL refresh the stage statuses and avatar position without full page reload
6. IF the "完了する" action fails, THEN THE Curriculum_System SHALL display an error toast notification to the User

### Requirement 6: 参考記事ドロワー

**User Story:** As a User, I want to access reference articles while studying a curriculum, so that I can deepen my understanding of the topics.

#### Acceptance Criteria

1. WHILE a User is on any `/curriculum/*` page, THE Curriculum_System SHALL display the Gear_FAB as a fixed-position button at the bottom-left of the viewport
2. WHEN a User clicks the Gear_FAB, THE Reference_Drawer SHALL slide in from the left side displaying a list of reference articles sorted by sort_order
3. THE Reference_Drawer SHALL display each article with its icon and title
4. WHEN a User clicks a reference article in the Reference_Drawer, THE Reference_Article_Modal SHALL open displaying the article content rendered as Markdown using react-markdown
5. WHEN a User presses Escape, clicks outside the Reference_Article_Modal, or clicks the close button, THE Reference_Article_Modal SHALL close
6. WHEN a User presses Escape, clicks outside the Reference_Drawer, or clicks the close button, THE Reference_Drawer SHALL close
7. THE Gear_FAB SHALL include an aria-label for accessibility and support keyboard activation

### Requirement 7: データベーススキーマ

**User Story:** As a developer, I want a well-structured database schema, so that curriculum data is stored reliably and efficiently.

#### Acceptance Criteria

1. THE Curriculum_System SHALL store curriculums in a `curriculums` table with columns: id (uuid PK), slug (unique), title, description, sort_order, is_published, created_at, updated_at
2. THE Curriculum_System SHALL store stages in a `stages` table with columns: id (uuid PK), curriculum_id (FK to curriculums), stage_number, title, description, created_at, updated_at
3. THE Curriculum_System SHALL store user progress in a `user_stage_progress` table with columns: id (uuid PK), user_id (FK), stage_id (FK to stages), status, completed_at, created_at, updated_at
4. THE Curriculum_System SHALL store reference articles in a `reference_articles` table with columns: id (uuid PK), slug (unique), title, icon, content (text), sort_order, created_at, updated_at
5. THE Curriculum_System SHALL enforce a unique constraint on (user_id, stage_id) in the user_stage_progress table to prevent duplicate progress records
6. THE Curriculum_System SHALL apply RLS policies to restrict data access to authenticated users only

### Requirement 8: シードデータ

**User Story:** As a developer, I want seed data for the MVP, so that the feature can be demonstrated and tested immediately.

#### Acceptance Criteria

1. THE Curriculum_System SHALL provide seed data containing one "フロントエンドカリキュラム" curriculum with slug "frontend" and 3 stages
2. THE Curriculum_System SHALL provide seed data containing 3 reference articles with Markdown content
3. THE Curriculum_System SHALL provide the seed data as a SQL migration file executable via Prisma

### Requirement 9: アクセシビリティとキーボード操作

**User Story:** As a User, I want the curriculum feature to be accessible via keyboard, so that I can use the feature without a mouse.

#### Acceptance Criteria

1. THE Stage_Map SHALL provide aria-label attributes on each stage circle describing the stage name and status
2. THE Stage_Map SHALL support keyboard focus navigation between stages using Tab key
3. WHEN a focused stage is activated via Enter or Space key, THE Stage_Map SHALL trigger the same action as a click
4. THE Gear_FAB SHALL be focusable and activatable via keyboard
5. THE Stage_Content_Dialog SHALL trap focus within the dialog while open and return focus to the triggering element on close
