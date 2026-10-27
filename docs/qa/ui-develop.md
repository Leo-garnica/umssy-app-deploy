# UI de develop en el deploy de épicas 2 y 3

Se aplicó la presentación de `develop` del proyecto principal al repositorio personal de deploy, conservando los servicios reales de las épicas 2 y 3.

Referencia: [UMSSY/umssy-app, develop de4bdfe4](https://github.com/UMSSY/umssy-app/tree/de4bdfe44d75429160ee8c3c6e5c2bb15e5a0a19/frontend). Base local del deploy: `f70d24d2b2941b42424ac81320944b8f3a9d1420`. Rama de trabajo: `fix/develop-ui-epic2-epic3`. Fecha: 27 de octubre de 2026.

## Pantallas y componentes

| Área | Resultado |
| --- | --- |
| Login | Componente idéntico a develop: campus, logo, columnas 60/40 en escritorio, correo/contraseña, mostrar contraseña y validaciones. |
| Inicio público | Portada, carrusel, imágenes, estilos y secciones de develop. Los talleres y la solicitud de acceso informan que están fuera del entorno de revisión. |
| Navegación | Cabecera, cuenta, búsqueda y componentes compartidos de develop. Inicio y accesos limitados a las funciones incluidas por rol. |
| Perfil y documentos | Se conserva el diseño compartido de develop y el guardado real de datos, CV, certificaciones, habilidades y experiencias. Se mantienen las correcciones de guardado atómico y detección NLP. |
| Radar personal | Cabecera con datos/foto del usuario, tarjetas con la presentación de develop y gráfico compartido; estados, pendientes, puntuaciones y evidencias reales. |
| Revisión | Presentación y tarjetas de develop con la cola real por evidencia, aprobación, rechazo, revocación y reprocesamiento. |
| Empresa | Portal con listado real de sus vacantes, búsqueda, filtros y detalles. El formulario usa los componentes actuales de develop y la empresa vinculada a la cuenta. |
| Candidatos | Selector, lista, gráfico comparativo, leyenda y brechas de develop, conectados a postulaciones y permisos reales. El enlace de una vacante abre su selección correspondiente. |
| Vacantes | Tarjetas con el diseño de develop y datos publicados del backend. Se conservan los consentimientos separados de radar, contacto y CV. |

Los componentes de develop que muestran demostraciones se conectan a los servicios existentes. No se trasladan nombres, empresas, candidatos, puntajes o certificados de ejemplo. Las métricas del radar representan lo disponible en el servicio real; por eso la tarjeta de pendientes conserva ese dato en lugar de presentar un porcentaje objetivo ficticio.

Se mantiene el alcance acordado de las épicas 2 y 3. Los endpoints de chat, mentorías, eventos, altas de usuarios, edición/eliminación de ofertas e historial de otras épicas no se exponen como funciones disponibles en este deploy.

## Compatibilidad de backend

- El login admite correo y contraseña sin selector. Usa la prioridad de roles de develop y firma únicamente roles asignados y vigentes. Rechaza cuentas inactivas. El contrato con roleTag explícito sigue admitido.
- El formulario de pasantía de develop muestra salario “A convenir”. El backend admite ese caso con la columna salaryRange existente; los demás contratos siguen exigiendo salario.
- Las empresas se consultan por el vínculo real. Los listados y detalles mantienen el alcance de la empresa y no reutilizan resultados de otra selección mientras carga la siguiente.

Prisma, migraciones, conexión de base de datos, arranque de Vercel, versiones y lockfiles no tienen cambios. Posteriormente se autorizó adaptar las reglas de CI únicamente para este repositorio personal; se detalla más abajo.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| Frontend | 1645 pruebas aprobadas; 0 fallos. |
| Backend | 1021 pruebas aprobadas; 0 fallos; 9 pruebas optativas omitidas. |
| Integración HTTP | 25 casos aprobados sobre PostgreSQL temporal. |
| Navegador | 26 comprobaciones aprobadas, incluidos login, perfil/NLP, certificados, radar, postulaciones, permisos, empresa y menú móvil. |
| Compilación | Backend y frontend correctos. |
| Revisión estática | ESLint sin errores; el comando completo de CI conserva una advertencia preexistente en lint-staged.config.mjs. git diff --check correcto. |

Se corrigieron además el desbordamiento de la cabecera pública a 320 px, la apertura/cierre del menú móvil y la intercepción de clics en puntos del radar. Se comprobó que cambiar de usuario o de empresa no conserva información privada de la selección anterior.

Las pruebas usaron una base desechable local y cuentas ficticias. Las llamadas del navegador se dirigieron exclusivamente al backend local; no se ejecutaron migraciones ni escrituras sobre Supabase. La verificación funcional local no sustituye la aceptación formal de QA ni confirma todavía el estado publicado en Vercel.

Evidencia estructurada: [ui-develop-verificacion.json](./ui-develop-verificacion.json). Las capturas y logs completos están en `C:/Users/Leo/AppData/Local/Temp/umssy-ui-develop-20261027`.

## Publicación pendiente

Los cambios están físicamente en `D:\UMSS\6to Semestre\IS\umssy-app-deploy`, dentro de una sola rama. La entrega inicial de UI ya fue confirmada y subida por el propietario. Esta corrección de CI sigue pendiente de commit y push en el mismo PR. El PR debe incluir frontend y los ajustes de autenticación/formulario del backend para que el login de dos campos funcione al publicarse.

## Corrección de los checks del PR

La primera validación ejecutó las pruebas sin medir cobertura. Al ejecutar el comando de CI se reprodujo una cobertura de ramas de 79.22 %, inferior al 80 % exigido. Se añadieron 33 pruebas de filtros, ordenamiento, fallos de carga, selección de empresa, identidad del usuario y estados del radar.

La cobertura completa ahora pasa con: ramas 80.45 %, funciones 81.18 %, sentencias 85.86 % y líneas 89.4 %. Los cuatro umbrales permanecen en 80 % y no se excluyeron archivos para elevar el resultado.

Con autorización del propietario se adaptó .github/workflows/pr-standards.yml para que Leo-garnica/umssy-app-deploy admita ramas como fix/develop-ui-epic2-epic3, PR directo a main y mantenimiento de CI en ese mismo PR. La excepción se limita al nombre exacto de este repositorio, sin distinguir mayúsculas. Las reglas originales del proyecto principal se conservan.

La política se verificó con 20 casos locales de Bash/YAML que incluyen los flujos permitidos y bloqueados del proyecto principal y del repo personal. Los checks remotos deberán volver a ejecutarse después del commit y push. Evidencia: [ci-deploy-verificacion.json](./ci-deploy-verificacion.json).
