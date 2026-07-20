import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth.js";
import { protectedRoutes } from "./routes/protected.js";
import { logger } from "hono/logger";
import { errorLogger } from "./utils/errors/logger.js";
import { redisClient } from "./db/redis.js";

const initApp = new Hono()
  .use(logger())
  // Default CORS config, but should customize for your deployment environment
  .use("*", cors())
  .notFound((c) => c.json({ error: "Resource Not Found" }, 404))
  .onError(errorLogger);

// Chained to support a typed test client https://arc.net/l/quote/wafwvhky
const routes = initApp
  .get("/healthcheck", async (c) => {
    const db = await redisClient.ping();
    return c.json({
      db: db ? "ok" : "failed",
      status: "ok",
    });
  })
  .route("/auth", authRoutes)
  .route("/v1", protectedRoutes);

export { routes as app };
