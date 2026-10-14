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
