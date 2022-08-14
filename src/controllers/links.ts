import { Express } from "express";
import { Request, Response } from "express";
import { Cache, CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

import { putLink, getLink, deleteLink } from "../services/links";

import { ILink } from "../models/ILink";

const swaggerUi = require("swagger-ui-express");
const { linksDocs } = require("../../docs/links.doc");
const linksCache = new CacheContainer(new MemoryStorage());

export default class LinksController {
  constructor(app: Express, cacheNode: any) {
    //Documentation
    app.use("/docs/links", swaggerUi.serve);
    app.get("/docs/links", swaggerUi.setup(linksDocs));

    app.get("/:_slug", async (req: Request, res: Response) => {
      const { _slug } = req.params;
      const cachedLink = await linksCache.getItem<ILink>(_slug);

      if (cachedLink) {
        return res.redirect(cachedLink.redirect);
      } else {
        try {
          const link: ILink = (await getLink(_slug)) as ILink;
          const { redirect } = link;

          if (redirect) {
            await linksCache.setItem(_slug, link, { ttl: 60 });
            res.redirect(redirect);
          } else {
            res.status(404).json({ message: "redirect not found" });
          }
        } catch (error) {
          res.status(404).json({ message: "slug not found" });
        }
      }
    });

    app.post("/api/links", async (req: any, res: any) => {
      const { body: link } = req;
      res.json(await putLink(link));
    });

    app.delete("/api/links/:_id", async (req: any, res: any) => {
      const { _id } = req.params;
      res.json(await deleteLink(_id));
      res.json("result");
    });
  }
}
