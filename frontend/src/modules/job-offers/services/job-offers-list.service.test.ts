import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/services/api-client";
import { radarIntegrationApi } from "@/modules/radar-chart/sprint2-integration/radar-integration-api";
import { buildJobOffer, COMPANY_ID } from "../testing/vacancy-fixtures";
import type { JobOfferListParams } from "../utils/filter-job-offers";
import { jobOffersService } from "./job-offers.service";

vi.mock("@/shared/services/api-client", () => ({ apiClient: { get: vi.fn() } }));
vi.mock("@/modules/radar-chart/sprint2-integration/radar-integration-api", () => ({ radarIntegrationApi: { applicants: vi.fn() } }));

const offers = [
  buildJobOffer({ id: "remote", title: "Ingeniería Backend", modality: "Remoto", createdAt: "2026-10-10T00:00:00Z" }),
  buildJobOffer({ id: "hybrid", title: "Analista de Datos", modality: "Híbrido", contractType: "Pasantía", createdAt: "2026-10-20T00:00:00Z" }),
  buildJobOffer({ id: "onsite", title: "QA funcional", modality: "Presencial", createdAt: "2026-10-25T00:00:00Z" }),
];
const counts: Record<string, number> = { remote: 3, hybrid: 0, onsite: 1 };
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(apiClient.get).mockResolvedValue({ data: { data: offers } });
  vi.mocked(radarIntegrationApi.applicants).mockImplementation(async id => ({ applicants: Array.from({ length: counts[id] }) }) as Awaited<ReturnType<typeof radarIntegrationApi.applicants>>);
});

describe("authorized company vacancy listing", () => {
  it("loads from the selected company and obtains actual applicant counts", async () => {
    const result = await jobOffersService.getByCompany(COMPANY_ID);
    expect(apiClient.get).toHaveBeenCalledWith(`/companies/${COMPANY_ID}/job-offers`);
    expect(result.map(offer => [offer.id, offer.applicantsCount])).toEqual([["onsite", 1], ["hybrid", 0], ["remote", 3]]);
  });
  it.each<[Partial<JobOfferListParams>, string[]]>([
    [{ search: " ingenieria " }, ["remote"]],
    [{ modality: "Híbrido" }, ["hybrid"]],
    [{ contractType: "Pasantía" }, ["hybrid"]],
    [{ dateFrom: "2026-10-20" }, ["onsite", "hybrid"]],
    [{ dateTo: "2026-10-20" }, ["hybrid", "remote"]],
    [{ dateFrom: "2026-10-20", dateTo: "2026-10-20" }, ["hybrid"]],
    [{ search: "QA", modality: "Remoto" }, []],
    [{ sortBy: "createdAt", order: "asc" }, ["remote", "hybrid", "onsite"]],
    [{ sortBy: "applicants", order: "asc" }, ["hybrid", "onsite", "remote"]],
    [{ sortBy: "applicants", order: "desc" }, ["remote", "onsite", "hybrid"]],
  ])("applies the requested filters or ordering %j", async (filter, expected) => {
    const result = await jobOffersService.getByCompany(COMPANY_ID, { sortBy: "createdAt", order: "desc", ...filter });
    expect(result.map(offer => offer.id)).toEqual(expected);
  });
  it("preserves readable offers without inventing counts when the radar request fails", async () => {
    vi.mocked(radarIntegrationApi.applicants).mockImplementation(async id => {
      if (id === "remote") throw new Error("Radar unavailable");
      return { applicants: Array.from({ length: counts[id] }) } as Awaited<ReturnType<typeof radarIntegrationApi.applicants>>;
    });
    const result = await jobOffersService.getByCompany(COMPANY_ID, { sortBy: "applicants", order: "asc" });
    expect(result.map(offer => [offer.id, offer.applicantsCount])).toEqual([["remote", null], ["hybrid", 0], ["onsite", 1]]);
    const descending = await jobOffersService.getByCompany(COMPANY_ID, { sortBy: "applicants", order: "desc" });
    expect(descending.map(offer => offer.id)).toEqual(["onsite", "hybrid", "remote"]);
  });
  it("handles an empty response without adding sample vacancies", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } });
    await expect(jobOffersService.getByCompany(COMPANY_ID)).resolves.toEqual([]);
    await expect(jobOffersService.getRecruiterCompanies()).resolves.toEqual([]);
    expect(radarIntegrationApi.applicants).not.toHaveBeenCalled();
  });
  it("propagates a failed listing so the view can offer retry", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error("Company access denied"));
    await expect(jobOffersService.getByCompany(COMPANY_ID)).rejects.toThrow("Company access denied");
  });
  it("finds details only inside the authorized company's response", async () => {
    await expect(jobOffersService.getByCompanyAndId(COMPANY_ID, "hybrid")).resolves.toEqual(offers[1]);
    expect(apiClient.get).toHaveBeenCalledWith(`/companies/${COMPANY_ID}/job-offers`);
    await expect(jobOffersService.getByCompanyAndId(COMPANY_ID, "another-company-offer")).rejects.toThrow("La vacante ya no está disponible para esta empresa.");
  });
});
