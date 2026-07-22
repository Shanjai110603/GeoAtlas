-- Closure Table Trigger Logic for admin_hierarchy_closure

CREATE OR REPLACE FUNCTION maintain_admin_closure()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- 1. Insert self-reference (depth 0)
    INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
    VALUES (NEW.id, NEW.id, 0);

    -- 2. Link all ancestors of the parent to the new node
    IF NEW.parent_id IS NOT NULL THEN
      INSERT INTO admin_hierarchy_closure (ancestor_id, descendant_id, depth)
      SELECT c.ancestor_id, NEW.id, c.depth + 1
      FROM admin_hierarchy_closure c
      WHERE c.descendant_id = NEW.parent_id;
    END IF;

    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    -- Only re-parent if parent_id actually changed
    IF OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
      -- Disconnect OLD ancestor links for NEW.id and all its descendants
      DELETE FROM admin_hierarchy_closure
      WHERE descendant_id IN (
        SELECT descendant_id FROM admin_hierarchy_closure WHERE ancestor_id = OLD.id
      )
      AND ancestor_id IN (
        SELECT ancestor_id FROM admin_hierarchy_closure WHERE descendant_id = OLD.id
        EXCEPT
        SELECT descendant_id FROM admin_hierarchy_closure WHERE ancestor_id = OLD.id
      );

      -- Connect NEW ancestors to NEW.id and all its sub-tree descendants
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
    -- Cleanup handled by ON DELETE CASCADE, but explicit check ensures integrity
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
