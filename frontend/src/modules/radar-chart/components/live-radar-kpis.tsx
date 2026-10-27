import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { RadarCard } from "./radar-card";
import { formatDecimal } from "../utils/format-decimal";
import { formatGap } from "../utils/format-gap";
import type { RadarBridgeView } from "../sprint2/types";

const valueClass = "font-heading text-3xl leading-none font-semibold tabular-nums";
const titleClass = "mt-3 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase";
const detailClass = "mt-1 text-xs text-text-secondary";

export function LiveRadarKpis({ radar, variation }: { radar: RadarBridgeView; variation: number | null }) {
  return <ul aria-label="Resumen del perfil" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <RadarCard as="li" className="flex flex-col p-5"><p className="whitespace-nowrap"><span className={`${valueClass} text-ink`}>{formatDecimal(radar.average, 2)}</span> <span className="text-sm text-text-secondary">/ 10</span></p><p className={titleClass}>Afinidad global</p><p className={`${detailClass} inline-flex items-center gap-1 font-semibold text-accent`}>{variation === null ? "Variación anterior no disponible" : <>{variation > 0 ? <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" /> : variation < 0 ? <ArrowDownRight aria-hidden="true" className="size-3.5 shrink-0" /> : null}{formatGap(variation)} vs. anterior</>}</p></RadarCard>
    <RadarCard as="li" className="flex flex-col p-5"><p className={`${valueClass} text-accent`}>{radar.areas.filter(area => area.score > 0).length} / 6</p><p className={titleClass}>Áreas con puntuación</p><p className={detailClass}>Competencias verificadas por área</p></RadarCard>
    <RadarCard as="li" className="flex flex-col p-5"><p className={`${valueClass} text-accent`}>{formatDecimal(radar.keywordCount)}</p><p className={titleClass}>Habilidades aprobadas</p><p className={detailClass}><span className="font-semibold text-accent">{radar.highRelevanceCount} de alta relevancia</span></p></RadarCard>
    <RadarCard as="li" className="flex flex-col p-5"><p className={`${valueClass} text-ink`}>{formatDecimal(radar.pendingCount)}</p><p className={titleClass}>Habilidades pendientes</p><p className={detailClass}>Pendientes de revisión</p></RadarCard>
  </ul>;
}
