import { Express, Response, NextFunction, ErrorRequestHandler } from "express";

export const invalidBody = (err: any, res: any) => {
  return err
    ? res.status(400).json({ status: false, error: "Enter valid json body" })
    : false;
};
