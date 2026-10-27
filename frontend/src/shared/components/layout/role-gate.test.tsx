import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AuthProvider } from "@/shared/contexts/auth-context";
import { saveAccessToken, clearAccessToken } from "@/shared/services/storage/access-token-storage";
import { getRouteRoles } from "@/shared/utils/get-route-roles";
import { RoleGate } from "./role-gate";

afterEach(() => { cleanup(); clearAccessToken(); });

function renderRoute(roleTag: string, pathname: string) {
  saveAccessToken(`h.${btoa(JSON.stringify({ roleTag }))}.s`);
  render(<AuthProvider><RoleGate allowedRoles={getRouteRoles(pathname)}><p>Contenido privado</p></RoleGate></AuthProvider>);
}

describe("Deployed role access", () => {
  it.each([
    ["administrativo", "/affinity-radar/review-queue"],
    ["empresa", "/matching"],
    ["empresa", "/recruiters/job-offers/new"],
    ["titulado", "/profile/radar"],
    ["titulado", "/vacancies"],
  ])("opens %s workspace %s using token roles", (role, route) => {
    renderRoute(role, route);
    expect(screen.getByText("Contenido privado")).toBeInTheDocument();
  });

  it.each([
    ["titulado", "/affinity-radar/review-queue"],
    ["titulado", "/matching"],
    ["empresa", "/profile/radar"],
  ])("blocks unauthorized role %s at %s", (role, route) => {
    renderRoute(role, route);
    expect(screen.queryByText("Contenido privado")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("No tienes permisos");
  });
});
