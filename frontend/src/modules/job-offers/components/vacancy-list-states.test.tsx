import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithQuery } from "@/shared/testing/render-with-query";
import { useRecruiterCompanies } from "../hooks/use-recruiter-companies";
import { useCompanyJobOffers } from "../hooks/use-company-job-offers";
import { buildJobOffer } from "../testing/vacancy-fixtures";
import { VacancyList } from "./vacancy-list";

vi.mock("../hooks/use-recruiter-companies", () => ({ useRecruiterCompanies: vi.fn() }));
vi.mock("../hooks/use-company-job-offers", () => ({ useCompanyJobOffers: vi.fn() }));
vi.mock("./job-offer-details-dialog", () => ({ JobOfferDetailsDialog: ({ companyId, jobOfferId }: { companyId: string; jobOfferId: string }) => <div role="dialog">{companyId}:{jobOfferId}</div> }));
const companies = [{ id: "company-a", name: "Empresa A" }, { id: "company-b", name: "Empresa B" }];
const reload = vi.fn();
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRecruiterCompanies).mockReturnValue({ companies: [companies[0]], status: "ready", reload });
  vi.mocked(useCompanyJobOffers).mockReturnValue({ companyId: "company-a", offers: [buildJobOffer({ id: "offer-a", title: "Oferta real" })], status: "ready", reload });
});
afterEach(cleanup);

describe("company selection and vacancy loading states", () => {
  it("announces company loading without showing vacancies prematurely", () => {
    vi.mocked(useRecruiterCompanies).mockReturnValue({ companies: [], status: "loading", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando las empresas");
    expect(screen.queryByRole("button", { name: "Oferta real" })).toBeNull();
  });
  it("offers a real retry when company loading fails", () => {
    vi.mocked(useRecruiterCompanies).mockReturnValue({ companies: [], status: "error", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudieron consultar tus empresas");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar empresas" }));
    expect(reload).toHaveBeenCalledOnce();
  });
  it("explains the missing association instead of showing sample data", () => {
    vi.mocked(useRecruiterCompanies).mockReturnValue({ companies: [], status: "ready", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByRole("status")).toHaveTextContent("No hay una empresa vinculada");
    expect(screen.queryByRole("button", { name: "Oferta real" })).toBeNull();
  });
  it("requires an explicit company and closes details when the company changes", () => {
    vi.mocked(useRecruiterCompanies).mockReturnValue({ companies, status: "ready", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByText("Selecciona una empresa para consultar sus vacantes.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Oferta real" })).toBeNull();
    fireEvent.change(screen.getByRole("combobox", { name: "Empresa" }), { target: { value: "company-b" } });
    expect(useCompanyJobOffers).toHaveBeenLastCalledWith(expect.any(Object), "published", "company-b");
    fireEvent.click(screen.getByRole("button", { name: "Oferta real" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("company-b:offer-a");
    fireEvent.change(screen.getByRole("combobox", { name: "Empresa" }), { target: { value: "company-a" } });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("announces the selected company's vacancy loading", () => {
    vi.mocked(useCompanyJobOffers).mockReturnValue({ companyId: "company-a", offers: [], status: "loading", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando vacantes");
  });
  it("keeps a failed vacancy request retryable", () => {
    vi.mocked(useCompanyJobOffers).mockReturnValue({ companyId: "company-a", offers: [], status: "error", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudieron cargar tus vacantes");
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(reload).toHaveBeenCalledOnce();
  });
  it("distinguishes no published vacancies from a search without matches", () => {
    vi.mocked(useCompanyJobOffers).mockReturnValue({ companyId: "company-a", offers: [], status: "ready", reload });
    renderWithQuery(<VacancyList />);
    expect(screen.getByText("Aún no has publicado vacantes.")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "inexistente" } });
    expect(screen.getByText("Ninguna vacante coincide con los filtros.")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    expect(screen.getByText("Aún no has publicado vacantes.")).toBeInTheDocument();
  });
});
