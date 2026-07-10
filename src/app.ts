import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/auth.js";
import { protectedRoutes } from "./routes/protected.js";
import { logger } from "hono/logger";
import { errorLogger } from "./utils/errors/logger.js";

const app = new Hono();

app.use(logger());
// Default CORS config, but should customize for your deployment environment
app.use("*", cors());

app.route("/auth", authRoutes);
app.route("/app", protectedRoutes);

app.notFound((c) => c.json({ error: "Resource Not Found" }, 404));
app.onError(errorLogger);

export { app };
