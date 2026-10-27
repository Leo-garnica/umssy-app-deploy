import { House, UserRound } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SIDEBAR_NAVIGATION } from "@/shared/config/navigation.config";
import type { NavigationItem } from "@/shared/types/navigation-item.types";
import { filterNavigationByRoles } from "./filter-navigation-by-roles";

const ITEMS: NavigationItem[] = [
  { label: "Inicio", icon: House, href: "/dashboard" },
  { label: "Solicitudes", icon: House, href: "/backoffice", roles: ["administrativo"] },
  {
    label: "Mi perfil",
    icon: UserRound,
    children: [
      { label: "Resumen", href: "/profile", roles: ["titulado", "mentor"] },
      { label: "Disponibilidad", href: "/mentor/availability", roles: ["mentor"] },
    ],
  },
];

const labels = (items: NavigationItem[]) =>
  items.map((item) => [item.label, ...(item.children ?? []).map((child) => child.label)].join(" > "));

describe("Role navigation", () => {
  it("keeps open items and the children allowed for the role", () => {
    expect(labels(filterNavigationByRoles(ITEMS, ["titulado"]))).toEqual(["Inicio", "Mi perfil > Resumen"]);
  });

  it("combines roles without duplicating entries", () => {
    expect(labels(filterNavigationByRoles(ITEMS, ["titulado", "mentor"]))).toEqual([
      "Inicio",
      "Mi perfil > Resumen > Disponibilidad",
    ]);
  });

  it("hides restricted items and empty groups", () => {
    expect(labels(filterNavigationByRoles(ITEMS, ["administrativo"]))).toEqual(["Inicio", "Solicitudes"]);
    expect(labels(filterNavigationByRoles(ITEMS, []))).toEqual(["Inicio"]);
  });

  it("shows the profile pages of this deploy to a graduate", () => {
    expect(labels(filterNavigationByRoles(SIDEBAR_NAVIGATION, ["titulado"]))).toEqual([
      "Mi perfil > Resumen > Configuración del perfil > Documentos y CV > Radar de afinidad",
      "Vacantes",
    ]);
  });

  it("shows only radar review to an administrative account", () => {
    expect(labels(filterNavigationByRoles(SIDEBAR_NAVIGATION, ["administrativo"]))).toEqual(["Revisión de radares"]);
  });
});
