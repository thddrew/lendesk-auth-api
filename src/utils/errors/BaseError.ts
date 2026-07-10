import type { ContentfulStatusCode } from "hono/utils/http-status";

export class BaseError extends Error {
  constructor(
    public statusCode: ContentfulStatusCode,
    message: string,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = this.constructor.name;
  }
}

export class AuthError extends BaseError {
  constructor(message: string) {
    super(401, message);
  }
}

/** Provide a safe string message to the user, but log the real descriptive error to our logging service */
export class InternalError extends BaseError {
  constructor(message: string, cause?: unknown) {
    super(500, "An internal server error occurred", cause);
    // log the real descriptive error to our logging service
    console.error(message, cause);
  }
}
