import { Express, Request, Response } from "express";
import { validationResult } from "express-validator";

export const invalidBody = (err: any, res: any) => {
  return err ? res.status(400).json({ status: false, error: err }) : false;
};

export const validateBody = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return errors.array();
  }
  return false;
};
