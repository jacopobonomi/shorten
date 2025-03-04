// Required environment variables - will throw error if not set
const requiredEnvVars = ['AWS_REGION'];

// Validate required environment variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Required environment variable ${varName} is not set`);
  }
});

export interface AppConfig {
  aws: {
    region: string;
  };
  app: {
    port: number;
    baseUrl: string;
  };
  db: {
    tableName: string;
  };
  cache: {
    ttl: number;
  };
  security: {
    apiKeys: string[] | null;
  };
}

// Parse and provide typed configuration
export const config: AppConfig = {
  aws: {
    region: process.env.AWS_REGION!,
  },
  app: {
    port: parseInt(process.env.PORT || "3000", 10),
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
  },
  db: {
    tableName: process.env.LINKS_TABLE_NAME || "links",
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || "60", 10),
  },
  security: {
    apiKeys: process.env.API_KEYS ? 
      process.env.API_KEYS.replace(/"/g, "").trim().split(",") : 
      null
  }
};

// Helper to get configuration values with defaults
export function getConfig<T>(path: string, defaultValue?: T): T {
  const parts = path.split('.');
  let current: any = config;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return defaultValue as T;
    }
    current = current[part];
  }
  
  return (current === undefined || current === null) ? defaultValue as T : current as T;
}