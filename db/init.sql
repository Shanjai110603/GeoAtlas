-- PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Administrative Levels Table
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

-- Closure Table for Administrative Hierarchy
CREATE TABLE IF NOT EXISTS admin_hierarchy_closure (
  ancestor_id UUID REFERENCES admin_levels(id) ON DELETE CASCADE,
  descendant_id UUID REFERENCES admin_levels(id) ON DELETE CASCADE,
  depth INT NOT NULL,
  PRIMARY KEY (ancestor_id, descendant_id)
);

CREATE INDEX IF NOT EXISTS idx_closure_ancestor ON admin_hierarchy_closure(ancestor_id);
CREATE INDEX IF NOT EXISTS idx_closure_descendant ON admin_hierarchy_closure(descendant_id);

-- 2. Generic Entities (Knowledge Graph Nodes)
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

-- 3. Relationships (Graph Edges)
CREATE TABLE IF NOT EXISTS entity_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  to_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_relationships_from ON entity_relationships(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_relationships_to ON entity_relationships(to_entity_id);

-- 4. Users Table & Trust Tiers
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  display_name VARCHAR(100),
  trust_tier VARCHAR(30) DEFAULT 'new', -- 'new', 'trusted', 'verified_org', 'official', 'moderator'
  accepted_edit_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Edit History & Moderation Queue
CREATE TABLE IF NOT EXISTS edit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_table VARCHAR(50) NOT NULL,
  target_id UUID,
  editor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  diff JSONB NOT NULL,
  source VARCHAR(100),
  trust_tier VARCHAR(30),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  confidence_score NUMERIC(3,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_edit_history_status ON edit_history(status);
CREATE INDEX IF NOT EXISTS idx_edit_history_editor ON edit_history(editor_id);

-- 6. Business Directory Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_entity ON reviews(entity_id);

-- 7. Pipeline Run Audit Logs
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL,
  records_processed INT DEFAULT 0,
  records_inserted INT DEFAULT 0,
  records_updated INT DEFAULT 0,
  records_failed INT DEFAULT 0,
  status VARCHAR(30) NOT NULL, -- 'running', 'completed', 'failed'
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 8. Closure Table Trigger Function for Re-Parenting & Insert/Delete
CREATE OR REPLACE FUNCTION maintain_admin_closure()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
    VALUES (NEW.id, NEW.id, 0);

    IF NEW.parent_id IS NOT NULL THEN
      INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
      SELECT c.ancestor_id, NEW.id, c.depth + 1
      FROM admin_hierarchy_closure c
      WHERE c.descendant_id = NEW.parent_id;
    END IF;

    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    IF OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
      DELETE FROM admin_hierarchy_closure
      WHERE descendant_id IN (
        SELECT descendant_id FROM admin_hierarchy_closure WHERE ancestor_id = OLD.id
      )
      AND ancestor_id IN (
        SELECT ancestor_id FROM admin_hierarchy_closure WHERE descendant_id = OLD.id
        EXCEPT
        SELECT descendant_id FROM admin_hierarchy_closure WHERE ancestor_id = OLD.id
      );

      IF NEW.parent_id IS NOT NULL THEN
        INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
        SELECT supertree.ancestor_id, subtree.descendant_id, supertree.depth + subtree.depth + 1
        FROM admin_hierarchy_closure AS supertree
        CROSS JOIN admin_hierarchy_closure AS subtree
        WHERE supertree.descendant_id = NEW.parent_id
          AND subtree.ancestor_id = NEW.id;
      END IF;
    END IF;

    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    DELETE FROM admin_hierarchy_closure WHERE descendant_id = OLD.id OR ancestor_id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_closure ON admin_levels;

CREATE TRIGGER trg_admin_closure
AFTER INSERT OR UPDATE OF parent_id OR DELETE ON admin_levels
FOR EACH ROW EXECUTE FUNCTION maintain_admin_closure();

