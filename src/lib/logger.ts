import "server-only";

type Level = "info" | "error";

type Meta = Record<string, unknown>;

function log(level: Level, message: string, meta?: Meta) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  console.info(JSON.stringify(payload));
}

export const logger = {
  info: (message: string, meta?: Meta) => log("info", message, meta),
  error: (message: string, meta?: Meta) => log("error", message, meta),
};
