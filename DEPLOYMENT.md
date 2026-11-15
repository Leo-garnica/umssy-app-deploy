# UMSSY en Vercel

Esta rama incorpora la aplicación completa de `UMSSY/umssy-app` y los cambios del sprint 3 hasta `a1fc425a7`, de `epic/grupo-2-perfiles-y-NLP`. Se conservan el arranque nativo de NestJS para Vercel, el build con OCR y la configuración de Prisma del deploy. El deploy usa su propio repositorio, URLs y base de datos. Los informes de QA en `docs/qa` y `UPSTREAM_INTEGRATION.md` corresponden a versiones anteriores.

## Base de pruebas

La base Supabase de este deploy ya tiene las 50 migraciones y los catálogos actualizados. Conserva sus cuentas. Para una instalación nueva, configura las variables DB en backend/.env y ejecuta desde backend:

```cmd
pnpm install --frozen-lockfile
pnpm migrate:apply
pnpm seed:production
```

Las actualizaciones se aplican con migrate deploy mediante el script migrate:apply. El build no aplica migraciones. No uses migrate reset en la base compartida.

## Proyectos en Vercel

| Ajuste | Frontend | Backend |
| --- | --- | --- |
| Directorio raíz | `frontend` | `backend` |
| Framework | Next.js | NestJS |
| Versión de Node.js | 22.x | 22.x |
| Instalación | `pnpm install --frozen-lockfile` | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` | `pnpm vercel-build` |
| Directorio de salida | Predeterminado | `dist` (definido en `backend/vercel.json`) |

Activa `ENABLE_EXPERIMENTAL_COREPACK=1` en ambos proyectos para usar pnpm 12.4.2, la versión declarada en sus archivos `package.json`. [Configuración de Corepack en Vercel](https://vercel.com/docs/builds/configure-a-build#corepack)

Configura estas variables en el entorno de Vercel que vas a desplegar. Usa los dominios correspondientes a ese entorno, tanto en Preview como en Production.

- Frontend: `NEXT_PUBLIC_APP_ENV=prod` y `NEXT_PUBLIC_API_URL_PROD=https://TU-BACKEND/api`.
- Backend: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA=public`, `NODE_ENV=production`, `JWT_SECRET`, `JWT_EXPIRES_IN=8h`, `JWT_ALGORITHM=HS256` y `CORS_ORIGIN=https://TU-FRONTEND`. `CORS_ORIGIN` acepta varios orígenes exactos separados por comas.
- Para este deploy de pruebas, configura `UMSSY_DEPLOYMENT_ENV=qa` y `MAIL_TRANSPORT=console` en el backend. Los mensajes se registran en los logs de Vercel.
- Para entregar correos, usa `MAIL_TRANSPORT=smtp`, un `MAIL_FROM_ADDRESS` verificado, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` y `SMTP_SECURE=true` o `SMTP_REQUIRE_TLS=true`.

El build de Vercel genera Prisma y descarga los modelos OCR. Las migraciones y catálogos se aplican manualmente con los comandos de arriba.

## Validación después del push

1. Comprueba que `GET https://TU-BACKEND/api` responde y que la portada carga desde el dominio del frontend.
2. Prueba el inicio de sesión con una cuenta de la base nueva y abre las pantallas que vayas a validar.
3. Para validar el chat en vivo, comprueba la conexión Socket.IO entre los dos dominios. Para documentos, prueba un PDF con texto y otro escaneado para verificar el OCR en el entorno de Vercel.

## Actualización del sprint 3 (15 de noviembre de 2026)

La sincronización es de contenido entre repositorios con historiales independientes. No aplica migraciones remotas ni publica automáticamente.

Incluye onboarding animado de siete pasos y completitud real, mejoras de carga, lectura y generación de CV, portafolio y conexión OAuth, consentimientos del radar, y el módulo de notificaciones. La sincronización parte del commit indicado arriba y excluye las modificaciones locales del cliente Prisma y todos los `.env` del proyecto de origen.

### Variables nuevas: proyecto BACKEND de Vercel

| Variable | Valor / uso |
| --- | --- |
| `VAPID_SUBJECT` | `mailto:soporte@umssy.com` o un contacto válido propio |
| `VAPID_PUBLIC_KEY` | Clave pública de un par generado con web-push |
| `VAPID_PRIVATE_KEY` | Clave privada del mismo par; marcar como sensible |
| `GITHUB_CLIENT_ID` | Client ID de la OAuth App de GitHub |
| `GITHUB_CLIENT_SECRET` | Client secret de esa app; sensible |
| `GITHUB_CALLBACK_URL` | `https://TU-FRONTEND/profile/settings` |
| `GITLAB_CLIENT_ID` | Application ID de la aplicación OAuth de GitLab |
| `GITLAB_CLIENT_SECRET` | Secret de esa aplicación; sensible |
| `GITLAB_CALLBACK_URL` | `https://TU-FRONTEND/profile/settings` |
| `GITHUB_API_TOKEN` | Opcional: token para ampliar límites de consulta de repositorios |
| `GITLAB_API_TOKEN` | Opcional: token para ampliar límites de consulta de repositorios |

Las tres VAPID son necesarias para que el módulo push pueda arrancar. Las seis OAuth son necesarias al usar Conectar GitHub/GitLab. Los callbacks deben coincidir exactamente con los registrados en cada proveedor: apuntan al formulario del FRONTEND, que recibe el código y lo intercambia mediante el backend. Los secretos permanecen únicamente en el backend.

Genera una sola vez un par para este entorno y guarda ambas claves juntas:

```cmd
cd /d "D:\UMSS\6to Semestre\IS\umssy-app-deploy\backend"
pnpm exec web-push generate-vapid-keys
```

No incluyas claves privadas en commits ni les agregues el prefijo `NEXT_PUBLIC_`. El ejemplo `.env.example` contiene nombres y marcadores, nunca las claves locales.

### Proyecto FRONTEND de Vercel

La guía del robot no necesita variables nuevas. Mantén:

```dotenv
NEXT_PUBLIC_APP_ENV=prod
NEXT_PUBLIC_API_URL_PROD=https://TU-BACKEND/api
```

En el backend, `CORS_ORIGIN` debe incluir el origen exacto de este frontend. Configura las variables en Production y en Preview si vas a probar esa rama. Los cambios de variables se aplican al volver a desplegar.

### Migraciones pendientes

Si tu base ya corresponde a la sincronización completa de develop `89d293cf`, conserva sus cuentas y aplica las migraciones nuevas con `pnpm migrate:apply`, desde backend y con `.env` apuntando explícitamente a la base de pruebas correcta. No ejecutes reset ni elimines tablas. Después ejecuta `pnpm seed:production` para actualizar los catálogos, incluido el de notificaciones. El build de Vercel conserva la política de aplicar migraciones manualmente.

Migraciones añadidas: `20261106000000_add_radar_application_consents`, `20261110184209_create_user_social_accounts_and_portfolio_projects`, `20261112170000_align_recruiter_company`, `20261113154453_add_notifications` y `20261114013413_add_notification_fk_indexes`.

Los informes históricos de `docs/qa` describen despliegues anteriores y no equivalen a una validación funcional de este sprint en la base remota. Tras publicar, comprobar login, bienvenida de titulado incompleto, guardado y reanudación del perfil, CV con texto y escaneado, conexión OAuth, notificaciones y sockets entre los dominios reales.

## Sincronización de la épica y registro directo (15 de noviembre de 2026)

Origen: epic/grupo-2-perfiles-y-NLP, commit a1fc425a712da954063f83a760a3066f0191ec75 (PR #2371). Esta actualización sincroniza 23 archivos del perfil, incluidas las correcciones de la guía y el selector del portafolio. No hay migraciones nuevas ni cambios de dependencias. Se conserva la configuración propia de Vercel, OCR, Prisma y hooks.

Para este deploy privado de QA, configurar EN AMBOS proyectos de Vercel (backend y frontend):

```dotenv
UMSSY_DEPLOYMENT_ENV=qa
ENABLE_DIRECT_REGISTRATION=true
```

Seleccionar los entornos utilizados, Production y/o Preview, y desplegar de nuevo ambos proyectos. Son variables del servidor; no requieren prefijo NEXT_PUBLIC_. El backend rechaza el registro directo salvo que ambas condiciones coincidan. Con el interruptor desactivado se muestra el flujo institucional anterior.

En Solicitar acceso (/request-access), completar los campos personales habituales y contraseña/confirmación. Crear cuenta guarda una solicitud de prueba con código QA-..., estado approved, y una cuenta activa con rol titulado. La escritura anidada es atómica; el hash de la contraseña solo está en users. No crea OTP ni envía correo. El registro no genera educación, habilidades, CV ni progreso ficticio.

Tras crearse la cuenta, pulsar Iniciar sesión e ingresar las credenciales elegidas. El destino es /dashboard: allí aparece la bienvenida de la guía para el nuevo usuario con perfil incompleto. No usar el registro de Supabase Auth para crear cuentas de esta aplicación. Un correo ya existente no se sobrescribe. Si falla, se conservan los campos para corregir y reintentar.

Se retira del deploy la ruta pública temporal /profile-guide-preview y su prueba de página. La épica aún contiene esa ruta: antes del merge a develop, retirar también esos archivos en el repositorio principal mediante el PR del equipo.

Para QA: la guía usa formularios superpuestos; guardar actualiza el porcentaje y habilita Siguiente, sin avanzar automáticamente. Inicio tiene Pendiente/Completada. Las pendientes conservan enlaces y su clic normal abre el modal si la guía está habilitada, con navegación al formulario como alternativa; las completadas son informativas. El listado dentro del modal sí distingue En proceso y permite elegir sección. Primer ingreso, paso y finalización de la guía están en IndexedDB por usuario/navegador; el contenido del perfil y el porcentaje real están en el backend. Estos son cambios de contrato respecto a los CA literales y requieren acuerdo de QA/PO, no una equivalencia aprobada de forma implícita.
