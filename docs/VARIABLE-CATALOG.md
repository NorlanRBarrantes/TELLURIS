# Earth-system variable catalog — NASA-backed candidates

**Research date:** November 14, 2026 (Costa Rica).  
**Purpose:** Broaden TELLURIS from two weather variables into an Earth-system *investigation platform*.  
**Status definitions:** **CONNECTED** = code and real source retrieval verified. **READY TO TEST** = official NASA product/API documented; still requires a real request with our community/units/date range, aggregation rules and QA. **RESEARCH** = an official collection/source exists but extraction and scientific suitability are not yet proven.

**Do not surface a research candidate as if the app could already analyze it.** Dataset horizons are source-specific and may vary with collection/version.

## A. Atmosphere, surface radiation and meteorology

| Variable | Scientific question | Source/identifier | Units / temporal interpretation | Status |
| --- | --- | --- | --- | --- |
| Air temperature at 2 m | Is near-surface air temperature changing? | NASA POWER \`T2M\` / MERRA-2 | °C; time-weighted monthly/annual mean | **CONNECTED** |
| Corrected precipitation | Is the rainfall estimate changing? | POWER \`PRECTOTCORR\` / MERRA-2 | mm/day monthly rate → mm per calendar period; verify homogeneity | **CONNECTED** |
| Relative humidity | Is the near-surface air becoming relatively moister/drier? | POWER \`RH2M\` | %; averaging rather than summing | **READY TO TEST** |
| Wind speed | Are near-surface winds changing? | POWER \`WS10M\` or \`WS2M\` | m/s; mean, not gust or local wind-station estimate | **READY TO TEST** |
| Solar irradiance | Is incident solar energy changing? | POWER \`ALLSKY_SFC_SW_DWN\` | Verify actual units per community/time product (e.g. energy per area per day) and source continuity | **READY TO TEST** |
| Maximum/minimum air temperature | Are heat extremes changing? | POWER \`T2M_MAX\`, \`T2M_MIN\` | °C; monthly reported maxima/minima need specific interpretation | **READY TO TEST** |
| Specific humidity / water vapor | Is atmospheric moisture changing? | POWER \`QV2M\`, \`PW\` | Verify source units/level; means not accumulations | **READY TO TEST** |
| Evapotranspiration | Is water flux from vegetation/land changing? | POWER \`EVPTRNS\`; GLDAS \`Evap\`; MODIS \`MOD16A2.061\` | Distinguish modeled flux or composite; unit conversions and valid-date policy vary | **READY TO TEST** POWER; **RESEARCH** MODIS/GLDAS |
| Surface pressure / atmospheric properties | Is modeled air pressure changing? | POWER \`PS\` | kPa or provider-defined; metadata must be checked | **READY TO TEST** |
| Ozone / nitrogen dioxide | Are atmospheric chemistry columns changing? | NASA Aura/OMI; Giovanni/GES DISC products | Column units and QA dependent on product; long records possible | **RESEARCH** |
| Atmospheric vertical temperature/humidity | What changes with altitude? | NASA AIRS products / GES DISC | Vertical levels, profile units/QA differ from surface point time series | **RESEARCH** |

NASA documents POWER parameter families and native MERRA-2 0.5° × 0.625° grid behavior; requests for POWER codes and communities must still pass live endpoint tests: https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/ ; https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/ ; https://power.larc.nasa.gov/parameters/.

## B. Rivers, freshwater and the water cycle

| Variable | What it actually measures | NASA dataset/product | Temporal/spatial cautions | Status |
| --- | --- | --- | --- | --- |
| Soil moisture — root zone/surface | Water content in soil, NOT river discharge | GLDAS \`SoilMoi*\`; NASA SMAP L4 \`SPL4SMGP\` | GLDAS model or SMAP/model-assimilation field, 9 km product for SMAP L4; data from ~2015 for SMAP | **RESEARCH** |
| Surface runoff | Water leaving a land model's near-surface grid cell | GLDAS \`Qs\` | kg m⁻² s⁻¹ or accumulation depending collection; NOT m³/s river flow | **RESEARCH** |
| Subsurface runoff/baseflow | Drainage or below-surface model flux | GLDAS \`Qsb\` | Grid flux; NOT gauged river flow | **RESEARCH** |
| River water surface elevation | Height of river surface relative to its reference | SWOT RiverSP \`SWOT_L2_HR_RiverSP_reach_D\` | Reaches/nodes with quality flags, intermittent passes, mission from Dec 2022 | **RESEARCH** |
| **Estimated river discharge (caudal)** | **Discharge estimate on a mapped river reach (m³/s)**, not direct gauge reading | SWOT RiverSP reach, version D; SWOT L4 Sword-of-Science discharge products | River geometry, algorithms/uncertainty, gauge-constrained options; **too short to presume multidecadal trends** | **RESEARCH — hydrology priority** |
| River width and surface-water slope | Changes in geometry of suitable river reaches | SWOT RiverSP reach/node | Reach (~10 km) vs node (~200 m) semantics; basin coverage and orbital sampling vary | **RESEARCH** |
| Total terrestrial water storage | Land-water-equivalent thickness/mass anomaly, not streamflow | GRACE/GRACE-FO \`TELLUS_GRFO_L3_CSR_RL06.3_LND_v04\` and GRACE counterpart | Monthly regional gravity-derived water anomaly; coarse effective footprint and mission gap | **RESEARCH** |
| Independent station river discharge | Water passing a gauge cross-section (m³/s) | CUAHSI HydroClient / HydroShare / national hydrometric agencies (non-NASA) | Optional validation context; not a replacement for NASA-source requirement | **REFERENCE** |

**Critical distinctions:** [GLDAS official model-variable definitions](https://ldas.gsfc.nasa.gov/gldas/model-output) explicitly list \`Qs\` and \`Qsb\` as runoff/baseflow fluxes. [NASA SWOT RiverSP version D](https://podaac.jpl.nasa.gov/dataset/SWOT_L2_HR_RiverSP_reach_D) reports water surface elevation, slope, width and **estimated discharge** on river reaches; [NASA SWOT discharge announcement Jan 2026](https://science.nasa.gov/blogs/science-news/2026/01/05/swot-offers-river-discharge-estimate/) highlights global discharge estimates. A SWOT-only 2022+ series cannot satisfy a 1985–2025 trend request.

## C. Vegetation, surface and ecosystems

| Variable | Product | Why it matters / safeguards | Status |
| --- | --- | --- | --- |
| NDVI and EVI (vegetation greenness) | MODIS \`MOD13Q1.061\` 16-day 250 m; optional monthly MOD13 products | Apply scale factor and vegetation QA; cloud, sensor and seasonal vegetation confound naive trends | **RESEARCH — candidate P1** |
| Land-surface temperature (LST) | MODIS \`MOD11A2.061\` 8-day, ~1 km; or monthly \`MOD11C3.061\` | **Not** the same physical quantity as 2 m air temperature; QA and Kelvin→°C as applicable | **RESEARCH** |
| Vegetation evapotranspiration | MODIS \`MOD16A2.061\` 8-day | Flux/accumulation units and QA require product-specific handling | **RESEARCH** |
| Leaf area index / productivity | MODIS \`MOD15A2H.061\`, \`MOD17A2H.061\` | Seasonal signals, quality flags and ecological interpretation | **RESEARCH** |
| Land cover changes | MODIS \`MCD12Q1.061\` yearly | Categorical transitions, **not directly a continuous-slope variable** | **RESEARCH** |
| Burned area / surface fire history | MODIS \`MCD64A1.061\` monthly | Estimate burned area using spatial sums/masks; avoid confusing hotspots with burned hectares | **RESEARCH** |

Start with [AppEEARS](https://appeears.earthdatacloud.nasa.gov/) for reproducible MODIS point/area extraction, mission-specific QA, scaling and metadata. NASA Earthdata lists the relevant MODIS product families: https://cmr.earthdata.nasa.gov/search/site/collections/directory/LPCLOUD/gov.nasa.eosdis.

## D. Oceans and sea level

| Variable | Source | Scope / caveat | Status |
| --- | --- | --- | --- |
| Sea surface temperature (SST) | JPL PO.DAAC \`MUR-JPL-L4-GLOB-v4.1\` | Global blended Level-4 product since May/June 2002; 0.01° gridded SST, not air temperature | **RESEARCH — candidate P1/P2** |
| Sea surface height anomalies | PO.DAAC \`NASA_SSH_REF_ALONGTRACK_V1\`, TOPEX/Poseidon/Jason/Sentinel-6 | Along-track ocean altimetry from 1992; not generic arbitrary land-point samples | **RESEARCH** |
| Coastal chlorophyll | SeaWiFS historical examples; MODIS ocean color products | Water optical quality and river-plume confounding; consult challenge-listed SeaWiFS methods paper | **RESEARCH** |

Catalog examples: https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1 ; https://podaac.jpl.nasa.gov/dataset/NASA_SSH_REF_ALONGTRACK_V1 .

## Connection priorities

**Next verified POWER adapter batch:** \`RH2M\`, \`WS10M\`, \`ALLSKY_SFC_SW_DWN\` (plus temperature extrema where scientifically useful). The POWER API handles multiple parameters per point, but the current TELLURIS browser code only requests and normalizes the first two; the rest must not be claimed as live until new metadata/unit tests pass.

**Next distinct source demonstration:** choose the shortest verified integration route with a strong scientific question: **GLDAS Qs + soil moisture** for hydrology, **MODIS NDVI** for land, **IMERG V07B** to cross-check the anomalously large precipitation slopes. SWOT discharge deserves a targeted river-reach case, but requires different spatiotemporal semantics and cannot be inferred from GLDAS \`Qs\`.

**Technical architecture:** each scientific variable needs \`id, source, collection, version, category, spatial_support, temporal_support, unit, aggregation, valid_years, quality_masks, source_url, interpretation, integration_status\`. Do not flatten raster/river reach/station to the same "point" abstraction. Use actual source availability to filter the UI.

**Scientific research hygiene:** the supplied Gemini EXP-002 text provides useful candidates and a provisional script, not executed measurements. Do not import its \`value > -900\` filter, unvalidated Hamed–Rao selection or categorical artifact conclusions. Test against real NASA metadata and independent references first.

## Team-generated expanded inventory (15 November 2026)

The sibling/team-contributed [original scientific inventory](TEAM-CATALOG-2026-11-15.md) adds **49 research candidates and ten proposed derived indicators** spanning atmosphere, freshwater/oceans, biosphere, geosphere, cryosphere and human footprint. **All are retained** in the normalized [JSON index](../website/public/telluris/catalog/data/catalog.json) and integrated into the exploratory web catalog (not live data connectors). The definitions and scientific corrections are in [TEAM-CATALOG-REVIEW.md](TEAM-CATALOG-REVIEW.md). T2M and PRECTOTCORR are the **only connected NASA variables** at this stage; sources mentioned in the team's document are candidates until individually verified.

**New high-impact opportunity:** NASA FIRMS MODIS/VIIRS active fire detections and FRP, plus distinct burned area products; NASA VIIRS Black Marble nighttime radiance; and NASA InSAR/ARIA, LHASA and USGS contextual event records. These require event/categorical/quality-specific scientific analysis rather than blindly reusing annual precipitation Mann–Kendall.

## EXP-003 — MODIS vegetation selected for an evidence-first pilot (2026-11-15)

[EXP-003 source audit](EXP-003-VEGETATION.md) documents live ORNL TESViS MOD13Q1 NDVI, EVI and pixel-reliability responses, precise inclusive valid ranges and the requirement to QA-mask cloudy pixels. A new Python NASA retrieval adapter and 10 synthetic regression checks have been added; they are **not** evidence of a multi-decade validated vegetation trend or an already-connected public third source. FIRMS and Black Marble are retained in the team research catalog with corrected source limits and interpretation cautions.

## EXP-004 — connected NASA POWER 18 parameters

The browser Explorer registry now exposes exactly **18 single-variable monthly POWER responses that were individually tested against NASA on November 15, 2026**. Catalog JSON v2 preserves the 49 original team candidate topics, but labels each of the 22 recently requested environment/water topics as **5 fulfilled, 4 partially fulfilled and 13 awaiting specialized mission connectors**. Current connected parameters are listed with unit-aware, domain-aware aggregation in the source registry `website/public/assets/science.js`. See [release staging and exact topic matrix](RELEASE-STAGES-EXP004.md). **Connection means NASA API retrieval + programming, not a validated climate trend.**
