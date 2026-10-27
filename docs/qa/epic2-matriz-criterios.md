# Matriz de criterios de épica 2 para el deploy

Referencia funcional: rama conjunta `feature/epic-2-y-epic-3`, merge `144e9be9`. Fecha: 27 de octubre de 2026.

Esta lista conserva 215 comprobaciones: 148 criterios originales de HU-2.1 a HU-2.6, 60 criterios/validaciones resumidos de HU-2.7, HU-2.9 y HU-2.10, y 7 verificaciones técnicas propuestas para HU-2.8. El PDF recibido no incluye una sección completa de HU-2.8; T1–T7 no son números de CA oficiales atribuidos al PDF.

**Las pruebas de la rama conjunta no aceptan automáticamente este deploy.** Todas las filas quedan pendientes de la ejecución y aceptación en la versión publicada correspondiente. Registrar entorno, SHA, fecha, escenario, evidencia, resultado y responsable. Consultar [el informe](epic2-integracion.md) y [los recorridos](epic2-recorridos.md).

## HU-2.1: Datos personales y presentación

Fuente: [issue #240](https://github.com/UMSSY/umssy-app/issues/240).

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.1-CA1 | Acceso al perfil: al acceder a Home &gt; Comunidad &gt; Mi perfil &gt; Datos personales, el sistema muestra el formulario para completar y gestionar la información personal y profesional. | QA pendiente | Pendiente |
| HU-2.1-CA2 | Registro de datos personales: al ingresar nombre completo, ciudad de residencia, teléfono y correo personal, el sistema guarda la información en el perfil. | QA pendiente | Pendiente |
| HU-2.1-CA3 | Registro de fotografía: al seleccionar y cargar una fotografía, el sistema la muestra como parte del perfil profesional. | QA pendiente | Pendiente |
| HU-2.1-CA4 | Validación de información de contacto: al registrar teléfono y correo personal, el sistema valida que ambos tengan formato válido antes de guardarlos. | QA pendiente | Pendiente |
| HU-2.1-CA5 | Registro del titular profesional: al ingresar un titular corto, el sistema lo guarda y lo muestra en el perfil. | QA pendiente | Pendiente |
| HU-2.1-CA6 | Registro de "Acerca de": al completar la sección "Acerca de", el sistema guarda y muestra la información en el perfil. | QA pendiente | Pendiente |
| HU-2.1-CA7 | Registro de especialidad profesional: al describir quién es y en qué se especializa dentro de "Acerca de", el sistema lo guarda como parte de la presentación profesional. | QA pendiente | Pendiente |
| HU-2.1-CA8 | Registro de oportunidades laborales: al especificar las oportunidades laborales que le interesan en su presentación, el sistema guarda y muestra esa información en el perfil. | QA pendiente | Pendiente |
| HU-2.1-CA9 | Validación de campos obligatorios: si deja campos obligatorios vacíos o con formato inválido, el sistema impide el guardado e indica qué datos completar o corregir. | QA pendiente | Pendiente |
| HU-2.1-CA10 | Guardado de datos personales: al seleccionar "Guardar perfil" con los datos completos, el sistema registra la información y confirma que se guardó correctamente. | QA pendiente | Pendiente |
| HU-2.1-CA11 | Guardado de presentación profesional: al seleccionar "Guardar presentación" con titular y "Acerca de" completos, el sistema registra la información y actualiza la presentación. | QA pendiente | Pendiente |
| HU-2.1-CA12 | Cancelación de cambios: al seleccionar "Cancelar" antes de guardar, el sistema descarta los cambios y conserva la información previamente registrada. | QA pendiente | Pendiente |
| HU-2.1-CA13 | Edición de información: el sistema permite modificar datos personales, de contacto o de presentación y guardar los cambios. | QA pendiente | Pendiente |
| HU-2.1-CA14 | Persistencia de los datos: al volver a Datos personales o Presentación profesional, el sistema muestra la información registrada y conserva los cambios. | QA pendiente | Pendiente |

## HU-2.2: Formación académica

Fuente: [issue #242](https://github.com/UMSSY/umssy-app/issues/242).

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.2-CA1 | Acceso: al seleccionar "Trayectoria" y luego "Formación académica", el sistema muestra la sección con los registros existentes y la opción "+ Agregar formación". | QA pendiente | Pendiente |
| HU-2.2-CA2 | Formulario: al seleccionar "+ Agregar formación", el sistema muestra el formulario para registrar una nueva formación académica. | QA pendiente | Pendiente |
| HU-2.2-CA3 | Institución y título: al ingresar la institución y el título o carrera obtenida, el sistema permite registrar ambos datos. | QA pendiente | Pendiente |
| HU-2.2-CA4 | Periodo: al ingresar la fecha de inicio y la de finalización, el sistema registra y muestra el periodo de formación. | QA pendiente | Pendiente |
| HU-2.2-CA5 | Descripción: al ingresar información adicional en la descripción, el sistema la guarda y la muestra junto al registro. | QA pendiente | Pendiente |
| HU-2.2-CA6 | Guardado: al guardar con los datos requeridos completos, el sistema registra la formación y la muestra en la sección "Formación académica". | QA pendiente | Pendiente |
| HU-2.2-CA7 | Validación: si deja datos requeridos sin completar, el sistema impide el guardado y muestra los campos que debe completar. | QA pendiente | Pendiente |
| HU-2.2-CA8 | Varios registros: al seleccionar de nuevo "+ Agregar formación" y registrar otro estudio, el sistema conserva el registro anterior y agrega el nuevo a la lista. | QA pendiente | Pendiente |
| HU-2.2-CA9 | Edición: al seleccionar "Editar" y modificar datos, el sistema actualiza el registro y muestra la información modificada. | QA pendiente | Pendiente |
| HU-2.2-CA10 | Eliminación: al seleccionar "Eliminar" en un registro, el sistema lo elimina de la lista de formación académica. | QA pendiente | Pendiente |

## HU-2.3: Experiencia laboral

Fuente: [issue #243](https://github.com/UMSSY/umssy-app/issues/243).

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.3-CA1 | Al ingresar a "Mi perfil" y seleccionar "Trayectoria", se muestra la pantalla "Experiencia laboral" con su título y el subtítulo "Registra tus empleos y las funciones que desempeñaste en cada cargo". | QA pendiente | Pendiente |
| HU-2.3-CA2 | Se muestra la etiqueta "Egresado aprobado" en la esquina superior derecha. | QA pendiente | Pendiente |
| HU-2.3-CA3 | Se muestran las pestañas Datos personales, Presentación, Trayectoria y Documentos, con "Trayectoria" resaltada. | QA pendiente | Pendiente |
| HU-2.3-CA4 | Se muestran en paralelo la sección "Tu experiencia" y la sección "Agregar experiencia". | QA pendiente | Pendiente |
| HU-2.3-CA5 | En "Tu experiencia" se muestra el texto indicativo de que los registros van del más reciente al más antiguo. | QA pendiente | Pendiente |
| HU-2.3-CA6 | En "Tu experiencia" se muestra el texto "Agrega todos los trabajos relevantes para tu trayectoria." | QA pendiente | Pendiente |
| HU-2.3-CA7 | Cada registro muestra el cargo, la empresa u organización y el periodo. | QA pendiente | Pendiente |
| HU-2.3-CA8 | Cada registro muestra las opciones "Editar" y "Eliminar". | QA pendiente | Pendiente |
| HU-2.3-CA9 | La opción "Eliminar" se muestra en rojo y diferenciada de "Editar". | QA pendiente | Pendiente |
| HU-2.3-CA10 | El formulario "Agregar experiencia" muestra los campos Empresa u organización, Cargo, Desde, Hasta, la casilla "Trabajo actualmente aquí" y Funciones que desempeñé. | QA pendiente | Pendiente |
| HU-2.3-CA11 | Empresa u organización, Cargo, Desde y Funciones que desempeñé están marcados con asterisco como obligatorios. | QA pendiente | Pendiente |
| HU-2.3-CA12 | El campo "Hasta" no está marcado como obligatorio. | QA pendiente | Pendiente |
| HU-2.3-CA13 | Los campos "Desde" y "Hasta" se muestran uno al lado del otro. | QA pendiente | Pendiente |
| HU-2.3-CA14 | El formulario vacío muestra textos de ayuda (ej. "Synapse Labs", "Desarrolladora web junior", "Mes y año"). | QA pendiente | Pendiente |
| HU-2.3-CA15 | El botón "Guardar experiencia" se muestra destacado en rojo y alineado a la derecha. | QA pendiente | Pendiente |
| HU-2.3-CA16 | Al ingresar la empresa u organización y el cargo, el sistema acepta ambos datos. | QA pendiente | Pendiente |
| HU-2.3-CA17 | Al ingresar mes y año en "Desde", el sistema acepta el dato. | QA pendiente | Pendiente |
| HU-2.3-CA18 | Al ingresar mes y año en "Hasta", el sistema acepta el dato. | QA pendiente | Pendiente |
| HU-2.3-CA19 | Al describir las funciones en "Funciones que desempeñé", el sistema acepta el texto ingresado. | QA pendiente | Pendiente |
| HU-2.3-CA20 | Al marcar "Trabajo actualmente aquí", el sistema permite guardar la experiencia sin fecha en "Hasta". | QA pendiente | Pendiente |
| HU-2.3-CA21 | Al intentar guardar sin la empresa u organización, el sistema impide el guardado y muestra un mensaje indicando que debe completarla. | QA pendiente | Pendiente |
| HU-2.3-CA22 | Al intentar guardar sin el cargo, el sistema impide el guardado y muestra un mensaje indicando que debe completarlo. | QA pendiente | Pendiente |
| HU-2.3-CA23 | Al intentar guardar sin la fecha "Desde", el sistema impide el guardado y muestra un mensaje indicando que debe completarla. | QA pendiente | Pendiente |
| HU-2.3-CA24 | Al intentar guardar sin "Funciones que desempeñé", el sistema impide el guardado y muestra un mensaje indicando que debe completarlas. | QA pendiente | Pendiente |
| HU-2.3-CA25 | Al intentar guardar con todos los campos obligatorios vacíos, el sistema impide el guardado y muestra un mensaje por cada campo faltante. | QA pendiente | Pendiente |
| HU-2.3-CA26 | Si "Hasta" es anterior a "Desde" y no está marcado "Trabajo actualmente aquí", el sistema impide el guardado y muestra un mensaje de periodo inválido. | QA pendiente | Pendiente |
| HU-2.3-CA27 | Al seleccionar "Guardar experiencia" con los datos requeridos completos, el sistema registra la experiencia y la muestra en "Tu experiencia". | QA pendiente | Pendiente |
| HU-2.3-CA28 | Al guardar una experiencia correctamente, el sistema limpia el formulario. | QA pendiente | Pendiente |
| HU-2.3-CA29 | Con "Trabajo actualmente aquí" marcado, la lista muestra el periodo como "[Mes Año] – Actualidad". | QA pendiente | Pendiente |
| HU-2.3-CA30 | Con "Hasta" completo, la lista muestra inicio y fin (ej. "Jul – Dic 2024" si son del mismo año, o "Mar 2023 – Dic 2024" si son de años distintos). | QA pendiente | Pendiente |
| HU-2.3-CA31 | Al registrar una segunda experiencia, el sistema conserva la anterior y agrega la nueva a la lista. | QA pendiente | Pendiente |
| HU-2.3-CA32 | Con varias experiencias registradas, el sistema las muestra de la más reciente a la más antigua. | QA pendiente | Pendiente |
| HU-2.3-CA33 | Al seleccionar "Editar" en un registro, el sistema carga sus datos en el formulario. | QA pendiente | Pendiente |
| HU-2.3-CA34 | Al modificar un dato y seleccionar "Guardar experiencia", el sistema actualiza el registro con la información modificada. | QA pendiente | Pendiente |
| HU-2.3-CA35 | Al seleccionar "Eliminar" en un registro, el sistema lo elimina de la lista. | QA pendiente | Pendiente |
| HU-2.3-CA36 | Al eliminar un registro, el sistema conserva las demás experiencias sin cambios. | QA pendiente | Pendiente |
| HU-2.3-CA37 | Al volver a "Mi perfil &gt; Trayectoria" después de guardar, editar o eliminar, el sistema muestra la lista con los cambios conservados. | QA pendiente | Pendiente |
| HU-2.3-CA38 | En móvil, la sección "Tu experiencia" y la sección "Agregar experiencia" se muestran una debajo de la otra. | QA pendiente | Pendiente |
| HU-2.3-CA39 | En móvil se mantienen todos los campos, la casilla y el botón "Guardar experiencia" del formulario. | QA pendiente | Pendiente |
| HU-2.3-CA40 | En móvil, los campos del formulario y el botón "Guardar experiencia" ocupan todo el ancho disponible. | QA pendiente | Pendiente |
| HU-2.3-CA41 | En móvil, los campos "Desde" y "Hasta" se mantienen uno al lado del otro. | QA pendiente | Pendiente |
| HU-2.3-CA42 | En móvil, las pestañas se muestran en una sola fila, con "Trayectoria" resaltada. | QA pendiente | Pendiente |
| HU-2.3-CA43 | En móvil se mantienen las opciones "Editar" y "Eliminar" en cada registro. | QA pendiente | Pendiente |

## HU-2.4: Habilidades técnicas

Fuente: [issue #244](https://github.com/UMSSY/umssy-app/issues/244).

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.4-CA1 | El sistema muestra correctamente la sección "Habilidades técnicas" dentro de Home &gt; Comunidad &gt; Mi perfil &gt; Trayectoria. | QA pendiente | Pendiente |
| HU-2.4-CA2 | El sistema muestra las habilidades disponibles en el catálogo, con su nombre y, cuando corresponda, su categoría o descripción. | QA pendiente | Pendiente |
| HU-2.4-CA3 | El sistema permite buscar una habilidad existente con el campo "Buscar en el catálogo". | QA pendiente | Pendiente |
| HU-2.4-CA4 | El sistema muestra únicamente las habilidades que coinciden con el término ingresado en el buscador. | QA pendiente | Pendiente |
| HU-2.4-CA5 | El sistema informa cuando una búsqueda no encuentra coincidencias en el catálogo. | QA pendiente | Pendiente |
| HU-2.4-CA6 | El sistema permite agregar una habilidad existente del catálogo con la opción "+ Añadir". | QA pendiente | Pendiente |
| HU-2.4-CA7 | Una habilidad agregada desde el catálogo aparece en la sección "Mis habilidades". | QA pendiente | Pendiente |
| HU-2.4-CA8 | El sistema permite agregar varias habilidades del catálogo sin eliminar las seleccionadas anteriormente. | QA pendiente | Pendiente |
| HU-2.4-CA9 | El sistema impide registrar dos veces la misma habilidad del catálogo en el perfil del usuario. | QA pendiente | Pendiente |
| HU-2.4-CA10 | El sistema permite crear y agregar una habilidad personalizada cuando no se encuentra en el catálogo. | QA pendiente | Pendiente |
| HU-2.4-CA11 | El sistema impide crear una habilidad personalizada cuando el campo de nombre está vacío. | QA pendiente | Pendiente |
| HU-2.4-CA12 | El sistema impide registrar una habilidad personalizada que ya existe con el mismo nombre, evitando duplicados. | QA pendiente | Pendiente |
| HU-2.4-CA13 | El sistema permite eliminar una habilidad agregada con la opción "X" de su etiqueta. | QA pendiente | Pendiente |
| HU-2.4-CA14 | Al eliminar una habilidad no se eliminan las demás habilidades del perfil. | QA pendiente | Pendiente |
| HU-2.4-CA15 | El botón "Guardar habilidades" guarda correctamente las habilidades seleccionadas y personalizadas. | QA pendiente | Pendiente |
| HU-2.4-CA16 | El sistema muestra un mensaje o indicador confirmando que las habilidades fueron guardadas correctamente. | QA pendiente | Pendiente |
| HU-2.4-CA17 | Las habilidades guardadas permanecen disponibles después de recargar la página. | QA pendiente | Pendiente |
| HU-2.4-CA18 | Las habilidades guardadas permanecen disponibles después de cerrar sesión y volver a iniciar sesión con la misma cuenta. | QA pendiente | Pendiente |
| HU-2.4-CA19 | (PC) La sección "Habilidades técnicas" se visualiza correctamente en un navegador de computadora, con el buscador, el catálogo, "Mis habilidades" y el botón "Guardar habilidades". | QA pendiente | Pendiente |
| HU-2.4-CA20 | (PC) El usuario puede escribir con el teclado en el campo de búsqueda y obtener los resultados correspondientes. | QA pendiente | Pendiente |
| HU-2.4-CA21 | (PC) Las habilidades agregadas se visualizan como etiquetas y cada una tiene la opción para eliminarla. | QA pendiente | Pendiente |
| HU-2.4-CA22 | (PC) El usuario puede crear una habilidad personalizada, agregarla a "Mis habilidades" y guardarla junto con las habilidades del catálogo. | QA pendiente | Pendiente |

## HU-2.5: Certificaciones

Fuente: [issue #245](https://github.com/UMSSY/umssy-app/issues/245).

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.5-CA1 | Acceso a la sección Certificaciones: al navegar a Home &gt; Comunidad &gt; Mi perfil &gt; Trayectoria &gt; Certificaciones, el sistema muestra la lista de registros existentes (o un estado vacío) y el botón "+ Agregar certificación". | QA pendiente | Pendiente |
| HU-2.5-CA2 | Visualización del listado: cada certificación muestra nombre, entidad emisora, fecha de obtención (año o fecha completa) y las acciones "Editar" y "Eliminar". | QA pendiente | Pendiente |
| HU-2.5-CA3 | Agregar una nueva certificación (camino feliz): al completar nombre, entidad emisora y fecha de obtención y confirmar el guardado, el sistema registra la certificación, la muestra en el listado y muestra un mensaje de éxito (ej. "Certificación agregada correctamente"). | QA pendiente | Pendiente |
| HU-2.5-CA4 | Campos obligatorios y validación de formato: si hay campos obligatorios vacíos o con formato inválido, el sistema impide el guardado y muestra errores claros junto a cada campo afectado. Reglas: nombre obligatorio, texto libre, máximo 150 caracteres; entidad emisora obligatoria, texto libre, máximo 100 caracteres; fecha de obtención obligatoria, formato fecha (YYYY o DD/MM/YYYY según diseño), no puede ser futura. | QA pendiente | Pendiente |
| HU-2.5-CA5 | Editar una certificación existente: al modificar uno o más campos y guardar, el sistema actualiza la información, refleja los cambios en el listado y muestra un mensaje de éxito. | QA pendiente | Pendiente |
| HU-2.5-CA6 | Eliminar una certificación: al seleccionar "Eliminar" y confirmar en el diálogo, el sistema elimina el registro de forma permanente, actualiza el listado y muestra un mensaje de confirmación de eliminación. | QA pendiente | Pendiente |
| HU-2.5-CA7 | Cancelar eliminación: al seleccionar "Cancelar" en el diálogo de confirmación, el sistema cierra el diálogo sin eliminar el registro y mantiene el listado sin cambios. | QA pendiente | Pendiente |
| HU-2.5-CA8 | Persistencia de datos: al cerrar sesión, volver a ingresar y navegar a Certificaciones, el sistema muestra exactamente el mismo estado de los registros (persistencia en base de datos). | QA pendiente | Pendiente |
| HU-2.5-CA9 | Estado vacío: si no hay certificaciones, el sistema muestra un mensaje orientativo (ej. "Aún no has agregado certificaciones") junto con el botón "+ Agregar certificación". | QA pendiente | Pendiente |
| HU-2.5-CA10 | Múltiples certificaciones: al agregar dos o más registros válidos, el sistema permite registrar varias sin límite práctico y las muestra ordenadas de la más reciente a la más antigua. | QA pendiente | Pendiente |
| HU-2.5-CA11 | Si la fecha de obtención es posterior a la fecha actual del sistema, el sistema impide el guardado y muestra un error indicando que la fecha no puede ser futura. | QA pendiente | Pendiente |
| HU-2.5-CA12 | Al seleccionar "Cancelar" o cerrar el formulario de agregar/editar sin guardar, el sistema descarta los cambios y regresa al listado sin modificar ningún registro. | QA pendiente | Pendiente |
| HU-2.5-CA13 | Si el Nombre de la certificación excede los 150 caracteres, el sistema impide el guardado y muestra un error de longitud máxima excedida. | QA pendiente | Pendiente |
| HU-2.5-CA14 | Si la Entidad emisora excede los 100 caracteres, el sistema impide el guardado y muestra un error de longitud máxima excedida. | QA pendiente | Pendiente |
| HU-2.5-CA15 | Si se ingresan caracteres especiales o scripts (ej. `&lt;script&gt;`, `';`, `""`) en Nombre o Entidad, el sistema sanitiza o rechaza la entrada y no permite guardar código malicioso. | QA pendiente | Pendiente |
| HU-2.5-CA16 | Si solo la Fecha de obtención está vacía (con Nombre y Entidad completos), el sistema muestra error únicamente en el campo Fecha e impide el guardado. | QA pendiente | Pendiente |
| HU-2.5-CA17 | Si la fecha tiene formato inválido (ej. 32/13/2024 o texto), el sistema muestra un error de formato de fecha inválido e impide el guardado. | QA pendiente | Pendiente |
| HU-2.5-CA18 | Durante el guardado, el sistema muestra un indicador de carga (loader/spinner) y deshabilita el botón "Guardar" para evitar envíos duplicados. | QA pendiente | Pendiente |
| HU-2.5-CA19 | Si se pierde la conexión a internet al guardar, el sistema muestra un mensaje de error de conexión/servidor y no registra el dato parcialmente. | QA pendiente | Pendiente |
| HU-2.5-CA20 | Al editar una certificación y dejar un campo obligatorio vacío, el sistema impide guardar la edición y muestra el error en el campo afectado. | QA pendiente | Pendiente |

## HU-2.6: Documentos y CV

Fuente: [issue #246](https://github.com/UMSSY/umssy-app/issues/246).

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.6-CA1 | El sistema muestra la sección "Documentos" con el subtítulo "Sube o actualiza tu CV y mantén tus documentos en orden". | QA pendiente | Pendiente |
| HU-2.6-CA2 | El sistema permite subir un currículum en formato PDF con el botón "Seleccionar PDF". | QA pendiente | Pendiente |
| HU-2.6-CA3 | Tras una subida correcta de CV, el sistema muestra un mensaje de éxito y actualiza la sección "Archivo guardado". | QA pendiente | Pendiente |
| HU-2.6-CA4 | El sistema rechaza archivos que no sean PDF al subir el currículum, mostrando un mensaje de error. | QA pendiente | Pendiente |
| HU-2.6-CA5 | El sistema muestra el nombre, el peso (ej. 1.2 MB) y la fecha de actualización del CV en "Archivo guardado". | QA pendiente | Pendiente |
| HU-2.6-CA6 | El sistema permite reemplazar un currículum existente con el botón "Reemplazar CV". | QA pendiente | Pendiente |
| HU-2.6-CA7 | Al reemplazar el CV, el archivo anterior deja de estar en la lista y se actualiza con la nueva información. | QA pendiente | Pendiente |
| HU-2.6-CA8 | El sistema valida el peso máximo permitido del PDF y rechaza los que superen el límite. | QA pendiente | Pendiente |
| HU-2.6-CA9 | El sistema permite navegar al paso 2 con el botón "Ver certificaciones". | QA pendiente | Pendiente |
| HU-2.6-CA10 | El sistema muestra la sección "Añadir una certificación" con el texto "Selecciona un PDF o una imagen (PNG o JPG) para adjuntarla al perfil". | QA pendiente | Pendiente |
| HU-2.6-CA11 | El sistema permite subir certificaciones en formato PDF, PNG o JPG con el botón "+ Seleccionar archivo". | QA pendiente | Pendiente |
| HU-2.6-CA12 | El sistema rechaza archivos de certificación que no sean PDF, PNG o JPG, mostrando un mensaje de error. | QA pendiente | Pendiente |
| HU-2.6-CA13 | El sistema muestra la lista "Documentos guardados" con las columnas Nombre y fecha de carga, Certificación, Tipo, y las acciones Reemplazar/Eliminar. | QA pendiente | Pendiente |
| HU-2.6-CA14 | El sistema muestra el nombre del archivo, la fecha de subida y el tipo (PDF, PNG, JPG) en la lista de documentos guardados. | QA pendiente | Pendiente |
| HU-2.6-CA15 | El sistema permite reemplazar una certificación existente con la opción "Reemplazar". | QA pendiente | Pendiente |
| HU-2.6-CA16 | Al reemplazar una certificación, el sistema actualiza la información del archivo y mantiene el registro en la lista. | QA pendiente | Pendiente |
| HU-2.6-CA17 | El sistema solicita confirmación antes de eliminar una certificación al hacer clic en "Eliminar". | QA pendiente | Pendiente |
| HU-2.6-CA18 | Al confirmar la eliminación, el archivo desaparece de la lista de documentos guardados. | QA pendiente | Pendiente |
| HU-2.6-CA19 | Si el usuario rechaza la confirmación, el sistema cancela la eliminación y mantiene el archivo en la lista. | QA pendiente | Pendiente |
| HU-2.6-CA20 | El sistema muestra el mensaje "Podrás reemplazar o quitar el archivo después de guardarlo" al añadir una certificación. | QA pendiente | Pendiente |
| HU-2.6-CA21 | El sistema muestra el mensaje "Eliminar solicita confirmación. Reemplazar abre la selección de un archivo nuevo" en la parte inferior de la lista. | QA pendiente | Pendiente |
| HU-2.6-CA22 | El sistema permite volver al paso 1 (CV) con el botón "Volver al CV". | QA pendiente | Pendiente |
| HU-2.6-CA23 | El sistema permite regresar al perfil principal con el botón "Volver a mi perfil". | QA pendiente | Pendiente |
| HU-2.6-CA24 | El sistema muestra el mensaje "Paso 2 de 2: Tus archivos pueden consultarse junto con tu perfil" al finalizar la carga de certificaciones. | QA pendiente | Pendiente |
| HU-2.6-CA25 | El sistema mantiene la persistencia de los datos (CV y certificaciones) al recargar la página o cerrar sesión. | QA pendiente | Pendiente |
| HU-2.6-CA26 | El sistema asocia correctamente el nombre de la certificación (ej. Scrum Fundamentals, Ciencia de datos) con el archivo subido. | QA pendiente | Pendiente |
| HU-2.6-CA27 | El sistema valida que el archivo de certificación no esté corrupto o vacío antes de guardarlo. | QA pendiente | Pendiente |
| HU-2.6-CA28 | El sistema permite subir múltiples certificaciones sin límite aparente (o según la regla de negocio definida). | QA pendiente | Pendiente |
| HU-2.6-CA29 | El sistema muestra un estado de carga (spinner o mensaje) mientras se procesan los archivos, para evitar múltiples clics. | QA pendiente | Pendiente |
| HU-2.6-CA30 | (Móvil) La barra superior muestra el logo, el nombre "UMSSY" y el botón de menú tipo hamburguesa en la esquina superior derecha. | QA pendiente | Pendiente |
| HU-2.6-CA31 | (Móvil) La barra de pestañas ("Datos", "Presentación", "Trayectoria", "Documentos") se desplaza horizontalmente y resalta la pestaña activa con una línea inferior roja. | QA pendiente | Pendiente |
| HU-2.6-CA32 | (Móvil) Los botones "Confirmar carga", "Guardar documento", "Reemplazar CV" y "Eliminar CV" ocupan el ancho completo de la pantalla. | QA pendiente | Pendiente |
| HU-2.6-CA33 | (Móvil) En la vista del CV, el bloque "Subir currículum" y el bloque "Archivo actual" se apilan verticalmente, sin superponerse. | QA pendiente | Pendiente |
| HU-2.6-CA34 | (Móvil) En la vista del CV, con un archivo cargado se muestra el indicador "✓ Cargado correctamente" debajo de los datos del archivo. | QA pendiente | Pendiente |
| HU-2.6-CA35 | (Móvil) El formulario "Adjuntar respaldo" muestra los campos obligatorios "Certificación asociada *" y "Archivo de respaldo *" con el espaciado adecuado. | QA pendiente | Pendiente |
| HU-2.6-CA36 | (Móvil) En "Documentos cargados", los botones "Reemplazar" y "Eliminar" se muestran como enlaces de texto subrayados y alineados a los extremos, sin solaparse con la información del archivo. | QA pendiente | Pendiente |
| HU-2.6-CA37 | (Móvil) La información de cada archivo (nombre, tipo, fecha y certificación vinculada) se muestra en bloques de texto separados por líneas sutiles. | QA pendiente | Pendiente |
| HU-2.6-CA38 | (Móvil) El menú lateral se oculta o colapsa y se despliega al presionar el botón hamburguesa. | QA pendiente | Pendiente |
| HU-2.6-CA39 | (Móvil) El scroll vertical es fluido, desde la carga del archivo hasta el final de la lista de documentos guardados, sin cortes ni saltos bruscos. | QA pendiente | Pendiente |

## HU-2.7: Consolidación de habilidades

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.7-CA1 | Unificar habilidades manuales y detectadas. | QA pendiente | Pendiente |
| HU-2.7-CA2 | Deduplicar por nombre/identificador, incluidas variantes de mayúsculas. | QA pendiente | Pendiente |
| HU-2.7-CA3 | Excluir de la lista final verificada habilidades fuera del catálogo válido o con formato inválido. | QA pendiente | Pendiente |
| HU-2.7-CA4 | Generar lista vacía controlada cuando no hay habilidades. | QA pendiente | Pendiente |
| HU-2.7-CA5 | Consolidar correctamente cuando solo existe una fuente. | QA pendiente | Pendiente |
| HU-2.7-CA6 | Dejar disponible en el perfil la lista final validada. | QA pendiente | Pendiente |
| HU-2.7-CA7 | Actualizar la lista al cambiar manuales o detectadas. | QA pendiente | Pendiente |
| HU-2.7-CA8 | Procesar fuentes incompletas manteniendo un resultado coherente con la información válida. | QA pendiente | Pendiente |
| HU-2.7-CA9 | Unificar equivalencias según las reglas de normalización. | QA pendiente | Pendiente |
| HU-2.7-V1 | Ejecución automática al guardar/actualizar fuentes del perfil. | QA pendiente | Pendiente |
| HU-2.7-V2 | Cumplir el umbral de tiempo acordado; el PDF da tres segundos como ejemplo. | Umbral y medición en deploy pendientes | Pendiente |
| HU-2.7-V3 | Persistencia asociada al userId. | QA pendiente | Pendiente |
| HU-2.7-V4 | updatedAt generado por el servidor en cada ejecución. | QA pendiente | Pendiente |
| HU-2.7-V5 | Logs de inicio, fin y resultado. | QA pendiente | Pendiente |
| HU-2.7-V6 | Reglas de catálogo, longitud, caracteres y normalización. | QA pendiente | Pendiente |
| HU-2.7-V7 | Formato y tipos de respuesta acordados. | QA pendiente | Pendiente |
| HU-2.7-V8 | 401 para consulta/ejecución sin sesión válida. | QA pendiente | Pendiente |
| HU-2.7-V9 | Idempotencia con datos iguales. | QA pendiente | Pendiente |

## HU-2.8: Contrato de entrega al radar

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.8-T1 | GET /api/profile/skills-for-radar autenticado, con userId de sesión y formato estándar. | QA pendiente | Pendiente |
| HU-2.8-T2 | Campos y tipos de status, fecha, revisión/versiones y lista de habilidades según contrato vigente. | QA pendiente | Pendiente |
| HU-2.8-T3 | Origen, área y metadatos de habilidades coherentes; tratamiento explícito de área nula/personalizada. | QA pendiente | Pendiente |
| HU-2.8-T4 | 401 para sesión ausente o inválida y 404 para perfil inexistente, conforme al contrato. | QA pendiente | Pendiente |
| HU-2.8-T5 | Diferenciar ready, pending y error sin convertir un fallo en lista vacía exitosa. | QA pendiente | Pendiente |
| HU-2.8-T6 | Reanálisis/reintento funcional y conservación de información válida cuando corresponda. | QA pendiente | Pendiente |
| HU-2.8-T7 | Consumo efectivo por el radar y publicación de datos de la revisión vigente. | QA pendiente | Pendiente |

## HU-2.9: Actualización de habilidades

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.9-CA1 | Agregar una habilidad activa la verificación. | QA pendiente | Pendiente |
| HU-2.9-CA2 | Modificar una habilidad activa la verificación. | QA pendiente | Pendiente |
| HU-2.9-CA3 | Eliminar una habilidad actualiza/verifica la lista. | QA pendiente | Pendiente |
| HU-2.9-CA4 | Editar el texto de experiencia vuelve a extraer keywords. | QA pendiente | Pendiente |
| HU-2.9-CA5 | Agregar información de otras habilidades a la experiencia vuelve a extraer. | QA pendiente | Pendiente |
| HU-2.9-CA6 | Entregar al radar la lista actualizada. | QA pendiente | Pendiente |
| HU-2.9-CA7 | Controlar las revisiones/versiones de los cambios sucesivos. | QA pendiente | Pendiente |
| HU-2.9-CA8 | Evitar que una ejecución anterior reemplace a una más reciente. | QA pendiente | Pendiente |
| HU-2.9-CA9 | Actualizar y entregar al radar tras alta, edición o eliminación. | QA pendiente | Pendiente |
| HU-2.9-CA10 | Ejecutar verificación/actualización en las tres operaciones. | QA pendiente | Pendiente |
| HU-2.9-CA11 | Incluir la habilidad nueva en la lista actualizada. | QA pendiente | Pendiente |
| HU-2.9-V1 | El radar recibe la habilidad agregada. | QA pendiente | Pendiente |
| HU-2.9-V2 | El radar recibe la habilidad modificada sin conservar el valor anterior. | QA pendiente | Pendiente |
| HU-2.9-V3 | La habilidad eliminada deja de figurar en la lista vigente enviada. | QA pendiente | Pendiente |
| HU-2.9-V4 | Keywords correspondientes al texto modificado. | QA pendiente | Pendiente |
| HU-2.9-V5 | Detecciones actualizadas según el nuevo texto. | QA pendiente | Pendiente |
| HU-2.9-V6 | Recepción por radar de la lista correspondiente al cambio. | QA pendiente | Pendiente |
| HU-2.9-V7 | Uso de la revisión más reciente para actualizar el radar. | QA pendiente | Pendiente |
| HU-2.9-V8 | Conservación por radar de la información de la última revisión. | QA pendiente | Pendiente |
| HU-2.9-V9 | Radar consistente con las habilidades vigentes del titular. | QA pendiente | Pendiente |
| HU-2.9-V10 | Pruebas de alta/edición/baja que comprueban la entrega actualizada. | QA pendiente | Pendiente |

## HU-2.10: Detección NLP

| ID | Criterio / comprobación | Aceptación en deploy | Evidencia / defecto |
| --- | --- | --- | --- |
| HU-2.10-CA1 | Extraer keywords de una experiencia con texto. | QA pendiente | Pendiente |
| HU-2.10-CA2 | Detectar varias habilidades/tecnologías en el mismo texto. | QA pendiente | Pendiente |
| HU-2.10-CA3 | Resolver texto sin habilidades identificables sin error. | QA pendiente | Pendiente |
| HU-2.10-CA4 | Resolver descripción vacía o espacios sin keywords de ese texto. | QA pendiente | Pendiente |
| HU-2.10-CA5 | Volver a detectar según el contenido actualizado. | QA pendiente | Pendiente |
| HU-2.10-CA6 | Reconocer los tipos de habilidad admitidos por el motor. | QA pendiente | Pendiente |
| HU-2.10-CA7 | Devolver únicamente habilidades sustentadas en el texto. | QA pendiente | Pendiente |
| HU-2.10-CA8 | Gestionar fallos de NLP sin exponer detalles sensibles ni simular éxito. | QA pendiente | Pendiente |
| HU-2.10-CA9 | Entregar detecciones en el formato utilizado por HU-2.7. | QA pendiente | Pendiente |
| HU-2.10-V1 | Ejecutar la detección conforme al flujo definido. | QA pendiente | Pendiente |
| HU-2.10-V2 | Correspondencia de keywords con el texto de experiencia. | QA pendiente | Pendiente |
| HU-2.10-V3 | Textos vacíos o sin habilidades sin error. | QA pendiente | Pendiente |
| HU-2.10-V4 | Actualizar resultados al editar experiencia. | QA pendiente | Pendiente |
| HU-2.10-V5 | Formato de salida acordado. | QA pendiente | Pendiente |
| HU-2.10-V6 | Tiempo de respuesta dentro del límite acordado. | Umbral y medición en deploy pendientes | Pendiente |
| HU-2.10-V7 | Errores sin detalles técnicos sensibles. | QA pendiente | Pendiente |
| HU-2.10-V8 | Acceso solo de usuarios autorizados. | QA pendiente | Pendiente |
| HU-2.10-V9 | Logs de ejecución sin información sensible. | QA pendiente | Pendiente |
| HU-2.10-V10 | Textos extensos dentro de límites definidos. | QA pendiente | Pendiente |
| HU-2.10-V11 | Diferenciar resultado vacío de fallo de ejecución. | QA pendiente | Pendiente |
| HU-2.10-V12 | Compatibilidad del resultado con consolidación HU-2.7. | QA pendiente | Pendiente |

