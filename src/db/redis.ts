import {
  createClient,
  type RedisClientType,
  type RedisClientOptions,
} from "redis";

import { logger } from "../log.js";
import { InternalError } from "../utils/errors/BaseError.js";

class RedisClient {
  #client: RedisClientType | undefined;

  connect = async (
    options: RedisClientOptions = {
      url: process.env.REDIS_URL,
    },
  ) => {
    try {
      this.#client = createClient(options);
      this.#client.on("error", (err) => {
        logger.error(err);
      });
      this.#client.on("connect", () => {
        logger.info("Redis client connected");
      });
      this.#client.on("ready", () => {
        logger.info("Redis client ready");
      });

      await this.#client.connect();
      await this.#client.ping();
    } catch (err) {
      this.#cleanUp(err);
      throw err;
    }
  };

  close = async () => {
    try {
      await this.#client?.close();
    } catch (err) {
      this.#cleanUp(err);
      throw err;
    }
  };

  /** Destroys the client and removes any references to the client instance */
  #cleanUp = (err: unknown) => {
    logger.error(err);
    this.#client?.destroy();
    this.#client = undefined;
  };

  #requireClient = () => {
    if (!this.#client) throw new InternalError("Redis client not connected");
    return this.#client;
  };

  get = async (key: string) => {
    const client = this.#requireClient();

    return client.get(key);
  };

  set = async (key: string, value: string) => {
    const client = this.#requireClient();

    return client.set(key, value);
  };
}

// Create a singleton instance of the RedisClient
export const redisClient = new RedisClient();
// In a serverless environment, need to assign to a global variable and create only if not instantiated.
