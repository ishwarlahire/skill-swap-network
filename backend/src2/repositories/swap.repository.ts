import pool from "../config/database";
import { SwapRequest, CreateSwapBody } from "../types";

export const createSwap = async (senderId: string, data: CreateSwapBody): Promise<SwapRequest> => {
  const r = await pool.query<SwapRequest>(
    `INSERT INTO swap_requests (sender_id, receiver_id, sender_skill_id, receiver_skill_id, message, preferred_mode)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [senderId, data.receiver_id, data.sender_skill_id, data.receiver_skill_id, data.message || null, data.preferred_mode]
  );
  return r.rows[0];
};

export const getSwapsByUser = async (userId: string): Promise<any[]> => {
  const r = await pool.query(`
    SELECT sr.*,
      sender.name as sender_name, sender.avatar_url as sender_avatar,
      receiver.name as receiver_name, receiver.avatar_url as receiver_avatar,
      ss.title as sender_skill_title, ss.category as sender_skill_category,
      rs.title as receiver_skill_title, rs.category as receiver_skill_category,
      (SELECT COUNT(*) FROM messages m WHERE m.swap_id = sr.id AND m.is_read = false AND m.sender_id != $1) as unread_count
    FROM swap_requests sr
    JOIN users sender ON sr.sender_id = sender.id
    JOIN users receiver ON sr.receiver_id = receiver.id
    JOIN skills ss ON sr.sender_skill_id = ss.id
    JOIN skills rs ON sr.receiver_skill_id = rs.id
    WHERE sr.sender_id=$1 OR sr.receiver_id=$1
    ORDER BY sr.updated_at DESC
  `, [userId]);
  return r.rows;
};

export const getSwapById = async (id: string): Promise<any | null> => {
  const r = await pool.query(`
    SELECT sr.*,
      sender.name as sender_name, sender.avatar_url as sender_avatar,
      receiver.name as receiver_name, receiver.avatar_url as receiver_avatar,
      ss.title as sender_skill_title, rs.title as receiver_skill_title
    FROM swap_requests sr
    JOIN users sender ON sr.sender_id = sender.id
    JOIN users receiver ON sr.receiver_id = receiver.id
    JOIN skills ss ON sr.sender_skill_id = ss.id
    JOIN skills rs ON sr.receiver_skill_id = rs.id
    WHERE sr.id=$1
  `, [id]);
  return r.rows[0] || null;
};

export const updateSwapStatus = async (id: string, receiverId: string, status: "accepted" | "rejected" | "completed"): Promise<SwapRequest | null> => {
  const r = await pool.query<SwapRequest>(
    "UPDATE swap_requests SET status=$1, updated_at=NOW() WHERE id=$2 AND receiver_id=$3 RETURNING *",
    [status, id, receiverId]
  );
  return r.rows[0] || null;
};
