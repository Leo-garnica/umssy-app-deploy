# Evaluación de precisión del detector (#1194)

## Resultado

| Conjunto | Perfiles | Relaciones esperadas | TP | FP | FN | Precisión | Recall | F1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Desarrollo | 40 | 108 | 108 | 0 | 0 | 100 % | 100 % | 1,00 |
| Evaluación (reservado) | 27 | 121 | 119 | 0 | 2 | **100 %** | **98,3 %** | 0,99 |

Meta de la HU: precisión ≥ 85 %. Se cumple en el conjunto reservado. El recall mínimo provisional de la prueba es 80 %, hasta que el equipo acuerde uno.

## Qué se midió

- Unidad de conteo: (perfil, habilidad canónica), una sola vez aunque se repita la mención.
- Se mide el detector antes de la validación contra el catálogo y sin habilidades manuales, para no inflar el resultado.
- Sin predicciones, la precisión se informa como no calculable, no como 100 %.

## Casos fallidos del conjunto reservado

| Perfil | Texto | Esperado | Causa |
| --- | --- | --- | --- |
| `eval-26` | “Componentes en JS y TS…” | TypeScript | `ts` no es alias: es demasiado ambiguo sin más reglas. |
| `eval-27` | “…base de datos Postgre…” | PostgreSQL | Abreviatura mal escrita, no está en el diccionario. |

Quedan como candidatos para el diccionario `1.1.0`, que deberá medirse con un conjunto nuevo y no con este.

## Criterio de etiquetado

- Cuenta una habilidad del diccionario cuando el texto indica que se usó, estudió o enseñó.
- No cuenta si está negada, si es solo intención de aprender, si es un nombre de empresa o institución, o si la palabra no se refiere a la tecnología (“piedra angular”, “transferencias SWIFT”, “osos pandas”, “go to market”).
- Las etiquetas usan solo los nombres canónicos del diccionario; las tecnologías fuera de él están fuera del alcance de esta medición.

## Limitaciones

Los perfiles son sintéticos y los escribió la misma persona que definió las reglas del detector, así que el resultado es optimista. Para una medición independiente, QA o el equipo deberían aportar perfiles etiquetados por otra persona (idealmente textos reales anonimizados) y correr la misma prueba.

## Reproducir

- Datos: `tests/fixtures/nlp-development-profiles.json` y `tests/fixtures/nlp-evaluation-profiles.json`.
- Diccionario: `NLP_DICTIONARY_VERSION = 1.0.0`.
- Código: rama `integrate/epic2-nlp-hu27` del repo de deploy, sobre `main` en `9269e64`.
- Comando, desde `backend/`: `pnpm exec vitest run src/modules/nlp/tests/nlp-detection-quality.spec.ts`.
- Fecha: 23 de octubre de 2026, Node 22, Windows 11.
