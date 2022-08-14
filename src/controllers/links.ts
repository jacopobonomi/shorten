import { Express } from "express";
import { Request, Response } from "express";
import { CacheContainer } from "node-ts-cache";
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

    app.get("/:_slug", async (req: Request, res: Response) =>
      this.getLinks(req, res)
    );

    app.post("/api/links", async (req: Request, res: Response) => {
      this.insertLink(req, res);
    });

    app.delete("/api/links/:_id", async (req: Request, res: Response) => {
      this.deleteLink(req, res);
    });
  }

  public deleteLink = async (req: Request, res: Response) => {
    const { _id } = req.params;
    res.json(await deleteLink(_id));
    res.json("result");
  };

  public insertLink = async (req: Request, res: Response) => {
    const { body: link } = req;
    const createdLink = (await putLink(link)) as ILink;
    await linksCache.setItem(createdLink.slug, null, { ttl: 60 });
    res.json(createdLink);
  };

  public getLinks = async (req: Request, res: Response) => {
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
          return res.redirect(redirect);
        } else {
          return res.status(404).json({ message: "redirect not found" });
        }
      } catch (error) {
        return res.status(404).json({ message: "slug not found" });
      }
    }
  };
  
}
