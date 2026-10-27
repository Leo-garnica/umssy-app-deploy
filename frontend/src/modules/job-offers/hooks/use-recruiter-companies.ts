"use client";

import { useQuery } from "@tanstack/react-query";
import { JOB_OFFERS_QUERY_KEYS } from "../constants/vacancies.constants";
import { jobOffersService } from "../services/job-offers.service";

export function useRecruiterCompanies() {
  const query = useQuery({
    queryKey: JOB_OFFERS_QUERY_KEYS.recruiterCompanies,
    queryFn: jobOffersService.getRecruiterCompanies,
  });
  return {
    companies: query.data ?? [],
    status: query.isPending ? "loading" as const : query.isError ? "error" as const : "ready" as const,
    reload: () => { void query.refetch(); },
  };
}
