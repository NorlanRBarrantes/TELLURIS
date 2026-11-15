# EXP-003 — NASA MODIS vegetation: independent source review and QA pilot

**Date:** 2026-11-15, Costa Rica.  
**Origin:** Team-forwarded Google Gemini investigation comparing (1) MODIS NDVI/EVI, (2) FIRMS fire detections / FRP and (3) VIIRS Black Marble nighttime light products.  
**Current status:** **NASA ORNL API response structure and a real 2023 one-composite sample verified**. Experimental NASA MODIS QA adapter and tests implemented; the larger 2023–2025 data acquisition is a separate GitHub Actions execution whose completion must be explicitly checked. No vegetation trend or causal relationship is certified.

## Decision: prioritize MODIS vegetation, retain the other two

This is a scientific breadth decision, not proof that one project will "guarantee a win". Connecting a validated NASA satellite vegetation index alongside the existing NASA POWER meteorology helps the platform demonstrate multiple Earth-system domains. It does **not** prove climate causes vegetation changes.

| Candidate | Decision | Main evidence and caveats |
| --- | --- | --- |
| MODIS Terra NDVI/EVI — \`MOD13Q1\` | **First experimental adapter** | NASA ORNL DAAC TESViS supports documented coordinate subsetting and 16-day composites, about 232 m native output pixel grid. Explicit QA, fill and cloud checks essential, especially for Caribbean sites. Confirm exact collection version from NASA catalog/source metadata before asserting \`061\` on acquired observations. |
| MODIS/VIIRS active fire via FIRMS | **Retain in roadmap** | FIRMS area REST API requires free MAP_KEY and currently limits \`DAY_RANGE\` to **1–5**, not 10 days. Use standard-science versus NRT labels correctly; do not combine different sensors' counts into a trend without harmonization. Active hotspots ≠ unique fires ≠ burned hectares. |
| VIIRS Black Marble \`VNP46A3\`/\`VNP46A4\` | **Retain in roadmap** | NASA LAADS provides monthly/yearly nighttime light products. Radiance measures outgoing light in sensor bands; LEDs, view geometry, background and changes to the calibration/collection affect comparisons. It cannot directly measure population or economic output. |

## Real NASA API checks, not hypothetical responses

[GitHub Actions ORNL MODIS probe #43737483122](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737483122) successfully contacted \`https://modis.ornl.gov/rst/api/v1/MOD13Q1\`:

- \`/bands\` → **HTTP 200**, JSON object containing \`bands\` array. Verified three exact band IDs: \`250m_16_days_NDVI\`, \`250m_16_days_EVI\`, \`250m_16_days_pixel_reliability\`, plus bit-field \`250m_16_days_VI_Quality\`.
- Actual metadata for NDVI/EVI: \`valid_range = "-2000 to 10000"\`, \`fill_value = "-3000"\`, \`scale_factor = "0.0001"\`, \`add_offset = "0"\`. Note **-2000 is a valid inclusive range endpoint**.
- Actual pixel reliability metadata: \`valid_range = "0 to 3"\`, \`fill_value = "-1"\`.
- \`/dates\` → **HTTP 200**, response envelope \`{"dates":[...]}\` (not a bare list), with **614 composite dates** for **both** the requested Liberia and Limón coordinates, from \`2000-02-18\` through \`2026-10-16\` as returned by this service at probe time. Actual years available for a newer collection may differ.
- \`/subset\` → **HTTP 200** for both coordinates, one composite \`A2023001\` (\`2023-01-01\`) with \`kmAboveBelow=0&kmLeftRight=0\`: **1×1** sample, \`cellsize = 231.656358264\` meters, with 12 science/QA bands.
- **Liberia A2023001**: NDVI raw \`2209\`, EVI raw \`1513\`, reliability \`0\`. After scaling, 0.2209 / 0.1513, valid under the chosen screening.
- **Limón A2023001**: NDVI raw \`2485\`, EVI raw \`1611\`, reliability \`3\`; **both must be excluded** despite seemingly plausible raw VI values. Never use that pair as a trustworthy observation.

This validates request shape, metadata and the necessity of QA, **not a full MODIS 2000–2025 record or scientifically significant trend**. The first probe run [#43737375446](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43737375446) failed due to an incorrect parser assumption: the \`/dates\` response is a JSON **object** wrapping the array. The source parser was corrected and the next probe completed successfully. This is a software test failure, not a NASA climate finding.

## Corrections to the Gemini draft

1. **Incorrect exclusion** \`raw_vi <= -2000\`: its own claimed valid range is inclusive **[-2000, 10000]**. Reject exact provider-defined fill \`-3000\` and out-of-range values, then apply QA.
2. **FIRMS API date window**: NASA's current official \`/api/area\` page states **1–5 days** per query. The claim of up to ten days conflates different endpoints and is not valid for that live endpoint.
3. **NASA product selection**: \`MOD13Q1\` is a 16-day 250 m product; \`MOD13A3\` is a different monthly 1 km product. The ORNL probe actually tested \`MOD13Q1\` only; do not label that sample monthly or assert \`MOD13A3\` retrieved.
4. **Sensor collection version**: MOD13Q1.061 is an official catalog designation, but the probed \`/subset\` entries did not themselves expose a \`version\` property. Confirm underlying ORNL catalog version rather than silently hardcoding it as verified.
5. **Point-to-city extrapolation**: \`kmAboveBelow=0&kmLeftRight=0\` selects one MODIS land pixel. Its value is **not** the average greenness of all of Liberia, Limón, Costa Rica, or a watershed.
6. **EVI definition**: EVI helps with certain canopy/atmospheric effects but does not guarantee cloud immunity or a universal absence of saturation. Apply QA for both EVI and NDVI, including VI Quality if advanced research demands it.
7. **Cross-dataset correlation**: Spearman/Pearson association between NASA precipitation and EVI may be informative but cannot quantify the "percentage controlled by rainfall" or establish a causal driver. Align years/seasons and consider autocorrelation and source resolution first.
8. **Annual median**: It is a screening/summary choice, **not** an official NASA annual MODIS value and not equivalent to monthly or annual mean. Require temporal distribution across quarters; a cloud-biased dry season can make naïve medians misleading.
9. **Time-series inference**: EVI/NDVI need minimum eligible years and satellite/sensor orbital-drift checks; serial correlation, phenological cycles and missingness can invalidate naïve original Mann–Kendall p-values.
10. **No arbitrary delivery estimates or competition guarantees**: The draft's hour estimates and "ensures triumph" are unsupported; the only valid claim is the verified source and tested implementation.

## Implemented EXP-003 source adapter

- [analysis/exp003_modis.py](../analysis/exp003_modis.py): ORNL bands/dates/subset retrieval, **exact metadata validation**, point-only 1×1 grid, raw-response preservation and SHA-256, no credentials, missingness/quality filter; annual **descriptive median** only when at least 12 acceptable 16-day composites and two in every calendar quarter. Those coverage thresholds are **our methodological screening convention**, not a NASA recommendation or proof of bias removal.
- [tests/test_exp003_modis.py](../tests/test_exp003_modis.py): deterministic checks for range boundary -2000, rank 3 exclusion, rank 1 trace, fill -3000, grid size, incomplete QA and seasonal sample incompleteness.
- [.github/workflows/exp003-modis.yml](../.github/workflows/exp003-modis.yml): runs parser QA and attempts actual 2023–2025 acquisition for the two Costa Rican point samples, retaining the original source JSON as a time-limited GitHub Actions artifact.

**Scientific release gate:** Do not mark vegetation as a full third *validated variable in the public Explorer* until real multi-year retrieval, source/collection version, QA coverage, scientifically justified trend handling, static/public front-end and end-to-end tests are confirmed. As with POWER, a successful HTTPS response does not validate trend significance.

## Official sources (reviewed)

- [NASA ORNL TESViS REST API](https://modis.ornl.gov/data/modis_webservice.html): actual endpoint parameters, 10 dates per synchronous request, data response format.
- [ORNL actual bands and documentation](https://modis.ornl.gov/rst/globalsubset_ui/): product/band IDs, quality metadata.
- [NASA FIRMS /api/area](https://firms.modaps.eosdis.nasa.gov/api/area): current 1–5-day window, MAP_KEY requirement.
- [NASA LAADS Black Marble](https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/science-domain/nighttime-lights): monthly/yearly VIIRS nightlight collections.
- [NASA MOD13Q1.061 catalog](https://doi.org/10.5067/MODIS/MOD13Q1.061): mission product lineage, collection and user guides.
