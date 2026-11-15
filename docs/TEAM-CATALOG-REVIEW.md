# Revisión e integración del inventario científico del equipo — 2026-11-15

**Origen:** archivo aportado por una integrante de Project Uriel a través del usuario, `TELLURIS_CATALOGO_VARIABLES_CIENTIFICAS(1).md`. Se conserva su texto en [TEAM-CATALOG-2026-11-15.md](TEAM-CATALOG-2026-11-15.md), sin sustituir las decisiones anteriores. **Estado:** revisión de alcance; no es prueba de APIs o resultados observacionales.

## Qué aporta el documento original

- **2** variables iniciales (`T2M` y `PRECTOTCORR`) ya conectadas a NASA POWER, frente a la etiqueta *Prioridad MVP* del documento.
- **49** entradas de ampliación agrupadas en seis secciones originales: 12 atmósfera, 10 hidrosfera/océanos, 8 biosfera, 9 geosfera, 5 criosfera y 5 huella humana.
- **10** indicadores derivados que requieren métodos, datos y controles específicos.
- **5** casos de investigación: Liberia–Limón, sequía/incendios Guanacaste, bosque/temperatura, sismicidad/deformación, océanos/ecosistemas.
- Una arquitectura modular de conectores, normalización, análisis, visualización y transparencia; alineada con nuestro contrato de fuentes/variables en [SCOPE-2026.md](SCOPE-2026.md).

## Adopción con ajustes técnicos

| Propuesta del equipo | Decisión | Motivo / prueba pendiente |
| --- | --- | --- |
| 49 variables/fenómenos | **Integrar todas como catálogo de investigación** | Son candidatas, no 49 variables conectadas ni un mismo tipo de registro temporal. Ver [catálogo JSON](../website/public/telluris/catalog/data/catalog.json). |
| 10 indicadores | **Incorporar como capacidades de cálculo propuestas** | La tendencia decenal tiene un prototipo exploratorio; SPI, VPD, extremos, puntos de cambio y correlaciones no están validados. |
| Incendios / MODIS VIIRS | **Prioridad futura alta** | FIRMS tiene eventos de anomalía térmica y FRP; usar datos de calidad científica y controlar efectos de sensores/nubes. Área quemada requiere otro producto como MODIS MCD64A1. |
| Geosfera / sismicidad | **Conservar, con fuente etiquetada separadamente** | USGS/catálogos regionales no son variables de misión NASA por sí mismos; podrían servir de contexto para productos NASA InSAR/ARIA. La detección de eventos depende de la completitud de la red. |
| Geosfera / deformación / deslizamientos | **Investigar NASA ARIA/InSAR y LHASA** | Desplazamientos y susceptibilidad requieren metadatos y escala distintos; LHASA es riesgo/nowcast, no predicción de sismos. |
| Criosfera | **Conservar sin desarrollo inmediato** | Productos ICESat-2/GRACE/MODIS permiten análisis, pero la cobertura y el soporte espacial no son intercambiables. |
| Huella humana | **Conservar fuente NASA VIIRS Black Marble** | Luces nocturnas son radiancia observada, no censo de población ni demostración automática de crecimiento económico. |
| Indicadores extremos / sequía | **Posponer hasta tener resolución temporal adecuada** | Con promedios mensuales/anuales no se pueden reconstruir días extremos ni periodos secos diarios; usar producto diario y QA. |
| Anomalía/punto de quiebre/p-valores | **Solo tras metodología validada** | Autocorrelación, cambio de sensores y pruebas múltiples pueden invalidar inferencias ingenuas. |

## Unidades y significados que NO deben confundirse

- **Incendios:** detecciones térmicas FIRMS ≠ incendios únicos ≠ área quemada. La potencia radiativa del fuego (FRP) tiene unidades propias (MW) y control de calidad.
- **Ríos:** escorrentía modelada de GLDAS ≠ caudal fluvial de un tramo; SWOT ofrece **caudal estimado**, no medido directamente por estación.
- **Temperatura:** T2M del aire ≠ temperatura superficial LST de MODIS ≠ anomalías térmicas satelitales.
- **Geosfera:** magnitud sísmica por evento no debe tratarse automáticamente como serie anual continua susceptible de la misma prueba Mann–Kendall; frecuencia de detecciones requiere umbral y completitud.
- **Actividad humana:** radiancia nocturna ≠ población ni actividad económica, por sí sola.
- **Riesgo:** susceptibilidad o exposición poblacional no son el evento físico ni una predicción de cuándo ocurrirá.

## Política de integración

1. **Documentado**: cualquier ítem conserva su nombre/categoría original y aparece como **no conectado** hasta verificar su producto.
2. **Seleccionado para pruebas**: verificar colección/versión, geografía, unidades, fechas, QA, acceso, licencia y condición de representatividad espacial antes de habilitarlo.
3. **Conectado**: demostrar una recuperación real, cálculos correctos y pruebas automáticas antes de ofrecer interacción científica en la web.
4. **Validado científicamente**: interpretación e inferencia requieren referencias y supuestos comprobados. La disponibilidad de un gráfico no convierte una relación en causalidad.

## Referencias institucionales verificadas para tres ampliaciones

- NASA [FIRMS — active fire](https://firms.modaps.eosdis.nasa.gov/content/active_fire/) y [VIIRS hot spots](https://firms.modaps.eosdis.nasa.gov/content/descriptions/FIRMS_VIIRS_Firehotspots.html): detecciones vs área quemada, calidad y FRP.
- NASA [VIIRS Black Marble products](https://viirsland.gsfc.nasa.gov/Products/NASA/BlackMarble.html): `VNP46A1/A2/A3/A4` con distintos productos de radiancia e iluminación nocturna.
- NASA [Landslide Hazard Assessment / LHASA](https://earth.gsfc.nasa.gov/hydro/data/landslide-hazard-assessment): potencial de deslizamientos a partir de precipitaciones y factores ambientales, no predicción sísmica.

## Prioridad dentro del hackathon

La prioridad de la **entrega 2026** sigue siendo resolver correctamente los cuatro requisitos NASA, con ejemplos verificables y explicación de significancia. Las 49 candidaturas y diez indicadores quedan **incorporados al alcance y a la navegación** como hoja de ruta. No poner en peligro la entrega ampliando a ciegas 49 conectores. Para el siguiente proveedor, evaluar MODIS vegetación y FIRMS incendios frente a GLDAS hidrología y GPM; no promover ninguno a implementado sin datos reales.

**Atribución interna:** aportación del equipo mediante un trabajo solicitado por la hermana del usuario, consolidada y revisada para Project Uriel. El texto de origen se conserva para que la contribución no se pierda.
