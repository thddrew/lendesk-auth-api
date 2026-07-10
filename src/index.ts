import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { redisClient } from "./db/redis.js";

try {
  await redisClient.connect();
} catch (err) {
  console.error(err);
  process.exit(1);
}

// use node-server adapter here to deploy on a long running node.js server
serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
