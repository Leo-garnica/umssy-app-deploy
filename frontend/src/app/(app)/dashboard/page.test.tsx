import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { clearAccessToken, saveAccessToken } from "@/shared/services/storage/access-token-storage";
import DashboardPage from "./page";
afterEach(() => { cleanup(); clearAccessToken(); });
it.each([["titulado", "/profile", "/matching"], ["administrativo", "/affinity-radar/review-queue", "/profile"], ["empresa", "/recruiters", "/profile/radar"]])("shows only published workspaces for %s", (roleTag, available, forbidden) => {
  saveAccessToken('h.'+btoa(JSON.stringify({ roleTag }))+'.s'); render(<DashboardPage />);
  expect(screen.getByRole("heading", { name: "Inicio" })).toBeInTheDocument();
  const links=screen.getAllByRole("link").map(link=>link.getAttribute("href"));
  expect(links).toContain(available); expect(links).not.toContain(forbidden);
  expect(links.some(href=>/^\/(?:chat|events|mentorship|backoffice)/.test(href??""))).toBe(false);
});
