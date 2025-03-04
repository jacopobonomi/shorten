require("dotenv").config();
import express, { Express } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";

import { config } from "./src/libs/config";
import cacheNode from "./src/libs/cache";
import rateLimitModule from "./src/libs/rateLimit";
import { defaultDocumentation } from "./src/libs/documentation";

import { ErrorHandler } from "./src/libs/errorHandler";
import { apiKeyGuard } from "./src/auth/apiKeys.guard";
import LinksController from "./src/controllers/links.controller";

const app: Express = express();
const port: number = config.app.port;

const corsConfig: CorsOptions = {
  origin: ["*"],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "api-key"],
};

const bodyParserConfig = {
  extended: true,
};

app.use(morgan("common"));
app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.urlencoded(bodyParserConfig));

defaultDocumentation(app);
rateLimitModule(app);

new ErrorHandler(app);
new LinksController(app, apiKeyGuard, cacheNode);

app.listen(port, () =>
  console.log(`
+-+-+-+-+-+-+-+
|S|h|o|r|t|e|n|
+-+-+-+-+-+-+-+               
                             
Start on port ${port}`)
);
