import { query } from '../db';
import { canAutoApprove } from './auth';

export async function submitContribution(editorId: string | null, targetTable: string, targetId: string | null, diff: any, source: string = 'community') {
  let trustTier = 'new';
  if (editorId) {
    const userRes = await query(`SELECT trust_tier FROM users WHERE id = $1;`, [editorId]);
    if (userRes.rows.length > 0) {
      trustTier = userRes.rows[0].trust_tier;
    }
  }

  const autoApprove = canAutoApprove(trustTier);
  const initialStatus = autoApprove ? 'approved' : 'pending';

  const res = await query(
    `INSERT INTO edit_history (target_table, target_id, editor_id, diff, source, trust_tier, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *;`,
    [targetTable, targetId, editorId, JSON.stringify(diff), source, trustTier, initialStatus]
  );

  const contribution = res.rows[0];

  if (autoApprove) {
    await applyDiffToTarget(targetTable, targetId, diff);
    if (editorId) {
      await incrementUserEditCount(editorId);
    }
  }

  return contribution;
}

export async function reviewContribution(contributionId: string, moderatorId: string, action: 'approve' | 'reject') {
  const modRes = await query(`SELECT trust_tier FROM users WHERE id = $1;`, [moderatorId]);
  const modUser = modRes.rows[0];
  if (!modUser || !['moderator', 'official'].includes(modUser.trust_tier)) {
    throw new Error('Unauthorized: Only moderators or official accounts can review pending contributions.');
  }

  const status = action === 'approve' ? 'approved' : 'rejected';

  const editRes = await query(
    `UPDATE edit_history
     SET status = $1, reviewed_by = $2, reviewed_at = NOW()
     WHERE id = $3 AND status = 'pending'
     RETURNING *;`,
    [status, moderatorId, contributionId]
  );

  if (editRes.rows.length === 0) {
    throw new Error('Contribution not found or already processed.');
  }

  const editRecord = editRes.rows[0];

  if (action === 'approve') {
    await applyDiffToTarget(editRecord.target_table, editRecord.target_id, editRecord.diff);
    if (editRecord.editor_id) {
      await incrementUserEditCount(editRecord.editor_id);
    }
  }

  return editRecord;
}

async function applyDiffToTarget(targetTable: string, targetId: string | null, diff: any) {
  if (targetTable === 'entities') {
    if (targetId) {
      // Update entity attributes/name
      if (diff.name) {
        await query(`UPDATE entities SET name = $1, updated_at = NOW() WHERE id = $2;`, [diff.name, targetId]);
      }
      if (diff.attributes) {
        await query(
          `UPDATE entities SET attributes = attributes || $1::jsonb, updated_at = NOW() WHERE id = $2;`,
          [JSON.stringify(diff.attributes), targetId]
        );
      }
    } else {
      // Create new entity
      await query(
        `INSERT INTO entities (entity_type, name, native_name, attributes, source)
         VALUES ($1, $2, $3, $4, 'community_edit');`,
        [diff.entity_type || 'poi', diff.name, diff.native_name || null, JSON.stringify(diff.attributes || {})]
      );
    }
  }
}

async function incrementUserEditCount(userId: string) {
  const userRes = await query(
    `UPDATE users
     SET accepted_edit_count = accepted_edit_count + 1
     WHERE id = $1
     RETURNING accepted_edit_count, trust_tier;`,
    [userId]
  );

  if (userRes.rows.length > 0) {
    const { accepted_edit_count, trust_tier } = userRes.rows[0];
    // Threshold advancement logic
    if (accepted_edit_count >= 50 && trust_tier === 'new') {
      await query(`UPDATE users SET trust_tier = 'trusted' WHERE id = $1;`, [userId]);
    }
  }
}
