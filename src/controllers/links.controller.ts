import { CacheContainer } from "node-ts-cache";
import { env } from "process";

import { ILink } from "../models/ILink";
import { IRedirect } from "../models/IRedirect";
import {
  putLink,
  getLink,
  deleteLink,
  getLinks,
} from "../services/links.service";

const CACHE_TTL: number = parseInt(env.CACHE_TTL as string) || 60;

export default class LinksController {
  private cacheNode: CacheContainer;

  constructor(cacheNode: CacheContainer) {
    this.cacheNode = cacheNode;
  }

  public deleteLink = async (_slug: string) => {
    await this.cacheNode.setItem(_slug, null, { ttl: 0 });
    await this.cacheNode.setItem("all-links", null, { ttl: 0 });
    return await deleteLink(_slug);
  };

  public insertLink = async (link: ILink): Promise<ILink> => {
    const createdLink: ILink = (await putLink(link)) as ILink;
    this.cacheNode.clear();
    await this.cacheNode.setItem(createdLink.slug, null, { ttl: 0 });
    await this.cacheNode.setItem("all-links", null, { ttl: 0 });

    return createdLink;
  };

  public getLink = async (_slug: string): Promise<IRedirect> => {
    try {
      const link: ILink = (await getLink(_slug)) as ILink;
      const { redirect } = link;

      await this.cacheNode.setItem(_slug, link, { ttl: CACHE_TTL });

      return {
        redirect: redirect ? redirect : undefined,
        error: redirect ? undefined : "Redirect not found",
      };
    } catch (error) {
      return {
        redirect: false,
        error: "Link not found",
      };
    }
  };

  public getLinks = async (): Promise<ILink[]> => {
    try {
      const links: ILink[] | PromiseLike<ILink[]>[] =
        (await getLinks()) as ILink[];
      await this.cacheNode.setItem("all-links", links, { ttl: CACHE_TTL });
      return links;
    } catch (error) {
      return [];
    }
  };
}
