import { apiClient } from "@/shared/services/api-client";
import type { ApiResponse } from "@/shared/types/api-response.types";
import type {
  CreateJobOfferPayload,
  JobOfferCreatedResponse,
  RecruiterCompany,
  JobOffer,
  JobOfferDetailsResponse,
} from "../types/job-offer.types";
import type { SkillOption } from "../types/vacancy-conditions.types";

import { radarIntegrationApi } from "@/modules/radar-chart/sprint2-integration/radar-integration-api";
import { normalizeSearchText } from "@/shared/utils/normalize-search-text";
import type { JobOfferListParams } from "../utils/filter-job-offers";

const SKILL_CATALOG_ENDPOINT = "/job-offers/skills";

function buildCompanyJobOffersEndpoint(companyId: string): string {
  return `/companies/${companyId}/job-offers`;
}

export const jobOffersService = {
  getByCompany: async (companyId: string, params?: JobOfferListParams): Promise<JobOffer[]> => {
    const response = await apiClient.get<ApiResponse<JobOfferDetailsResponse[]>>(buildCompanyJobOffersEndpoint(companyId));
    const offers = await Promise.all((response.data.data ?? []).map(async offer => {
      let applicantsCount: number | null = null;
      try { applicantsCount = (await radarIntegrationApi.applicants(offer.id)).applicants.length; } catch { /* The list remains readable if applicant counts cannot be loaded. */ }
      return { ...offer, applicantsCount };
    }));
    const search = normalizeSearchText(params?.search ?? "");
    const filtered = offers.filter(offer => normalizeSearchText(offer.title).includes(search)
      && (!params?.modality || offer.modality === params.modality)
      && (!params?.contractType || offer.contractType === params.contractType)
      && (!params?.dateFrom || offer.createdAt.slice(0,10) >= params.dateFrom)
      && (!params?.dateTo || offer.createdAt.slice(0,10) <= params.dateTo));
    return filtered.sort((a,b) => {
      const delta = params?.sortBy === "applicants" ? (a.applicantsCount ?? -1) - (b.applicantsCount ?? -1) : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return params?.order === "asc" ? delta : -delta;
    });
  },
  getByCompanyAndId: async (companyId: string, jobOfferId: string): Promise<JobOfferDetailsResponse> => {
    const response = await apiClient.get<ApiResponse<JobOfferDetailsResponse[]>>(buildCompanyJobOffersEndpoint(companyId));
    const offer = response.data.data.find(item => item.id === jobOfferId);
    if (!offer) throw new Error("La vacante ya no está disponible para esta empresa.");
    return offer;
  },
  getRecruiterCompanies: async (): Promise<RecruiterCompany[]> => {
    const response = await apiClient.get<ApiResponse<RecruiterCompany[]>>("/radar-integration/recruiter/companies");
    return response.data.data ?? [];
  },

  getSkillCatalog: async (): Promise<SkillOption[]> => {
    const response = await apiClient.get<ApiResponse<SkillOption[]>>(SKILL_CATALOG_ENDPOINT);
    return (response.data.data ?? []).map(({ id, name }) => ({ id, name }));
  },

  publish: async (
    companyId: string,
    payload: CreateJobOfferPayload,
  ): Promise<JobOfferCreatedResponse> => {
    const response = await apiClient.post<ApiResponse<JobOfferCreatedResponse>>(
      buildCompanyJobOffersEndpoint(companyId),
      payload,
    );
    return response.data.data;
  },
};
