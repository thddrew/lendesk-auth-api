import { hash, compare } from "bcrypt";
import type { User } from "../schemas/users.js";

/** Number of rounds to encrypt passwords using bcrypt */
const SALT_ROUNDS = 12;

/** Hash a password with an auto-generated salt */
export const hashPassword = (password: string) => hash(password, SALT_ROUNDS);

/** Verify a password against a hashed password */
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
