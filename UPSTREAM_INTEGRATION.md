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
