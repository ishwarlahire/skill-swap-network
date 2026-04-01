import { FastifyRequest, FastifyReply } from "fastify";
import * as authService from "../services/auth.service";
import * as userRepo from "../repositories/user.repository";
import * as skillRepo from "../repositories/skill.repository";
import * as swapRepo from "../repositories/swap.repository";
import * as sessionRepo from "../repositories/session.repository";
import * as messageRepo from "../repositories/message.repository";
import * as reviewRepo from "../repositories/review.repository";
import * as categoryRepo from "../repositories/category.repository";
import { JwtPayload } from "../types";

const jwt = (req: FastifyRequest) => req.user as JwtPayload;

// ─── AUTH ──────────────────────────────────────────────────────────────────
export const register = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const user = await authService.register(req.body);
    const token = req.server.jwt.sign({ id: user.id, email: user.email, role: user.role });
    reply.status(201).send({ success: true, data: { user, token } });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const login = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const user = await authService.login(req.body);
    const token = req.server.jwt.sign({ id: user.id, email: user.email, role: user.role });
    reply.send({ success: true, data: { user, token } });
  } catch (e: any) { reply.status(401).send({ success: false, message: e.message }); }
};

export const getMe = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await userRepo.findById(jwt(req).id);
    if (!user) return reply.status(404).send({ success: false, message: "User not found" });
    reply.send({ success: true, data: user });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const getUserProfile = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const profile = await userRepo.getUserPublicProfile(req.params.id);
    const skills = await skillRepo.getSkillsByUser(req.params.id);
    const reviews = await reviewRepo.getReviewsForUser(req.params.id);
    reply.send({ success: true, data: { ...profile, skills, reviews } });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

// ─── SKILLS ────────────────────────────────────────────────────────────────
export const createSkill = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const skill = await skillRepo.createSkill(jwt(req).id, req.body);
    reply.status(201).send({ success: true, data: skill });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const getAllSkills = async (req: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
  try {
    const skills = await skillRepo.getAllSkills(req.query);
    reply.send({ success: true, data: skills });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const getMySkills = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const skills = await skillRepo.getSkillsByUser(jwt(req).id);
    reply.send({ success: true, data: skills });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const deleteSkill = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const ok = await skillRepo.deleteSkill(req.params.id, jwt(req).id);
    if (!ok) return reply.status(404).send({ success: false, message: "Skill not found" });
    reply.send({ success: true, message: "Skill deleted" });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

// ─── SWAPS ─────────────────────────────────────────────────────────────────
export const createSwap = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const { id } = jwt(req);
    if (id === req.body.receiver_id) return reply.status(400).send({ success: false, message: "Cannot swap with yourself" });
    const swap = await swapRepo.createSwap(id, req.body);
    reply.status(201).send({ success: true, data: swap });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const getMySwaps = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const swaps = await swapRepo.getSwapsByUser(jwt(req).id);
    reply.send({ success: true, data: swaps });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const getSwapById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const swap = await swapRepo.getSwapById(req.params.id);
    if (!swap) return reply.status(404).send({ success: false, message: "Swap not found" });
    reply.send({ success: true, data: swap });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const updateSwapStatus = async (req: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
  try {
    const swap = await swapRepo.updateSwapStatus(req.params.id, jwt(req).id, req.body.status);
    if (!swap) return reply.status(404).send({ success: false, message: "Swap not found or unauthorized" });
    reply.send({ success: true, data: swap });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

// ─── SESSIONS ──────────────────────────────────────────────────────────────
export const createSession = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const swap = await swapRepo.getSwapById(req.body.swap_id);
    if (!swap) return reply.status(404).send({ success: false, message: "Swap not found" });
    const { id } = jwt(req);
    const teacherId = id;
    const learnerId = swap.sender_id === id ? swap.receiver_id : swap.sender_id;
    const session = await sessionRepo.createSession(teacherId, learnerId, req.body);

    // Auto-share session details as a chat message
    const scheduledDate = new Date(req.body.scheduled_at);
    const dateStr = scheduledDate.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });
    const modeEmoji: Record<string, string> = { video: "🎥", audio: "🎙️", chat: "💬", offline: "🤝" };
    const platformLabel = req.body.meet_platform === "zoom" ? "Zoom" : req.body.meet_platform === "teams" ? "Microsoft Teams" : "Google Meet";

    let autoMsg = `📅 *Session Scheduled!*\n\n`;
    autoMsg += `📌 Topic: ${req.body.title || `${swap.sender_skill_title} ⇄ ${swap.receiver_skill_title}`}\n`;
    autoMsg += `📆 Date: ${dateStr}\n`;
    autoMsg += `⏱️ Duration: ${req.body.duration_minutes} minutes\n`;
    autoMsg += `${modeEmoji[req.body.mode] || "📡"} Mode: ${req.body.mode.charAt(0).toUpperCase() + req.body.mode.slice(1)}\n`;
    if (req.body.meet_link) {
      autoMsg += `\n🔗 ${platformLabel} Link:\n${req.body.meet_link}\n`;
    }
    if (req.body.location_note) {
      autoMsg += `\n📍 Location: ${req.body.location_note}\n`;
    }
    if (req.body.agenda) {
      autoMsg += `\n📋 Agenda:\n${req.body.agenda}\n`;
    }
    autoMsg += `\nSee you there! 🚀`;

    await messageRepo.sendMessage(req.body.swap_id, id, autoMsg);

    reply.status(201).send({ success: true, data: session });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const getSessionsBySwap = async (req: FastifyRequest<{ Params: { swapId: string } }>, reply: FastifyReply) => {
  try {
    const sessions = await sessionRepo.getSessionsBySwap(req.params.swapId);
    reply.send({ success: true, data: sessions });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const getMySessions = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const sessions = await sessionRepo.getMysessions(jwt(req).id);
    reply.send({ success: true, data: sessions });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const updateSession = async (req: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
  try {
    const session = await sessionRepo.updateSession(req.params.id, jwt(req).id, req.body);
    if (!session) return reply.status(404).send({ success: false, message: "Session not found" });
    reply.send({ success: true, data: session });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

// ─── MESSAGES ──────────────────────────────────────────────────────────────
export const sendMessage = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const msg = await messageRepo.sendMessage(req.body.swap_id, jwt(req).id, req.body.content);
    reply.status(201).send({ success: true, data: msg });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const getMessages = async (req: FastifyRequest<{ Params: { swapId: string } }>, reply: FastifyReply) => {
  try {
    const msgs = await messageRepo.getMessages(req.params.swapId, jwt(req).id);
    reply.send({ success: true, data: msgs });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

// ─── REVIEWS ───────────────────────────────────────────────────────────────
export const createReview = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const review = await reviewRepo.createReview(jwt(req).id, req.body);
    reply.status(201).send({ success: true, data: review });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const getMyReviews = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const reviews = await reviewRepo.getReviewsForUser(jwt(req).id);
    reply.send({ success: true, data: reviews });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

// ─── CATEGORIES ────────────────────────────────────────────────────────────
export const getCategories = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const cats = await categoryRepo.getAll();
    reply.send({ success: true, data: cats });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

// ─── ADMIN ─────────────────────────────────────────────────────────────────
export const adminGetStats = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const [users, skills, swaps, sessions, reviews] = await Promise.all([
      pool_count("users"), pool_count("skills"), pool_count("swap_requests"),
      pool_count("sessions"), pool_count("reviews"),
    ]);
    reply.send({ success: true, data: { users, skills, swaps, sessions, reviews } });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

import pool from "../config/database";
const pool_count = async (table: string): Promise<number> => {
  const r = await pool.query(`SELECT COUNT(*) FROM ${table}`);
  return parseInt(r.rows[0].count);
};

export const adminGetUsers = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userRepo.getAllUsers();
    reply.send({ success: true, data: users });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminToggleUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const user = await userRepo.toggleUserActive(req.params.id);
    reply.send({ success: true, data: user });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminDeleteUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const ok = await userRepo.deleteUser(req.params.id);
    if (!ok) return reply.status(400).send({ success: false, message: "Cannot delete admin" });
    reply.send({ success: true, message: "User deleted" });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminGetAllSkills = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const skills = await skillRepo.getAllSkills({});
    reply.send({ success: true, data: skills });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminToggleSkill = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const skill = await skillRepo.adminToggleSkill(req.params.id);
    reply.send({ success: true, data: skill });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminGetCategories = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const cats = await categoryRepo.getAllAdmin();
    reply.send({ success: true, data: cats });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminCreateCategory = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const cat = await categoryRepo.create(req.body);
    reply.status(201).send({ success: true, data: cat });
  } catch (e: any) { reply.status(400).send({ success: false, message: e.message }); }
};

export const adminToggleCategory = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const cat = await categoryRepo.toggle(req.params.id);
    reply.send({ success: true, data: cat });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};

export const adminDeleteCategory = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    await categoryRepo.remove(req.params.id);
    reply.send({ success: true, message: "Category deleted" });
  } catch (e: any) { reply.status(500).send({ success: false, message: e.message }); }
};
