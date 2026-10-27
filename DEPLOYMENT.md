# Despliegue de UMSSY en Vercel

Se mantienen dos proyectos de Vercel conectados a este repositorio.

| Ajuste | Frontend | Backend |
| --- | --- | --- |
| Root Directory | `frontend` | `backend` |
| Framework Preset | Next.js | NestJS |
| Install Command | `pnpm install --frozen-lockfile` | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` | `pnpm vercel-build` |
| Output Directory | Predeterminada | Predeterminada |
| Node.js | 22.x | 22.x |

Vercel reconoce `backend/src/main.ts` como entrada de NestJS. No configurar un servidor estático ni una carpeta `dist` como Output Directory del backend.

Referencia: https://vercel.com/docs/frameworks/backend/nestjs

## Variables de producción

Frontend:

```dotenv
NEXT_PUBLIC_APP_ENV=prod
NEXT_PUBLIC_API_URL_PROD=https://umssy-backend.vercel.app/api
```

Backend:

```dotenv
DB_HOST=HOST_EXACTO_DEL_SESSION_POOLER_DE_SUPABASE
DB_PORT=5432
DB_USER=postgres.REFERENCIA_DEL_PROYECTO
DB_PASSWORD=CONTRASEÑA_PRIVADA_DE_LA_BASE
DB_NAME=postgres
JWT_SECRET=SECRETO_PRIVADO_ALEATORIO
CORS_ORIGIN=https://umssy-app-deploy.vercel.app
NODE_ENV=production
```

Copiar los datos de conexión desde Supabase → Connect → Session pooler. El host debe coincidir exactamente con el de ese proyecto. El puerto 5432 corresponde al pooler en modo sesión.

Referencia: https://supabase.com/docs/guides/database/connecting-to-postgres

`CORS_ORIGIN` contiene el origen del frontend, sin `/api`. La URL de la API incluye `/api`, porque NestJS usa ese prefijo global. No pegar corchetes ni formato Markdown en los valores de Vercel.

Guardar las variables en el entorno Production y volver a desplegar ambos proyectos. Las variables `NEXT_PUBLIC_*` quedan incorporadas durante el build del frontend.

## Flujo de acceso

1. Abrir `https://umssy-app-deploy.vercel.app/`: redirige a `/login`.
2. Elegir el rol **Titulado** y usar la cuenta de prueba creada en Supabase.
3. El login guarda el token de sesión y abre `/profile`.
4. El perfil ofrece **Completar perfil** y los enlaces para editar cada sección.
5. Abrir una ruta privada sin sesión redirige al login. Una respuesta 401 desde el perfil elimina la sesión y vuelve al login.

## Comprobaciones

Desde `backend`, con las variables de la base configuradas en `.env`:

```powershell
node scripts/check-database.mjs
node scripts/check-test-password.mjs
```

El primer comando solo consulta la base y comprueba usuario, contraseña y rol. El segundo verifica el hash del SQL original y únicamente imprime un SQL de corrección si no coincide.

Para comprobar el despliegue real sin imprimir tokens:

```powershell
$env:API_BASE_URL = 'https://umssy-backend.vercel.app/api'
node scripts/check-api.mjs
```

El resultado esperado es CORS 204 con el origen del frontend, login 201 y perfil 200. La comprobación usa la cuenta de prueba `prueba@umss.edu.bo`, contraseña `Prueba123`, rol `titulado`.

Si el backend no responde, abrir Vercel → proyecto backend → Logs y revisar la petición `/api/auth/login`. Comparar las variables de Production con los datos de Supabase y comprobar el Framework Preset y Root Directory. Un timeout por sí solo no identifica la causa del fallo.

La validación local realizada conectó con Supabase y obtuvo CORS 204, login 201 y perfil 200.

## Bloqueo de arranque en Vercel

El build de producción proporcionado terminó correctamente, generó Prisma y comprobó las migraciones contra Supabase. Los errores de ejecución mostraron `INTERNAL_FUNCTION_INVOCATION_FAILED`.

Se reprodujo un bloqueo al cargar `main.ts`: Vercel intercepta `http.Server.listen()` al importar la entrada y abre el servidor después de completar la importación. Un `await bootstrap()` al nivel superior espera a que `app.listen()` termine, por lo que impide que Vercel complete ese proceso. La entrada ahora invoca `void bootstrap().catch(...)`, siguiendo el patrón de arranque documentado para NestJS en Vercel.

La comprobación siguiente reproduce esa intercepción sin acceder a la base y verifica que `/api` responda HTTP 200:

```powershell
pnpm build
node scripts/check-vercel-startup.mjs
```

Referencias:

- https://vercel.com/kb/guide/ship-a-nestjs-app-on-vercel
- https://github.com/vercel/vercel/blob/main/packages/node/src/serverless-functions/serverless-handler.mts

Publicar el cambio de `backend/src/main.ts` en Git y desplegar ese nuevo commit. Redeploy de un commit anterior mantiene el código que bloquea el arranque. Después del despliegue, repetir `check-api.mjs` contra la URL pública para confirmar login y perfil en producción.

Las credenciales reales no se guardan en este repositorio. Cambiar la contraseña de la base y el secreto JWT compartidos en el chat, y actualizar sus valores en Vercel.

## Actualización de épicas 2 y 3: migraciones y catálogos

La integración de la rama conjunta `feature/epic-2-y-epic-3` en el merge `144e9be9` incorpora tablas de vacantes y radar, consentimientos y soporte de varios CV. El esquema de los modelos importados conserva las definiciones del proyecto completo. El deploy mantiene sus migraciones históricas y añade un puente multi-CV que no vuelve a crear la tabla de estado NLP existente.

También se añade `20261027110000_seed_epic2_epic3_catalogs`: inserta las seis áreas, las 81 habilidades oficiales con sus mapeos y once títulos de catálogos de vacantes. Preserva identificadores existentes, marcas personalizadas y áreas ya asignadas. No crea usuarios ni vacantes de prueba. Este dato es necesario: las habilidades sin área oficial no aportan puntos al radar aunque sean aprobadas.

El `vercel-build` existente ejecuta `prisma generate`, aplica migraciones en **Production** y compila. Por tanto, un push a la rama de producción configurada puede iniciar tanto el despliegue como las migraciones y la carga de catálogos. Las migraciones se preparan y prueban localmente antes de ese push; no se ejecutan en Supabase durante la preparación del código.

Antes de publicar:

1. Confirmar en Vercel la rama de producción y los directorios raíz `frontend`/`backend`.
2. Confirmar que el frontend apunta a la URL del backend propio y que las variables del backend corresponden a la base del deploy.
3. Revisar las migraciones pendientes reales de esa base. La copia de trabajo tenía ocho directorios históricos, pero el último commit publicado puede contener solo los seis anteriores a NLP; las pruebas de actualización deben contemplar esa situación.
4. Registrar build, pruebas y migraciones del candidato en `docs/qa/epic2-integracion.md`. Los resultados guardados como evidencia del repositorio conjunto no sustituyen estas pruebas.
5. Publicar el commit revisado y comprobar primero el backend. Después repetir los recorridos de `docs/qa/epic2-recorridos.md` desde la URL pública y registrar el SHA publicado en la matriz.

La política de Preview continúa omitiendo migraciones. Un preview necesita una base compatible preparada por separado; no debe asumir que comparte cambios de esquema con Production.

No ejecutar `backend/test/qa/verify-epic2-radar.mjs` contra Supabase: crea fixtures e inyecta un fallo mediante un trigger temporal. Está protegido para bases descartables en localhost. Los tiempos de esa prueba local no certifican el arranque en frío en Vercel.

Se conserva el login específico del deploy. Las cuentas de QA deben tener los roles correspondientes para revisar radares y probar el acceso de empresa. Los consentimientos controlan la exposición de radar, CV y contacto. La aceptación de criterios visuales antiguos, fórmula provisional y rendimiento queda registrada con QA/PO antes de declarar cerradas las HU.
