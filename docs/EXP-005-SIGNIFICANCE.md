# EXP-005 — ¿Es estadísticamente significativa una tendencia del sistema terrestre?

**Project Uriel / TELLURIS — NASA Space Apps 2026**  
**Fecha:** 2026-11-15, Costa Rica  
**Estado:** funcional en código, probado con datos originales NASA y referencia SciPy; la *inferencia científica definitiva* está explícitamente pendiente de homogeneidad de producto y validación independiente.  
**NASA challenge:** https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

## Respuesta técnica al cuarto objetivo de NASA

NASA pide visualizar series largas, estimar cuánto cambia una variable y evaluar si la tendencia es significativa. TELLURIS registra **múltiples capas de evidencia estadística** en lugar de transformar un p-value aislado en una verdad física.

### 1. Tasa de cambio — estimador Theil–Sen

Para años válidos \`t_i\` y datos \`y_i\`, calcula la **mediana de todas las pendientes pareadas** \`(y_j − y_i)/(t_j − t_i)\`. El tiempo usa los **años reales**, no índices consecutivos inventados cuando hay huecos. Presenta la pendiente por década con unidades verificadas en NASA POWER.

Un valor \`+0,2 °C/década\` es una **pendiente estimada**, no una predicción ni un porcentaje de causalidad.

### 2. Contraste Mann–Kendall original

Evalúa monotonicidad con \`S\`, varianza corregida por empates y aproximación normal con continuidad. Muestra el **valor p original**. El supuesto de observaciones independientes es **crítico**; un \`p < 0,05\` sin modelar autocorrelación **no autoriza** la etiqueta «tendencia climática validada». La prueba es pertinente para el reto NASA, pero su conclusión está condicionada a la calidad del registro.

### 3. Intervalo del 95% de pendiente Sen

Calcula el **intervalo basado en rangos y varianza de Kendall** según Sen (1968) y la implementación de referencia SciPy. Los límites conservan las unidades **por década**. Un intervalo que **incluye cero** no descarta una pendiente nula bajo esos supuestos; que **excluya cero** aporta evidencia *condicional* y no prueba dependencia temporal ausente ni homogeneidad histórica.

La implementación JavaScript se contrastó numéricamente contra SciPy con **seis series** (cuatro del archivo real NASA EXP-001 Liberia/Limón y dos sintéticas). Evidencia: [ejecución científica independiente #43755159596](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43755159596). Código: [inference.js](../website/public/assets/inference.js), [exp005_reference_scipy.py](../analysis/exp005_reference_scipy.py).

### 4. Dependencia temporal — prueba adicional por bloques (exploratoria)

- Ajusta el diagnóstico de correlación **lag-1 de residuos sin tendencia** para años consecutivos; ese estimador no verifica independencia.
- Reordena *bloques contiguos* no superpuestos de **tres y cinco años**, conserva el orden **dentro** de cada bloque y calcula, con **999 permutaciones** y semilla fija, la proporción de estadísticas |S| al menos tan extremas como el dato original.
- Estimación Monte Carlo: \`p = (reordenamientos_extremos + 1) / (999 + 1)\`. Las unidades de bloque al final pueden ser más cortas si la longitud de la serie no es múltiplo de 3/5.
- **Puerta de elegibilidad:** años consecutivos, y **mínimo seis bloques por tamaño**. Si no cumple, muestra «sensibilidad no evaluable», nunca p inventado.
- **Limitación fundamental:** intercambiabilidad y estacionariedad de bloques bajo la hipótesis nula **no están demostradas** para cada producto climático. Reordenar bloques no es una corrección Hamed–Rao ni valida autocorrelación de memoria larga, estacionalidad, ni quiebres instrumentales. Resultados significativos en estos tests son SOLO evidencia de sensibilidad exploratoria, **no evidencia definitiva ni un p formalmente corregido en general**.

### 5. Sensibilidad a ventana de tiempo

Compara pendientes de las dos **mitades temporales predefinidas** sin buscar el corte de mayor efecto. Requiere al menos diez años por mitad. Si las pendientes tienen **signos opuestos**, desactiva la calificación de «pruebas exploratorias coincidentes». **No** pretende identificar el año de una ruptura ni diagnosticar por sí sola cambios instrumentales o físicos.

### 6. Comparación costa Pacífico vs Caribe

La plataforma calcula pendientes de cada punto, pero además forma la serie de **diferencias en años compartidos** \`D_t = A_t − B_t\`, sobre la que aplica los mismos tests de tendencia. Esto es más informativo que comparar dos p-values sin emparejar observaciones; sigue siendo una comparación entre **dos celdas de productos**, no regiones enteras, ni prueba que ambas responden a un mismo agente físico. No se usa esa prueba en ángulos de viento \`WD10M\`.

### 7. Exportación de reporte científico JSON

El Explorer ofrece **Descargar informe científico JSON** con serie anual, variable, unidades, origen NASA, coordenadas solicitadas y resueltas, hash del archivo original (cuando existe), URL, pendiente por década, MK condicional, CI Sen, lag-1, permutaciones por bloques, mitades históricas, comparación pareada opcional y limitaciones metodológicas. El campo \`validatedSignificance\` es **false** hasta completar evidencia independiente.

### 8. Asistente de evidencias

El asistente determinista y bilingüe contesta preguntas sobre tendencia, incertidumbre, intervalos, dependencia temporal, comparación pareada y fuentes **solo usando valores calculados**. No hay un modelo generativo alucinado como fuente de p-values.

## Caso demostrativo real 1985–2025 (archivo NASA EXP-001)

Todos los números siguientes **dependen** de la agregación anual archivada y se muestran para reproducibilidad, no como veredicto físico definitivo.

| Lugar | Parámetro | Sen por década | IC 95 % iid por década | MK p original |
| --- | --- | ---: | --- | ---: |
| Liberia | T2M | -0,113 °C | [-0,228; +0,008] °C | 0,085708 |
| Limón | T2M | +0,168 °C | [+0,109; +0,234] °C | 0,000000177 |
| Liberia | PRECTOTCORR | +434,85 mm | [+327,33; +577,03] mm | 0,0000000161 |
| Limón | PRECTOTCORR | +918,77 mm | [+686,91; +1128,02] mm | 0,000000000343 |

**Interpretación responsable:** Liberia/T2M no excluye cero bajo los supuestos del CI. Precipitación muestra pendientes de magnitud extraordinaria, por lo que exige pruebas independientes de **homogeneidad de MERRA-2/POWER**, datos observados u otros productos y posible cambio de método antes de atribuir un proceso climático. La dirección distinta de temperaturas Liberia/Limón no demuestra un «dipolo causado por un mismo mecanismo».

Las cifras están derivadas de [NASA EXP-001 y SciPy #43755159596](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43755159596). El resultado no equivale a un promedio provincial o una medición de estación; el archivo de la app utiliza valores anuales redondeados para presentación.

## Puerta de interpretación pública

- **Pruebas exploratorias coincidentes:** p MK original < 0,05, CI iid excluye cero, ambos bloque-p < 0,05, ambos calculables y las dos mitades predefinidas no invierten sus signos. **Incluso así NO es «significancia climática validada».**
- **Inconcluso:** cualquier evidencia conflictiva, CI incluye cero, o tests no coinciden.
- **Sensibilidad incompleta:** períodos/gaps insuficientes para bloques, independientemente del p MK.
- **Circunferencia del viento:** WD10M solamente promedios circulares descriptivos, sin línea Sen/MK.
- **Limitaciones siempre visibles:** homogeneidad de fuentes, independencia, estacionariedad de bloques, múltiples comparaciones entre 18 parámetros, representatividad espacial, causalidad no demostrada.

## Puntos pendientes para validación física (no ocultos)

1. Contrastar lluvia \`PRECTOTCORR\` con GPM, CHIRPS/estaciones autorizadas u otra fuente independiente; verificar cambios de fuente por año y posibles magnitudes imposibles.
2. Probar formalmente corrección de autocorrelación (p. ej., Yue–Pilon o Hamed–Rao) contra una implementación científica independiente y evaluar la estacionalidad sin atribuir p falsos.
3. Evaluar sesgos por resolución, reanálisis, rejillas, variabilidad interanual ENOS y no linealidad.
4. Verificar en navegadores reales, móvil, descarga JSON/CSV y acceso libre desde BanaHosting.
5. Un jurado debe poder reproducir la consulta/código y diferenciar lo científicamente demostrado de lo que sigue en investigación.

## Referencias técnicas independientes

- NASA Space Apps Challenge 2026 — Earth System Trend Detective: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/
- USGS — Mann–Kendall requiere independencia serial: https://pubs.usgs.gov/publication/sir20245123/full
- USGS — efectos de autocorrelación en análisis de caudal: https://pubs.usgs.gov/sir/2004/5080/pdf/sir20045080.pdf
- SciPy — Theil–Sen slope + 95% CI, documentación y Sen (1968): https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.theilslopes.html
- Hamed y Rao (1998), corrección de varianza para MK autocorrelacionado: https://search.r-project.org/CRAN/refmans/modifiedmk/html/mmkh.html
- USGS (Hirsch y Slack, 1984), Kendall estacional con dependencia: https://www.usgs.gov/publications/a-nonparametric-trend-test-seasonal-data-serial-dependence
- Código JavaScript y pruebas: [inference.js](../website/public/assets/inference.js), [inference.test.js](../website/tests/inference.test.js), [report.js](../website/public/assets/report.js).
