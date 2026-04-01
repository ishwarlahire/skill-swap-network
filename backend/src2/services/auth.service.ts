import bcrypt from "bcrypt";
import { RegisterBody, LoginBody } from "../types";
import * as userRepo from "../repositories/user.repository";

export const register = async (data: RegisterBody) => {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new Error("Email already registered");
  const password_hash = await bcrypt.hash(data.password, 10);
  return userRepo.createUser({ ...data, password_hash });
};

export const login = async (data: LoginBody) => {
  const user = await userRepo.findByEmail(data.email);
  if (!user) throw new Error("Invalid email or password");
  if (!user.is_active) throw new Error("Your account has been deactivated. Contact admin.");
  const valid = await bcrypt.compare(data.password, user.password_hash);
  if (!valid) throw new Error("Invalid email or password");
  return user;
};
