-- Migration 004: Entities & Graph Edge Relationships

CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  native_name VARCHAR(255),
  admin_level_id UUID REFERENCES admin_levels(id) ON DELETE SET NULL,
  geom GEOMETRY(Geometry, 4326),
  attributes JSONB DEFAULT '{}'::jsonb,
  confidence_score NUMERIC(3,2) DEFAULT 1.00,
  source VARCHAR(100),
  source_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entities_geom ON entities USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_entities_admin_level ON entities(admin_level_id);
CREATE INDEX IF NOT EXISTS idx_entities_attributes ON entities USING GIN(attributes);

CREATE TABLE IF NOT EXISTS entity_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  to_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_relationships_from ON entity_relationships(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_relationships_to ON entity_relationships(to_entity_id);
