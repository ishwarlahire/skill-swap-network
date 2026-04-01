import pool from "../config/database";
import { Skill, CreateSkillBody } from "../types";

export const createSkill = async (userId: string, data: CreateSkillBody): Promise<Skill> => {
  const r = await pool.query<Skill>(
    `INSERT INTO skills (user_id, title, description, category, type, level)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [userId, data.title, data.description, data.category, data.type, data.level]
  );
  return r.rows[0];
};

export const getAllSkills = async (filters: { category?: string; type?: string; search?: string }): Promise<any[]> => {
  let q = `
    SELECT s.*, u.name as user_name, u.location, u.avatar_url,
      COALESCE(AVG(rv.rating),0) as avg_rating,
      COUNT(DISTINCT rv.id) as review_count,
      COALESCE(AVG(rv.skill_transfer_percent),0) as avg_transfer_percent
    FROM skills s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN reviews rv ON rv.reviewee_id = u.id
    WHERE s.is_active = true AND u.is_active = true
  `;
  const params: any[] = [];
  if (filters.category) { params.push(filters.category); q += ` AND s.category = $${params.length}`; }
  if (filters.type) { params.push(filters.type); q += ` AND s.type = $${params.length}`; }
  if (filters.search) { params.push(`%${filters.search}%`); q += ` AND (s.title ILIKE $${params.length} OR s.description ILIKE $${params.length})`; }
  q += " GROUP BY s.id, u.name, u.location, u.avatar_url ORDER BY s.created_at DESC";
  const r = await pool.query(q, params);
  return r.rows;
};

export const getSkillsByUser = async (userId: string): Promise<Skill[]> => {
  const r = await pool.query<Skill>("SELECT * FROM skills WHERE user_id=$1 ORDER BY created_at DESC", [userId]);
  return r.rows;
};

export const deleteSkill = async (id: string, userId: string): Promise<boolean> => {
  const r = await pool.query("DELETE FROM skills WHERE id=$1 AND user_id=$2", [id, userId]);
  return (r.rowCount ?? 0) > 0;
};

// Admin: toggle any skill
export const adminToggleSkill = async (id: string): Promise<Skill | null> => {
  const r = await pool.query<Skill>("UPDATE skills SET is_active = NOT is_active WHERE id=$1 RETURNING *", [id]);
  return r.rows[0] || null;
};
