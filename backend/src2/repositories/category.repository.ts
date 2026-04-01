import pool from "../config/database";
import { Category, CreateCategoryBody } from "../types";

export const getAll = async (): Promise<Category[]> => {
  const r = await pool.query<Category>("SELECT * FROM categories WHERE is_active=true ORDER BY name ASC");
  return r.rows;
};

export const getAllAdmin = async (): Promise<Category[]> => {
  const r = await pool.query<Category>("SELECT * FROM categories ORDER BY name ASC");
  return r.rows;
};

export const create = async (data: CreateCategoryBody): Promise<Category> => {
  const r = await pool.query<Category>(
    "INSERT INTO categories (name, icon) VALUES ($1,$2) RETURNING *",
    [data.name, data.icon || "🎯"]
  );
  return r.rows[0];
};

export const toggle = async (id: string): Promise<Category | null> => {
  const r = await pool.query<Category>(
    "UPDATE categories SET is_active = NOT is_active WHERE id=$1 RETURNING *",
    [id]
  );
  return r.rows[0] || null;
};

export const remove = async (id: string): Promise<boolean> => {
  const r = await pool.query("DELETE FROM categories WHERE id=$1", [id]);
  return (r.rowCount ?? 0) > 0;
};
