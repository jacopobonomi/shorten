export const linksDocs = {
  swagger: "2.0",
  info: {
    title: "Shorten links API",
    version: "v1",
    description: "API for creating and managing shortened URLs"
  },
  paths: {
    "/:slug": {
      get: {
        operationId: "getRedirect",
        summary: "Redirect to original link",
        description: "Redirects the user to the original URL associated with the provided slug",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            type: "string",
            description: "The short URL slug"
          }
        ],
        produces: ["application/json"],
        responses: {
          "301": {
            description: "Successful redirect to the original URL"
          },
          "404": {
            description: "Slug not found",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Link not found"
                },
                status: {
                  type: "string",
                  example: "error"
                }
              }
            }
          }
        }
      }
    },
    "/api/links": {
      post: {
        operationId: "createLink",
        summary: "Create a new shortened link",
        description: "Creates a new shortened URL with optional custom slug",
        security: [
          {
            apiKey: []
          }
        ],
        parameters: [
          {
            name: "body",
            in: "body",
            required: true,
            schema: {
              type: "object",
              required: ["redirect"],
              properties: {
                redirect: {
                  type: "string",
                  description: "The original URL to redirect to",
                  example: "https://example.com/very-long-url-that-needs-shortening"
                },
                slug: {
                  type: "string",
                  description: "Custom slug (optional)",
                  example: "my-custom-slug"
                },
                readable: {
                  type: "boolean",
                  description: "Generate a readable slug if true and no custom slug provided",
                  example: true
                }
              }
            }
          }
        ],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "Successfully created shortened link",
            schema: {
              type: "object",
              properties: {
                redirect: {
                  type: "string",
                  example: "https://example.com/very-long-url-that-needs-shortening"
                },
                slug: {
                  type: "string",
                  example: "abc123"
                },
                short_link: {
                  type: "string",
                  example: "https://short.url/abc123"
                }
              }
            }
          },
          "400": {
            description: "Validation error",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Validation failed"
                },
                errors: {
                  type: "array",
                  items: {
                    type: "object"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/links/{slug}": {
      delete: {
        operationId: "deleteLink",
        summary: "Delete a shortened link",
        description: "Deletes a shortened URL by its slug",
        security: [
          {
            apiKey: []
          }
        ],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            type: "string",
            description: "The short URL slug to delete"
          }
        ],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "Successfully deleted the link",
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: true
                }
              }
            }
          },
          "404": {
            description: "Slug not found",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Link not found"
                }
              }
            }
          }
        }
      }
    }
  },
  securityDefinitions: {
    apiKey: {
      type: "apiKey",
      name: "x-api-key",
      in: "header",
      description: "API key for authentication"
    }
  },
  consumes: ["application/json"],
  produces: ["application/json"]
};