import type { ErrorHandler } from "hono";
import { BaseError } from "./BaseError.js";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorLogger: ErrorHandler = (err, c) => {
  let statusCode: ContentfulStatusCode = 500;
  let message = "An internal server error occurred";
  let type = "Internal Server Error";

  if (err instanceof BaseError) {
    statusCode = err.statusCode;
    message = err.message;
    type = err.name;
  }

  return c.json({ error: message, type }, statusCode);
};
