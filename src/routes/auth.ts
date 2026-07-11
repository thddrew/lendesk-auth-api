import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { basicAuthMiddleware } from "./middleware.js";
import { createUserSchema, type SessionUser } from "../schemas/users.js";
import { AuthError } from "../utils/errors/BaseError.js";
import { createUser } from "../services/auth.js";
import { getUserByUsername, setUser } from "../db/users.js";

export const authRoutes = new Hono<{
  Variables: {
    user?: SessionUser;
  };
}>()
  .get("/authenticate", basicAuthMiddleware, (c) =>
    c.json(
      {
        message: `Authenticated as ${c.get("user")?.username}`,
        success: true,
      },
      200,
    ),
  )
  .post(
    "/sign-up",
    zValidator("json", createUserSchema, (result) => {
      if (!result.success) {
        throw new AuthError("Invalid username or password");
      }
    }),
    async (c) => {
      const { username, password } = c.req.valid("json");

      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        throw new AuthError("User already exists");
      }

      const newUser = await createUser(username, password);
      await setUser(newUser);

      return c.json(
        {
          message: "User created successfully",
          success: true,
        },
        200,
      );
    },
  );
