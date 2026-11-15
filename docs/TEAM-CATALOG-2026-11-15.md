# TELLURIS — Catálogo de variables científicas

**Proyecto:** TELLURIS  
**Equipo:** Project Uriel  
**Contexto:** NASA Space Apps Challenge 2026 — *Be An Earth System Trend Detective!*  
**Fecha de esta versión:** 15 de noviembre de 2026  
**Estado:** Inventario de alcance y hoja de ruta; no representa funcionalidades terminadas ni resultados científicos validados.

## 1. Propósito

TELLURIS busca facilitar la exploración, comparación e interpretación de cambios en el sistema terrestre mediante observaciones científicas, análisis estadístico reproducible y visualizaciones comprensibles.

Este documento distingue tres conceptos:

- **Variable observada o estimada:** magnitud física o ambiental, como temperatura, precipitación o concentración de gases.
- **Fenómeno o conjunto de eventos:** incendios, sismos, inundaciones o deslizamientos, que pueden describirse mediante varias variables.
- **Indicador derivado:** resultado calculado, como anomalías, tendencias decenales, índices de sequía o correlaciones.

El inventario es una **propuesta de ampliación**, no una afirmación de disponibilidad universal, compatibilidad automática entre productos ni implementación actual.

## 2. Variables iniciales del MVP

| Variable | Identificador orientativo | Propósito | Fuente inicial prevista | Estado |
|---|---|---|---|---|
| Temperatura del aire a 2 m | `T2M` | Series históricas y tendencias térmicas | NASA POWER | Prioridad MVP |
| Precipitación | `PRECTOTCORR` | Series históricas, estacionalidad y tendencias de lluvia | NASA POWER | Prioridad MVP |

Las ampliaciones que aparecen a continuación deben pasar por una revisión específica de fuente, cobertura temporal, resolución espacial, unidades, licencias, calidad y validación científica antes de incorporarse.

## 3. Catálogo de ampliaciones

### 3.1 Atmósfera y clima

| N.º | Variable o fenómeno | Medición o indicador propuesto |
|---:|---|---|
| 1 | Humedad relativa | `RH2M` |
| 2 | Velocidad y dirección del viento | `WS10M` y componentes del viento |
| 3 | Radiación solar superficial | `ALLSKY_SFC_SW_DWN` |
| 4 | Temperatura máxima y mínima | `T2M_MAX`, `T2M_MIN` |
| 5 | Presión atmosférica | Presión superficial |
| 6 | Cobertura y propiedades de nubes | Fracción de nubosidad y espesor óptico |
| 7 | Dióxido de carbono | Concentración atmosférica de CO₂ |
| 8 | Metano | Concentración atmosférica de CH₄ |
| 9 | Contaminantes atmosféricos | NO₂, SO₂, CO y aerosoles |
| 10 | Ozono atmosférico | Columna de O₃ |
| 11 | Balance energético terrestre | Radiación entrante, reflejada, emitida y/o neta |
| 12 | Actividad eléctrica atmosférica | Densidad o frecuencia de rayos |

**Fuentes candidatas según variable:** NASA POWER, OMI, OCO-2, EMIT, CERES, MERRA-2, LIS/OTD y otros productos científicos aplicables. La fuente exacta de cada medición queda pendiente de validación.

### 3.2 Hidrosfera y océanos

| N.º | Variable o fenómeno | Medición o indicador propuesto |
|---:|---|---|
| 13 | Humedad del suelo | Contenido de agua en el suelo |
| 14 | Evapotranspiración | ET |
| 15 | Escorrentía superficial | Runoff |
| 16 | Niveles y extensión de ríos | Altura o superficie observada |
| 17 | Nivel medio del mar | Altimetría y anomalías |
| 18 | Temperatura superficial oceánica | SST |
| 19 | Salinidad superficial oceánica | SSS |
| 20 | Clorofila-a | Concentración estimada |
| 21 | Turbidez y propiedades ópticas del agua | Reflectancia y variables ópticas |
| 22 | Extensión de inundaciones | Área inundada detectada |

**Fuentes candidatas:** GLDAS, SMAP, SWOT, misiones altimétricas oceánicas, PACE, MODIS y otras observaciones pertinentes.

### 3.3 Biosfera y vegetación

| N.º | Variable o fenómeno | Medición o indicador propuesto |
|---:|---|---|
| 23 | Índices de vegetación | NDVI, EVI |
| 24 | Cobertura forestal | Porcentaje o superficie |
| 25 | Deforestación y cambio de uso del suelo | Superficie transformada |
| 26 | Biomasa forestal | Biomasa aérea estimada |
| 27 | Altura del dosel | Altura vegetal |
| 28 | Área quemada por incendios | Superficie afectada |
| 29 | Puntos calientes e intensidad térmica | Anomalías térmicas y potencia radiativa |
| 30 | Estrés hídrico vegetal | Índices asociados a evapotranspiración |

**Fuentes candidatas:** MODIS, VIIRS, FIRMS, GEDI, ECOSTRESS, HLS y OPERA, según la variable.

### 3.4 Geosfera y actividad sísmica

| N.º | Variable o fenómeno | Medición o indicador propuesto |
|---:|---|---|
| 31 | Frecuencia sísmica | Número de eventos por período |
| 32 | Magnitud sísmica | Magnitud por evento |
| 33 | Profundidad de hipocentros | Kilómetros |
| 34 | Distribución de epicentros | Coordenadas y densidad espacial |
| 35 | Deformación de la superficie | Desplazamiento estimado mediante InSAR |
| 36 | Emisiones volcánicas | SO₂ observado o estimado |
| 37 | Anomalías térmicas volcánicas | Anomalías de temperatura superficial |
| 38 | Susceptibilidad a deslizamientos | Indicadores modelados |
| 39 | Subsidencia terrestre | Desplazamiento vertical estimado |

**Fuentes candidatas:** catálogos USGS y redes sismológicas regionales para eventos sísmicos; InSAR, NASA ARIA, AIRS, OMI, MODIS y NASA LHASA para los demás fenómenos cuando corresponda.

**Límite científico:** un catálogo con más eventos registrados no demuestra por sí solo una mayor actividad sísmica: debe evaluarse la completitud y evolución de la red de detección. TELLURIS no debe afirmar que predice terremotos ni sustituir sistemas oficiales de alerta.

### 3.5 Criosfera

| N.º | Variable o fenómeno | Medición o indicador propuesto |
|---:|---|---|
| 40 | Extensión de glaciares | Superficie cubierta |
| 41 | Cambios de elevación del hielo | Diferencias altimétricas |
| 42 | Cambios de masa de hielo | Variaciones de masa estimada |
| 43 | Cobertura de nieve | Superficie y persistencia |
| 44 | Extensión del hielo marino | Área cubierta |

**Fuentes candidatas:** ICESat-2, GRACE/GRACE-FO, MODIS y otros productos especializados.

### 3.6 Actividad humana y territorio

| N.º | Variable o fenómeno | Medición o indicador propuesto |
|---:|---|---|
| 45 | Temperatura superficial urbana | Diferencias espaciales e islas de calor |
| 46 | Expansión urbana | Superficie construida |
| 47 | Luces nocturnas | Radiancia nocturna |
| 48 | Cambios en cobertura del suelo | Clases de uso y cobertura |
| 49 | Exposición poblacional a amenazas | Indicador combinado con datos demográficos |

**Fuentes candidatas:** MODIS, VIIRS Black Marble, Landsat/HLS y fuentes demográficas complementarias sujetas a revisión.

## 4. Indicadores derivados que puede calcular TELLURIS

Estos indicadores no necesariamente requieren una nueva misión satelital, pero sí métodos, periodos de referencia y resoluciones apropiados.

| N.º | Indicador derivado | Pregunta que ayuda a responder |
|---:|---|---|
| 1 | Anomalías climáticas | ¿Cuánto difiere una observación del comportamiento histórico de referencia? |
| 2 | Tendencias por década | ¿A qué ritmo cambia una variable? |
| 3 | Días de calor extremo | ¿Cambian los días que superan un umbral o percentil térmico? |
| 4 | Índice estandarizado de precipitación (SPI) | ¿Hay déficits o excesos anómalos de lluvia? |
| 5 | Períodos secos consecutivos | ¿Están aumentando la frecuencia o duración de los períodos sin lluvia significativa? |
| 6 | Amplitud térmica | ¿Cómo cambia la diferencia entre máximas y mínimas? |
| 7 | Déficit de presión de vapor (VPD) | ¿Cómo cambia la demanda evaporativa atmosférica? |
| 8 | Correlaciones multivariables | ¿Qué variables presentan asociaciones temporales o geográficas? |
| 9 | Puntos de cambio | ¿Existen posibles rupturas de comportamiento en una serie? |
| 10 | Incertidumbre estadística | ¿Qué precisión y robustez tienen las estimaciones obtenidas? |

**Métodos estadísticos considerados:** pendientes de implementación y validación por indicador; entre los candidatos discutidos se encuentran Theil–Sen, Mann–Kendall y Pettitt. Deben examinarse estacionalidad, autocorrelación, valores faltantes, cambios de instrumentos, múltiples pruebas y la distinción entre significancia estadística y relevancia ambiental.

## 5. Priorización propuesta después del MVP

| Prioridad | Incorporación | Justificación |
|---:|---|---|
| 1 | Temperatura superficial terrestre | Complementa T2M y facilita análisis de calor urbano y cambios de cobertura |
| 2 | Extremos climáticos | Reutiliza series de temperatura y precipitación; agrega indicadores interpretables |
| 3 | Incendios y área quemada | Aplicación relevante para Guanacaste y datos MODIS/VIIRS |
| 4 | Cambios de cobertura forestal | Permite explorar relaciones entre bosque, calor y condiciones hídricas |
| 5 | Calidad atmosférica | Incorpora contaminación y exposición ambiental con cautelas de resolución |
| 6 | Actividad sísmica y volcánica | Amplía la geosfera con catálogos y observaciones geodésicas/atmosféricas |

La prioridad es una **propuesta de producto**, no una confirmación de factibilidad o de que las seis ampliaciones deban completarse durante el hackathon.

## 6. Casos de investigación sugeridos

### Costa Rica: Liberia y Limón

Comparar temperatura del aire, precipitación y patrones históricos entre Liberia (Guanacaste) y Limón (Caribe), incluyendo la influencia de ENSO cuando la disponibilidad y calidad de los datos lo permitan.

### Guanacaste: condiciones secas e incendios

Investigar asociaciones entre precipitación, humedad del suelo, temperatura, anomalías térmicas y área quemada. **La asociación no equivale a causalidad** y una anomalía térmica no siempre representa un incendio.

### Cambios forestales y temperatura superficial

Comparar cambios de cobertura y temperatura superficial terrestre. Diferenciar temperatura superficial de temperatura del aire y controlar diferencias de resolución, cobertura nubosa y estacionalidad.

### Actividad sísmica y deformación del terreno

Visualizar eventos históricos y, donde existan observaciones adecuadas, desplazamientos superficiales relacionados con sismos. No presentar mapas de eventos como predicción de terremotos.

### Océanos y ecosistemas marinos

Estudiar temperatura superficial oceánica y clorofila-a, aclarando que clorofila elevada no identifica por sí sola una floración algal tóxica.

## 7. Arquitectura conceptual del catálogo

TELLURIS debería incorporar nuevos dominios sin duplicar por completo su infraestructura:

1. **Conectores de fuentes:** consultas, versiones de productos, metadatos, unidades y procedencia.
2. **Normalización:** espacio, tiempo, unidades, resoluciones, ausencia de datos y calidad.
3. **Motor científico:** tendencias, anomalías, comparaciones, indicadores y pruebas estadísticas.
4. **Visualización:** series temporales, mapas, comparaciones regionales y análisis multivariable.
5. **Transparencia:** exportación, metodología, incertidumbre, trazabilidad y limitaciones.

Organización funcional propuesta:

- **Atmosphere:** clima, calidad del aire y radiación.
- **Hydrosphere:** agua continental y ciclo hidrológico.
- **Biosphere:** vegetación, bosques y ecosistemas.
- **Geosphere:** sismicidad, volcanes y deformación del terreno.
- **Cryosphere:** hielo y nieve.
- **Oceans:** mares y costas.
- **Human Footprint:** urbanización y actividad humana observable.
- **Trend Lab:** comparaciones y análisis estadístico multivariable transversal.

Estas categorías son áreas de navegación de producto y pueden solaparse: por ejemplo, **Oceans** forma parte de la hidrosfera desde el punto de vista científico.

## 8. Reglas de implementación y evidencia

Antes de habilitar cualquier nueva variable, documentar:

- Proveedor, misión, producto, versión y enlace de documentación oficial.
- Significado exacto de la variable y sus unidades.
- Cobertura geográfica, temporal, resolución y frecuencia de actualización.
- Tipo de dato: observación, reanálisis, estimación modelada, catálogo de eventos o indicador calculado.
- Tratamientos de valores faltantes, sesgos conocidos, cambios instrumentales y máscaras de calidad.
- Compatibilidad de escalas con otras variables y efectos de agregación.
- Procedimiento de validación reproducible y pruebas con referencias independientes.
- Condiciones de uso, limitaciones y lenguaje adecuado para comunicar resultados.

**Reglas científicas mínimas:** no inventar tendencias ni resultados; no confundir correlación con causalidad; no presentar observaciones ilustrativas como medidas reales; no anunciar capacidades de predicción de sismos o alertas operativas no implementadas.

## 9. Resumen ejecutivo

- **2 variables iniciales priorizadas:** temperatura del aire y precipitación.
- **49 entradas candidatas de ampliación:** distribuidas en seis grupos del inventario.
- **10 indicadores derivados propuestos:** de anomalías, extremos, tendencias, relaciones y robustez estadística.
- **Alcance de producto:** plataforma modular global con un caso de demostración inicial en Costa Rica.
- **Estado:** catálogo conceptual. La integración, los productos definitivos y las validaciones requieren decisiones documentadas posteriores.

> **Visión de TELLURIS:** transformar observaciones científicas de la Tierra en conocimiento comprensible, comparable y verificable, sin perder el rigor de los métodos ni la trazabilidad de las fuentes.

**Sitio del equipo:** https://projecturiel.earth/  
**Repositorio:** https://github.com/NorlanRBarrantes/TELLURIS