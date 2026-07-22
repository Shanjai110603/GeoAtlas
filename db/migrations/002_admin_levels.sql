-- Migration 002: Administrative Levels Table
CREATE TABLE IF NOT EXISTS admin_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code CHAR(2) NOT NULL,
  level_number INT NOT NULL,
  local_term VARCHAR(100),
  parent_id UUID REFERENCES admin_levels(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  native_name VARCHAR(255),
  geom GEOMETRY(MultiPolygon, 4326),
  centroid GEOMETRY(Point, 4326),
  source VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_levels_geom ON admin_levels USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_admin_levels_centroid ON admin_levels USING GIST(centroid);
CREATE INDEX IF NOT EXISTS idx_admin_levels_parent ON admin_levels(parent_id);
CREATE INDEX IF NOT EXISTS idx_admin_levels_country ON admin_levels(country_code);
