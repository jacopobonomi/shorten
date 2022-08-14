import { Express } from "express";

import { putLink, getLink } from "../services/links";
import { ILink } from "../models/link";
import { Request, Response } from "express";

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/links.doc.json");

export default class LinksController {
  constructor(app: Express) {
    //Documentation
    app.use("/docs/links", swaggerUi.serve);
    app.get("/docs/links", swaggerUi.setup(swaggerDocument));
    
    app.get("/:_slug", async (req: Request, res: Response) => {
      const { _slug } = req.params;
      try {
        const { redirect }: ILink = (await getLink(_slug)) as ILink;
        redirect
          ? res.redirect(redirect)
          : res.status(404).json({ message: "Link not found" });
      } catch (error) {
        res.status(404).json({ message: "Slug not found" });
      }
    });

    app.post("/api/links", async (req: any, res: any) => {
      const { body: link } = req;
      res.json(await putLink(link));
    });

    app.delete("/api/links/:_id", async (req: any, res: any) => {
      const { _id } = req.params;
      res.json("result");
    });
  }
}
