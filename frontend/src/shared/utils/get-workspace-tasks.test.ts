import { describe, expect, it } from "vitest";
import { getWorkspaceTasks, normalizeSearch } from "./get-workspace-tasks";
import { getRouteRoles } from "./get-route-roles";
import type { RoleTag } from "@/shared/types/role-tag.types";

describe("Workspace discovery", () => {
  it.each<RoleTag>(["titulado", "mentor", "estudiante", "empresa"])("shows only permitted destinations for %s", (role) => {
    const tasks = getWorkspaceTasks([role]);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((task) => getRouteRoles(task.href).includes(role))).toBe(true);
  });

  it("finds accented labels and common task names", () => {
    expect(normalizeSearch("  FORMACIÓN ")).toBe("formacion");
    expect(getWorkspaceTasks(["titulado"], "curriculum").map((task) => task.href)).toEqual(["/profile/documents"]);
    expect(getWorkspaceTasks(["titulado"], "formacion").some((task) => task.href === "/profile#education")).toBe(true);
  });

  it("offers the radar and application flows without unrelated epic destinations", () => {
    expect(getWorkspaceTasks(["titulado"], "radar").map(task => task.href)).toEqual(["/profile/radar"]);
    expect(getWorkspaceTasks(["titulado"], "vacantes").map(task => task.href)).toEqual(["/vacancies"]);
    expect(getWorkspaceTasks(["titulado", "mentor", "empresa", "administrativo"]).some(task => /\/(chat|events|mentor|mentorship|backoffice)(\/|$)/.test(task.href))).toBe(false);
  });

  it("restricts review and company tasks to their authorized roles", () => {
    expect(getWorkspaceTasks(["administrativo"]).map(task => task.href)).toEqual(["/affinity-radar/review-queue"]);
    expect(getWorkspaceTasks(["empresa"], "candidatos").map(task => task.href)).toEqual(["/matching"]);
    expect(getWorkspaceTasks(["titulado"], "candidatos")).toEqual([]);
    expect(getWorkspaceTasks([], "")).toEqual([]);
  });
});
