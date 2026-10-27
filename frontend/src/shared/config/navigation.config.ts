import type { NavigationItem } from "@/shared/types/navigation-item.types";
import { getRouteRoles } from "@/shared/utils/get-route-roles";
import { WORKSPACE_SECTIONS } from "./workspace-sections.config";
import { BriefcaseBusiness, Building2, Radar, UserRound } from "lucide-react";

function getSectionItems(sectionId: string) {
  return WORKSPACE_SECTIONS.find((section) => section.id === sectionId)?.items.map((item) => ({
    label: item.label,
    href: item.href,
    roles: getRouteRoles(item.href),
  })) ?? [];
}

// Publish Epic 2 and the integrated Epic 3 flows, filtered by role.
export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  { label: "Mi perfil", icon: UserRound, activePathPatterns: [/^\/profile(?:\/|$)/], children: getSectionItems("profile") },
  { label: "Mi empresa", icon: Building2, activePathPatterns: [/^\/(?:recruiters|matching)(?:\/|$)/], children: getSectionItems("company") },
  { label: "Vacantes", icon: BriefcaseBusiness, href: "/vacancies", roles: getRouteRoles("/vacancies") },
  { label: "Revisión de radares", icon: Radar, href: "/affinity-radar/review-queue", roles: getRouteRoles("/affinity-radar/review-queue") },
];
