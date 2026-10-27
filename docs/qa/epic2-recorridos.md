# Recorridos para aceptar el deploy de épicas 2 y 3

Registrar entorno, URL, SHA publicado, fecha, cuenta sintética, resultado y evidencia por recorrido. Mantener separados el registro de la rama conjunta y el de este deploy. Los valores de puntuación siguientes usan la fórmula provisional conservada del origen.

| Caso | Pasos | Resultado esperado |
| --- | --- | --- |
| Perfil vacío | Entrar con un titulado nuevo y abrir perfil, documentos y radar. | Estados vacíos claros, cero CV y seis ejes en cero. |
| Datos personales | Guardar datos, presentación e intereses en «Acerca de»; recargar y volver a entrar. Probar contacto inválido. | Datos válidos persistidos; errores sin sobrescribir lo guardado. |
| Habilidad manual | Añadir Python. Revisar el radar, aprobar con el administrativo y consultar otra vez. | Pendiente visible sin puntos; un punto en Data/AI después de aprobación. Repetir la decisión no duplica la publicación. |
| Experiencia | Añadir «Desarrollo con Python y Docker», aprobar Docker, editar a «Desarrollo con Java» y eliminar la experiencia. | Detecciones actualizadas sin recarga, sin duplicado de Python; desaparecen fuentes/aportes anteriores y se conserva la base manual aprobada. |
| Formación y certificación | Añadir, editar y eliminar textos con tecnologías oficiales. | Lista vigente y estado de NLP actualizados en las tres operaciones. |
| Certificado y respaldo | Crear con PDF válido, editar conservando el archivo, reemplazarlo e intentar un archivo corrupto; volver a entrar. | Campos y respaldo se guardan juntos. Un fallo conserva lo anterior. Nombre y metadatos persisten entre sesiones. |
| CV e historial | Subir un PDF textual y luego uno sin texto; revisar estados/historial y eliminar el último. | El último enviado es la fuente actual; uno ilegible no reactiva silenciosamente uno anterior. Los pendientes no puntúan. |
| Evidencias del radar | Abrir el detalle de un eje con aportes aprobados y consultar sus respaldos. | Evidencias de la publicación actual y archivos disponibles únicamente para quien tiene permiso. |
| Revisión administrativa | Entrar como administrativo, filtrar la cola y aprobar/rechazar/revocar aportes. | Decisión persistida; pendientes y puntuaciones se actualizan; repetir una decisión no produce duplicados. |
| Vacantes y empresa | Usar una empresa/cuenta de QA autorizada, publicar o preparar una vacante según el flujo disponible y postular con consentimientos. | Vacantes reales visibles; consulta de candidatos y documentos limitada a empresa y consentimientos correspondientes. |
| Permisos | Consultar sin token, pedir documentos de otra cuenta y acceder como titulado a revisión administrativa. | 401, archivos ajenos inaccesibles y 403 en administración. |
| Fallo de publicación | Ejecutar exclusivamente en la base local temporal el caso de fallo del script protegido. Guardar perfil y reintentar. | Guardado conservado, último radar válido disponible, error recuperable y reintento efectivo. |
| Cambios rápidos | Retener un análisis anterior y guardar una revisión más reciente en el caso concurrente del script. | El resultado antiguo no reemplaza la revisión actual. |
| Cambio de sesión | Salir de A y entrar con B con consultas pendientes. | No se reutilizan caché, nombre, habilidades ni respuestas tardías de A. |
| Móvil | Revisar perfil, radar y evidencias a 1440, 390 y 320 px; abrir/cerrar el menú con teclado. | Tema actual, contenido legible, sin desbordamiento horizontal y navegación accesible. |
| Catálogos | Consultar las seis áreas y nombres oficiales después de migrar. | Las habilidades oficiales del catálogo tienen área; usuarios y registros previos conservan sus identificadores. |
| Rendimiento | Medir guardado/análisis/radar y primer PDF tras un arranque en frío en el deploy. | Cumplimiento del umbral acordado por QA/PO, registrando por separado el caso frío. |

El script de fallos, los fixtures y el SQL de prueba no se ejecutan en Supabase. La [matriz](epic2-matriz-criterios.md) conserva los criterios y comprobaciones individuales; pasar estos recorridos principales no marca automáticamente todas sus filas como aceptadas.

## Cuenta de empresa de QA

La cuenta debe tener el rol empresa y un vínculo autorizado con una fila real de companies. Con una sesión administrativa, usar POST /api/radar-integration/admin/company-access y un JSON con userId y companyId de QA. El formulario consulta las empresas vinculadas; no usa una empresa de muestra ni una variable pública de demo. Con varias empresas, elegir una explícitamente. Comprobar también cuenta sin vínculo y acceso a empresa ajena.
