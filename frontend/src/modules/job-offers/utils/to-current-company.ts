import type { CurrentCompany, RecruiterCompany } from "../types/job-offer.types";

export function toCurrentCompany(company: RecruiterCompany): CurrentCompany {
  const capitals = company.name.match(/[A-ZÁÉÍÓÚÑ]/g) ?? [];
  const initials = capitals.slice(0, 2).join("") || company.name.slice(0, 2).toUpperCase();
  return { ...company, initials };
}
