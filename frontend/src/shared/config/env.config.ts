type AppEnv = "local" | "dev" | "prod";

const currentEnv = (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) ||
  (process.env.NODE_ENV === "production" ? "prod" : "local");

const API_URLS: Record<AppEnv, string | undefined> = {
  local: process.env.NEXT_PUBLIC_API_URL_LOCAL,
  dev: process.env.NEXT_PUBLIC_API_URL_DEV,
  prod: process.env.NEXT_PUBLIC_API_URL_PROD,
};

const configuredUrl = API_URLS[currentEnv]?.trim().replace(/\/+$/, "");

export const ENV_CONFIG = {
  env: currentEnv,
  apiUrl: configuredUrl
    ? configuredUrl.endsWith("/api") ? configuredUrl : `${configuredUrl}/api`
    : "/api",
};
