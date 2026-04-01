import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";

dotenv.config();

const server = Fastify({ logger: false });

server.register(cors, { origin: "http://localhost:3000", credentials: true });
server.register(jwt, { secret: process.env.JWT_SECRET as string });

server.register(registerRoutes);

server.get("/", async () => ({ status: "✅ Skill Swap API v2.0 running" }));

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 5000, host: "0.0.0.0" });
    console.log(`🚀 Server → http://localhost:${process.env.PORT || 5000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
