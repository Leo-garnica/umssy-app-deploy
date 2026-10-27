import type { NlpEvidenceRef } from '../types/nlp-evidence-ref.type.js';

export function sortEvidenceRefs(refs: readonly NlpEvidenceRef[]): NlpEvidenceRef[] {
  const unique = new Map(refs.map((ref) => [`${ref.type}:${ref.id}`, { type: ref.type, id: ref.id }]));
  return [...unique.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, ref]) => ref);
}
