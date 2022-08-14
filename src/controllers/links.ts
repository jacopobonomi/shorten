import { Express } from "express";
import { Request, Response } from "express";
import { CacheContainer } from "node-ts-cache";
import { param } from "express-validator";
import swaggerUi from "swagger-ui-express";
import { env } from "process";

import { putLink, getLink, deleteLink } from "../services/links";

import { ILink } from "../models/ILink";

const { linksDocs } = require("../../docs/links.doc");

const CACHE_TTL: any = parseInt(env.CACHE_TTL as string) || 60;

export default class LinksController {
  private cacheNode;

  constructor(app: Express, cacheNode: CacheContainer) {
    this.cacheNode = cacheNode;

    //Documentation
    app.use("/links/docs", swaggerUi.serve);
    app.get("/links/docs", swaggerUi.setup(linksDocs));

    app.get(
      "/:_slug",
      [param("_slug").isString().exists().trim()],
      async (req: Request, res: Response) => this.getLinks(req, res)
    );

    app.post("/api/links", async (req: Request, res: Response) =>
      this.insertLink(req, res)
    );

    app.delete("/api/links/:_slug", async (req: Request, res: Response) =>
      this.deleteLink(req, res)
    );
  }

  public deleteLink = async (req: Request, res: Response) => {
    const { _slug } = req.params;
    return res.json(await deleteLink(_slug));
  };

  public insertLink = async (req: Request, res: Response) => {
    const { body: link } = req;
    const createdLink = (await putLink(link)) as ILink;

    await this.cacheNode.setItem(createdLink.slug, null, { ttl: 0 });

    res.json(createdLink);
  };

  public getLinks = async (req: Request, res: Response) => {
    const { _slug } = req.params;
    const cachedLink = await this.cacheNode.getItem<ILink>(_slug);

    if (cachedLink) {
      return res.redirect(cachedLink.redirect);
    } else {
      try {
        const link: ILink = (await getLink(_slug)) as ILink;
        const { redirect } = link;

        if (redirect) {
          this.cacheNode.setItem(_slug, link, { ttl: CACHE_TTL });
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
