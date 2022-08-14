import express, { Express } from "express";
const bodyParser = require("body-parser");
require('dotenv').config();

import LinksController from "./src/controllers/links";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

new LinksController(app);

app.listen(port, () => console.log(`
+-+-+-+-+-+-+-+
|S|h|o|r|t|e|n|
+-+-+-+-+-+-+-+               
                             
Start on port ${port}`));