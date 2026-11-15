# EXP-004 — TELLURIS por etapas: 22 campos solicitados y preparación de entrega

**Fecha:** 2026-11-15 (Costa Rica).  
**Estado de esta etapa:** IMPLEMENTADA EN REPOSITORIO, **52/52 pruebas de sitio/ciencia superadas**. Requiere despliegue manual y prueba visual en BanaHosting.  
**Alcance aprobado:** herramienta global, bilingüe, guiada, multivariable y multifuentе para investigar tendencias del sistema terrestre. No es una prueba preconcebida de Liberia frente a Limón.

## Etapa 1 — NASA POWER, ejecutada y comprobada con respuesta real

El [experimento de sondeo real NASA #43751240278](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43751240278) comprobó en la coordenada Liberia y año 2023 el JSON de cada parámetro, las unidades y los doce registros mensuales. La [segunda ejecución #43751362556](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43751362556) confirmó que **AG/RE** eran comunidades válidas para \`EVPTRNS\`, \`GWETROOT\`, \`GWETTOP\`, frente al HTTP **422** del intento con \`HY\` en ese endpoint. Son pruebas de disponibilidad/API; no una validación de homogeneidad climática de 1985–2025.

### Parámetros LIVE programados — 18

| Área | Códigos NASA POWER | Procesamiento y cautela |
| --- | --- | --- |
| Temperatura | \`T2M\`, \`T2M_MAX\`, \`T2M_MIN\` | Promedio anual de valores mensuales ponderado por días. Los máximos/mínimos NO se presentan como un único récord anual |
| Humedad del aire | \`RH2M\`, \`QV2M\` | Promedios ponderados; porcentaje (%) ≠ humedad específica (g/kg) |
| Viento | \`WS10M\`, \`U10M\`, \`V10M\`, \`WD10M\` | Módulos/componentes promediados; **WD10M** promediado circularmente, SIN Sen ni Mann–Kendall sobre ángulos |
| Presión y nubosidad | \`PS\`, \`CLOUD_AMT\` | kPa y %, no espesor óptico |
| Radiación y albedo | \`ALLSKY_SFC_SW_DWN\`, \`ALLSKY_SFC_LW_DWN\`, \`ALLSKY_SRF_ALB\` | kWh/m²/día media anual y albedo 0–1, no balance total de la Tierra |
| Agua y suelo | \`PRECTOTCORR\`, \`EVPTRNS\`, \`GWETTOP\`, \`GWETROOT\` | Precipitación en mm/año acumulado; evapotranspiración **energética** MJ/m²/día; suelo wetness 0–1 modelada y NO humedad volumétrica ni caudal fluvial |

**La muestra NASA histórica interna sigue limitada a T2M y PRECTOTCORR.** Para los otros dieciséis parámetros, el usuario debe consultar NASA POWER en vivo o importar su JSON original. No generar series ficticias cuando NASA no responde. NASA POWER utiliza celdas y composiciones de fuentes, no mediciones puntuales exactas de una estación.

La página Explorer en ES/EN permite buscar esos 18 códigos, muestra una **definición educativa** por variable, seis atajos de preguntas iniciales, curva anual, Sen/p exploratorio para variables lineales, procedencia fuente/código/comunidad/unidad, importación JSON y exportación CSV. Cuenta con comparación **optativa** Liberia–Limón mediante una **segunda solicitud NASA POWER** para variables continuas; no presenta dos pendientes por separado como una prueba estadística de diferencias. Evita aceptar resultados tardíos después de cambiar la selección. El globo 3D, la lectura de evidencias y el catálogo continúan.

El catálogo histórico de **49 entradas aportadas por el equipo se mantiene completo** y **10 indicadores derivados se mantienen identificados como propuestos**. Los 18 códigos integrados aparecen como registros de acceso operativo. Para las 22 entradas específicas nuevas, cinco están cubiertas a nivel de tema, cuatro **parcialmente** y trece requieren otras misiones. Ninguna se descarta.

**Web QA:** [GitHub Actions #43752855041](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43752855041) obtuvo **52/52 pruebas correctas**, syntax-check de módulos, sitio HTTP local y ZIP completo de publicación. **No certifica la web pública hasta desplegarla.**

## Matriz precisa de los 22 temas del equipo

| Ítem | Tema solicitado | Cobertura actual | Siguiente fuente o trabajo |
| --- | --- | --- | --- |
| C01 | Humedad relativa | **Conectado** | RH2M NASA POWER |
| C02 | Velocidad y dirección de viento | **Conectado**, WD solo circular descriptivo | WS10M/WD10M/U10M/V10M |
| C03 | Radiación solar | **Conectado** | ALLSKY_SFC_SW_DWN |
| C04 | Temperatura máxima/mínima | **Conectado** | T2M_MAX, T2M_MIN |
| C05 | Presión atmosférica | **Conectado** | PS |
| C06 | Nubosidad y propiedades de nube | **Parcial** | CLOUD_AMT conectado; espesor óptico CERES/MODIS pendiente |
| C07 | CO₂ | **Pendiente** | NASA OCO-2/OCO-3 productos QA |
| C08 | Metano CH₄ | **Pendiente** | NASA AIRS / GES DISC |
| C09 | Contaminantes NO₂/SO₂/CO/aerosoles | **Pendiente** | OMI/MOPITT/MODIS (separar parámetros) |
| C10 | Ozono O₃ | **Pendiente** | NASA Aura OMI/AIRS |
| C11 | Balance energético | **Parcial** | Descendentes y albedo NASA POWER; falta balance neto TOA de CERES |
| C12 | Rayos | **Pendiente** | NASA LIS/OTD |
| C13 | Humedad suelo | **Parcial** | GWETROOT/GWETTOP modelo; faltan SMAP/GLDAS volumétricos |
| C14 | Evapotranspiración | **Parcial** | EVPTRNS energía; falta producto de flujo de agua equivalente MOD16/GLDAS |
| C15 | Escorrentía | **Pendiente** | NASA GLDAS Qs; no equiparar con caudal de río |
| C16 | Niveles/extensión de ríos | **Pendiente** | SWOT RiverSP por tramo/paso |
| C17 | Nivel medio del mar | **Pendiente** | Altimetría de PO.DAAC y referencia vertical |
| C18 | Temperatura del océano SST | **Pendiente** | NASA PO.DAAC MUR |
| C19 | Salinidad SSS | **Pendiente** | NASA SMAP mensual |
| C20 | Clorofila-a | **Pendiente** | NASA PACE OCI / OB.DAAC |
| C21 | Turbidez/propiedades ópticas | **Pendiente** | NASA PACE reflectancia y producto algorítmico adecuado |
| C22 | Inundaciones | **Pendiente** | NASA OPERA DSWx área en raster, no una pendiente sobre códigos de clase |

## Etapa 2 — Cerrar el mínimo científico de NASA Space Apps (prioridad inmediata)

**Objetivo: cuatro preguntas "qué cambia, dónde, cuánto, significancia" con interpretaciones honestas.**

- Verificar en BanaHosting todos los componentes del Explorer, cambio ES/EN, menú de 18 variables, seis preguntas, globo 3D, carga NASA en vivo, JSON de archivo y CSV.
- Ejecutar una investigación real para T2M, RH2M y GWETROOT en Liberia, y (opcional) comparación Liberia–Limón; preservar URL real y los resultados, sin afirmar causalidad.
- Revisar inferencia de significancia: Mann–Kendall original se muestra como **exploratorio** y hay diagnóstico lag-1; NO debe comunicarse p como prueba validada de tendencia bajo autocorrelación. Si no se valida un método correctivo antes de la entrega, reportar explícitamente "significancia no establecida"; NASA sí pide realizar una prueba básica y existe la prueba MK original.
- Mantener pruebas negativas/inconclusas, procedencia, créditos y métodos con URL persistentes. No incorporar p falsamente significativo por mejorar la presentación.

## Etapa 3 — Fuentes especializadas (arquitectura modular; no bloquear la entrega)

- **GLDAS**: Qs escorrentía, humedad volumétrica y ET; Earthdata Login/subsetting y validación de kg m⁻² s⁻¹ vs mm y datos completos.
- **SWOT**: nivel/anchura/pendiente/caudal estimado por *river reach*; serie desde 2023, no inventar un registro de 41 años.
- **PO.DAAC**: océanos SST, SSS, altura/altimetría; modelo espacial oceánico distinto de puntos terrestres.
- **PACE/OPERA**: clorofila/reflectancia y extensión de inundaciones; máscaras QA/categorical y series apropiadas.
- **OCO-2/3, AIRS, OMI, CERES, LIS/OTD**: CO₂, metano, contaminantes/ozono, presupuesto energético y descargas eléctricas; sus observaciones de columna/eventos no se procesan como temperatura mensual.
- MODIS Terra NDVI/EVI EXP-003 sigue siendo piloto independiente con QA geográfico (Río Banano) y deriva orbital; conservar sin promocionarlo como fuente pública antes de validación.

Criterio de aceptación para cada conector: colección/version NASA, autenticación, escala espacio-temporal, variables/unidades, tratamiento de ausentes, QA, prueba real y archivo origen, agregación validada, inferencia científicamente justificada y prueba UI ES/EN.

## Etapa 4 — Entrega a jueces y verificación final

1. Desplegar el ZIP de GitHub Actions **después de suite verde**, no simplemente editar GitHub.
2. Comprobar HTTP 200 real, respuestas NASA e interacción, pantalla móvil y archivo CSV descargado.
3. Código accesible a los jueces **solo tras auditoría de credenciales/licencias** (el repo es privado en el momento de esta nota).
4. Confirmar video oficial conforme a reglas, créditos de integrantes/IA/fuentes y enlace público.
5. Enviar el formulario del proyecto NASA Space Apps, no confundir un sitio web en línea con una entrega oficial.

### Lo que NO constituye un bloqueo NASA

No se necesitan autenticación de usuarios, base SQL, generador de texto comercial, ni acceso a **todas** las 22 candidaturas antes de mostrar una solución útil. La ampliación multifuentе queda correctamente trazada para una evolución científica posterior.

## Fuentes

- https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/
- https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/
- https://ldas.gsfc.nasa.gov/gldas/gldas
- https://podaac.jpl.nasa.gov/dataset/SWOT_L4_HR_DAWG_SOS_DISCHARGE_V3
- https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1
- https://podaac.jpl.nasa.gov/dataset/SMAP_JPL_L3_SSS_CAP_MONTHLY_V5
- https://www.earthdata.nasa.gov/s3fs-public/2024-04/OPERA-DSWx_Fact_Sheet.pdf
