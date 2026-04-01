import { FastifyRequest, FastifyReply } from "fastify";
import { JwtPayload } from "../types";

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await req.jwtVerify();
  } catch {
    reply.status(401).send({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

export const requireAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await req.jwtVerify();
    const user = req.user as JwtPayload;
    if (user.role !== "admin") {
      reply.status(403).send({ success: false, message: "Forbidden: Admins only" });
    }
  } catch {
    reply.status(401).send({ success: false, message: "Unauthorized" });
  }
};
