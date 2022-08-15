import { Express, Request, Response } from "express";
import { CacheContainer } from "node-ts-cache";
import { param, body, validationResult } from "express-validator";
import { env } from "process";

import { ILink } from "../models/ILink";
import { putLink, getLink, deleteLink } from "../services/links.service";

const CACHE_TTL: any = parseInt(env.CACHE_TTL as string) || 60;

export default class LinksController {
  private cacheNode;

  constructor(app: Express, cacheNode: CacheContainer) {
    this.cacheNode = cacheNode;

    app.get(
      "/:_slug",
      [param("_slug").isString().exists().trim()],
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return this.getLinks(req, res);
      }
    );

    app.post(
      "/api/links",
      body("redirect").isString().exists().trim(),
      body("slug").isString().trim(),
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return this.insertLink(req, res);
      }
    );

    app.delete(
      "/api/links/:_slug",
      [param("_slug").isString().exists().trim()],
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return this.deleteLink(req, res);
      }
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
