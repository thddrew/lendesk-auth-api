import { afterAll, beforeAll } from "vitest";
import { redisClient } from "../src/db/redis.js";

beforeAll(async () => {
  await redisClient.connect({
    url: process.env.REDIS_URL_TEST,
  });
});

afterAll(async () => {
  await redisClient.close();
});
