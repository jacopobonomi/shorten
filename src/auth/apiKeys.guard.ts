import { env } from "process";
import { Request, Response, NextFunction } from "express";

export const apiKeyGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (!env.API_KEYS) {
    console.warn("No API Keys found in env, all requests will be allowed");
    next();
    return;
  }

  const unauthorizedMessage = {
    message: "Unauthorized",
  };

  const authorization: string | undefined = req.header("api-key");
  if (authorization === undefined) {
    return res.status(400).json(unauthorizedMessage);
  }
  const apiKeys: string[] = (env.API_KEYS as string)
    .replace('"', "")
    .trim()
    .split(",");
  return !apiKeys.includes(authorization)
    ? res.status(400).json(unauthorizedMessage)
    : next();
};
