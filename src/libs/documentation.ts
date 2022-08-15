import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const { linksDocs } = require("../../docs/links.doc");

export const defaultDocumentation = (app: Express) => {
  app.use("/links/docs", swaggerUi.serve);
  app.get("/links/docs", swaggerUi.setup(linksDocs));
};
