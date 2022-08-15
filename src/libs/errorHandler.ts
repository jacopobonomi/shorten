import { Express, Response, NextFunction, ErrorRequestHandler } from "express";

export class ErrorHandler {
  constructor(app: Express) {
    app.use((err: any, res: Response, next: NextFunction) => {
      this.invalidBody(err, res);
      next();
    });
  }
  invalidBody(err: any, res: any) {
    if (err.status === 400 && "body" in err) {
      console.error(err);
      return res
        .status(400)
        .json({ status: false, error: "Enter valid json body" });
    }
  }
}
