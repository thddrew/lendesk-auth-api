import { describe, it, expect } from "vitest";
import { passwordValidationSchema, userSchema } from "./users.js";

const flattenIssues = (issues?: { message: string }[]) =>
  issues?.flatMap((i) => i.message) ?? [];

describe("userSchema", () => {
  it("should validate a valid user structure", () => {
    const user = {
      username: "testuser",
      hashedPassword: "$2b$12$1234567890",
      createdAt: new Date().toISOString(),
    };

    const result = userSchema.safeParse(user);

    expect(result.success).toBe(true);
  });

  it("should not validate an invalid username", () => {
    const user = {
      username: "",
      hashedPassword: "$2b$12$1234567890",
      createdAt: new Date().toISOString(),
    };

    const result = userSchema.safeParse(user);
    expect(result.success).toBe(false);
  });
});

describe("passwordValidationSchema", () => {
  it("should validate a valid password", () => {
    const password = "Password123!";
    const result = passwordValidationSchema.safeParse(password);
    expect(result.success).toBe(true);
  });

  it("should not validate an invalid password length", () => {
    const password = "ShPw1!";
    const result = passwordValidationSchema.safeParse(password);
    expect(result.success).toBe(false);
    expect(flattenIssues(result.error?.issues)).toContain(
      "Password must be at least 8 characters long",
    );
  });

  it("should not validate a password without an uppercase letter", () => {
    const password = "password123!";
    const result = passwordValidationSchema.safeParse(password);
    expect(result.success).toBe(false);
    expect(flattenIssues(result.error?.issues)).toContain(
      "Password must contain at least one uppercase letter",
    );
  });

  it("should not validate a password without a lowercase letter", () => {
    const password = "PASSWORD123!";
    const result = passwordValidationSchema.safeParse(password);
    expect(result.success).toBe(false);
    expect(flattenIssues(result.error?.issues)).toContain(
      "Password must contain at least one lowercase letter",
    );
  });

  it("should not validate a password without a number", () => {
    const password = "Password!ABC";
    const result = passwordValidationSchema.safeParse(password);
    expect(result.success).toBe(false);
    expect(flattenIssues(result.error?.issues)).toContain(
      "Password must contain at least one number",
    );
  });

  it("should not validate a password without a special character", () => {
    const password = "Password123";
    const result = passwordValidationSchema.safeParse(password);
    expect(result.success).toBe(false);
    expect(flattenIssues(result.error?.issues)).toContain(
      "Password must contain at least one special character",
    );
  });
});
