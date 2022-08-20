import { Express, Request, Response } from "express";
import { CacheContainer } from "node-ts-cache";
import { param, body, validationResult } from "express-validator";
import { env } from "process";

import { ILink } from "../models/ILink";
import { putLink, getLink, deleteLink } from "../services/links.service";

const CACHE_TTL: number = parseInt(env.CACHE_TTL as string) || 60;

export default class AnalyticsController {
  private cacheNode;

  constructor(app: Express, apiGuard: any, cacheNode: CacheContainer) {
    this.cacheNode = cacheNode;

    app.get(
      "/api/analytics/:_slug",
      apiGuard,
      [param("_slug").isString().exists().trim()],
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        return !errors.isEmpty()
          ? res.status(400).json({ errors: errors.array() })
          : this.getAnalyticsData(req, res);
      }
    );

    app.put(
      "/api/analytics/:_slug",
      apiGuard,
      [param("_slug").isString().exists().trim()],
      async (req: Request, res: Response) => {
        const errors = validationResult(req);
        return !errors.isEmpty()
          ? res.status(400).json({ errors: errors.array() })
          : this.updateAnalyticsSettings(req, res);
      }
    );
  }

  public deleteAnalytics = async (req: Request, res: Response) => {
    const { body: link } = req;
    const createdLink = (await putLink(link)) as ILink;

    await this.cacheNode.setItem(createdLink.slug, null, { ttl: 0 });

    res.json(createdLink);
  };

  public updateAnalyticsSettings = async (req: Request, res: Response) => {
    const { body: link } = req;
    const createdLink = (await putLink(link)) as ILink;

    await this.cacheNode.setItem(createdLink.slug, null, { ttl: 0 });

    res.json(createdLink);
  };

  public getAnalyticsData = async (req: Request, res: Response) => {
    const { _slug, forceRefresh } = req.params;
    if (forceRefresh) {
    } else {
      const cachedAnalyticsData = await this.cacheNode.getItem<ILink>(_slug);
      if (cachedAnalyticsData) {
        return res.json(cachedAnalyticsData.redirect);
      } else {
        try {
          const link: ILink = (await getLink(_slug)) as ILink;
          const { redirect } = link;

          if (redirect) {
            this.cacheNode.setItem(`analytics_${_slug}`, link, {
              ttl: CACHE_TTL,
            });
            return res.redirect(redirect);
          } else {
            return res.status(404).json({ message: "redirect not found" });
          }
        } catch (error) {
          return res.status(404).json({ message: "slug not found" });
        }
      }
    }
  };
}
