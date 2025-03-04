import { Request, Response, NextFunction } from "express";
import { config } from "../libs/config";
import { AppError, ErrorType } from "../libs/errorHandler";

export const apiKeyGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const apiKeys = config.security.apiKeys;
  
  // Skip validation if no API keys configured
  if (!apiKeys || apiKeys.length === 0) {
    console.warn("No API Keys found in env, all requests will be allowed");
    next();
    return;
  }

  const authorization: string | undefined = req.header("api-key");
  
  // Return error if no API key provided
  if (!authorization) {
    const error = new AppError(
      "API key required",
      ErrorType.UNAUTHORIZED,
      401,
      { header: "api-key" }
    );
    
    return res.status(error.statusCode).json({
      message: error.message,
      status: "error"
    });
  }
  
  // Validate the API key
  if (!apiKeys.includes(authorization)) {
    const error = new AppError(
      "Invalid API key",
      ErrorType.UNAUTHORIZED,
      401
    );
    
    return res.status(error.statusCode).json({
      message: error.message,
      status: "error"
    });
  }
  
  // Key is valid, proceed
  next();
};