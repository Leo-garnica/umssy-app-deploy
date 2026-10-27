# Integración de épicas 2 y 3 en el deploy de QA

Fecha: 27 de octubre de 2026. Origen: `UMSSY/umssy-app`, rama `feature/epic-2-y-epic-3`, merge `144e9be9` del PR #1715. Destino: `Leo-garnica/umssy-app-deploy`.

## Alcance

El candidato incorpora el perfil y NLP de épica 2 junto con el radar, revisión administrativa, evidencias y consumo de vacantes/postulaciones que necesita la integración disponible de épica 3. Conserva la UI actual y las adaptaciones del deploy: arranque de NestJS para Vercel, CORS, URLs de API, login, token y configuración de sus dos proyectos.

El flujo objetivo es: guardar una fuente del perfil, confirmar la publicación NLP, avisar al radar después del commit y publicar aportes aprobados de la revisión vigente. Las habilidades pendientes permanecen visibles para revisión y no suman puntos. Una fuente eliminada deja de aportar; una respuesta antigua no reemplaza la revisión más reciente. El reintento conserva el último resultado válido cuando hubo un fallo.

Este documento es un registro de integración y preparación de QA. La aceptación de cada HU se registra en [la matriz](epic2-matriz-criterios.md) después de probar la versión correspondiente.

## Datos y compatibilidad

Se conserva el historial de migraciones del deploy. Los modelos de vacantes y los cambios de CV importados usan las definiciones del proyecto completo; no se importan columnas ni relaciones de otras épicas que este deploy no utiliza.

La tabla de estado NLP ya existe en la migración local `20261023170000_add_profile_skill_processing_states`. Por eso no se copia íntegramente la migración posterior del proyecto completo que vuelve a crear esa tabla. La migración de compatibilidad `20261027100000_align_epic2_multi_cv` aplica únicamente el cambio de índice necesario para varios CV por usuario. Se conserva el estado existente y su restricción de valores admitidos. El atributo Prisma `@updatedAt` afecta las escrituras del cliente y no necesita otra columna.

Las cinco migraciones añadidas por esta integración son:

1. `20261012020907_add_job_offers`: tablas y relaciones de vacantes, copiada del proyecto completo.
2. `20261025210000_epic3_integration`: evidencias de CV, instantáneas del radar, auditoría, acceso de empresa y postulaciones, copiada del proyecto completo.
3. `20261026090000_epic3_application_contact_consent`: consentimiento independiente para compartir contacto, copiada del proyecto completo.
4. `20261027100000_align_epic2_multi_cv`: puente compatible con el historial propio del deploy.
5. `20261027110000_seed_epic2_epic3_catalogs`: datos de catálogo necesarios para que el radar y las vacantes funcionen.

Las tablas de integración del radar permanecen definidas en SQL, igual que en el proyecto completo. No se inventan modelos Prisma adicionales para esas tablas.

La migración de catálogos carga las seis áreas, las **81 habilidades oficiales con sus áreas** y los once valores de estado/modalidad/contrato de vacantes del origen. Conserva los identificadores existentes, las áreas ya asignadas y la marca de habilidad personalizada; completa únicamente las áreas nulas de nombres oficiales. No crea usuarios, documentos, vacantes de muestra ni postulaciones.

El SQL anterior `docs/supabase-nlp-data.sql` corresponde a la integración 6 y no contiene todos los mapeos de áreas. No sustituye las migraciones y catálogos de esta integración.

## Evidencia del repositorio conjunto

Estos resultados pertenecen al código del repositorio conjunto antes de adaptarlo al deploy; **no son resultados de esta copia de deploy**:

| Comprobación del repositorio conjunto | Resultado registrado |
| --- | --- |
| Backend | 2.074 pruebas aprobadas; ninguna fallida. |
| Frontend | 3.133 pruebas aprobadas; ninguna fallida. |
| API y PostgreSQL local | 16 escenarios aprobados. |
| Chrome y API real | 9 escenarios aprobados, incluyendo móvil, cambio de sesión y respaldos. |

El [registro de evidencia del origen](epic2-evidencia-upstream.json) conserva los escenarios y conteos sin credenciales ni documentos personales. Las migraciones del deploy tienen un historial diferente; la validación de base de datos del origen no se traslada automáticamente a este repositorio.

## Validación específica de este deploy

Resultados obtenidos con la copia integrada de este deploy:

| Comprobación | Resultado |
| --- | --- |
| Dependencias | Solo se añaden pdfjs-dist 6.4.299, nestjs-zod 5.5.0 y Recharts 3.10.1. Ninguna dependencia directa existente cambia de versión. |
| Prisma | Esquema válido y cliente 7.10.0 generado. Nueve modelos comparados coinciden con el origen; los ocho SQL históricos conservan su contenido. |
| Migraciones | 13 migraciones aplicadas desde cero y actualizaciones de 6→13 y 8→13 aprobadas. CV, usuarios, IDs, personalizadas, áreas previas y estado NLP conservados; segundo CV permitido. |
| Catálogos | Reejecución del SQL en las tres bases sin duplicar ni modificar IDs, marcas personalizadas ni mapeos existentes. |
| Backend | 1011 pruebas aprobadas, 9 optativas omitidas y cero fallidas. Cobertura: sentencias 80,11%; ramas 80,16%; funciones 82,42%; líneas 81,13%. Build y Oxlint correctos; ESLint sin errores y con advertencias en archivos generados de Prisma. |
| Frontend | 1435 pruebas aprobadas y cero fallidas. Cobertura: sentencias 87,13%; ramas 81,16%; funciones 83,23%; líneas 91,10%. Build de producción, tipos y lint correctos. |
| Arranque Vercel | Simulación aprobada, GET /api devuelve 200. |
| API real | 25 escenarios aprobados: perfil/NLP/radar, concurrencia, respaldos, permisos, empresas/vacantes, postulaciones y consentimientos/revocación/decisiones. |
| Navegador Chrome | 14 escenarios aprobados, incluyendo publicación de vacante desde sus tres pasos, postulación y matching reales, roles, cambio de sesión, respaldos y perfil/radar de 320/390 px. |
| Producción y aceptación | Publicación y pruebas sobre las URLs de Vercel pendientes. |

El [registro del deploy](epic2-evidencia-deploy.json) conserva conteos y escenarios sin credenciales. El repositorio local no contiene backend/.env; no se inspeccionaron las variables efectivas de Vercel ni se conectó a Supabase. Se conserva el límite de archivos del producto; los tamaños próximos al máximo deben comprobarse en Vercel, además del arranque en frío.

Las pruebas con datos y fallos inyectados se ejecutan únicamente en PostgreSQL temporal. El script `backend/test/qa/verify-epic2-radar.mjs` crea usuarios sintéticos e instala un trigger temporal de fallo, por lo que no debe ejecutarse contra Supabase ni una base compartida.

## Publicación y aceptación

El script existente `vercel-build` genera el cliente Prisma y ejecuta `prisma migrate deploy` en **Production**. Al publicar un commit con estas migraciones, el backend aplicará los cambios de tablas y catálogos a la base configurada. No se ha ejecutado ninguna de esas operaciones contra producción al preparar este documento. Preview conserva la política existente que omite migraciones; necesita una base compatible preparada por separado.

Antes del push de publicación, comprobar que las variables de ambos proyectos apuntan al backend y la base propios del equipo, que el conjunto de migraciones fue revisado y que las pruebas del candidato quedaron registradas. Después, verificar primero backend/login y luego los recorridos desde el frontend público.

La fórmula del radar sigue identificada como provisional. QA/PO debe resolver los criterios visuales antiguos, la política de historial multi-CV y el umbral de respuesta de NLP/PDF. Los tiempos de pruebas locales no certifican el comportamiento de Vercel en arranque en frío. Este alcance no certifica por sí solo todas las HU de épica 3.

## Adaptaciones funcionales del deploy

Se añadieron envolturas de respuesta locales para conservar el contrato de autenticación propio. Publicar/listar vacantes de una empresa exige JWT, rol empresa y un vínculo real en radar_company_access. El formulario consulta GET /api/radar-integration/recruiter/companies; muestra la identidad real, permite elegir entre varios vínculos y conserva el borrador ante un fallo. Se retiró la empresa ficticia por defecto.

Una cuenta administrativa vincula la empresa mediante POST /api/radar-integration/admin/company-access con {userId, companyId}; esta operación no se ejecuta como parte de las migraciones. Los catálogos no crean cuentas ni empresas de QA. Estas adaptaciones de aplicación quedan documentadas para poder sincronizarlas posteriormente con el repositorio compartido.

Se desactivaron los puntos de hover duplicados de Recharts que interceptaban el clic de los puntos accesibles del radar. El portal de empresa conserva su diseño de escritorio y apila sus bloques en pantallas pequeñas.

Los perfiles que ya tenían análisis NLP y todavía no tenían su primera publicación del radar se inicializan al abrirlo. Siete pruebas específicas posteriores a la suite completa verifican esta actualización, perfiles vacíos, reintento y protección de sesión.
