import { hash, compare } from "bcrypt";
import type { User } from "../schemas/users.js";

const SALT_ROUNDS = 12;

export const hashPassword = (password: string) => hash(password, SALT_ROUNDS);

export const verifyPassword = (password: string, hashedPassword: string) =>
  compare(password, hashedPassword);

export const createUser = async (username: string, password: string) => {
  const hashedPassword = await hashPassword(password);

  const user: User = {
    username,
    hashedPassword,
    createdAt: new Date().toISOString(),
  };

  return user;
};
