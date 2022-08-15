import express, { Express, ErrorRequestHandler } from "express";
const bodyParser = require("body-parser");
require("dotenv").config();

import cacheNode from "./src/libs/cache";
import LinksController from "./src/controllers/links";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app: Express = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too request from this IP, please try again after a minute"
});

app.use(morgan("common"));
app.use(compression());
app.use(limiter); //  apply to all requests

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//TODO: migrate logic to separate file, for better error handling
app.use((err: any, req: any, res: any, next: any) => {
  if (err.status === 400 && "body" in err) {
    console.error(err);
    return res
      .status(400)
      .json({ status: false, error: "Enter valid json body" });
  }
  next();
});

new LinksController(app, cacheNode);

app.listen(port, () =>
  console.log(`
+-+-+-+-+-+-+-+
|S|h|o|r|t|e|n|
+-+-+-+-+-+-+-+               
                             
Start on port ${port}`)
);
