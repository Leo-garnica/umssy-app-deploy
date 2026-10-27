# Cobertura del módulo NLP (#1195)

Medida con `pnpm test:cov` (v8) el 23 de octubre de 2026, en la rama `integrate/epic2-nlp-hu27` del repo de deploy.

| Archivo | Sentencias | Ramas | Funciones | Líneas |
| --- | --- | --- | --- | --- |
| `controllers/profile-skills-analysis.controller.ts` | 100 % | — | 100 % | 100 % |
| `mappers/profile-skills-radar.mapper.ts` | 100 % | 100 % | 100 % | 100 % |
| `repositories/profile-skill-results.repository.ts` | 100 % | 92,9 % | 100 % | 100 % |
| `repositories/profile-skill-sources.repository.ts` | 100 % | 50 % | 100 % | 100 % |
| `services/profile-skills-analysis.service.ts` | 100 % | 100 % | 100 % | 100 % |
| `services/skill-detection.service.ts` | 100 % | 100 % | 100 % | 100 % |
| `services/skill-validation.service.ts` | 100 % | 100 % | 100 % | 100 % |
| `utils/` (17 archivos) | 100 % | 97,5 % | 100 % | 100 % |
| `constants/` | 100 % | — | — | 100 % |
| **Módulo completo** | **100 %** | **97,3 %** | **100 %** | **100 %** |

El módulo supera el 80 % en sentencias, ramas, funciones y líneas. La rama sin cubrir de cada repositorio está en la línea del decorador `@Injectable()`: es código que genera TypeScript para los metadatos de inyección, no lógica del módulo.

Backend completo en la misma corrida: 92,7 % sentencias, 91,9 % ramas, 94,3 % funciones y 93,1 % líneas, con 771 pruebas; el umbral de la CI (80 %) se cumple.

La prueba contra base real (`nlp-pipeline-database.spec.ts`) se omite en esta corrida porque necesita una base `_test`; se ejecutó aparte con 9 casos correctos.
