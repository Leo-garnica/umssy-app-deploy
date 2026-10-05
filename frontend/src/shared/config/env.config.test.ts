import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("API configuration", () => {
  it.each([
    ["https://backend.example", "https://backend.example/api"],
    ["https://backend.example/api/", "https://backend.example/api"],
  ])("normalizes %s without duplicating the API prefix", async (url, expected) => {
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "prod");
    vi.stubEnv("NEXT_PUBLIC_API_URL_PROD", url);
    const { ENV_CONFIG } = await import("./env.config");
    expect(ENV_CONFIG.apiUrl).toBe(expected);
  });
});
