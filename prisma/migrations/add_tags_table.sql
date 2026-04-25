-- タグマスターテーブル
CREATE TABLE tags (
  id             CHAR(26)     NOT NULL,
  tenant_id      CHAR(26)     NOT NULL,
  name           VARCHAR(50)  NOT NULL,
  normalized_name VARCHAR(50) NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE (tenant_id, normalized_name)
);

CREATE INDEX idx_tags_tenant_id ON tags (tenant_id);
