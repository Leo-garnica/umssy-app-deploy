"use client";

import Image from "next/image";
import { useProfile } from "@/modules/profile/hooks/use-profile";
import { useProfilePhoto } from "@/modules/profile/hooks/use-profile-photo";
import { getInitials } from "@/shared/utils/get-initials";
import { RadarCard } from "./radar-card";
import type { RadarBridgeView } from "../sprint2/types";

export function LiveRadarHeader({ radar }: { radar: RadarBridgeView }) {
  const { profile } = useProfile();
  const { photoUrl } = useProfilePhoto();
  const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Mi perfil profesional";
  return (
    <RadarCard className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-5 p-6">
        {photoUrl ? <Image src={photoUrl} alt={name} width={80} height={80} unoptimized className="size-20 shrink-0 rounded-full border border-border object-cover" />
          : <span role="img" aria-label={name} className="flex size-20 shrink-0 items-center justify-center rounded-full bg-ink font-heading text-2xl font-semibold text-surface">{getInitials(name)}</span>}
        <div className="min-w-0 flex-1">
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight break-words text-ink">{name}</h2>
          <p className="mt-1 text-sm text-text-secondary">{profile?.headline || "Competencias y evidencias de tu perfil"}</p>
          <ul aria-label="Tecnologías" className="mt-3 flex min-w-0 flex-wrap gap-1.5">{radar.approved.map(skill => <li key={skill.id} className="max-w-full rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium break-words text-ink-soft hover:border-border-strong motion-safe:transition-colors">{skill.name}</li>)}</ul>
        </div>
        <div className="text-right text-xs text-text-secondary">
          <p role="status" className="font-semibold text-ink">{radar.status === "ready" ? (radar.approved.length ? "Publicado" : "Sin evidencias aprobadas") : radar.status === "pending" ? (radar.processingStatus === "pending" ? "Actualización en curso" : "Pendiente de revisión") : "Análisis con error"}</p>
          <p>Versión del radar {radar.version} · Rúbrica {radar.rubric}</p>
          <p>Última actualización: {radar.updatedAt ? new Date(radar.updatedAt).toLocaleString("es-BO", { dateStyle: "medium", timeStyle: "short" }) : "Sin actualización"}</p>
        </div>
      </div>
    </RadarCard>
  );
}
