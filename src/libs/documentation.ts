import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const { linksDocs, analyticsDocs } = require("../../docs/links.doc");

export const defaultDocumentation = (app: Express) => {
  //Serve Swagger links
  app.use("/links/docs", swaggerUi.serve);
  app.get("/links/docs", swaggerUi.setup(linksDocs));

  //Serve Swagger analytics
  app.use("/analytics/docs", swaggerUi.serve);
  app.get("/analytics/docs", swaggerUi.setup(analyticsDocs));
};
