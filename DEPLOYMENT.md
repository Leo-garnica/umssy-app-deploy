# UMSSY en Vercel

Esta rama importa la aplicación completa de `UMSSY/umssy-app`, `develop` en `89d293cf`. El deploy usa su propio repositorio, URLs y base de datos. Los informes de QA en `docs/qa` y `UPSTREAM_INTEGRATION.md` corresponden a versiones anteriores.

## Base de pruebas

Crea una base PostgreSQL vacía para esta versión, con esquema `public` y permiso para instalar `btree_gist`. La base del deploy anterior tiene otro historial de migraciones, incluidas variantes de las migraciones de CV y NLP. Usa un proyecto Supabase separado si quieres conservar ese entorno y sus cuentas.

Desde `backend`, configura un `.env` local a partir de `.env.example`, con los datos de la base nueva. En Supabase usa los datos de **Connect → Session pooler** (puerto 5432). Ejecuta:

```powershell
pnpm install --frozen-lockfile
pnpm migrate:apply
pnpm seed:production
```

Para crear la primera cuenta administrativa, ejecuta `pnpm seed:admin --email TU_CORREO` y guarda la contraseña que imprime. La base nueva tiene sus propias cuentas y catálogos.

## Proyectos en Vercel

| Ajuste | Frontend | Backend |
| --- | --- | --- |
| Directorio raíz | `frontend` | `backend` |
| Framework | Next.js | NestJS |
| Versión de Node.js | 22.x | 22.x |
| Instalación | `pnpm install --frozen-lockfile` | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` | `pnpm vercel-build` |
| Directorio de salida | Predeterminado | Predeterminado |

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
