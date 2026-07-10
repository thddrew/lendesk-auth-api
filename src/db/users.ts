import type { User } from "../../schemas/users.js";
import { userSchema } from "../../schemas/users.js";
import { redisClient } from "./redis.js";

export const getUserByUsername = async (username: string) => {
  const user = await redisClient.get(`user:${username}`);
  if (!user) return null;

  return userSchema.parse(JSON.parse(user));
};

export const setUser = async (user: User) => {
  const validUser = userSchema.parse(user);

  return redisClient.set(
    `user:${validUser.username}`,
    JSON.stringify(validUser),
  );
};
