import { Award, BriefcaseBusiness, Building2, FileText, GraduationCap, Radar, Search, ShieldCheck, Sparkles, SquarePlus, UserRound } from "lucide-react";
import type { WorkspaceArea, WorkspaceTask } from "@/shared/types/workspace-navigation.types";

export const WORKSPACE_AREAS: readonly WorkspaceArea[] = [
  { id: "profile", label: "Mi perfil", icon: UserRound },
  { id: "company", label: "Mi empresa", icon: Building2 },
  { id: "management", label: "Administración", icon: ShieldCheck },
  { id: "opportunities", label: "Oportunidades", icon: BriefcaseBusiness },
];

// Only the routes published in this deploy, so the search never links to a missing page.
export const WORKSPACE_TASKS: readonly WorkspaceTask[] = [
  { label: "Resumen del perfil", href: "/profile", icon: UserRound, area: "profile" },
  { label: "Configuración del perfil", href: "/profile/settings", icon: UserRound, area: "profile", keywords: "ajustes editar datos" },
  { label: "Datos personales", href: "/profile/settings#personal-info", icon: UserRound, area: "profile", keywords: "contacto teléfono ciudad correo foto" },
  { label: "Presentación", href: "/profile/settings#presentation", icon: FileText, area: "profile", keywords: "biografía sobre mí titular" },
  { label: "Formación académica", href: "/profile#education", icon: GraduationCap, area: "profile", keywords: "estudios trayectoria universidad" },
  { label: "Experiencia laboral", href: "/profile#experience", icon: BriefcaseBusiness, area: "profile", keywords: "trabajo trayectoria" },
  { label: "Habilidades", href: "/profile#skills", icon: Sparkles, area: "profile", keywords: "competencias tecnologías" },
  { label: "Certificaciones", href: "/profile#certifications", icon: Award, area: "profile", keywords: "diplomas certificados" },
  { label: "Documentos y CV", href: "/profile/documents", icon: FileText, area: "profile", keywords: "currículum curriculum archivo" },
  { label: "Radar de afinidad", href: "/profile/radar", icon: Radar, area: "profile", keywords: "competencias afinidad" },
  { label: "Revisión de radares", href: "/affinity-radar/review-queue", icon: Radar, area: "management", keywords: "aprobar habilidades documentos" },
  { label: "Portal de empresa", href: "/recruiters", icon: Building2, area: "company" },
  { label: "Publicar vacante", href: "/recruiters/job-offers/new", icon: SquarePlus, area: "company", keywords: "empleo oferta trabajo" },
  { label: "Buscar candidatos", href: "/matching", icon: Search, area: "company", keywords: "afinidad reclutamiento" },
  { label: "Vacantes", href: "/vacancies", icon: BriefcaseBusiness, area: "opportunities", keywords: "empleo trabajo ofertas" },
];
