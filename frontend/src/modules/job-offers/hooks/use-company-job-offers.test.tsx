import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { jobOffersService } from "../services/job-offers.service";
import { buildJobOffer } from "../testing/vacancy-fixtures";
import type { JobOffer } from "../types/job-offer.types";
import { DEFAULT_JOB_OFFER_FILTERS } from "../utils/filter-job-offers";
import { useCompanyJobOffers } from "./use-company-job-offers";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}
it("waits for an explicit real company instead of choosing a demo ID", () => {
  const request = vi.spyOn(jobOffersService, "getByCompany");
  const { result } = renderHook(() => useCompanyJobOffers(DEFAULT_JOB_OFFER_FILTERS), { wrapper: wrapper() });
  expect(request).not.toHaveBeenCalled();
  expect(result.current.companyId).toBeNull();
  expect(result.current.offers).toEqual([]);
});
it("hides the previous company's offers while another company's request is pending", async () => {
  let resolveCompany!: (offers: JobOffer[]) => void;
  vi.spyOn(jobOffersService, "getByCompany").mockImplementation(async companyId => companyId === "company-a"
    ? [buildJobOffer({ id: "offer-a", title: "Oferta de A" })]
    : new Promise(resolve => { resolveCompany = resolve; }));
  const { result, rerender } = renderHook(({ companyId }) => useCompanyJobOffers(DEFAULT_JOB_OFFER_FILTERS, "published", companyId), { initialProps: { companyId: "company-a" }, wrapper: wrapper() });
  await waitFor(() => expect(result.current.offers[0]?.id).toBe("offer-a"));
  rerender({ companyId: "company-b" });
  expect(result.current.offers).toEqual([]);
  expect(result.current.status).toBe("loading");
  await waitFor(() => expect(resolveCompany).toBeDefined());
  resolveCompany([buildJobOffer({ id: "offer-b", title: "Oferta de B" })]);
  await waitFor(() => expect(result.current.offers[0]?.id).toBe("offer-b"));
});
