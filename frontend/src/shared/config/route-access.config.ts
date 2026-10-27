import type { RouteAccessRule } from "@/shared/types/route-access-rule.types";

export const APP_ROUTE_ACCESS: readonly RouteAccessRule[] = [
  { pattern: /^\/dashboard\/?$/, roles: ["titulado", "estudiante", "mentor", "empresa", "administrativo"] },
  { pattern: /^\/affinity-radar\/review-queue\/?$/, roles: ["administrativo"] },
  { pattern: /^\/recruiters(?:\/|$)/, roles: ["empresa"] },
  { pattern: /^\/matching\/?$/, roles: ["empresa"] },
  { pattern: /^\/profile\/radar\/?$/, roles: ["titulado", "mentor"] },
  { pattern: /^\/profile(?:\/|$)/, roles: ["titulado", "estudiante", "mentor", "empresa"] },
  { pattern: /^\/vacancies(?:\/|$)/, roles: ["titulado", "estudiante", "mentor"] },
];
