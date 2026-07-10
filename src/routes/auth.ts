import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { basicAuthMiddleware } from "./middleware.js";
import { createUserSchema } from "../../schemas/users.js";
import { AuthError } from "../utils/errors/BaseError.js";
import { createUser } from "../../services/auth.js";
import { getUserByUsername, setUser } from "../db/users.js";

export const authRoutes = new Hono();

authRoutes.get("/authenticate", basicAuthMiddleware);

authRoutes.post(
  "/sign-up",
  zValidator("form", createUserSchema, (result) => {
    if (!result.success) {
      throw new AuthError("Invalid username or password");
    }
  }),
  async (c) => {
    const { username, password } = c.req.valid("form");

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
