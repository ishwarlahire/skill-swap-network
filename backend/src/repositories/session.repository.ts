import pool from "../config/database";
import { Session, CreateSessionBody, UpdateSessionBody } from "../types";

export const createSession = async (teacherId: string, learnerId: string, data: CreateSessionBody): Promise<Session> => {
  const r = await pool.query<Session>(
    `INSERT INTO sessions (swap_id, teacher_id, learner_id, scheduled_at, duration_minutes, mode, meet_link, location_note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [data.swap_id, teacherId, learnerId, data.scheduled_at, data.duration_minutes, data.mode, data.meet_link || null, data.location_note || null]
  );
  return r.rows[0];
};

export const getSessionsBySwap = async (swapId: string): Promise<any[]> => {
  const r = await pool.query(`
    SELECT s.*,
      t.name as teacher_name, t.avatar_url as teacher_avatar,
      l.name as learner_name, l.avatar_url as learner_avatar,
      (SELECT json_agg(rv.*) FROM reviews rv WHERE rv.session_id = s.id) as reviews
    FROM sessions s
    JOIN users t ON s.teacher_id = t.id
    JOIN users l ON s.learner_id = l.id
    WHERE s.swap_id=$1 ORDER BY s.scheduled_at DESC
  `, [swapId]);
  return r.rows;
};

export const getMysessions = async (userId: string): Promise<any[]> => {
  const r = await pool.query(`
    SELECT s.*,
      t.name as teacher_name, l.name as learner_name,
      sr.sender_skill_id, sr.receiver_skill_id,
      sk1.title as sender_skill_title, sk2.title as receiver_skill_title
    FROM sessions s
    JOIN users t ON s.teacher_id = t.id
    JOIN users l ON s.learner_id = l.id
    JOIN swap_requests sr ON s.swap_id = sr.id
    JOIN skills sk1 ON sr.sender_skill_id = sk1.id
    JOIN skills sk2 ON sr.receiver_skill_id = sk2.id
    WHERE s.teacher_id=$1 OR s.learner_id=$1
    ORDER BY s.scheduled_at DESC
  `, [userId]);
  return r.rows;
};

export const updateSession = async (id: string, userId: string, data: UpdateSessionBody): Promise<Session | null> => {
  const fields: string[] = [];
  const params: any[] = [];
  if (data.notes !== undefined) { params.push(data.notes); fields.push(`notes=$${params.length}`); }
  if (data.skill_transfer_percent !== undefined) { params.push(data.skill_transfer_percent); fields.push(`skill_transfer_percent=$${params.length}`); }
  if (data.status !== undefined) { params.push(data.status); fields.push(`status=$${params.length}`); }
  if (!fields.length) return null;
  fields.push("updated_at=NOW()");
  params.push(id); params.push(userId);
  const r = await pool.query<Session>(
    `UPDATE sessions SET ${fields.join(",")} WHERE id=$${params.length-1} AND (teacher_id=$${params.length} OR learner_id=$${params.length}) RETURNING *`,
    params
  );
  return r.rows[0] || null;
};
