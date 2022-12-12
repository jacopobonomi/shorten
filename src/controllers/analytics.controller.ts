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
  }
  

}
