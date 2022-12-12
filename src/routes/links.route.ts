import { Express, Request, Response } from "express";
import { CacheContainer } from "node-ts-cache";
import { param, body } from "express-validator";
import { validateBody } from "../libs/errorHandler";
import { pipe } from "../libs/common";
import { ILink } from "../models/ILink";
import LinksController from "../controllers/links.controller";

export default class LinksRoute {
  private cacheNode;
  private LinksController;
  constructor(app: Express, apiGuard: any, cacheNode: CacheContainer) {
    /**
     * LinksController is a class that contains the logic to handle the requests
     * It's used to separate the logic from the routes
     * It's also used to cache the links in memory, as a Singleton class it's instantiated only once to be used in all the routes
     * That's to avoid to instantiate the class in every route and to avoid to cache the links in memory for every route
     */
    this.cacheNode = cacheNode;
    this.LinksController = new LinksController(cacheNode);

    /**
     * @route GET /:slug
     * @group Links - Operations about links
     * @param {string} _slug required - Slug of the link
     * @returns {object} 302 - Redirect to the link
     * @returns {Error}  404 - Link not found
     * @returns {Error}  400 - Bad request
     * Returns the link with the given slug or 404 if not found
     * params is validated with express-validator and the error is handled by the errorHandler middleware
     * */
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
                  ? res.redirect(cachedLink.redirect)
                  : this.LinksController.getLink(_slug).then((link: any) => {
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

    /**
     * @route GET /api/links
     * @group Links - Operations about links
     * @returns {object} 200 - List of links
     * @returns {Error}  404 - Links not found
     * @returns {Error}  400 - Bad request
     * Returns the list of links or 404 if not found any link
     *
     */
    app.get("/api/links", [], async (req: Request, res: Response) => {
      pipe(validateBody, (err: any) =>
        err
          ? res.status(400).json({ status: false, error: err })
          : (async () => {
              const cachedLinks: ILink[] =
                (await this.cacheNode.getItem<ILink[]>("all")) || [];
              return cachedLinks.length > 0
                ? res.status(200).json(cachedLinks)
                : this.LinksController.getLinks().then((links: any) => {
                    links
                      ? res.json(links)
                      : res
                          .status(404)
                          .json({ status: false, error: links.error });
                  });
            })()
      )(req);
    });

    /**
     * @route POST /api/links
     * @group Links - Operations about links
     * @body {string} redirect required - Redirect of the link
     * @returns {object} 200 - Link created
     * @returns {Error}  400 - Bad request
     * Returns the link created
     * if pass slug in body, it will be used as slug of the link otherwise it will be generated automatically
     * body is validated with express-validator and the error is handled by the errorHandler middleware
     */
    app.post(
      "/api/links",
      apiGuard,
      body("redirect").isString().trim(),
      async (req: Request, res: Response) =>
        pipe(validateBody, (err: any) =>
          err
            ? res.status(400).json({ status: false, error: err })
            : res.json(this.LinksController.insertLink(req.body))
        )(req)
    );

    /**
     * @route DELETE /api/links/:slug
     * @group Links - Operations about links
     * @param {string} _slug required - Slug of the link
     * @returns {object} 200 - Link deleted
     * @returns {Error}  400 - Bad request
     * Returns the link deleted
     * param is validated with express-validator and the error is handled by the errorHandler middleware
     */
    app.delete(
      "/api/links/:_slug",
      apiGuard,
      [param("_slug").isString().trim()],
      async (req: Request, res: Response) =>
        pipe(validateBody, (err: any) =>
          err
            ? res.status(400).json({ status: false, error: err })
            : res.json(this.LinksController.deleteLink(req.params._slug))
        )(req)
    );
  }
}
