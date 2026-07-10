import { Hono } from "hono";
import { basicAuthMiddleware } from "./middleware.js";
import type { SessionUser } from "../../schemas/users.js";

export const protectedRoutes = new Hono<{ Variables: { user: SessionUser } }>();

protectedRoutes.use("*", basicAuthMiddleware);

protectedRoutes.get("/", (c) => {
  const user = c.get("user");

  return c.text(`Hello ${user.username}`);
});
