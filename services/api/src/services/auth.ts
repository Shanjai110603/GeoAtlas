import bcrypt from 'bcrypt';
import { query } from '../db';

export async function createUser(email: string, passwordHash: string, displayName: string, trustTier: string = 'new') {
  const res = await query(
    `INSERT INTO users (email, password_hash, display_name, trust_tier)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, display_name, trust_tier, accepted_edit_count, created_at;`,
    [email, passwordHash, displayName, trustTier]
  );
  return res.rows[0];
}

export async function findUserByEmail(email: string) {
  const res = await query(`SELECT * FROM users WHERE email = $1;`, [email]);
  return res.rows[0];
}

export async function findUserById(id: string) {
  const res = await query(`SELECT id, email, display_name, trust_tier, accepted_edit_count, created_at FROM users WHERE id = $1;`, [id]);
  return res.rows[0];
}

export function canAutoApprove(trustTier: string): boolean {
  return ['official', 'verified_org', 'trusted'].includes(trustTier);
}
