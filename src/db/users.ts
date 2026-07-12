import type { User } from "../schemas/users.js";
import { userSchema } from "../schemas/users.js";
import { redisClient } from "./redis.js";

/** When more namespaces are added, we can move this to a shared key helper file */
export const userKey = (username: string) => `user:${username}`;

export const getUserByUsername = async (username: string) => {
  const user = await redisClient.get(userKey(username));
  if (!user) return null;

  return userSchema.parse(JSON.parse(user));
};

export const setUser = async (user: User) => {
  const validUser = userSchema.parse(user);

  return redisClient.set(
    userKey(validUser.username),
    JSON.stringify(validUser),
  );
};
