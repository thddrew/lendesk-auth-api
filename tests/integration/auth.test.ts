import { testClient } from "hono/testing";
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../../src/app";
import { getTestUserAuthHeader, seedTestUser } from "../utils/seed";

describe("Authentication", async () => {
  beforeAll(async () => {
    await seedTestUser();
  });

  describe("GET /auth/authenticate", async () => {
    it("should return a 401 status code and 'Unauthorized' JSON response", async () => {
      const client = testClient(app);
      const res = await client.auth.authenticate.$get();

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Unauthorized",
        type: "AuthError",
      });
    });

    it("should return a 200 status code and 'Hello testuser' JSON response", async () => {
      const client = testClient(app);

      const res = await client.auth.authenticate.$get(undefined, {
        headers: {
          Authorization: getTestUserAuthHeader(),
        },
      });

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        message: "Authenticated as testuser",
        success: true,
      });
    });
  });
});
