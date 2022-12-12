require("dotenv").config();
const bodyParser = require("body-parser");

import express, { Express, Response, NextFunction } from "express";
import { env } from "process";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";

import cacheNode from "./src/libs/cache";
import rateLimitModule from "./src/libs/rateLimit";
import { defaultDocumentation } from "./src/libs/documentation";
import { bodyParserConfig } from "./src/libs/configuration";
import { invalidBody } from "./src/libs/errorHandler";

import { apiKeyGuard } from "./src/auth/apiKeys.guard";

import AnalyticsController from "./src/controllers/analytics.controller";

import LinksRoute from "./src/routes/links.route";

const app: Express = express();
const port: number = parseInt(env.PORT as string) || 3000;

/*app.use((req: any, err: any, res: Response, next: NextFunction) => {
  req.body && err ? invalidBody(err, res) : next();
});*/

app.use(morgan("common"));
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded(bodyParserConfig));

defaultDocumentation(app);
rateLimitModule(app);

const boot = () => {
  new LinksRoute(app, apiKeyGuard, cacheNode);
  new AnalyticsController(app, apiKeyGuard, cacheNode);

  app.listen(port, () =>
    console.log(`
    +-+-+-+-+-+-+-+
    |S|h|o|r|t|e|n|
    +-+-+-+-+-+-+-+                                        
    Start on port ${port}`)
  );
};

boot();
