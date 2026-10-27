# NLP de perfiles (Epic 2, HU-2.7)

Módulo propio de la Epic 2 que reúne las habilidades registradas del egresado y las que aparecen en el texto de su experiencia laboral y académica, las valida contra el catálogo y deja una lista consolidada y persistente para el radar. No usa IA generativa, no agrega dependencias y no usa el NLP de `matching` ni `job-connect`.

## Flujo

```
guardar habilidades / experiencia / educación
  → registrar revisión (profile_skill_processing_states.input_revision + 1, status pending)
  → leer fuentes (cargo + descripción, título + descripción; sin nombres de empresa ni institución)
  → normalizar → detectar → validar contra el catálogo → consolidar con las manuales
  → publicar en una transacción solo si la revisión sigue vigente (status ready)
  → GET /api/profile/skills-for-radar lee el resultado guardado
```

| Pieza | Archivo | Issue |
| --- | --- | --- |
| Contratos y módulo | `types/`, `nlp.module.ts`, `index.ts` | #1189 |
| Normalización | `utils/tokenize-text.ts`, `utils/normalize-term.ts`, `utils/remove-stopwords.ts`, `constants/nlp-language.constants.ts` | #1190 |
| Diccionario y detector | `constants/nlp-dictionary.constants.ts`, `utils/build-alias-index.ts`, `utils/detect-skill-mentions.ts`, `services/skill-detection.service.ts` | #1191 |
| Consolidación y persistencia | `utils/plan-skill-reconciliation.ts`, `repositories/`, `services/profile-skills-analysis.service.ts` | #1192 |
| Validación y mensajes | `utils/validate-skill-name.ts`, `services/skill-validation.service.ts`, `constants/nlp-validation.constants.ts` | #1193 |
| Evaluación de precisión | `tests/nlp-detection-quality.spec.ts`, `tests/fixtures/`, `docs/evaluation-report.md` | #1194 |
| Pruebas y cobertura | `tests/`, `docs/coverage-report.md` | #1195 |

## Reglas

- **Normalización.** Unicode NFD sin marcas (tildes), minúsculas y espacios únicos. Se conservan `C++`, `C#`, `.NET`, `Node.js`; `/` separa palabras (`CI/CD` → `ci`, `cd`); el punto final y la puntuación cortan la oración. Las stopwords en español (y algunas en inglés) se quitan para buscar alias, pero las negaciones nunca son stopwords.
- **Diccionario `1.0.0`.** Solo habilidades técnicas (lenguajes, frameworks, bases de datos, herramientas y metodologías). Cada entrada tiene un nombre canónico y alias; se prueba primero el alias más largo (`React Native` antes que `React`, `SQL Server` antes que `SQL`). Ningún alias pertenece a dos habilidades.
- **Contexto.**
  - Negación: `no`, `nunca`, `ni`, `tampoco`, `desconozco`, `excepto`, `never`… dentro de las 4 palabras anteriores de la misma cláusula. `sin` y `without` solo niegan si van justo antes de la habilidad o antes de “experiencia/conocimiento/manejo”. `no solo` no es negación y `pero`, `aunque`, `sino`, `sin embargo` abren una cláusula nueva.
  - Intención: `aprender`, `estudiar`, `conocer` o `learn` en las 3 palabras anteriores no cuentan como evidencia (`aprendí` sí).
  - Alias ambiguos (`go`, `node`, `js`, `express`, `swift`, `pandas`, `oracle`, `ruby`, `angular`) solo cuentan con un término técnico en el mismo texto o con otra habilidad no ambigua; `angular` se bloquea después de “piedra”, “momento”, “velocidad”.
- **Validación (#1193).**
  - Rechazo de entrada: un texto de más de 20 000 caracteres no se analiza y se informa (`source-too-long`); nunca se trunca sin aviso.
  - Descarte de keyword: una detección fuera del catálogo oficial (`skills.is_custom = false`) se descarta (`not-in-catalog`).
  - Formato del nombre (manuales y catálogo): se corrigen los espacios; se descartan los vacíos, los de más de 50 caracteres, los que tienen caracteres no permitidos o ninguna letra, y los que repiten un carácter más de 3 veces. Los mensajes están en `NLP_VALIDATION_MESSAGES`.
- **Consolidación.** Una fila por habilidad en `user_skills`. Si es manual y también aparece en el texto, queda `source = manual` con la evidencia del NLP. Las detectadas quedan `source = nlp`, `verification_status = pending`. Una detectada sin evidencia vigente se elimina, salvo que esté `approved`. `is_high_relevance` indica que la habilidad tiene evidencia en los textos (regla provisional hasta acordarla con Epic 3).
- **Habilidades manuales.** `GET /api/profile/me/skills` devuelve solo las manuales. Al guardarlas, las filas detectadas no se tocan; una manual que el usuario quita pero que el texto respalda pasa a detectada.

## Estados y concurrencia

`profile_skill_processing_states` guarda, por usuario: `status` (`pending`, `ready`, `error`), `input_revision`, `processed_revision`, `result_version`, `updated_at` y `dictionary_version`.

- Cada cambio de fuentes suma una revisión y deja el estado en `pending`.
- La publicación bloquea la fila con `UPDATE … WHERE input_revision = <revisión analizada>`; si otra revisión llegó antes, el resultado viejo se descarta (`nlp.analysis.stale`).
- `result_version` sube solo cuando cambia el contenido (o en el primer resultado). `updated_at` cambia en cada ejecución.
- Si el análisis falla, el guardado del usuario no falla: el estado pasa a `error` y el radar recibe solo las habilidades manuales.

## API

Ambas rutas exigen sesión (`401` sin token o con token inválido) y responden `404` si el perfil no existe.

- `GET /api/profile/skills-for-radar`: lee el resultado guardado, no analiza.
- `POST /api/profile/me/skills/analysis`: vuelve a analizar (reintento) y devuelve el mismo formato más `analysis.discarded` y `analysis.rejectedSources`.

```json
{
  "statusCode": 200, "ok": true, "detail": "OK",
  "data": {
    "userId": "<uuid>", "status": "ready", "version": 3,
    "updatedAt": "2026-10-23T15:00:00.000Z", "dictionaryVersion": "1.0.0",
    "skills": [{
      "id": "<uuid del catálogo>", "text": "Docker", "name": "Docker", "source": "nlp",
      "areaId": "cloud-devops", "verificationStatus": "pending", "isHighRelevance": true,
      "evidenceRefs": [{ "type": "work-experience", "id": "<uuid>" }]
    }]
  }
}
```

Mientras el estado no sea `ready` con la última revisión procesada, `skills` trae solo las manuales, sin evidencia. `text` y `name` llevan el mismo valor hasta que el contrato con Epic 3 elija uno. Este contrato es la propuesta de HU-2.8 y todavía no está congelado.

## Logs

Cada ejecución registra `nlp.analysis.started`, `nlp.analysis.finished` (o `stale` / `failed`) con `correlationId`, `userId`, revisión, duración y conteos. Nunca se registran textos del perfil, nombres de habilidades ni tokens; los errores solo dejan un código (`toErrorCode`).

## Trazabilidad HU-07

| Criterio | Pruebas |
| --- | --- |
| CA1 reúne las registradas | `profile-skills-analysis.service.spec` (manual + detectadas), `nlp-pipeline-database.spec` |
| CA2 extrae keywords | `skill-detection.spec`, `nlp-pipeline-database.spec` |
| CA3 listado consolidado | `skill-consolidation.spec`, `profile-skills-analysis.service.spec` |
| CA4 sin duplicados | `skill-consolidation.spec`, `skill-validation.spec` (fusión por id), `nlp-pipeline-database.spec` (una fila por skill) |
| CA5 descarta fuera del catálogo | `skill-validation.spec`, `profile-skills-analysis.service.spec` |
| CA6 lista vacía sin error | `profile-skills-analysis.service.spec`, `nlp-pipeline-database.spec` |
| CA7 solo registradas | `profile-skills-analysis.service.spec` |
| CA8 solo keywords | `profile-skills-analysis.service.spec`, `nlp-pipeline-database.spec` |
| CA9 disponible para el radar | `profile-skills-analysis.controller.spec`, `profile-skills-radar.mapper.spec` |
| CA10 fallo del NLP sin cortar el flujo | `profile-skills-analysis.service.spec` (error + manuales) |
| CA11 actualiza con información vigente | `profile-skills-analysis.service.spec`, `nlp-pipeline-database.spec` (editar, borrar, carrera) |
| CA12 formato inválido | `skill-validation.spec`, `profile-skills-radar.mapper.spec` |
| V1 automático al guardar | specs de servicios y flujos de `skills`, `work-experience` y `educations` |
| V2 tiempo de respuesta | `nlp-performance.spec`, `nlp-pipeline-database.spec` (< 3 s) |
| V3 persistencia por usuario | `nlp-pipeline-database.spec` (lectura desde otra instancia) |
| V4 `updatedAt` en cada ejecución | `profile-skills-analysis.service.spec`, `nlp-pipeline-database.spec` |
| V5 logs | `profile-skills-analysis.service.spec` |
| V6 sin errores técnicos al usuario | `profile-skills-analysis.service.spec` (`status: error`) |
| V7 reglas de negocio | `skill-validation.spec` |
| V8 contrato | `profile-skills-radar.mapper.spec`, `profile-skills-analysis.controller.spec` |
| V9 401 | `profile-skills-analysis.controller.spec` |
| V10 idempotencia | `profile-skills-analysis.service.spec`, `nlp-pipeline-database.spec` |
| V11 perfiles grandes | `nlp-performance.spec` |
| V12 privacidad | `profile-skills-analysis.service.spec` (logs sin textos ni nombres) |

## Pruebas

Desde `backend/`:

```
pnpm exec vitest run src/modules/nlp
```

La prueba contra base real se omite si no se apunta a una base desechable terminada en `_test`:

```
DB_HOST=localhost DB_PORT=55432 DB_USER=<usuario> DB_PASSWORD=<clave> DB_NAME=nlp_test NLP_E2E_DATABASE=nlp_test \
  pnpm exec vitest run src/modules/nlp/tests/nlp-pipeline-database.spec.ts
```
