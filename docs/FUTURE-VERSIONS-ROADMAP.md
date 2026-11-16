# TELLURIS — Post-submission scientific expansion roadmap

**Decision date:** 2026-11-15 (Costa Rica)
**Status:** Accepted backlog / future research only. This document does **not** announce new production integrations, implementation dates, or independently validated environmental trends.
**Baseline reviewed:** GitHub main at `c9a4d95acac397b108a0204f51c6aebec510f9cc` (EXP-012).

## 1. Scope freeze for the 2026 NASA Space Apps submission

Project Uriel will prioritize a reliable, publicly reviewable demonstration of the NASA *Be An Earth System Trend Detective!* research questions: **what** changes, **where**, **by how much**, and **how confidently**. A broad catalog is useful for discovery but is not proof that all listed observations or analyses are connected.

The **existing 2026 codebase** includes 18 NASA POWER source-checked API parameters, four observational exploration modes, experimental evidence/statistical diagnostics, NASA GIBS globe layers, a separate USGS earthquake event explorer, NASA EONET event browsing, bilingual pages, and an enumerated scientific catalog. Their presence in GitHub is **not equivalent to confirmed public deployment, end-to-end scientific validation, or official NASA submission**.

Catalog accounting as of this review:
- **18 operational NASA POWER parameter entries** (some overlap conceptually with the research topics). The small archived 1985–2025 sample covers T2M/PRECTOTCORR; other POWER parameters require their own live original-source queries/imports.
- **49 proposed research topics** in six domains: **5 connected, 8 partially covered, 36 not connected**. The four USGS-derived seismic research topics are *partial* and remain distinct from NASA POWER measurements. Related EONET event links do not upgrade the underlying physical variables.
- **10 derived-indicator proposals**, not ten validated indicators. The catalog calls decade trends exploratory; some seasonal/anomaly/correlation/uncertainty tools already exist elsewhere in the Explorer and must be reconciled explicitly before promoting catalog indicators.

Authoritative inventories: [team inventory](TEAM-CATALOG-2026-11-15.md), [source-by-source review](TEAM-CATALOG-REVIEW.md), [active JSON catalogue](../website/public/telluris/catalog/data/catalog.json), [EXP-004 staging](RELEASE-STAGES-EXP004.md), [EXP-011 events](EXP-011-SLIDES-EVENTS.md), [EXP-005 statistical inference](EXP-005-SIGNIFICANCE.md).

**Freeze rule:** No new provider, new speculative climate conclusion, breaking website redesign, credential exposure, or undocumented statistical claim may compromise the official 2026 submission. Record future work, but implement it **after** the submission unless it fixes a verified blocking defect. No future item is advertised as production-connected until its individual acceptance gates pass.

## 2. Future connectors: all 36 pending topics remain eligible

Every item C01–C49 remains documented and may be implemented in a later version; no topic is silently discarded. The source selection below is **candidate**, never a promise that one dataset answers every subquestion.

| Domain and catalog IDs | Current baseline | Possible future product integration | Scientific/technical qualification |
| --- | --- | --- | --- |
| **Atmosphere C01–C06** | C01–C05 connected using POWER, C06 partially covered | Refine CLOUD_AMT and add correctly labeled CERES/MODIS cloud optical properties | Cloud fraction is not optical depth; angular wind direction needs circular statistics |
| **Atmosphere C07–C10** | Four topics not connected | OCO-2/OCO-3 CO₂; AIRS CH₄; OMI/MOPITT/MODIS atmospheric pollutants and O₃ | Column vs surface concentration, retrieval flags, observing footprint and product-specific seasonal coverage |
| **Atmosphere C11–C12** | C11 partial, C12 not connected | CERES EBAF net/TOA energy balance; LIS/OTD lightning events | Surface incoming shortwave, longwave, and albedo cannot be relabeled a net Earth energy budget; lightning is an event-rate process |
| **Water/ocean C13–C14** | Partially covered by POWER GWETTOP/GWETROOT and EVPTRNS | SMAP/GLDAS volumetric soil water and MOD16/GLDAS water-flux ET | POWER relative wetness (0–1) is not volumetric water; ET energetic flux is not automatically mm/day |
| **Water/ocean C15–C16** | Not connected | GLDAS runoff, SWOT RiverSP water elevation/width and separately identified reach-discharge estimates | Runoff ≠ river discharge; SWOT coverage starts much later than a 41-year climate record |
| **Water/ocean C17–C19** | Not connected | PO.DAAC altimetry and sea-level anomalies, MUR SST, SMAP/JPL sea-surface salinity | Ocean-only spatial support, reference datum, coastal QA and instrument/product continuity |
| **Water/ocean C20–C22** | Not connected | PACE/OB.DAAC chlorophyll and ocean optics; OPERA DSWx inundation | Optical retrieval uncertainty, clouds, classification masks and physical inundated area computation |
| **Biosphere C23–C27** | None connected publicly; C23 has real MODIS exploratory QA research | MOD13Q1 NDVI/EVI; verified MCD12Q1 land-cover; later GEDI/other forest structure and biomass products | Pixel geography, land/water flags, QA/orbital geometry, land-cover classes and time-series consistency; no automatic deforestation or biomass inference |
| **Biosphere C28–C30** | Not connected; EONET only gives related wildfire reports | MCD64A1 burned area, FIRMS MODIS/VIIRS hotspots and FRP, vegetation/water-stress products | A detection is not a unique fire; FRP is not burned area; cloud/sensor bias and API key confidentiality matter |
| **Geosphere C31–C34** | Partial USGS FDSN event queries | Thresholded seismic occurrence studies, coverage/completeness diagnostics, more geospatial inspection | Counts are not completeness-adjusted seismic rates or climate time-series observations; **no earthquake prediction** |
| **Geosphere C35–C39** | Not connected; related EONET event context for select topics | ARIA/InSAR deformation/subsidence; OMI volcanic SO₂, thermal anomalies, NASA LHASA landslide susceptibility | Displacement vs event, SO₂ event vs concentration, probabilistic susceptibility vs imminent prediction |
| **Cryosphere C40–C44** | Not connected | ICESat-2 elevation, GRACE/GRACE-FO mass, MODIS snow/glacier/sea-ice coverage | Harmonize temporal and geographic domains, vertical datum, masks and method-specific uncertainty |
| **Human footprint C45–C49** | Not connected | MODIS/Landsat/HLS urban heat and land cover, VIIRS Black Marble nighttime radiance, appropriately licensed population overlays | LST is not T2M, light radiance is not a population count or direct economic proof, exposure is a derived spatial model |

The 49-topic identity, exact numbering and original proposed sources remain in the team catalog. Do not imply that NASA provides an uninterrupted 1985–2025 series for every candidate.

## 3. Ten proposed indicators: actionable release gates

| Indicator | 2026 reality and later action | Gate |
| --- | --- | --- |
| I01 Anomalies | Explorer has *descriptive* month-matched differences/limited reference windows. Later add a user-selectable documented climatological baseline; do not label an arbitrary short baseline a 30-year normal. | Matching units, months, years and missingness |
| I02 Decadal trend | Exploratory Theil–Sen/Mann–Kendall/CI sensitivity exists. Improve data homogeneity and serial-dependence assumptions. | Independent statistical verification and clear noncausal conclusion |
| I03 Extreme heat days | Not implemented; needs **daily** temperature with a declared threshold, period and denominator. | Threshold stability and complete daily sampling |
| I04 SPI | Not implemented; needs calibrated precipitation time scales, fit diagnostics and adequate historical coverage. | Accepted SPI reference tests and source applicability |
| I05 Consecutive dry days | Not implemented; annual or monthly totals cannot reconstruct daily runs. | Original daily observations and explicit rain threshold |
| I06 Diurnal/maximum–minimum thermal amplitude | Potentially derivable from distinct T2M_MAX/T2M_MIN data, but aggregation meaning must be checked before activation. | Clear definition (monthly/day vs range of monthly means), unit and temporal QA |
| I07 Vapor-pressure deficit | Candidate from compatible temperature/humidity observations, with thermodynamic formula and aggregation caveats. | Independent equations/tests and physically meaningful time alignment |
| I08 Multivariable correlations | Five predeclared noncausal first-difference exploratory correlations already exist in the observatory; catalog status must not be automatically upgraded to fully validated. | Common years, multiplicity and serial/spatial dependence warnings |
| I09 Change points | Not implemented; avoid visually inferring structural breaks. | Predeclared test, calibration, multiple testing and sensitivity |
| I10 Statistical uncertainty | Existing experimental Sen CI, original MK p, residual lag-1 and bootstrap sensitivity must be distinguished from confirmed climate significance. | Robustness, original data and reproducible model assumptions |

## 4. Prioritized post-2026 release trains (proposed, not scheduled)

**R1 — scientific integrity and accessibility:** public deployment/browser provenance audit; canonical source registry; catalog-state reconciliation with already available anomaly, correlation and uncertainty tools; screen-reader/keyboard/mobile verification; a small set of reproducible, hypothesis-neutral NASA case studies. This is highest value before new dataset breadth.

**R2 — a second verified NASA observation family:** choose **either MODIS NDVI/EVI** (existing source and land-water/QA work) **or GPM IMERG precipitation** (existing extractor/comparator but missing original granules). Choose on access to real assets and ability to close the source-to-result proof; do not force both.

**R3 — geospatial hazard and water observations:** only after R2, evaluate FIRMS detection/FRP, MCD64A1 burned area, GLDAS runoff, or SWOT reach data as distinct query/method families. Apply request-budget and source license/auth checks.

**R4 — global breadth:** atmosphere composition (OCO/AIRS/OMI/CERES/LIS), oceans (PO.DAAC/PACE), snow/ice (ICESat-2/GRACE/MODIS), human footprint (VIIRS Black Marble/HLS), followed by physically justified exposure indicators. Independent temporal/spatial methods per family; no universal Sen/MK switch for categorical and event records.

**R5 — optional secure AI researcher:** only if a server-side proxy, private secrets, rate limits, evidence-bound output schema, adversarial validation and cost cap are proven. Preserve deterministic analysis as authoritative; never let an LLM invent or overwrite scientific numbers.

## 5. Connector acceptance contract

A topic becomes **connected** only after all applicable gates pass:

1. Named original provider/mission/collection/product/version, official URL/DOI and permissible access/licensing; API credentials never shipped in static web assets.
2. Actual external response with retrieval date, original input or reproducible reference/hashes and honest failure behavior; no sample-only promotion.
3. Declared geographic footprint, grid/pixel/river-reach support, temporal cadence and valid period. Verify mixed land-water pixels and any map reprojection.
4. Variable definition, original and displayed units, aggregation equations, fill/missing values, masks, QA flags, detection completeness and relevant product inhomogeneity.
5. Independently tested numeric operations and appropriate inference; point trends, correlations, categorical change maps and events use **different methods**.
6. English/Spanish metadata, user controls, accessible charts/tables, provenance/download/report, empty/error/loading states, security and performance checks.
7. Green automated tests **and** hands-on public BanaHosting checks (desktop/mobile, ES/EN, real NASA response), followed by exact version/update to `docs/VALIDATION.md`, `docs/DATA-SOURCES.md`, `docs/DECISIONS.md` and the JSON catalog.

**Statuses:** `research / not_connected` (documented), `partial` (only a sub-measurement or related event), `connected` (specific genuine operational source), and `scientifically validated for a stated question` (separate evidence level; never inferred from connected). Keep the 18 POWER entries and the 49 research topics as different accounting categories.

## 6. Attribution, participation, and deliverable boundary

The 49 topics and ten derived-indicator proposals originated in the team-contributed inventory; preserve that contribution in the scientific bibliography and project credits. The specific implementation and source QA decisions are Project Uriel's separate reviewed work.

Before the 2026 deadline, prioritize the [submission checklist](SUBMISSION.md), source audit, judge journey and official portal submission. This roadmap is not a substitute for the challenge response or an excuse to postpone it.

### Official technical starting points

- NASA POWER monthly API: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- NASA MODIS vegetation/land: https://lpdaac.usgs.gov/products/mod13q1v061/
- NASA GPM IMERG: https://gpm.nasa.gov/data/imerg
- NASA FIRMS: https://firms.modaps.eosdis.nasa.gov/content/active_fire/
- NASA GLDAS: https://ldas.gsfc.nasa.gov/gldas/gldas
- NASA SWOT: https://podaac.jpl.nasa.gov/SWOT
- NASA PACE: https://pace.oceansciences.org/
- NASA OPERA: https://www.jpl.nasa.gov/go/opera/
- NASA VIIRS Black Marble: https://viirsland.gsfc.nasa.gov/Products/NASA/BlackMarble.html
- USGS earthquakes: https://earthquake.usgs.gov/fdsnws/event/1/
- NASA EONET: https://eonet.gsfc.nasa.gov/docs/v3
