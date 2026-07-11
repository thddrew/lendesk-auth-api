import { Hono } from "hono";
import { basicAuthMiddleware } from "./middleware.js";
import type { SessionUser } from "../schemas/users.js";

export const protectedRoutes = new Hono<{ Variables: { user: SessionUser } }>()
  .use("*", basicAuthMiddleware)
  .get("/", (c) => {
    const user = c.get("user");

    return c.json(
      {
        message: `Hello ${user.username}`,
      },
      200,
    );
  });
