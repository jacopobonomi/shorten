import { Express } from "express";

import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too request from this IP, please try again after a minute",
});

export default (app: Express) => {
  app.use(limiter);
};
