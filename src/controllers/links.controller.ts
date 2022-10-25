import { Express, Request, Response } from "express";
import { CacheContainer } from "node-ts-cache";
import { param, body, validationResult } from "express-validator";
import { env } from "process";

import { ILink } from "../models/ILink";
import { putLink, getLink, deleteLink } from "../services/links.service";
import { validateBody } from "../libs/errorHandler";
import { pipe } from "../libs/common";

const CACHE_TTL: number = parseInt(env.CACHE_TTL as string) || 60;

export default class LinksController {
  private cacheNode;

  constructor(app: Express, apiGuard: any, cacheNode: CacheContainer) {
    this.cacheNode = cacheNode;

    app.get(
      "/:_slug",
      [param("_slug").isString().trim()],
      async (req: Request, res: Response) => {
        pipe(validateBody, (err: any) =>
          err
            ? res.status(400).json({ status: false, error: err })
            : (async () => {
                const { _slug } = req.params;
                const cachedLink = await this.cacheNode.getItem<ILink>(_slug);
                return cachedLink
                  ? res.status(200).json(cachedLink)
                  : this.getLinks(_slug).then((link: any) => {
                      link.redirect
                        ? res.redirect(link.redirect)
                        : res
                            .status(404)
                            .json({ status: false, error: link.error });
                    });
              })()
        )(req);
      }
    );

    app.post(
      "/api/links",
      apiGuard,
      body("redirect").isString().trim(),
      async (req: Request, res: Response) =>
        pipe(validateBody, (err: any) =>
          err
            ? res.status(400).json({ status: false, error: err })
            : res.json(this.insertLink(req.body))
        )(req)
    );

    app.delete(
      "/api/links/:_slug",
      apiGuard,
      [param("_slug").isString().trim()],
      async (req: Request, res: Response) =>
        pipe(validateBody, (err: any) =>
          err
            ? res.status(400).json({ status: false, error: err })
            : res.json(this.deleteLink(req.params._slug))
        )(req)
    );
  }

  public deleteLink = async (_slug: string) =>  await deleteLink(_slug);

  public insertLink = async (link: ILink) => {
    const createdLink = (await putLink(link)) as ILink;
    await this.cacheNode.setItem(createdLink.slug, null, { ttl: 0 });
    return createdLink;
  };

  public getLinks = async (_slug: string) => {
    try {
      const link: ILink = (await getLink(_slug)) as ILink;
      const { redirect } = link;

      await this.cacheNode.setItem(_slug, link, { ttl: CACHE_TTL });

      return {
        redirect: redirect ? redirect : null,
        error: redirect ? null : "Redirect not found",
      };
    } catch (error) {
      return {
        redirect: false,
        error: "Link not found",
      };
    }
  };
}
