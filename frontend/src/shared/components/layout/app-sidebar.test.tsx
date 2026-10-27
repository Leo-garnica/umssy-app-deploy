import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { House } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { RoleTag } from "@/shared/types/role-tag.types";
import { stubMatchMedia } from "@/shared/testing/stub-match-media";
import type { AppSidebarProps } from "@/shared/types/app-sidebar-props.types";
import { AppSidebar } from "./app-sidebar";

const sessionRoles = vi.hoisted(() => ({ current: [] as readonly RoleTag[] }));
vi.mock("@/shared/contexts/auth-context", () => ({ useAuth: () => ({ roles: sessionRoles.current, isLoading: false, refreshRoles: vi.fn() }) }));
const route = vi.hoisted(() => ({ pathname: "/profile" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
function renderSidebar(props: AppSidebarProps = {}) { return render(<SidebarProvider><AppSidebar {...props} /></SidebarProvider>); }

describe("AppSidebar", () => {
  beforeEach(() => { route.pathname = "/profile"; sessionRoles.current = ["titulado"]; stubMatchMedia(); });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it("uses the original logo without inventing a user", () => {
    renderSidebar();
    expect(screen.getByRole("img", { name: "UMSSY, Acreditación y comunidad" })).toHaveAttribute("src", "/icons/umssy-logo-web.svg");
    expect(document.querySelector('[data-slot="sidebar-footer"]')).toBeNull();
  });

  it("links to the published profile, radar and vacancy pages for graduates", () => {
    route.pathname = "/dashboard";
    renderSidebar();
    fireEvent.click(screen.getByRole("button", { name: "Mi perfil" }));
    const navigation = screen.getByRole("navigation", { name: "Menú principal" });
    const hrefs = within(navigation).getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual(["/dashboard", "/profile", "/profile/settings", "/profile/documents", "/profile/radar", "/vacancies"]);
  });

  it.each([
    ["/profile/settings", "Configuración del perfil"],
    ["/profile/documents", "Documentos y CV"],
  ])("opens the profile group and marks only the current destination for %s", (pathname, destination) => {
    route.pathname = pathname; renderSidebar();
    expect(screen.getByRole("button", { name: "Mi perfil" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: destination })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation", { name: "Menú principal" }).querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  it("renders each authorized top-level entry", () => {
    renderSidebar();
    const navigation = screen.getByRole("navigation", { name: "Menú principal" });
    const top = within(navigation).getAllByRole("listitem").filter((item) => item.getAttribute("data-slot") === "sidebar-menu-item");
    expect(top).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Mi perfil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vacantes" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mi empresa" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Revisión de radares" })).not.toBeInTheDocument();
  });

  it("renders the items and user received by props", () => {
    route.pathname = "/home";
    renderSidebar({ items: [{ label: "Inicio", icon: House, href: "/home" }], user: { fullName: "María Pérez", role: "Egresada" } });
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("María Pérez")).toBeInTheDocument();
  });

  it("hides the profile group for roles without access to the profile", () => {
    sessionRoles.current = ["administrativo"];
    renderSidebar();
    expect(screen.queryByRole("button", { name: "Mi perfil" })).toBeNull();
  });
});
