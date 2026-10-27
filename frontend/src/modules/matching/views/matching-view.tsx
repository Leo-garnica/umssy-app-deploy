'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RadarChart as ComparisonRadarChart } from '../components/radar-chart';
import { GapBreakdownList } from '../components/gap-breakdown-list';
import { VacancyTabs } from '../components/vacancy-tabs';
import { getInitials } from '@/shared/utils/get-initials';
import { Button } from '@/components/ui/button';
import type { AxisScores, CandidateWithMatch } from "../types/matching-types";
import { CandidateList } from "../components/candidate-list";
import { PageHeading } from '@/shared/components/layout';
import { RadarAreaDetailsDialog, EMPTY_AREA_EVIDENCE, type AreaEvidenceDetails } from '@/modules/radar-chart/sprint2/radar-area-details-dialog';
import { RADAR_AXES, radarIntegrationApi, type RealVacancy, type RecruiterResponse, type CandidateRow, type AxisId } from '@/modules/radar-chart/sprint2-integration/radar-integration-api';

const LOCALE='es-BO';
export function MatchingView(){
  const [vacancies,setVacancies]=useState<RealVacancy[]>([]);
  const [vacancyId,setVacancyId]=useState<string>('');
  const [search,setSearch]=useState('');
  const [data,setData]=useState<RecruiterResponse|null>(null);
  const [selectedId,setSelectedId]=useState<string>('');
  const [selectedArea,setSelectedArea]=useState<AxisId|null>(null);
  const [showProfile,setShowProfile]=useState(false);
  const [detail,setDetail]=useState<{applicationId:string;areaId:AxisId;evidence:AreaEvidenceDetails;error:string}|null>(null);
  const [detailRevision,setDetailRevision]=useState(0);
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const loadVacancies=useCallback(async()=>{try{const v=await radarIntegrationApi.recruiterVacancies();setVacancies(v);setVacancyId(id=>v.some(x=>x.id===id)?id:v.find(x=>x.id===new URLSearchParams(window.location.search).get('vacancyId'))?.id??v[0]?.id??'');setError('');}catch{setError('No se pudo consultar las vacantes autorizadas.');}finally{setLoading(false);}},[]);
  useEffect(()=>{
    let active=true;
    void radarIntegrationApi.recruiterVacancies()
      .then(v=>{if(!active)return;setVacancies(v);setVacancyId(id=>v.some(x=>x.id===id)?id:v.find(x=>x.id===new URLSearchParams(window.location.search).get('vacancyId'))?.id??v[0]?.id??'');setError('');})
      .catch(()=>{if(active)setError('No se pudo consultar las vacantes autorizadas.');})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);
  const loadCandidates=useCallback(async()=>{if(!vacancyId){setData(null);return;}setLoading(true);try{const d=await radarIntegrationApi.applicants(vacancyId);setData(d);setSelectedId(id=>d.applicants.some(a=>a.applicationId===id)?id:d.applicants[0]?.applicationId??'');setError('');}catch{setError('No se pudo consultar los postulantes. Reintenta.');}finally{setLoading(false);}},[vacancyId]);
  useEffect(()=>{
    if(!vacancyId)return;
    let active=true;
    void radarIntegrationApi.applicants(vacancyId)
      .then(d=>{if(!active)return;setData(d);setSelectedId(id=>d.applicants.some(a=>a.applicationId===id)?id:d.applicants[0]?.applicationId??'');setError('');})
      .catch(()=>{if(active)setError('No se pudo consultar los postulantes. Reintenta.');})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[vacancyId]);
  const candidates=useMemo(()=>data?.applicants.filter(c=>`${c.name} ${c.headline}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))??[],[data,search]);
  const selected=candidates.find(c=>c.applicationId===selectedId)??candidates[0]??null;
  const applicationId=selected?.applicationId??'';
  useEffect(()=>{
    if(!selectedArea||!applicationId)return;
    let active=true;
    void radarIntegrationApi.applicantAreaEvidence(applicationId,selectedArea)
      .then(result=>{if(active)setDetail({applicationId,areaId:selectedArea,evidence:result,error:''})})
      .catch(()=>{if(active)setDetail({applicationId,areaId:selectedArea,evidence:EMPTY_AREA_EVIDENCE,error:'No se pudieron cargar las evidencias autorizadas de esta área.'})});
    return ()=>{active=false};
  },[applicationId,selectedArea,detailRevision]);
  const emptyScores = Object.fromEntries(RADAR_AXES.map(a => [a.id, 0])) as AxisScores;
  const displayCandidates: CandidateWithMatch[] = candidates.map(c => ({
    id:c.applicationId, name:c.name, role:c.headline, technologies:c.skills.slice(0,3),
    demoPhone:c.phone ?? '', scores:c.scores ?? emptyScores, matchPercent:c.comparison?.match ?? 0,
    gaps:c.comparison?.gaps ?? emptyScores, status:c.state==='rejected'?'discarded':'active',
    hasRadar:Boolean(c.scores && c.comparison),
  }));
  const target=data?.vacancy.target;
  function openArea(area:AxisId){setDetail(null);setSelectedArea(area);}
  function chooseVacancy(v:RealVacancy){setLoading(true);setData(null);setVacancyId(v.id);setSelectedId('');setSelectedArea(null);setShowProfile(false);setSearch('');}
  async function decision(c:CandidateRow,action:'hired'|'rejected'){if(busy||!window.confirm(`${action==='hired'?'Contratar':'Rechazar'} a ${c.name}?`))return;setBusy(true);try{await radarIntegrationApi.decide(c.applicationId,action);await loadCandidates();}catch{setError('No se pudo registrar la decisión.');}finally{setBusy(false);}}
  async function viewCV(c:CandidateRow){try{const blob=await radarIntegrationApi.recruiterCv(c.applicationId);const u=URL.createObjectURL(blob);window.open(u,'_blank','noopener,noreferrer');setTimeout(()=>URL.revokeObjectURL(u),60000);}catch{setError('El archivo no existe o el postulante no autorizó su consulta.');}}
  return <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
    <PageHeading title="Buscar candidatos" description="Selecciona una vacante y compara la afinidad de cada candidato." />
    <VacancyTabs vacancies={vacancies} activeVacancyId={vacancyId} onChange={id => { const vacancy = vacancies.find(item => item.id === id); if(vacancy) chooseVacancy(vacancy); }} />
    {error&&<div role="alert" className="rounded-lg border border-red-300 p-3 text-red-700">{error} <Button variant="outline" onClick={()=>{void loadVacancies();void loadCandidates();}}>Reintentar</Button></div>}
    {loading&&<p role="status">Cargando datos reales…</p>}
    {!vacancies.length&&!loading&&<p className="rounded-lg border border-border p-5">No tienes vacantes activas vinculadas a tu empresa. Un administrador debe asociar tu cuenta a la empresa correspondiente.</p>}
    <div className="grid min-h-[540px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-semibold">Postulantes · {data?.vacancy.title??'Sin selección'}</h2>
        <CandidateList query={search} onQueryChange={value => { setSearch(value); setSelectedArea(null); setDetail(null); }} candidates={displayCandidates} selectedCandidateId={selected?.applicationId ?? null} onSelectCandidate={id => {setSelectedId(id);setSelectedArea(null);setShowProfile(false);}} />
      </section>
      <section className="min-w-0 rounded-xl border border-border bg-card p-6 text-card-foreground">
        {!selected?<p className="text-text-secondary">Selecciona un postulante para ver el radar comparativo.</p>:<>
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div><div className="mb-3 flex items-center gap-3"><span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">{getInitials(selected.name)}</span><h2 className="text-base font-semibold">{selected.name}</h2></div><p className="text-sm text-text-secondary">{selected.headline}</p><p className="mt-2 text-xs text-text-secondary">Postulación: {new Date(selected.appliedAt).toLocaleDateString(LOCALE)} · {selected.email?`${selected.phone??'Sin teléfono'} · ${selected.email}`:'Contacto no compartido'}</p></div>
            <div className="ml-auto max-w-48 shrink-0 text-right"><span className="block text-[10px] leading-tight text-text-secondary uppercase">Compatibilidad vs. {data?.vacancy.title}</span><p className="mt-1 text-3xl font-bold text-ink tabular-nums">{selected.comparison?`${selected.comparison.match}%`:'N/D'}</p></div></header>
          {!selected.scores?<p className="my-10 rounded-lg bg-surface-soft p-6 text-center">Este postulante todavía no tiene un radar publicado. No se le asignó compatibilidad ficticia.</p>:<>
            <ComparisonRadarChart axes={RADAR_AXES.map(axis=>({id:axis.id,label:axis.name}))} series={[{id:'candidate',name:'Postulante: '+selected.name,color:'var(--color-radar-candidate)',values:selected.scores},{id:'target',name:'Objetivo de la vacante',color:'var(--color-radar-target)',values:target??emptyScores}]} onAxisSelect={openArea} />
            {selectedArea&&<RadarAreaDetailsDialog
              areaName={RADAR_AXES.find(a=>a.id===selectedArea)?.name??selectedArea}
              position={[...RADAR_AXES].sort((a,b)=>(selected.scores?.[b.id]??0)-(selected.scores?.[a.id]??0)||a.name.localeCompare(b.name)).findIndex(a=>a.id===selectedArea)+1}
              score={selected.scores[selectedArea]}
              globalAverage={RADAR_AXES.reduce((sum,a)=>sum+(selected.scores?.[a.id]??0),0)/6}
              evidence={detail?.applicationId===applicationId&&detail.areaId===selectedArea?detail.evidence:EMPTY_AREA_EVIDENCE} loading={detail?.applicationId!==applicationId||detail.areaId!==selectedArea} error={detail?.applicationId===applicationId&&detail.areaId===selectedArea?detail.error:''}
              onRetry={()=>{setDetail(null);setDetailRevision(n=>n+1);}} onClose={()=>setSelectedArea(null)}
              subtitle={`Información relevante del candidato seleccionado: ${selected.name}`}
            />}
            {selected.comparison && <GapBreakdownList axes={RADAR_AXES.map(axis=>({id:axis.id,label:axis.name}))} gaps={selected.comparison.gaps} />}
          </>}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" onClick={()=>setShowProfile(!showProfile)}>Ver perfil</Button><Button disabled={busy||selected.state!=='applied'} onClick={()=>void decision(selected,'hired')}>Contratar</Button><Button variant="destructive" disabled={busy||selected.state!=='applied'} onClick={()=>void decision(selected,'rejected')}>Rechazar</Button></div>
          {showProfile&&<div className="mt-3 rounded-lg border border-border bg-surface-soft p-4 text-sm"><h3 className="font-semibold">Perfil compartido por el postulante</h3><p>{selected.headline||'Sin presentación registrada'}</p><p className="mt-2">{selected.email?`${selected.email} · ${selected.phone??'Sin teléfono'}`:'El postulante no autorizó compartir sus datos de contacto'}</p><p className="mt-2">Tecnologías aprobadas: {selected.skills.join(', ')||'Ninguna'}</p>{selected.canViewCv?<Button variant="outline" className="mt-3" onClick={()=>void viewCV(selected)}>Abrir CV autorizado</Button>:<p className="mt-2 text-text-secondary">El titular no autorizó compartir el archivo PDF.</p>}</div>}
          {selected.state!=='applied'&&<p role="status" className="mt-3 text-sm">Decisión registrada: {selected.state==='hired'?'Contratado':selected.state==='rejected'?'Rechazado':selected.state}</p>}
        </>}
      </section>
    </div>
  </main>;
}
