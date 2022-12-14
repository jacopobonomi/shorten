export const linksDocs = {
  swagger: "2.0",
  info: {
    title: "Shorten links API",
    version: "v1",
  },
  paths: {
    "/:slug": {
      get: {
        operationId: "getRedirec",
        summary: "Get redirect to original link",
        produces: ["application/json"],
        responses: {
          "200": {
            description: "301 response",
          },
          "404": {
            description: "404 response",
            examples: {
              "application/json": ' {\n    "message": "Slug not found"\n  }',
            },
          },
        },
      },
    },
  },
  consumes: ["application/json"],
};
