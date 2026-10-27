"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/shared/components/layout";
import { AffinityRadarChart } from "../components/affinity-radar-chart";
import { LiveRadarHeader } from "../components/live-radar-header";
import { LiveRadarKpis } from "../components/live-radar-kpis";
import { AreaBreakdownPanel } from "../components/area-breakdown-panel";
import type { AreaId } from "../types/area-detail.types";
import { RadarEvidencePanel } from "../sprint2/radar-evidence-panel";
import { useLiveRadar } from "../sprint2/use-live-radar";



export function RadarProfileView() {
  const { data, loading, error, variation, retry, retrying } = useLiveRadar();
  const [selectedArea, setSelectedArea] = useState<AreaId | null>(null);
  const areas = data?.areas ?? [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 font-sans">
      <PageHeading
        title="Radar de afinidad"
        description="Competencias verificadas de tu perfil. Las habilidades pendientes no alteran las puntuaciones publicadas."
      />
      {loading && !data ? <p role="status" className="rounded-lg border border-border bg-surface p-5">Cargando tu radar...</p> : null}
      {error ? (
        <div role="alert" className="rounded-lg border border-border bg-surface p-5">
          <p>{error}</p>
          <Button type="button" variant="outline" className="mt-2" disabled={retrying} onClick={() => { void retry(); }}>{retrying ? 'Actualizando...' : 'Reintentar'}</Button>
          {data ? <p className="mt-2 text-xs text-text-secondary">Se conserva la última instantánea disponible.</p> : null}
        </div>
      ) : null}
      {data ? (
        <>
          <LiveRadarHeader radar={data} />
          <LiveRadarKpis radar={data} variation={variation} />
          {data.approved.length === 0 && areas.every(area => area.score === 0) ? (
            <p className="rounded-lg border border-border bg-surface-soft p-4 text-sm text-text-secondary">Todavía no tienes habilidades aprobadas. El radar conserva sus seis ejes en 0/10. <Link href="/profile/documents" className="underline">Completar documentación y CV</Link>.</p>
          ) : null}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <AffinityRadarChart areas={areas} average={data.average} onAreaClick={setSelectedArea} />
            <AreaBreakdownPanel areas={areas} average={data.average} />
          </div>
          {selectedArea ? (
            <RadarEvidencePanel key={`${data.userId}:${selectedArea}`} selected={selectedArea} radar={data} onClose={() => setSelectedArea(null)} />
          ) : null}
          <p className="text-xs text-text-secondary">Cálculo provisional para integración: 1 punto por habilidad aprobada y 0,5 adicional por alta relevancia, máximo 10 por área. Pendiente de aprobación del Product Owner.</p>
        </>
      ) : (!loading && !error ? <p className="text-text-secondary">Sin respuesta del servicio de afinidad.</p> : null)}
    </main>
  );
}
