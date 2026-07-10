import pino from "pino";

export const logger = pino(
  process.env.NODE_ENV === "production"
    ? undefined
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      },
);
