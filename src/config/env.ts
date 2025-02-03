export const env = {
  WS_URL: process.env.RSBUILD_WS_URL,
  WS_PUBLIC_PATH: process.env.RSBUILD_WS_PUBLIC_PATH,
  WS_PROTECTED_PATH: process.env.RSBUILD_WS_PROTECTED_PATH,
  REST_URL: process.env.RSBUILD_REST_URL,
  MODE: process.env.NODE_ENV || 'development'
} as const;

// Type-safe way to access environment variables
export type EnvKey = keyof typeof env;
