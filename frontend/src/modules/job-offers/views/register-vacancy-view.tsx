"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { PageHeading } from "@/shared/components/layout";
import { useState } from "react";
import { ConfirmDialog } from "../components/confirm-dialog";
import { InformationStep } from "../components/information-step";
import { PreviewStep } from "../components/preview-step";
import { RequirementsStep } from "../components/requirements-step";
import { VacancyStepper } from "../components/vacancy-stepper";
import { DISCARD_DIALOG_TEXT, LEAVE_DIALOG_TEXT, PUBLISH_MESSAGES } from "../constants/vacancies.constants";
import { useJobOfferForm } from "../hooks/use-job-offer-form";
import { useLeaveGuard } from "../hooks/use-leave-guard";
import { usePublishJobOffer } from "../hooks/use-publish-job-offer";
import { useRecruiterCompanies } from "../hooks/use-recruiter-companies";
import { toCurrentCompany } from "../utils/to-current-company";

export function RegisterVacancyView() {
  const {
    currentStep,
    conditions,
    errors,
    hasUnsavedChanges,
    updateField,
    selectModality,
    validateField,
    handleContinue,
    handleRequirementsContinue,
    goBack,
    reset,
  } = useJobOfferForm();
  const associated = useRecruiterCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const selectedCompany = associated.companies.find(item => item.id === selectedCompanyId)
    ?? (associated.companies.length === 1 ? associated.companies[0] : null);
  const company = selectedCompany ? toCurrentCompany(selectedCompany) : null;
  const publication = usePublishJobOffer(company?.id ?? null);
  const leaveGuard = useLeaveGuard(hasUnsavedChanges && !publication.isSuccess);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  const handleCancel = () => {
    if (hasUnsavedChanges) setIsDiscardDialogOpen(true);
  };

  const handleDiscard = () => {
    setIsDiscardDialogOpen(false);
    publication.reset();
    reset();
  };

  const handleFinish = () => {
    publication.reset();
    reset();
  };

  if (publication.isSuccess) {
    return <main className="mx-auto w-full max-w-7xl space-y-6"><PageHeading title="Vacante publicada" description="La oferta se registró correctamente." /><section className="max-w-2xl rounded-lg border border-border bg-surface p-6"><h2 className="text-lg font-semibold">{conditions.title}</h2><p className="mt-2 text-sm text-text-secondary">{conditions.modality} · {conditions.contractType}</p><div className="mt-6 flex gap-3 border-t border-border pt-5"><Link href="/recruiters" className={buttonVariants()}>Volver a mi empresa</Link><Button variant="outline" onClick={handleFinish}>Publicar otra vacante</Button></div></section></main>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl">
      <PageHeading className="mb-6" title="Publicar vacante" description="Define la oferta, agrega los requisitos y revisa la publicación antes de confirmarla." />

      <section aria-label="Empresas vinculadas" className="mb-6 rounded-lg border border-border bg-surface p-4">
        {associated.status === "loading" && <p role="status">Cargando las empresas vinculadas a tu cuenta...</p>}
        {associated.status === "error" && <div role="alert"><p>No se pudieron consultar tus empresas. Los datos de la vacante se conservan.</p><Button type="button" variant="outline" className="mt-3" onClick={associated.reload}>Reintentar empresas</Button></div>}
        {associated.status === "ready" && !associated.companies.length && <div role="status"><p>{PUBLISH_MESSAGES.noCompany}</p><Button type="button" variant="outline" className="mt-3" onClick={associated.reload}>Actualizar empresas</Button></div>}
        {associated.status === "ready" && associated.companies.length === 1 && <p className="font-semibold">Empresa de la publicación: {company?.name}</p>}
        {associated.status === "ready" && associated.companies.length > 1 && <div className="max-w-lg"><label htmlFor="vacancy-company" className="mb-2 block text-sm font-semibold">Empresa de la publicación</label><NativeSelect id="vacancy-company" value={selectedCompanyId} disabled={publication.isSubmitting} onChange={event => { setSelectedCompanyId(event.target.value); publication.reset(); }}><NativeSelectOption value="">Selecciona una empresa</NativeSelectOption>{associated.companies.map(item => <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>)}</NativeSelect></div>}
      </section>

      <div className="space-y-6">
        <VacancyStepper currentStep={currentStep} />

        <div key={currentStep} className="animate-in duration-200 fade-in-0 slide-in-from-right-1">
        {currentStep === 1 && (
          <InformationStep
            conditions={conditions}
            errors={errors}
            updateField={updateField}
            selectModality={selectModality}
            validateField={validateField}
            onCancel={handleCancel}
            onContinue={handleContinue}
          />
        )}

        {currentStep === 2 && (
          <RequirementsStep
            conditions={conditions}
            errors={errors}
            updateField={updateField}
            onPrevious={goBack}
            onContinue={handleRequirementsContinue}
          />
        )}

        {currentStep === 3 && company && associated.status === "ready" && (
          <PreviewStep
            conditions={conditions}
            company={company}
            isSubmitting={publication.isSubmitting}
            isPublished={publication.isSuccess}
            error={publication.error}
            onPrevious={goBack}
            onConfirm={() => void publication.submit(conditions)}
            onFinish={handleFinish}
          />
        )}
        {currentStep === 3 && (!company || associated.status !== "ready") && <section className="rounded-lg border border-border bg-surface p-6"><p>Selecciona una empresa vinculada para revisar y confirmar la publicación.</p><Button type="button" variant="outline" className="mt-4" onClick={goBack}>Anterior</Button></section>}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDiscardDialogOpen}
        title={DISCARD_DIALOG_TEXT.title}
        description={DISCARD_DIALOG_TEXT.description}
        confirmLabel={DISCARD_DIALOG_TEXT.confirm}
        cancelLabel={DISCARD_DIALOG_TEXT.cancel}
        onConfirm={handleDiscard}
        onCancel={() => setIsDiscardDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={leaveGuard.isLeaveDialogOpen}
        title={LEAVE_DIALOG_TEXT.title}
        description={LEAVE_DIALOG_TEXT.description}
        confirmLabel={LEAVE_DIALOG_TEXT.confirm}
        cancelLabel={LEAVE_DIALOG_TEXT.cancel}
        onConfirm={leaveGuard.confirmLeave}
        onCancel={leaveGuard.cancelLeave}
      />
    </main>
  );
}
