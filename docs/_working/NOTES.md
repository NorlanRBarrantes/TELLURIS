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

## Regla de promoción

Cuando una decisión quede aprobada, registrarla en docs/DECISIONS.md y actualizar el documento público correspondiente. Al finalizar, revisar este registro y eliminarlo de la rama final mediante un commit específico.

**IMPORTANTE:** Eliminar este archivo no borra su presencia en el historial público de Git. Para notas verdaderamente privadas, usar .local/ con .gitignore.
