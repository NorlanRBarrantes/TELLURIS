# TELLURIS — Notas temporales de trabajo

**TEMPORAL — Eliminar del árbol final antes de entregar a NASA.**

Este documento agrupa decisiones en discusión, pendientes y observaciones de implementación. No forma parte de la documentación científica definitiva.

**Advertencia Git:** Aunque se borre este archivo, el historial de commits podrá conservar versiones previas. NO escribir credenciales, tokens, accesos de BanaHosting, datos personales sensibles, claves API, rutas privadas o información que nunca deba publicarse. Para notas realmente confidenciales utilizar un archivo local ignorado, por ejemplo .local/PRIVATE_NOTES.md.

## Punto de partida — 2026-11-14

### Confirmado por el equipo

- Equipo: Project Uriel.
- Producto seleccionado: TELLURIS.
- Desafío: Be An Earth System Trend Detective! de NASA Space Apps 2026.
- Repo GitHub: https://github.com/NorlanRBarrantes/TELLURIS
- Rama: main; repositorio inicialmente privado.
- Dominio a utilizar: https://telluris.lynxglobals.net/
- Hosting: BanaHosting compartido.
- El repositorio se compartirá con NASA. Se exige documentación relevante, trazabilidad y commits descriptivos.
- La documentación pública estará redactada en inglés; este archivo de trabajo puede estar en español.

### Propuestas todavía no confirmadas por implementación

- React/TypeScript con salida estática; pequeño PHP opcional de integración, solo si el hosting lo necesita y soporta.
- NASA POWER como primera fuente, con variables T2M y PRECTOTCORR.
- Tendencias mediante regresión lineal, Mann-Kendall y pendiente de Sen, cada una con supuestos y pruebas.
- Demostración centrada en Costa Rica, pero motor diseñado sin bloqueo geográfico.
- Comparación entre dos puntos; reporte científico reproducible.
- IA solo como ayuda de interpretación, no como generadora de resultados.

### Pendientes críticos

- [ ] Confirmar versión de PHP y herramientas disponibles en la cuenta de BanaHosting.
- [ ] Confirmar configuración DNS/HTTPS, acceso público y ruta de despliegue.
- [ ] Probar datos reales NASA POWER y guardar la procedencia de la respuesta.
- [ ] Definir representación correcta de precipitación por mes/año según unidades devueltas.
- [ ] Elegir implementación estadística y validarla contra una referencia independiente.
- [ ] Construir un caso reproducible real y documentar resultados.
- [ ] Registrar licencias de dependencias y recursos visuales.
- [ ] Verificar cómo se presentará la demostración de NASA.
- [ ] Retirar este archivo del árbol final antes de la entrega.
- [ ] Verificar repositorio público y dominio sin autenticación.

## Registro de trabajo

**2026-11-14 — Inicialización.** Se estableció la identidad TELLURIS, se confirmó el repositorio vacío y privado y se comenzó la documentación pública. No se ha confirmado una aplicación en funcionamiento ni un despliegue.

**2026-11-14 — Flujo para aportes externos.** El equipo compartirá periódicamente investigaciones, materiales y propuestas de Gemini u otras herramientas. Antes de integrarlas: identificar fuente y fecha, separar afirmaciones de hipótesis, verificar con fuentes NASA y método científico, evaluar compatibilidad, decidir su estado, documentar decisiones aprobadas y subir solo cambios útiles con commits claros. Política pública en CONTRIBUTING.md y ADR-009.

**2026-11-14 — Evaluación de investigación externa sobre Pacífico/Caribe y ESP32.** Se seleccionó la comparación de dos puntos (Liberia–Limón) como demostración P1, sin asumir que existan tendencias opuestas; los fenómenos estacionales y los cambios multidecadales se investigarán por separado. Se evaluarán métodos estacionales y correcciones de autocorrelación solo tras pruebas. El ESP32 LCD de 5" sigue opcional, sin confirmar hardware ni firmware. Se corrigió el límite NASA POWER a 20 parámetros por punto y se evitó presentar porcentajes de evaluación de la sede 2025 como rúbrica global 2026. No se aceptaron coeficientes, nombres de jueces ni supuestos resultados sin fuentes primarias verificadas. Ver ADR-010 a ADR-012 y docs/RESEARCH-REFERENCES.md.


**2026-11-14 — Recursos oficiales NASA Space Apps.** Se incorporaron al catálogo Giovanni, Hydrology Time Series, AppEEARS, NOAA CDO, artículo SeaWiFS, KNMI Climate Explorer y recursos asociados/externos de la pestaña Resources. Se priorizaron referencias para validación científica sin introducir nuevas dependencias; recursos no probados quedaron etiquetados como tales. Consulta docs/NASA-CHALLENGE-RESOURCES.md.

**2026-11-14 — Revisión de selección de fuentes.** Se cuestionó priorizar NASA POWER frente a recursos oficialmente enumerados. Se constató que POWER es de NASA, ofrece API temporal y variables basadas en MERRA-2, pero su conveniencia técnica no implica superioridad científica. Comparar Giovanni/GES DISC y AppEEARS antes de ampliar integraciones. POWER tiene además IMERG/SMAP de mayor resolución que requieren validación de parámetros y accesos. **Decisión principal pendiente**, ver ADR-013.

**2026-11-14 — Auditoría del segundo informe de Gemini.** Se reconoce como oportunidad el panel educativo de controles de calidad/advertencias estadísticas. Se mantienen POWER inicial, casos CR y estadística con referencia independiente. React/TypeScript para cálculo local y PHP cache siguen como propuesta a validar en BanaHosting. GPM IMERG V07B (desde enero 1998 según NASA) es candidato a comparación. Se posponen Pettitt, filtro ENSO y ESP32 hasta que P0 esté probado. No se aceptan los valores p/correlaciones propuestos ni promesas de rendimiento. Se documentaron ADR-014 a ADR-016 y docs/SCIENTIFIC-GUARDRAILS.md.


**2026-11-14 — EXP-001 de Gemini: implementación auditada.** Se revisó el script Python recibido. Se corrigieron valores faltantes por metadatos NASA, unidades obligatorias, años completos por variable, posibles claves YYYY13, alineación temporal y errores de series vacías. Se retiró selección automática no validada de Hamed–Rao. Se incorporó análisis exploratorio independiente de runtime web con pruebas: 11/11 sintéticas pasaron localmente. Intento de acceso a NASA POWER falló por DNS externo; sin valores NASA verificados. Ver docs/EXPERIMENT-001.md y ADR-017.

**2026-11-14 — Tercera revisión Gemini sobre EXP-001.** Gemini no recibió los archivos privados del repo y planteó riesgos condicionales. Se comprobó que el tratamiento de empates/continuidad MK, las pendientes Sen con años reales y la eliminación de tendencia previa al lag-1 ya existían. Se detectaron dos pruebas defectuosas en Gemini (tolerancia p=0.001 y un ejemplo donde las pendientes coincidían accidentalmente). Se corrigió un defecto verdadero: calcular r1 solo para parejas de años calendario consecutivos. Se añadieron 6 pruebas adversariales y dependencia de validación pyMannKendall 1.4.3: 17/17 CI exitosas (runs 43649103042 y 43649183358). Se modernizó GitHub Actions para Node 24. Sin NASA POWER real descargado. Ver ADR-019 y docs/EXPERIMENT-001.md.


## Regla de promoción

Cuando una decisión quede aprobada, registrarla en docs/DECISIONS.md y actualizar el documento público correspondiente. Al finalizar, revisar este registro y eliminarlo de la rama final mediante un commit específico.

**IMPORTANTE:** Eliminar este archivo no borra su presencia en el historial público de Git. Para notas verdaderamente privadas, usar .local/ con .gitignore.
