require("dotenv").config();
const bodyParser = require("body-parser");

import express, { Express } from "express";
import { env } from "process";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";

import cacheNode from "./src/libs/cache";
import rateLimitModule from "./src/libs/rateLimit";
import { defaultDocumentation } from "./src/libs/documentation";

import { ErrorHandler } from "./src/libs/errorHandler";
import LinksController from "./src/controllers/links.controller";

const app: Express = express();
const port: number = parseInt(env.PORT as string) || 3000;
const corsConfig = {
  origin: ["*"],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const bodyParserConfig = {
  extended: true,
};
const errorHandler = new ErrorHandler(app);

app.use(morgan("common"));
app.use(compression());
app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.urlencoded(bodyParserConfig));

defaultDocumentation(app);
rateLimitModule(app);
new LinksController(app, cacheNode);

app.listen(port, () =>
  console.log(`
+-+-+-+-+-+-+-+
|S|h|o|r|t|e|n|
+-+-+-+-+-+-+-+               
                             
Start on port ${port}`)
);
