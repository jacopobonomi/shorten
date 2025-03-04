import { Express, Response, Request, NextFunction } from "express";
import { IError } from "../models/IError";

export enum ErrorType {
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  DB_ERROR = "DB_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

export class AppError extends Error {
  public type: ErrorType;
  public statusCode: number;
  public details?: any;

  constructor(message: string, type: ErrorType, statusCode: number, details?: any) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
  }
}

export class ErrorHandler {
  constructor(app: Express) {
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      this.handleError(err, req, res, next);
    });
  }

  public handleError(err: any, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof AppError) {
      return this.handleAppError(err, res);
    }

    if (err.status === 400 && "body" in err) {
      return this.invalidBody(err, res);
    }

    console.error("Unhandled error:", err);
    res.status(500).json({
      status: false,
      error: "Internal server error",
    });
  }

  private handleAppError(err: AppError, res: Response): void {
    const response: IError = {
      message: err.message,
      status: "error",
    };

    if (err.details) {
      (response as any).details = err.details;
    }

    res.status(err.statusCode).json(response);
  }

  private invalidBody(err: any, res: Response): void {
    console.error("Invalid body error:", err);
    res.status(400).json({
      status: false,
      error: "Enter valid JSON body",
    });
  }
}