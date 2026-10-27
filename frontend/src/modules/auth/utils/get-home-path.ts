import type { RoleTag } from "../types/auth-types";

export function getHomePath(roles: readonly RoleTag[]): string {
  if (roles.includes("administrativo")) return "/affinity-radar/review-queue";
  if (roles.includes("empresa")) return "/recruiters";
  return "/profile";
}
