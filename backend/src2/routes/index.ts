import { FastifyInstance } from "fastify";
import * as c from "../controllers";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const auth = { preHandler: [authenticate] };
const admin = { preHandler: [requireAdmin] };

export const registerRoutes = async (fastify: FastifyInstance) => {
  // Auth
  fastify.post("/api/auth/register", c.register);
  fastify.post("/api/auth/login", c.login);
  fastify.get("/api/auth/me", auth, c.getMe);
  fastify.get("/api/users/:id", c.getUserProfile);

  // Skills
  fastify.get("/api/skills", c.getAllSkills);
  fastify.post("/api/skills", auth, c.createSkill);
  fastify.get("/api/skills/my", auth, c.getMySkills);
  fastify.delete("/api/skills/:id", auth, c.deleteSkill);

  // Categories
  fastify.get("/api/categories", c.getCategories);

  // Swaps
  fastify.post("/api/swaps", auth, c.createSwap);
  fastify.get("/api/swaps/my", auth, c.getMySwaps);
  fastify.get("/api/swaps/:id", auth, c.getSwapById);
  fastify.patch("/api/swaps/:id/status", auth, c.updateSwapStatus);

  // Sessions
  fastify.post("/api/sessions", auth, c.createSession);
  fastify.get("/api/sessions/my", auth, c.getMySessions);
  fastify.get("/api/sessions/swap/:swapId", auth, c.getSessionsBySwap);
  fastify.patch("/api/sessions/:id", auth, c.updateSession);

  // Messages
  fastify.post("/api/messages", auth, c.sendMessage);
  fastify.get("/api/messages/:swapId", auth, c.getMessages);

  // Reviews
  fastify.post("/api/reviews", auth, c.createReview);
  fastify.get("/api/reviews/my", auth, c.getMyReviews);

  // Admin
  fastify.get("/api/admin/stats", admin, c.adminGetStats);
  fastify.get("/api/admin/users", admin, c.adminGetUsers);
  fastify.patch("/api/admin/users/:id/toggle", admin, c.adminToggleUser);
  fastify.delete("/api/admin/users/:id", admin, c.adminDeleteUser);
  fastify.get("/api/admin/skills", admin, c.adminGetAllSkills);
  fastify.patch("/api/admin/skills/:id/toggle", admin, c.adminToggleSkill);
  fastify.get("/api/admin/categories", admin, c.adminGetCategories);
  fastify.post("/api/admin/categories", admin, c.adminCreateCategory);
  fastify.patch("/api/admin/categories/:id/toggle", admin, c.adminToggleCategory);
  fastify.delete("/api/admin/categories/:id", admin, c.adminDeleteCategory);
};
