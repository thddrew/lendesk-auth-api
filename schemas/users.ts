import { z } from "zod";

const usernameSchema = z.string().min(3).max(100);

export const passwordValidationSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const userSchema = z.object({
  username: usernameSchema,
  hashedPassword: z.string(),
  createdAt: z.iso.datetime(),
});

export const sessionUserSchema = userSchema.omit({ hashedPassword: true });

export const createUserSchema = z.object({
  username: usernameSchema,
  password: passwordValidationSchema,
});

export type User = z.infer<typeof userSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
