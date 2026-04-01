import pool from "../config/database";
import { User, RegisterBody } from "../types";

export const findByEmail = async (email: string): Promise<User | null> => {
  const r = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
  return r.rows[0] || null;
};

export const findById = async (id: string): Promise<User | null> => {
  const r = await pool.query<User>(
    "SELECT id, name, email, bio, location, avatar_url, role, is_active, created_at FROM users WHERE id = $1",
    [id]
  );
  return r.rows[0] || null;
};

export const createUser = async (data: RegisterBody & { password_hash: string }): Promise<User> => {
  const r = await pool.query<User>(
    `INSERT INTO users (name, email, password_hash, bio, location)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, bio, location, role, is_active, created_at`,
    [data.name, data.email, data.password_hash, data.bio || null, data.location || null]
  );
  return r.rows[0];
};

export const getAllUsers = async (): Promise<any[]> => {
  const r = await pool.query(`
    SELECT u.id, u.name, u.email, u.role, u.is_active, u.location, u.created_at,
      COUNT(DISTINCT s.id) as skill_count,
      COUNT(DISTINCT sr.id) as swap_count
    FROM users u
    LEFT JOIN skills s ON s.user_id = u.id
    LEFT JOIN swap_requests sr ON sr.sender_id = u.id OR sr.receiver_id = u.id
    GROUP BY u.id ORDER BY u.created_at DESC
  `);
  return r.rows;
};

export const toggleUserActive = async (id: string): Promise<User | null> => {
  const r = await pool.query<User>(
    "UPDATE users SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING *",
    [id]
  );
  return r.rows[0] || null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const r = await pool.query("DELETE FROM users WHERE id = $1 AND role != 'admin'", [id]);
  return (r.rowCount ?? 0) > 0;
};

export const getUserPublicProfile = async (id: string): Promise<any | null> => {
  const r = await pool.query(`
    SELECT u.id, u.name, u.bio, u.location, u.avatar_url, u.created_at,
      COALESCE(AVG(rv.rating), 0) as avg_rating,
      COUNT(DISTINCT rv.id) as review_count,
      COALESCE(AVG(rv.skill_transfer_percent), 0) as avg_transfer_percent
    FROM users u
    LEFT JOIN reviews rv ON rv.reviewee_id = u.id
    WHERE u.id = $1
    GROUP BY u.id
  `, [id]);
  return r.rows[0] || null;
};
