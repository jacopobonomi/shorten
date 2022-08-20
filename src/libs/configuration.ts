import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: ["*"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "api-key"],
};

export const bodyParserConfig = {
  extended: true,
};
