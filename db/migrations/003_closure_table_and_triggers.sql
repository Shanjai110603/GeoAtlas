-- Migration 003: Closure Table & Hierarchy Re-Parenting Trigger

CREATE TABLE IF NOT EXISTS admin_hierarchy_closure (
  ancestor_id UUID REFERENCES admin_levels(id) ON DELETE CASCADE,
  descendant_id UUID REFERENCES admin_levels(id) ON DELETE CASCADE,
  depth INT NOT NULL,
  PRIMARY KEY (ancestor_id, descendant_id)
);

CREATE INDEX IF NOT EXISTS idx_closure_ancestor ON admin_hierarchy_closure(ancestor_id);
CREATE INDEX IF NOT EXISTS idx_closure_descendant ON admin_hierarchy_closure(descendant_id);

CREATE OR REPLACE FUNCTION maintain_admin_closure()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Insert self-reference (depth 0)
    INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
    VALUES (NEW.id, NEW.id, 0);

    -- Link all ancestors of the parent to the new node
    IF NEW.parent_id IS NOT NULL THEN
      INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
      SELECT c.ancestor_id, NEW.id, c.depth + 1
      FROM admin_hierarchy_closure c
      WHERE c.descendant_id = NEW.parent_id;
    END IF;

    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    -- Re-parenting: ONLY when parent_id changes
    IF OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
      -- 1. Remove old ancestry links for NEW.id and all its sub-tree descendants
      DELETE FROM admin_hierarchy_closure
      WHERE descendant_id IN (
        SELECT descendant_id FROM admin_hierarchy_closure WHERE ancestor_id = OLD.id
      )
      AND ancestor_id IN (
        SELECT ancestor_id FROM admin_hierarchy_closure WHERE descendant_id = OLD.id
        EXCEPT
        SELECT descendant_id FROM admin_hierarchy_closure WHERE ancestor_id = OLD.id
      );

      -- 2. Link all ancestors of NEW.parent_id to NEW.id and all its sub-tree descendants
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
