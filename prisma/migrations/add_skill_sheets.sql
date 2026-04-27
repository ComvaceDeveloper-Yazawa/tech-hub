CREATE TABLE skill_sheets (
  id                  CHAR(26)      NOT NULL,
  tenant_id           CHAR(26)      NOT NULL,
  user_id             CHAR(26)      NOT NULL,
  project_name        VARCHAR(255)  NOT NULL,
  start_date          DATE          NOT NULL,
  duration_months     INTEGER       NOT NULL,
  scale               VARCHAR(50)   NOT NULL,
  birth_date          DATE,
  nationality         VARCHAR(100)  NOT NULL DEFAULT '',
  station_line        VARCHAR(100)  NOT NULL DEFAULT '',
  nearest_station     VARCHAR(100)  NOT NULL DEFAULT '',
  desired_area        VARCHAR(255)  NOT NULL DEFAULT '',
  self_introduction   TEXT          NOT NULL,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_skill_sheets_tenant_user ON skill_sheets (tenant_id, user_id);
CREATE INDEX idx_skill_sheets_user_id ON skill_sheets (user_id);

CREATE TABLE skill_sheet_projects (
  id              CHAR(26)      NOT NULL,
  skill_sheet_id  CHAR(26)      NOT NULL,
  project_number  INTEGER       NOT NULL,
  period_start    VARCHAR(100)  NOT NULL,
  period_end      VARCHAR(100)  NOT NULL,
  description     TEXT          NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_skill_sheet_projects_skill_sheet
    FOREIGN KEY (skill_sheet_id)
    REFERENCES skill_sheets (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_skill_sheet_projects_skill_sheet_id ON skill_sheet_projects (skill_sheet_id);

CREATE TABLE skill_sheet_project_tasks (
  id                       CHAR(26)      NOT NULL,
  skill_sheet_project_id   CHAR(26)      NOT NULL,
  category                 VARCHAR(100)  NOT NULL,
  task_description         TEXT          NOT NULL,
  created_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_skill_sheet_project_tasks_project
    FOREIGN KEY (skill_sheet_project_id)
    REFERENCES skill_sheet_projects (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_skill_sheet_project_tasks_project_id ON skill_sheet_project_tasks (skill_sheet_project_id);

CREATE TABLE skill_sheet_skills (
  id                       CHAR(26)      NOT NULL,
  skill_sheet_project_id   CHAR(26)      NOT NULL,
  category                 VARCHAR(50)   NOT NULL,
  skill_name               VARCHAR(100)  NOT NULL,
  created_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_skill_sheet_skills_project
    FOREIGN KEY (skill_sheet_project_id)
    REFERENCES skill_sheet_projects (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_skill_sheet_skills_project_id ON skill_sheet_skills (skill_sheet_project_id);
CREATE INDEX idx_skill_sheet_skills_project_category ON skill_sheet_skills (skill_sheet_project_id, category);

CREATE TABLE skill_sheet_environments (
  id                       CHAR(26)      NOT NULL,
  skill_sheet_project_id   CHAR(26)      NOT NULL,
  environment_type         VARCHAR(50)   NOT NULL,
  value                    VARCHAR(100)  NOT NULL,
  created_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_skill_sheet_environments_project
    FOREIGN KEY (skill_sheet_project_id)
    REFERENCES skill_sheet_projects (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_skill_sheet_environments_project_id ON skill_sheet_environments (skill_sheet_project_id);
CREATE INDEX idx_skill_sheet_environments_project_type ON skill_sheet_environments (skill_sheet_project_id, environment_type);
