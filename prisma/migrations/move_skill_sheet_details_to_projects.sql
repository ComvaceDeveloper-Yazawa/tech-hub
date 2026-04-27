DROP TABLE IF EXISTS skill_sheet_environments;
DROP TABLE IF EXISTS skill_sheet_skills;

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
