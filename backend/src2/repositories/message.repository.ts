import pool from "../config/database";
import { Message } from "../types";

export const sendMessage = async (swapId: string, senderId: string, content: string): Promise<Message> => {
  const r = await pool.query<Message>(
    "INSERT INTO messages (swap_id, sender_id, content) VALUES ($1,$2,$3) RETURNING *",
    [swapId, senderId, content]
  );
  return r.rows[0];
};

export const getMessages = async (swapId: string, userId: string): Promise<any[]> => {
  // Mark messages as read
  await pool.query(
    "UPDATE messages SET is_read=true WHERE swap_id=$1 AND sender_id!=$2",
    [swapId, userId]
  );
  const r = await pool.query(`
    SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.swap_id=$1 ORDER BY m.created_at ASC
  `, [swapId]);
  return r.rows;
};
