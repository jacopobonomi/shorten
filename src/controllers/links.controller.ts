import { Express, Request, Response, NextFunction } from "express";
import { CacheContainer } from "node-ts-cache";
import { param, body, validationResult } from "express-validator";

import { ILink } from "../models/ILink";
import { putLink, getLink, deleteLink } from "../services/links.service";
import { config } from "../libs/config";
import { AppError, ErrorType } from "../libs/errorHandler";

// Create a validation middleware to remove duplication
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      "Validation failed",
      ErrorType.VALIDATION,
      400,
      { errors: errors.array() }
    );
  }
  next();
};

export default class LinksController {
  private cacheNode: CacheContainer;

  constructor(app: Express, apiGuard: any, cacheNode: CacheContainer) {
    this.cacheNode = cacheNode;

    // Route for redirecting to original URL
    app.get(
      "/:slug",
      [
        param("slug").isString().exists().trim(),
        validate
      ],
      this.getLinks
    );

    // Route for creating a new short link
    app.post(
      "/api/links",
      apiGuard,
      [
        body("redirect").isString().exists().trim().isURL(),
        body("readable").optional().isBoolean(),
        body("slug").optional().isString().trim(),
        validate
      ],
      this.insertLink
    );

    // Route for deleting a link
    app.delete(
      "/api/links/:slug",
      apiGuard,
      [
        param("slug").isString().exists().trim(),
        validate
      ],
      this.deleteLink
    );
  }

  /**
   * Deletes a link by slug
   */
  public deleteLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const result = await deleteLink(slug);
      
      // Clear cache for this slug
      await this.cacheNode.setItem(slug, null, { ttl: 0 });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a new short link
   */
  public insertLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createdLink = await putLink(req.body);
      
      // Clear cache entry if it exists
      await this.cacheNode.setItem(createdLink.slug, null, { ttl: 0 });
      
      res.json(createdLink);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Redirects to the original URL based on slug
   */
  public getLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      
      // Try to get link from cache first
      const cachedLink = await this.cacheNode.getItem<ILink>(slug);

      if (cachedLink) {
        res.redirect(cachedLink.redirect);
        return;
      }

      // If not in cache, get from database
      try {
        const link = await getLink(slug);
        
        // Cache the link for future requests
        await this.cacheNode.setItem(slug, link, { ttl: config.cache.ttl });
        
        res.redirect(link.redirect);
      } catch (error) {
        if (error instanceof AppError && error.type === ErrorType.NOT_FOUND) {
          res.status(404).json({ message: "Link not found", status: "error" });
          return;
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
}