import pool from "../config/database";
import { Review, CreateReviewBody } from "../types";

export const createReview = async (reviewerId: string, data: CreateReviewBody): Promise<Review> => {
  const r = await pool.query<Review>(
    `INSERT INTO reviews (session_id, reviewer_id, reviewee_id, rating, comment, skill_transfer_percent)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [data.session_id, reviewerId, data.reviewee_id, data.rating, data.comment || null, data.skill_transfer_percent]
  );
  return r.rows[0];
};

export const getReviewsForUser = async (userId: string): Promise<any[]> => {
  const r = await pool.query(`
    SELECT rv.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
    FROM reviews rv
    JOIN users u ON rv.reviewer_id = u.id
    WHERE rv.reviewee_id=$1 ORDER BY rv.created_at DESC
  `, [userId]);
  return r.rows;
};

export const getUserStats = async (userId: string): Promise<any> => {
  const r = await pool.query(`
    SELECT
      COALESCE(AVG(rating),0) as avg_rating,
      COUNT(*) as total_reviews,
      COALESCE(AVG(skill_transfer_percent),0) as avg_transfer_percent
    FROM reviews WHERE reviewee_id=$1
  `, [userId]);
  return r.rows[0];
};
