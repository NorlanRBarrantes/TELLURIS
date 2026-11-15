# EXP-002 research protocol — seasonal and cross-region falsification

**Status (2026-11-14 Costa Rica): PLANNED, NOT YET EXECUTED.** This is a preregistration-style plan, not a table of observed/validated results. It expands the real-data EXP-001 investigation without selecting positive outcomes in advance.

## Central question

Does a given NASA Earth-science variable show robust trends, possibly with different signs in different places, after temporal/spatial consistency checks, explicit uncertainty, and credible comparison with an independent data product?

NASA's challenge describes opposite regional trends as a *possible pattern* under common drivers, not a required pre-known result for any specific city pair. Avoid guaranteeing "significant opposite slopes" from literature describing different datasets, time windows, or geographical footprints.

## Candidate experiments (hypotheses, not expected results)

| Stage | Comparison | Variables / period candidate | Specific falsifiable hypothesis | Evidence gate |
| --- | --- | --- | --- | --- |
| Priority 1 | Liberia vs Limón, Costa Rica | Monthly NASA POWER PRECTOTCORR; full-year and JJA 1985–2025 | Seasonal and annual contrasts may differ in direction/magnitude, but opposing **time trends** are not presumed | Raw monthly data, complete JJA years, separately aligned periods, trends/uncertainty, lag assumptions |
| Priority 1 | Liberia vs Nicoya, Costa Rica | T2M, PRECTOTCORR on common years | Same broad Pacific climate regime may show more similar variability than cross-divide samples | Confirm distinct effective grid cells, independence and distance; no arbitrary demanded p>0.05 |
| Priority 1 | NASA POWER/MERRA-2 vs GPM IMERG **Final V07B** | Precipitation, actual common overlap **1998 onward** | Very large EXP-001 model rainfall changes may or may not persist across an independent precipitation estimate | Verify collection/run/version, units **POWER mm/day vs IMERG mm/hr**, 0.1° grid, matched footprints, overlap, monthly completeness and quality flags |
| Optional 1 | Frankfurt vs New Delhi | NASA POWER surface solar irradiance **ALLSKY_SFC_SW_DWN** if available, requested 1985–2025 (coverage unverified) | European brightening versus South Asian dimming *may* be detectable, but can depend on the solar source, cloud effects, aerosol changes, period and site | Actual POWER parameter metadata and continuity, matching years, independent literature describing comparable measure |
| Optional 2 | Santiago vs Punta Arenas (not Antarctica) | PRECTOTCORR | Regional precipitation behavior may differ under changing Southern Hemisphere circulation | Independent Chilean station/satellite references and source homogeneity |
| Optional 3 | Sahel (Niamey) vs Central Congo | PRECTOTCORR | Contrasting rainfall histories may exist, but the chosen product or period can fail to show opposite slopes | No assumed sign/p-value; independent satellite/station evidence first |

**Important:** A single grid point in a city is not a country-wide/regional climate estimate. For international case studies consider reproducible area aggregations or multiple well-defined cells.

## EXP-002 first scientific implementation

1. Reuse EXP-001's **original NASA POWER monthly JSON** to produce **JJA totals per calendar year** for each location; include only 3/3 valid months and use month-length weighting for a precipitation rate in mm/day, yielding **seasonal accumulated mm**. Do not treat JJA as all 12 months or use simple mean rainfall as a total.
2. Plot annual and JJA series side-by-side on **identical years**; compare Sen slopes and a descriptive paired difference. Avoid assuming opposite signs. Distinguish seasonal contrast in climatological levels from trends in seasonal rainfall **over years**.
3. Use annually aggregated JJA values as one observation per year. If presenting original MK results, clearly show the serial-dependence limitations. Seasonal MK on the full monthly sequence is a separate test, **not automatically equivalent** to MK on a JJA total.
4. Retrieve the Nicoya/adjacent Pacific sample (provisional: 10.15 N, -85.45 W); verify actual source grid footprint. If samples share a cell, mark the comparison **invalid as an independent spatial control**. Same-regime sites need not have identical trends or non-significant paired differences.
5. Compare annual precipitation over an aligned 1998–2025 (or shorter actual) common overlap with **IMERG Final V07B**, not an incorrectly cited January 1985 IMERG start. Compare the definitions of PRECTOTCORR and IMERG satellite-gauge blend; disagreement alone does not identify which product is "wrong".
6. Implement two deterministic internal **metamorphic tests** on our scientific engine: negating valid observations flips Sen slope and MK S/Z signs while preserving two-sided p (within numeric tolerance); shifting all observation values by a constant leaves slope/S/Z/p unchanged. Keep calendar time unchanged. These tests **validate invariants, not climate findings**.
7. Optional permutation tests require an exchangeable null. **Naïvely shuffling climate years destroys serial correlation**. Never present permutation p-values on autocorrelated observations as generally valid significance or claim each shuffle must give p>0.05.
8. Register every source query and retrieval timestamp, actual units, grid/footprint, raw SHA256, valid months, method version, CI execution and uncertainty. Record negative or inconclusive results, not just eye-catching trends.

## Explicit false-positive and interpretation controls

- Two separately significant p-values do not prove that slopes **differ**. Conversely, two individual p-values with different significance decisions do not establish an environmental contrast.
- An exploratory cross-site trend is not itself evidence of a **common physical cause**. That needs a separate meteorological attribution/teleconnection study.
- No statistical test can establish that a control region's trend is "zero" from a non-significant p alone. If equivalence matters, select a justified *equivalence margin* and method.
- Reanalysis/satellite products require source homogeneity and correlated-errors awareness. A second gridded product isn't necessarily independent in all inputs (IMERG Final includes gauge information).
- The initial EXP-001 MERRA2 precipitation trend is unusually large and is a **quality-control finding**, not a celebrated warming/rainfall conclusion.

## Proposed milestone for next functional release

**Explorer 0.2: comparative evidence mode** — two-location chart with shared years and two slopes, JJA versus full year for rainfall, clearer provenance, export of both records and difference series. Release only after scientific QA fixtures and one real-data comparison are verified.

## Original and research references

- NASA challenge: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/
- NASA POWER monthly point API: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- NASA GPM IMERG data directory: https://gpm.nasa.gov/data/directory
- IMERG Final V07B monthly collection: https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07
- Midsummer drought / Caribbean Low-Level Jet: https://doi.org/10.1002/joc.4077
- Surface solar brightening variability in Europe, 1983–2020: https://doi.org/10.1029/2024JD041101

**Open work:** Gemini can independently research matching source collection IDs, variable availability and published physical mechanisms, but any asserted numerical "ground truth" signs, z-scores or p-values must be rejected until reproduced on exactly our selected source, site and period.
