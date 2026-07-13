import { basicAuth } from "hono/basic-auth";
import { verifyPassword } from "../services/auth.js";
import { sessionUserSchema } from "../schemas/users.js";
import { getUserByUsername } from "../db/users.js";
import { AuthError } from "../utils/errors/BaseError.js";

/**
 * Basic authentication middleware for protecting routes
 * This middleware will return a http response with status 200 for successful authentication,
 * and a 401 for failed verifications.
 */
export const basicAuthMiddleware = basicAuth({
  verifyUser: async (username, password, ctx) => {
    const user = await getUserByUsername(username);
    if (!user) return false;

    const isVerified = await verifyPassword(password, user.hashedPassword);
    if (isVerified) {
      const sanitizedUser = sessionUserSchema.parse(user);
      ctx.set("user", sanitizedUser);
      return true;
    }

    return false;
  },
  invalidUserMessage: (ctx) => {
    // Throwing a custom error to override the default middleware error response
    throw new AuthError();
  },
});
