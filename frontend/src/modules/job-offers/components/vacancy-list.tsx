"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { VACANCY_LIST_TEXT, PUBLISH_MESSAGES } from "../constants/vacancies.constants";
import { useRecruiterCompanies } from "../hooks/use-recruiter-companies";
import { useCompanyJobOffers } from "../hooks/use-company-job-offers";
import { DEFAULT_JOB_OFFER_FILTERS, type JobOfferFilters } from "../utils/filter-job-offers";
import { JobOfferDetailsDialog } from "./job-offer-details-dialog";
import { VacancyCard } from "./vacancy-card";
import { VacancyFiltersDialog } from "./vacancy-filters-dialog";

export function VacancyList() {
  const associated = useRecruiterCompanies();
  const [chosenCompanyId, setChosenCompanyId] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobOfferFilters>(DEFAULT_JOB_OFFER_FILTERS);
  const companyId = associated.companies.find(company => company.id === chosenCompanyId)?.id
    ?? (associated.companies.length === 1 ? associated.companies[0].id : null);
  const { offers, status, reload } = useCompanyJobOffers(filters, "published", companyId);
  const text = VACANCY_LIST_TEXT.published;
  function update<K extends keyof JobOfferFilters>(field: K, value: JobOfferFilters[K]) {
    setFilters(previous => ({ ...previous, [field]: value }));
  }

  if (associated.status === "loading") return <p role="status" className="text-sm text-text-secondary">Cargando las empresas vinculadas a tu cuenta...</p>;
  if (associated.status === "error") return <div role="alert" className="space-y-3"><p>No se pudieron consultar tus empresas.</p><Button variant="outline" onClick={associated.reload}>Reintentar empresas</Button></div>;
  if (!associated.companies.length) return <p role="status" className="rounded-lg border border-border bg-surface p-5 text-sm text-text-secondary">{PUBLISH_MESSAGES.noCompany}</p>;

  return (
    <section aria-label={text.ariaLabel} className="space-y-4">
      {associated.companies.length > 1 ? <div className="max-w-sm"><label htmlFor="company-offers" className="mb-2 block text-sm font-semibold">Empresa</label><NativeSelect id="company-offers" value={chosenCompanyId} onChange={event => { setChosenCompanyId(event.target.value); setSelectedOfferId(null); }}><NativeSelectOption value="">Selecciona una empresa</NativeSelectOption>{associated.companies.map(company => <NativeSelectOption key={company.id} value={company.id}>{company.name}</NativeSelectOption>)}</NativeSelect></div> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Input type="search" placeholder="Buscar por título de vacante..." aria-label="Buscar por título de vacante" value={filters.search} onChange={event => update("search", event.target.value)} className="w-full max-md:h-11 sm:max-w-sm" />
        <VacancyFiltersDialog filters={filters} onChange={update} onReset={() => setFilters(DEFAULT_JOB_OFFER_FILTERS)} showStatusFilter={false} />
      </div>
      {!companyId ? <p className="text-sm text-text-secondary">Selecciona una empresa para consultar sus vacantes.</p>
        : status === "loading" ? <p role="status" className="text-sm text-text-secondary">{text.loading}</p>
        : status === "error" ? <div role="alert" className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">{text.loadError}<Button variant="outline" size="sm" onClick={reload}>Reintentar</Button></div>
        : offers.length === 0 ? <p className="text-sm text-text-secondary">{Object.entries(filters).some(([key,value]) => value !== DEFAULT_JOB_OFFER_FILTERS[key as keyof JobOfferFilters]) ? text.noMatches : text.empty}</p>
        : <ul className="space-y-4">{offers.map(offer => <VacancyCard key={offer.id} offer={offer} onDetails={setSelectedOfferId} />)}</ul>}
      {companyId && selectedOfferId ? <JobOfferDetailsDialog companyId={companyId} jobOfferId={selectedOfferId} onClose={() => setSelectedOfferId(null)} /> : null}
    </section>
  );
}
