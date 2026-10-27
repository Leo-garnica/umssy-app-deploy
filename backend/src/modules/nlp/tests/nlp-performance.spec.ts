import { describe, expect, it } from 'vitest';
import { SkillDetectionService } from '../services/skill-detection.service.js';
import { SkillValidationService } from '../services/skill-validation.service.js';
import type { NlpCatalogSkill } from '../types/nlp-catalog-skill.type.js';
import type { NlpTextSource } from '../types/nlp-text-source.type.js';

// The response budget is 3 s for the whole process; the in-memory part must take a small share of it.
const IN_MEMORY_BUDGET_MS = 500;

const sentences = [
  'Desarrollé microservicios con Node.js, Docker y PostgreSQL para el área de pagos.',
  'No tengo experiencia con Angular, pero sí con React y TypeScript.',
  'Automatización de reportes con Python y Power BI; consultas SQL diarias.',
  'Coordinación con el equipo de negocio, levantamiento de requisitos y capacitaciones.',
];

function buildLongText(length: number): string {
  let text = '';
  for (let index = 0; text.length < length; index += 1) text += `${sentences[index % sentences.length]} `;
  return text.slice(0, length);
}

describe('NLP processing of large profiles', () => {
  it('processes many long texts within the budget and without duplicated skills', () => {
    const sources: NlpTextSource[] = Array.from({ length: 60 }, (_, index) => ({
      id: `source-${index}`,
      type: index % 3 === 0 ? 'education' : 'work-experience',
      text: buildLongText(5_000),
    }));
    const catalog: NlpCatalogSkill[] = Array.from({ length: 500 }, (_, index) => ({ id: `extra-${index}`, name: `Skill ${index}`, areaId: null }))
      .concat(['Node.js', 'Docker', 'PostgreSQL', 'React', 'TypeScript', 'Python', 'Power BI', 'SQL'].map((name) => ({ id: name, name, areaId: null })));
    const detection = new SkillDetectionService();
    const validation = new SkillValidationService();

    const startedAt = performance.now();
    const candidates = detection.detect({ userId: 'user-1', sources });
    const result = validation.validateDetected(candidates, catalog);
    const elapsed = performance.now() - startedAt;

    expect(elapsed).toBeLessThan(IN_MEMORY_BUDGET_MS);
    expect(result.accepted.map((skill) => skill.name).sort()).toEqual(
      ['Docker', 'Node.js', 'PostgreSQL', 'Power BI', 'Python', 'React', 'SQL', 'TypeScript'],
    );
    expect(result.accepted.every((skill) => skill.evidenceRefs.length === sources.length)).toBe(true);
  });
});
