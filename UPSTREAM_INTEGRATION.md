# Integración de correcciones del repositorio original

Origen: `https://github.com/UMSSY/umssy-app.git`, rama `epic/grupo-2-perfiles-y-NLP`.

Versión importada: `9e93510` (merge del PR #827). Base del repositorio de deploy: `b0fee69`.

La copia de deploy y el original tienen historiales independientes. Se compararon e incorporaron los cambios de contenido en una rama local `integrate/profile-fixes-9e93510`, conservando las adaptaciones propias del despliegue. No se usó una fusión de historiales no relacionados.

## Cambios incorporados

- Separación del módulo frontend de perfil en `certifications`, `documents`, `education`, `skills` y `work-experience`, con actualización de imports, rutas y pruebas.
- Validación frontend y backend para rechazar etiquetas HTML/scripts en nombre y entidad de certificaciones.
- Creación de certificación con respaldo obligatorio en el formulario; si falla la carga, el frontend intenta eliminar la certificación recién creada. Es una compensación entre peticiones, no una transacción atómica de backend.
- Estado del formulario de certificaciones durante el envío, formulario desplegable y cabecera fija dentro del listado con scroll.
- Apertura de pestaña del respaldo antes de descargar el contenido, para reducir el bloqueo de ventanas emergentes.
- Metadatos de respaldos conservados en `sessionStorage` durante la sesión del navegador.
- Resto de cambios de `backend/src` y `frontend/src` de esa versión, incluyendo componentes NLP de Home; se mantienen las rutas iniciales específicas del deploy.
- Eliminación del test e2e de perfil y exclusión de e2e en la configuración de pruebas unitarias, siguiendo la reorganización del origen. No se afirma haber ejecutado pruebas e2e con base real.

## Adaptaciones del deploy conservadas

- Arranque de NestJS sin top-level await: `void bootstrap().catch(...)`, necesario para la intercepción de Vercel.
- Normalización de `CORS_ORIGIN` y prefijo global `/api`.
- Entrada `/` hacia `/login`, login válido hacia `/profile` y protección de rutas privadas.
- URL de API normalizada, timeout y tratamiento de fallos de autenticación/conexión.
- Variables de ejemplo, comandos de build/migración, scripts de diagnóstico y `DEPLOYMENT.md`.
- Campo de oportunidades deshabilitado con aviso explícito. El origen lo habilita con estado de página, pero no tiene columna, payload ni persistencia de backend; se mantiene la conducta del deploy hasta implementar el guardado real.

No se cambiaron dependencias, lockfile ni migraciones de Prisma. Esta integración no necesita ejecutar SQL adicional por cambios de esquema. El seed del catálogo de habilidades es una operación de datos separada.

## Validación local

- Backend: TypeScript build aprobado y 505 pruebas unitarias aprobadas (66 archivos).
- Frontend: build de producción Next.js aprobado, comprobación TypeScript aprobada y 680 pruebas aprobadas (89 archivos).
- ESLint de módulos importados, páginas de perfil y componentes NLP: aprobado.
- Oxlint de certificaciones backend: aprobado.
- Simulación del arranque de Vercel: aprobada; `GET /api` devuelve 200 sin conectar a una base de datos real.
- `git diff --check`: aprobado.

En Windows se ejecutó Node 22 mediante su ruta real y se añadió su directorio al PATH del build, para que los workers no utilizaran el lanzador de NVM.

## Bugs que no deben darse por cerrados solo por esta importación

| Hallazgo QA | Situación |
|---|---|
| B01: oportunidades laborales | Sigue pendiente la persistencia en backend/base. Se conserva el campo deshabilitado. |
| B02: catálogo vacío | Requiere ejecutar/verificar el seed de habilidades en Supabase; no lo hace la copia de código. |
| B03: paso 02 de Documentos | La vista sigue siendo de CV; el flujo completo de dos pasos continúa pendiente. |
| B04: alta conjunta con respaldo | Corrección de formulario y compensación importadas; requiere revalidación funcional tras publicar. No es atomicidad de base de datos. |
| B05: nombre de respaldo entre sesiones | Se importa caché en sessionStorage. La persistencia de metadatos en backend y entre sesiones/navegadores sigue pendiente. |
| B06: 5 MiB y 413 de Vercel | El límite frontend sigue siendo de 5 MiB. La importación no resuelve el límite de plataforma. |
| B07: login inmediato | Se conserva el login del deploy; falta revalidar/corregir la carrera de hidratación. |
| B08: móvil | Hay ajuste responsive en certificaciones, pero no una corrección completa de todas las vistas. Requiere revalidación. |
| B09/B10: identidad en sidebar y cerrar sesión | No se incorporan soluciones a estos hallazgos en esta versión. |
| B11: porcentaje de carga | Indicador de carga importado; no se acredita progreso porcentual completo. |
| B12: cabecera fija de certificaciones | Corrección importada; validar con scroll en el deploy actualizado. |
| B13: scripts en certificaciones | Rechazo de HTML/script importado en frontend y backend; pruebas unitarias aprobadas. |
| B14/B15: nombre y recuperación de CV | Sin corrección completa de estos hallazgos en esta versión. |

La matriz QA anterior corresponde al deploy anterior. No se sobrescribió ni se cambió su dictamen usando solo pruebas unitarias. El DOCX mencionado no fue adjuntado en esta solicitud; se contrastó con el reporte QA local y el código de la rama indicada.

## Publicación de esta integración

La rama de integración queda preparada localmente. Para publicar desde este repositorio, una vez revisados los cambios:

```powershell
git switch main
git merge --ff-only integrate/profile-fixes-9e93510
git push origin main
```

Si los dos proyectos Vercel siguen conectados a `main` de `Leo-garnica/umssy-app-deploy`, ese push iniciará ambos despliegues. Primero comprobar que el backend esté listo y luego revalidar login, perfil y certificaciones desde el frontend público. Las variables de Vercel siguen siendo las de `DEPLOYMENT.md`.

---

# Integración 2: Epic 2 hasta `b531fa35` (10 de octubre de 2026)

Origen: `https://github.com/UMSSY/umssy-app.git`, rama `epic/grupo-2-perfiles-y-NLP`, tras fusionar `develop`. Base de esta integración: `9e93510` (la importación anterior). Rama local: `integrate/epic2-20261010`.

Solo se importó lo que pertenece a la Epic 2. La rama de origen contiene además el trabajo de otras épicas (eventos, mentorías, solicitudes de acceso, reportes, chat), que **no** se copió.

## Método

Fusión de tres vías por archivo: base `9e93510`, versión actual de la Epic 2 y versión del deploy.

- Si el deploy no había cambiado el archivo, se tomó la versión nueva.
- Si el origen no cambió, se conservó el archivo del deploy.
- Los archivos eliminados por la reorganización del origen se eliminaron.

## Alcance importado

- Backend: `profile`, `educations`, `work-experience`, `certifications` y los módulos nuevos `certification-documents`, `cv` y `skills` (el CV, las habilidades y los documentos de certificaciones salieron de `profile` y `certifications`).
- Frontend: módulos `profile`, `certifications`, `documents`, `education`, `skills`, `work-experience` y las rutas `app/(app)/profile/**`.
- Piezas compartidas que ese código necesita: validación de archivos (`common/services/file-validation.service.ts` y sus excepciones, tipos y constantes), guard JWT, decorador de usuario, filtro de excepciones, interceptor de respuesta, componentes `ui` (`dialog`, `label`, `alert-dialog`, `button`, `card-title`) y `shared/utils/download-file.ts`. Se agregaron los tests de esas piezas.
- `backend/src/app.module.ts`: se registraron `CvModule`, `SkillsModule` y `CertificationDocumentsModule`. No se agregaron los proveedores globales del origen, porque los controladores de la Epic 2 aplican su propio `ResponseInterceptor`.

## Adaptaciones del deploy conservadas

- `backend/src/main.ts` (arranque sin top-level await para Vercel) y `common/config/cors-origins.ts`.
- `frontend/src/shared/config/env.config.ts` y `frontend/src/shared/services/api-client.ts`: normalización de la URL de la API, timeout y tratamiento de 401. El origen agregó un interceptor del token y un error si falta la variable; no se importó porque los servicios de la Epic 2 envían el token con `getAuthHeaders()`.
- Login, protección de rutas, layout `(app)`, página de inicio y componentes NLP de Home.
- Campo "Oportunidades que me interesan" deshabilitado con aviso (`IS_INTERESTED_OPPORTUNITIES_ENABLED = false`).

## Corrección de QA incluida

- HU-01 (teléfono): el campo descarta los dígitos que pasan de 15 y muestra desde el inicio "De 7 a 15 dígitos".

## No cambió

- Dependencias y lockfile: el código importado no usa paquetes nuevos.
- Esquema de Prisma y migraciones: los cambios del origen desde la base son de otras épicas (exportes, solicitudes de acceso, disponibilidad de mentorías) y ningún modelo de la Epic 2. No hace falta ejecutar SQL en Supabase por esta integración.
- El cliente de Prisma generado (`backend/src/prisma`) no se tocó: Vercel lo regenera con `prisma generate`.

## Pendiente (no resuelto por esta importación)

- HU-02 (oportunidades): requiere la columna `users.interested_opportunities`, que no existe en la base.
- Catálogo de habilidades: sigue siendo una operación de datos en Supabase; la copia de código no la hace.

## Validación

- Backend: build de producción correcto, 618 pruebas (73 archivos), lint y estándares sin errores, cobertura 86 %, arranque simulado de Vercel con `GET /api` en 200 y las 31 rutas de las 6 HU registradas.
- Frontend: tipos y lint sin errores, 873 pruebas (102 archivos), cobertura 96 % y build de producción correcto con las 9 rutas de perfil.
- Los errores de tipos que aparecen en archivos `*.spec.ts` al compilar con `tsconfig.json` también existen en el repositorio de origen y no afectan al build (`tsconfig.build.json`).

---

# Integración 3: Epic 2 hasta `3e8deda2` (12 de octubre de 2026)

Origen: `https://github.com/UMSSY/umssy-app.git`, rama `epic/grupo-2-perfiles-y-NLP` (PR #1007, correcciones de la Epic 2). Base de esta integración: `b531fa35` (la importación anterior). Rama local: `integrate/epic2-20261012`.

Mismo método y mismo alcance que la integración 2 (fusión de tres vías por archivo, solo archivos de la Epic 2). Ningún archivo compartido fuera de la Epic 2 cambió desde la base, y no hubo conflictos: 46 archivos copiados (8 nuevos) y 2 eliminados.

## Cambios incorporados

- Backend: la lógica de catálogos se separó en servicios propios (`CityCatalogService`, `EducationCatalogService`, `SkillCatalogService`) y `skill.service.ts` pasó a `user-skill.service.ts`. Los módulos `profile`, `educations` y `skills` se actualizaron en consecuencia. No cambian rutas ni contratos de la API (las 31 rutas de las 6 HU siguen registradas).
- Certificaciones: "Organización emisora" admite hasta 150 caracteres (antes 100) en frontend y backend, y el documento de respaldo es obligatorio también al editar, salvo que la certificación ya tenga uno que no se esté quitando.
- Habilidades: pantalla rediseñada (búsqueda en el catálogo, sugerencias, "Mis habilidades" y creación de habilidad propia) con los textos nuevos de `SKILLS_UI_TEXTS`.
- `SectionCard` acepta `contentClassName`. Los demás cambios son limpieza de comentarios.

## Se conserva igual que en la integración 2

- Las adaptaciones del deploy (`main.ts`, CORS, `env.config.ts`, `api-client.ts`, login, layout, Home/NLP) y el campo "Oportunidades que me interesan" deshabilitado.

## No cambió

- Dependencias, lockfile, esquema de Prisma y migraciones. `issuing_organization` es `TEXT`, por lo que los 150 caracteres no requieren SQL. No hace falta ejecutar nada en Supabase.

## Pendiente (sin cambios)

- HU-02 (oportunidades): requiere la columna `users.interested_opportunities`.
- Catálogo de habilidades: sigue siendo una operación de datos en Supabase.

## Validación

- Backend: build de producción correcto, 629 pruebas (76 archivos), lint sin errores, arranque simulado de Vercel con `GET /api` en 200 y las 31 rutas registradas.
- Frontend: lint sin errores, 873 pruebas (102 archivos) y build de producción correcto (incluye comprobación de tipos) con las 9 rutas de perfil.

---

# Integración 4: presentación solo con "Acerca de" (14 de octubre de 2026)

Origen: commits `922808a2` y `4b044585` de `feature/grupo-2-profile-personal-info` (PR en revisión hacia `epic/grupo-2-perfiles-y-NLP`). Rama local: `integrate/epic2-20261014`.

## Cambio

- Se elimina el campo "Oportunidades que me interesan" de la presentación profesional (HU-01): formulario, vista previa y resumen de "Mi perfil".
- "Acerca de" es el único texto de presentación. Se guarda en `aboutMe`, igual que antes, y su texto de ayuda pide mencionar las oportunidades laborales que interesan.
- Con esto deja de existir el bloqueo propio del deploy: se quita `IS_INTERESTED_OPPORTUNITIES_ENABLED` y el aviso "Pronto podrás guardar este dato". Los 18 archivos del módulo `profile` quedan iguales a los del origen.

## No cambió

- Backend, esquema de Prisma y migraciones. La columna `users.interested_opportunities` ya no es necesaria.

## Validación

- Frontend: 873 pruebas (102 archivos), lint sin errores y build de producción correcto.

---

# Integración 5: Epic 2 hasta `63b93db8`, tabla `user_cv_file` y sidebar nuevo (15 de octubre de 2026)

Origen: `https://github.com/UMSSY/umssy-app.git`, rama `epic/grupo-2-perfiles-y-NLP`. Base de esta integración: `3e8deda2` (la importación anterior de la Epic 2). Rama local: `integrate/epic2-cv-table-sidebar`.

Mismo método que las integraciones anteriores: fusión de tres vías por archivo, solo archivos de la Epic 2 y lo compartido que esos archivos importan. 59 archivos copiados y 2 eliminados.

## Epic 2 (backend y frontend)

- CV (HU-06): el archivo se guarda en la tabla nueva `user_cv_file` (nombre, fecha de carga y contenido en base64) en lugar de `users.cv_pdf_url`.
- Habilidades: `SkillsModule` incluye `SkillDictionaryService` (`modules/job-connect`, sin dependencias); es un proveedor nuevo que solo se importó porque el módulo lo declara.
- Validaciones y constantes de educación, experiencia, certificaciones, perfil y habilidades reorganizadas, sin cambios de contrato en la API.
- Guard JWT: la consulta de sesión se separó en `SessionService`/`SessionRepository` (`common/session`). Valida lo mismo contra `users` y `user_roles`, que ya existen en el deploy.
- Frontend: diálogo de confirmación que no desborda con textos largos y vista de educación ajustada.

## Base de datos

- Esquema: se agregó el modelo `UserCvFile` y la relación `User.cvFile`, y se quitó `User.cvPdfUrl`. El cliente de Prisma generado se actualizó solo en lo de `UserCvFile`.
- Migración nueva: `20261014020000_add_user_cv_file`. Crea la tabla, copia los CV existentes desde `users.cv_pdf_url` (bytes a base64, con nombre `CV.pdf`) y elimina esa columna.
- `vercel-build` ejecuta `prisma migrate deploy` en producción, por lo que la migración se aplica sola al desplegar el backend. Si se prefiere aplicarla a mano en Supabase, hay que marcarla después con `prisma migrate resolve --applied 20261014020000_add_user_cv_file`.
- No se copiaron las migraciones de otras épicas (chat, ofertas de empleo, claves de historiales y de eventos).

## Sidebar nuevo

- Logo de UMSSY (`public/icons/icon-192x192.png`) en el sidebar, el título y el ícono de la pestaña; textos, estilos de los ítems y tarjeta de usuario como en el equipo.
- La tarjeta de usuario muestra el nombre real (consulta `GET /profile/me`) y el rol del token, con botón para cerrar sesión. Reemplaza al usuario de muestra "Alejandro Vargas".
- Menú: solo "Mi perfil", porque el resto de las secciones del equipo (chat, talleres, vacantes, reclutadores, reportes, radar) no existen en este deploy.
- Se eliminó la página `/sidebar-preview` y sus datos de muestra, que el equipo también quitó.
- Se mantuvo el control de sesión del deploy (`AuthGuard`) y no se tomó el sistema de sesión por cookies, roles por ruta, React Query ni el service worker del equipo.

## No cambió

- Dependencias y lockfile. No se importó `recharts` ni el radar de afinidad (`/profile/radar` y `modules/radar-chart`), que no son de las 6 HU.
- `main.ts`, CORS, `env.config.ts`, `api-client.ts`, login y la página de inicio.

## Validación

- Backend: build de producción correcto, 645 pruebas (79 archivos), lint sin errores y arranque simulado de Vercel con `GET /api` en 200 con las rutas de CV registradas.
- Frontend: 892 pruebas (104 archivos), lint sin errores y build de producción correcto con las 9 rutas de perfil.

---

# Integración 6: UI nueva de la Epic 2 y NLP de la HU-2.7 (23 de octubre de 2026)

Origen de la UI: `https://github.com/UMSSY/umssy-app.git`, rama `epic/grupo-2-perfiles-y-NLP` en `2f71f0a4` (incluye el PR #1354 con el esqueleto del NLP, #1189). Base: `63b93db8` (la importación anterior). Rama local: `integrate/epic2-nlp-hu27`.

El NLP de la HU-2.7 (#1190–#1195) se implementó directamente en este deploy, sobre el esqueleto del #1189.

## UI nueva

- Mismo método de fusión de tres vías: 240 archivos copiados y 12 eliminados de la Epic 2, más las piezas compartidas que usan.
- "Mi perfil" (`/profile`) reúne experiencia, educación, certificaciones y habilidades, con edición en diálogos; `/profile/settings` junta datos personales y presentación. Las rutas anteriores redirigen a esas secciones.
- Sistema de diseño del equipo (`app/globals.css`), componentes `ui` actualizados (`calendar` y `dropdown-menu` nuevos) y bloques de layout (`workspace-page`, `page-heading`, `form-section`, `form-fieldset`, `record-editor-dialog`, `danger-zone`, `date-field`).
- Armazón nuevo: encabezado azul con logo, buscador de secciones (`Ctrl K`) y menú "Mi cuenta"; sidebar con el sello y el logo de la UMSS.
- Adaptado a este deploy:
  - `shared/contexts/auth-context.tsx` lee los roles del token del login, porque no hay `/auth/session`;
  - `app-shell.tsx` y `app-header.tsx` no incluyen el chat;
  - la navegación y el buscador solo listan las páginas de perfil que existen aquí;
  - `/dashboard` redirige a `/profile`, porque el logo del equipo enlaza ahí;
  - `app/providers.tsx` solo tiene React Query y la sesión, sin el service worker.
- `api-client.ts` del deploy conserva su URL, su timeout y su manejo de 401; solo se le agregó `isApiError`, que usa la UI nueva.
- No se tomaron el chat, el radar (`/profile/radar`, `modules/radar-chart`), el login ni la sesión por cookies del equipo, ni las carpetas `seeds/`.

## Dependencias nuevas (frontend)

`@tanstack/react-query` 5.104.1, `react-day-picker` 10.0.2 y `date-fns` 4.4.0, las mismas versiones que el lockfile del equipo. La UI nueva las necesita. `pnpm install --frozen-lockfile` pasa con el lockfile actualizado.

## NLP de la HU-2.7

- Módulo `backend/src/modules/nlp`: normalización, diccionario versionado (`1.0.0`), detector con reglas de contexto, validación contra el catálogo, consolidación con las habilidades manuales y estado por usuario. Detalle y trazabilidad en `backend/src/modules/nlp/README.md`.
- Se ejecuta solo después de guardar, editar o borrar habilidades, experiencia laboral o educación; si falla, el guardado no falla.
- Rutas nuevas: `GET /api/profile/skills-for-radar` (resultado guardado para el radar) y `POST /api/profile/me/skills/analysis` (reintento).
- Guardar habilidades ya no borra todas las filas del usuario: reconcilia solo las manuales y conserva las detectadas, su evidencia y su verificación. `GET /api/profile/me/skills` devuelve solo las manuales.
- Frontend: en "Mi perfil" → "Habilidades", el bloque "Detectadas en tu experiencia" muestra lo que encontró el análisis, con su estado y un botón "Volver a analizar". Es un agregado de este deploy para poder probar la HU; no está en la UI del equipo.

## Base de datos

- `20261023003219_add_radar_areas_and_user_skill_fields`: la migración del PR #1334, copiada tal cual (`radar_areas`, `skills.area_id`, `source`, `verification_status`, `is_high_relevance` y `evidence_refs` en `user_skills`).
- `20261023170000_add_profile_skill_processing_states`: la tabla nueva según la especificación entregada (PK y FK a `users` con `ON DELETE CASCADE`, `CHECK` de `status`).
- Ambas se aplican solas con `prisma migrate deploy` al desplegar el backend en producción. Se probaron sobre una base vacía y el esquema resultante coincide con `schema.prisma`.
- Datos: `docs/supabase-nlp-data.sql` carga las 6 áreas del radar y las 28 habilidades del catálogo oficial. Solo inserta lo que falta. Sin catálogo, el NLP descarta todo lo que detecta.

## Validación

- Backend: build de producción correcto, 771 pruebas (91 archivos), `lint` y `lint:standards` sin errores, cobertura global de 92,7 % sentencias y 91,9 % ramas, y arranque simulado de Vercel con las rutas del NLP registradas.
- NLP: 117 pruebas propias, cobertura del módulo de 100 % sentencias y 97,3 % ramas, y precisión de 100 % con recall de 98,3 % en el conjunto reservado (`docs/evaluation-report.md`). La prueba contra Postgres real (9 casos) pasó.
- Frontend: 969 pruebas (121 archivos), cobertura de 95,3 % sentencias, lint sin errores y build de producción correcto.

---

# Integración 7: épicas 2 y 3 desde la rama conjunta (27 de octubre de 2026)

Origen: `https://github.com/UMSSY/umssy-app.git`, rama `feature/epic-2-y-epic-3`, merge `144e9be9` del PR #1715. La preparación parte del estado completo de este deploy, incluidas la UI nueva y las modificaciones locales de la integración 6. Los repositorios mantienen historiales independientes; la importación se hace por contenido y dependencias.

## Alcance funcional

- Perfil y NLP de épica 2: fuentes vigentes, consolidación, referencias, control de revisiones y aviso posterior al commit.
- Radar de épica 3: publicación coherente, detalle de evidencias, cola administrativa, aprobaciones/revocaciones y reintento tras fallo.
- Consulta de vacantes, postulaciones y comparación de candidatos que usa la integración disponible, con sus catálogos y modelos necesarios.
- Certificaciones con guardado conjunto de campos y respaldo en una transacción; metadatos recuperables entre sesiones mediante la auditoría existente.
- Panel de habilidades detectadas en la UI actual, limpieza de caché al cambiar de usuario y tamaños móviles del radar.

Se conservan el arranque propio de Vercel, CORS, conexión de base de datos, normalización de URLs, login y sesión por token. Los cambios locales anteriores se preservan como base de esta integración. No se incorpora el resto de módulos del proyecto completo para exponer funciones ajenas a estas épicas.

## Historial y compatibilidad de base de datos

Se conservan los ocho directorios de migración que estaban en la carpeta de trabajo del deploy, incluidos los dos de NLP de la integración 6. Se añaden cinco:

- `20261012020907_add_job_offers`.
- `20261025210000_epic3_integration`.
- `20261026090000_epic3_application_contact_consent`.
- `20261027100000_align_epic2_multi_cv`.
- `20261027110000_seed_epic2_epic3_catalogs`.

Las tres primeras proceden del proyecto completo. El puente multi-CV aplica el índice del origen sin volver a crear `profile_skill_processing_states`, porque el deploy ya tiene su propia migración histórica para esa tabla. No se reemplazan ni reescriben las migraciones antiguas. Los modelos y campos importados conservan los tipos, nombres y relaciones del proyecto completo.

Los catálogos se incluyen en una migración de datos para evitar que una base con tablas nuevas pero sin áreas asignadas produzca un radar vacío: seis áreas, 81 habilidades oficiales con mapeos y once valores de estado/modalidad/contrato de vacantes. El SQL conserva IDs, mapeos existentes y marcas personalizadas; solo inserta faltantes y completa áreas nulas de los nombres oficiales. No crea cuentas ni vacantes de ejemplo.

El archivo `docs/supabase-nlp-data.sql` queda como referencia histórica de la integración 6. Su lista de 28 habilidades y sus áreas sin mapear no sustituyen la nueva migración.

## Evidencia y publicación

Los resultados del repositorio conjunto se guardan por separado en `docs/qa/epic2-evidencia-upstream.json`: 2.074 pruebas de backend, 3.133 de frontend, 16 escenarios de API y nueve recorridos de navegador aprobados. No se atribuyen automáticamente al deploy.

Validación específica del deploy: 1011 pruebas de backend aprobadas (9 optativas omitidas), 1435 de frontend, 25 escenarios de API y 14 recorridos de navegador. Coberturas superiores al 80%, builds/lint y simulación de Vercel aprobados. Las 13 migraciones pasaron desde cero y desde historiales de seis y ocho migraciones con datos sintéticos conservados. Detalles en docs/qa/epic2-integracion.md y epic2-evidencia-deploy.json.

La política existente de `vercel-build` aplica `prisma migrate deploy` en Production; publicar estas migraciones ejecutará cambios de tablas y datos en la base configurada. Preparar esta integración no ejecuta SQL sobre Supabase. El push y la comprobación de la versión pública son pasos posteriores a la validación local del candidato.

La fórmula del radar continúa provisional y los criterios visuales antiguos, el historial multi-CV y los tiempos en Vercel necesitan aceptación de QA/PO. No se declara terminada toda la épica 3 únicamente por importar esta integración.
