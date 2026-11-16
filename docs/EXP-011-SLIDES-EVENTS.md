# EXP-011 — Slide presentation and source-authentic event intelligence

**Date:** 2026-11-15 (Costa Rica)  
**Team:** Project Uriel · TELLURIS · independent NASA Space Apps Challenge 2026 participant  
**Source implementation:** `main`; BanaHosting publication is a separate manual gate.

## Product decision: no long vertical judge landing

The original five-stage TELLURIS public presentation was editorially sound but too long to scroll during a NASA judging session. The homepage now uses a **six-panel horizontal presentation** rather than continuous page scrolling:

| Slide | Contents |
| --- | --- |
| 00 | TELLURIS identity, research purpose, verified source scope |
| 01 | Problem: single trends lack Earth-system context |
| 02 | Method: select, retrieve NASA POWER, validate, analyze, explain |
| 03 | Four supported comparison modes and 18 connected POWER variables **plus separately identified event services** |
| 04 | Scientific limits, actual dataset provenance and original NASA participation disclaimer |
| 05 | The handoff: direct link into the interactive TELLURIS Explorer |

All canonical `/`, `/en/` and historical Spanish/English root aliases use the **same** six-panel interaction. The page itself does not scroll vertically; an active panel may scroll internally **only if the device height is insufficient** to display original scientific disclosures without clipping. The header and horizontal slide index remain visible. Navigation supports click, previous/next arrows, Left/Right/Page/Home/End keyboard keys, swipe gestures, URL fragments (e.g., `#method`, `#capabilities`) and screen-reader live status. There is **no autoplay**, allowing reviewers to read at their own pace. Motion is disabled when `prefers-reduced-motion` is active. Only one panel is focusable/exposed to assistive technology at any moment (`inert` + `aria-hidden`).

Sources: `website/public/assets/journey-slider.js`, `journey.css`, six bilingual landing files; regression `website/tests/journey-slider.test.js`. The original `/about/`, `/en/about/`, catalog and Explorer routes remain separate.

## Catalog review and what is actually connected

The existing [49-candidate catalog](../website/public/telluris/catalog/data/catalog.json) is a **research inventory**, not a list of 49 connected measurement products. The already verified **18 NASA POWER** original-variable connections remain unchanged, with their RE/AG communities and original-unit monthly sources.

Four **seismic event dimensions** now have a source-backed, interactive pilot using the public **USGS FDSN Event Catalog**:

- **C31 seismic occurrence / frequency:** number of events actually returned after area, time and minimum-magnitude filtering; **not a completeness-adjusted seismic rate** or hazard estimate.
- **C32 event magnitude:** catalog-reported earthquake magnitude, which may use different catalog scale/estimate types. Not earthquake energy or regional stress by itself.
- **C33 hypocenter depth:** original USGS estimated depth in km; a catalog attribute with location uncertainty.
- **C34 epicenter distribution:** catalog latitude and longitude for event locations. An epicenter is **not the same as observed surface shaking**.

Status for C31–C34 is `partial` in the 49-candidate inventory: event **records** are queryable but no long-term seismic-statistical completeness test, recurrence analysis, geographic sensor coverage adjustment, seismic forecast or climate causality is provided.

Four other research **topics** have related **NASA EONET** events without claiming that the missing physical quantity has been measured:

- **C22 Flood extent** → related EONET flood event reports, **not** NASA OPERA DSWx flood polygons/areas.
- **C29 MODIS/VIIRS hot spots** → related EONET wildfire *events*, **not** FIRMS hot-spot pixels or fire radiative power.
- **C36 Volcanic emissions** → related EONET volcanic *events*, **not** SO₂ flux/concentrations.
- **C38 Landslide susceptibility** → related EONET landslide *events*, **not** a susceptibility or probability map.

The Explorer's new independent event panel supports **USGS earthquakes and NASA EONET wildfires, volcanoes, floods, severe storms and landslides**. All six categories are offered from the same location-A center, with user-selected observation window (30, 90 or 365 days) and region radius (200, 500, 1000 km); USGS additionally supports explicit minimum magnitudes (2.5, 3.5, 4.5). No new source is merged into the NASA POWER climatology matrix, no earthquake trend is inferred from climate data and no climatological predictive relationship is presented.

## Scientific data pipeline and restrictions

**USGS:** https://earthquake.usgs.gov/fdsnws/event/1/  
Request is a bounded event catalog GeoJSON query using precise point coordinates, radius in km, magnitude floor, time window, fixed maximum 500, descending time. The parser validates features, coordinates, magnitude, time and depth; it strips malformed records, verifies actual geodesic distance and only links to official HTTPS USGS event pages. Requests yielding the 500-event cap are explicitly marked truncated; the cap must never be treated as the true number of earthquakes.

**NASA EONET v3:** https://eonet.gsfc.nasa.gov/docs/v3  
Requests use category, event-time window, bbox and bounded limit 150. Events are spatially filtered by actual geographic distance after retrieval, with native `Point` observation geometry; polygons are not assigned fake point centroids. These are curated **reported events**, not complete censuses or numeric physical intensity fields. EONET event reports may have different time/space support and are NOT automatically independent climate trend confirmations. The 150-event cap is prominently disclosed when hit. Both sources can return zero events without this proving an absence of activity. The sketch map is a **geographic coordinate-plane plot**, not a hazard map or satellite imagery.

**No synthetic observations:** event requests happen only following explicit user interaction. Network failure displays the original source error and empty scientific context rather than fabricated examples. Event observations and NASA POWER source measurements remain separate in all UI copy.

## Original source QA — verified through GitHub Actions

[EXP-011 original API probe #43787577130](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43787577130) completed with real USGS and NASA EONET HTTP 200 responses for **all six request types**, not mock fixtures:

- USGS, 90-day 1000-km source test centered near Liberia, minimum M3.5: **284 returned seismic events**, no capped-results warning. Source query covered the rolling UTC dates of the run.
- NASA EONET, 365-day 1000-km source test centered in northern California: wildfires **150 API events (127 geocoded within radius)** with a **truncated-result warning**; flood reports **4**, severe storms **1**. Volcanoes and landslides **0** for the specific area, time and source, which does **not** establish their absence.
- These counts are purely **source test observations for the stated spatial/temporal query**, not worldwide or Costa Rican event counts, a normalized trend, predictive hazard or guarantee of an identical count in future queries.

Local Node test fixtures independently test event transformations and science safeguards; Chromium browser fixture testing verifies that the interface renders real-format event responses but is not substitute original source QA. Recorded run links and source context belong in `docs/VALIDATION.md`.

## Remaining scientific families for future releases

Candidate products such as OCO-2/OCO-3 atmospheric CO₂, AIRS CH₄, OMI NO₂/O₃, SMAP and GLDAS physics, SWOT river discharge, PO.DAAC SST and altimetry, PACE OCI ocean color, OPERA water masks, MODIS/VIIRS vegetation/fire pixels, GEDI forest structure, GRACE/ICESat-2 cryosphere, Black Marble urban light and exposure require dedicated authenticated/published granule ingestion, geography masks, source resolutions, quality flags, scientific QA and sometimes institutional processing. **They are deliberately NOT enabled** by an unrelated EONET event report. The 49-topic catalog preserves their pending status and potential source candidates. Additional derived indicators require validated mathematics and data completeness before being marked available.

## Release checklist

- Confirm green current commit's Node source and Chromium desktop/mobile six-slide journey tests, including navigation, keyboard, URL fragments, no home-page vertical scroll and source/event panel.
- Verify native public-browser NASA GIBS layer georegistration separately; browser QA with CDN blocked only demonstrates safe fallback.
- On BanaHosting: update a read-only SSH clone and review `scripts/deploy-bana-static.sh --check` before committing to `--deploy`. Existing controls back up the original files and verify HTTPS hashes.
- Inspect `/`, `/en/`, `/telluris/` compatibility, product slides on desktop/mobile, `/about/`, `/en/about/`, both Explorer routes, and directly linked catalog events. Confirm that event source requests succeed **in the deployed browser**; GitHub server-side API QA does not guarantee client-side CORS success.
- Never claim official NASA affiliation, station-level climate precision, seismic forecast capability, fake simulated real observations, successful GPM physical validation or complete 49-domain integration.

**Scientific provenance:** [USGS Earthquake FDSN event service](https://earthquake.usgs.gov/fdsnws/event/1/); [NASA EONET v3 API](https://eonet.gsfc.nasa.gov/docs/v3); [NASA POWER monthly source specification](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/).