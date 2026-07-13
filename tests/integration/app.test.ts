import { testClient } from "hono/testing";
import { describe, it, expect } from "vitest";
import { app } from "../../src/app";

describe("API initialization", async () => {
  describe("GET /healthcheck", async () => {
    it("should return a 200 status code and 'ok' JSON response with db status", async () => {
      const client = testClient(app);

      const res = await client.healthcheck.$get();

      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ db: "ok", status: "ok" });
    });
  });

  describe("GET /missing-route", async () => {
    it("should return a 404 status code and 'Resource Not Found' JSON response", async () => {
      const res = await app.request("/missing-route");

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({ error: "Resource Not Found" });
    });
  });

  describe("GET anonymous /v1", async () => {
    it("should return 401 status code and 'Unauthorized' JSON response", async () => {
      const client = testClient(app);

      const res = await client.v1.$get();

      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({
        error: "Unauthorized",
        type: "AuthError",
      });
    });
  });
});
