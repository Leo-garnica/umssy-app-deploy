import { describe, expect, it } from 'vitest';
import { createJobOfferSchema } from '../requests/create-job-offer.request.js';
import { formatSalaryRange } from '../utils/format-salary-range.js';

const request = {
  title: 'Desarrollador QA', description: 'Desarrollo y pruebas con Docker', modality: 'Remoto',
  contractType: 'Pasantía', category: 'Tecnología', positionsAvailable: 1, languages: 'Español',
  locationUrl: 'https://maps.app.goo.gl/Example', skillIds: ['a0000000-0000-4000-8000-000000000001'],
};
describe('develop internship form compatibility', () => {
  it('accepts an internship without a salary and persists the agreed label', () => {
    const result = createJobOfferSchema.parse(request);
    expect(formatSalaryRange(result.salaryMin, result.salaryMax)).toBe('A convenir');
  });
  it('continues requiring a salary for other contracts', () => {
    expect(createJobOfferSchema.safeParse({ ...request, contractType: 'Tiempo completo' }).success).toBe(false);
  });
  it('rejects an isolated salary maximum', () => {
    expect(createJobOfferSchema.safeParse({ ...request, salaryMax: 7000 }).success).toBe(false);
  });
});
