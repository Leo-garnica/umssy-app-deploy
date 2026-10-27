import { BriefcaseBusiness, Building2, Radar, UserRound } from "lucide-react";
import type { WorkspaceSectionProps } from "@/shared/types/workspace-section-props.types";

// Only the profile, radar and recruitment routes included in this deploy.
export const WORKSPACE_SECTIONS: readonly WorkspaceSectionProps[] = [
  {
    id: "profile", label: "Perfil profesional", icon: UserRound, patterns: [/^\/profile(?:\/|$)/],
    items: [
      { label: "Resumen", href: "/profile", group: "Perfil" },
      { label: "Configuración del perfil", href: "/profile/settings", group: "Perfil" },
      { label: "Documentos y CV", href: "/profile/documents", group: "Documentos y afinidad" },
      { label: "Radar de afinidad", href: "/profile/radar", group: "Documentos y afinidad" },
    ],
  },
  {
    id: "company", label: "Empresas", icon: Building2, patterns: [/^\/(?:recruiters|matching)(?:\/|$)/],
    items: [
      { label: "Portal de empresa", href: "/recruiters" },
      { label: "Publicar vacante", href: "/recruiters/job-offers/new" },
      { label: "Buscar candidatos", href: "/matching" },
    ],
  },
  { id: "radar-review", label: "Revisión de radares", icon: Radar, patterns: [/^\/affinity-radar\/review-queue\/?$/], items: [] },
  { id: "vacancies", label: "Vacantes", icon: BriefcaseBusiness, patterns: [/^\/vacancies(?:\/|$)/], items: [] },
];
