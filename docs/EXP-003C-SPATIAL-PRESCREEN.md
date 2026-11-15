# EXP-003C — Predeclared Caribbean MODIS spatial suitability experiment

**Date:** November 15, 2026 (Costa Rica)  
**Status:** NASA spatial pre-screen implemented and running; individual candidates only become evidence-supported when actual NASA source calls and metadata pass.  
**Source:** team-forwarded independent Gemini analysis, preserved **verbatim** at [GEMINI-EXP-003C-ORIGINAL.txt](_working/GEMINI-EXP-003C-ORIGINAL.txt). **This source is a proposal, not NASA observation data.**

## Motivation and original reproducible finding

The original TELLURIS 2023–2025 MOD13Q1 QA audit on *one* 1×1 MODIS pixel at geographic point **Limón 9.99, -83.03** found 67 land/water code **2** (shoreline) and two code **0** (shallow ocean), zero code **1** unequivocal land. These classifications came from genuine NASA ORNL source records and indicate the chosen **MODIS pixel is unsuitable for an unequivocal terrestrial-vegetation series**, not that Limón lacks forest.

The Gemini source recommends three alternative points and multi-pixel extraction. We **pre-register** the source-proposed candidates before any vegetation slope/statistical analysis. This prevents moving to a location because the slope appears impressive.

## Exact predeclared sites (labels are unverified descriptions)

| Code | Coordinate (N, E) | Role in spatial screen | Nominal 0.5°×0.625° box around (10, -83.125) |
| --- | --- | --- | --- |
| LIM-ORIGINAL | (9.9900, -83.0300) | Existing shoreline QA control | Inside |
| LIM-BANANO | (9.8850, -83.1350) | Candidate A, described in Gemini as Río Banano/Fila Matama | Inside |
| LIM-BEVERLEY | (9.9650, -83.1150) | Candidate B, described in Gemini as Beverley/Matina | Inside |
| LIM-HITOY | (9.6710, -83.0240) | Candidate C, described as Hitoy Cerere | **Outside** nominal latitude bounds (south of 9.75 N) |
| LIB-REFERENCE | (10.6300, -85.4400) | Known inland Liberia reference pixel | Not applicable |

**Important corrections:** The labels and claimed reserve boundaries/elevations/landcover have **NOT** yet been verified using SINAC, NASADEM or MCD12Q1. The statement in Gemini's report that *all* points are in the same MERRA-2 cell is false for Hitoy under its **own** nominated cell boundaries (9.75–10.25 N). For the other points, a nominal mathematical bounding box test **does not prove identical NASA POWER data**, which may have provider-specific sampling, interpolation, masking or coordinate handling. An exact NASA POWER endpoint comparison at both points is required before asserting data identity.

## Source-derived NASA definitions and research filters

NASA MOD13Q1 DetailedQA \`250m_16_days_VI_Quality\` encodes bits 11–13 land/water. Land class **1** is unequivocal land; code **2** indicates coastline; code **0** indicates shallow ocean, with other classes for shallow/ephemeral/inland/deep water. The **project-selected** restriction \`land_class == 1\` is valid for a strict terrestrial vegetation site screen, but is **not a universal NASA rule** for all coastal/wetland research questions.

The source also has MODLAND bits 0–1, high aerosol 6–7, adjacent cloud 8, mixed cloud 10, snow 14, shadow 15; the EXP-003B routine is used without silently changing the mask. Summary QA \`pixel_reliability\` is **required** alongside DetailedQA. A site judged only on DetailedQA is incompletely screened.

**ORNL TESViS API**: \`/MOD13Q1/subset\` accepts lat/lon/startDate/endDate and *integer km* \`kmAboveBelow\` and \`kmLeftRight\`, maximum ten composite dates per synchronous request. At radius **1 km**, its documented example returns **9×9 pixels**, not 3×3. EXP-003C requests 1 km and extracts the **central nine** pixels with genuine returned \`nrows\`, \`ncols\` and same-date band alignment. Do not assume decimal \`0.5\` is accepted as an integer radius or that a 5×5 response has been measured without requesting it.

ORNL MOD13Q1 250 m cells have an observed \`cellsize≈231.656 m\` in the relevant output, so 3×3 central nominal footprint is ≈0.7 km wide, **not exactly 750 m** in native sinusoidal coordinates. Do not claim 9 cells reduce noise by exactly \`1/sqrt(9)\`: spatial pixels are correlated and footprints overlap.

## Actual screening algorithm

- [analysis/exp003c_spatial_screen.py](../analysis/exp003c_spatial_screen.py) queries original NASA source data for all **five** predeclared positions (including original and Liberia controls), retaining each original JSON with SHA-256 and the response URL.
- Get full QA and science bands for one predeclared 16-day composite \`A2023001\`. Audit 9×9 source metadata, select center 3×3 using the **actual returned dimensions**, inspect every pixel's land code, reliability, atmospheric/geometry flags and NDVI/EVI data validity.
- Report whether central cell has class 1, number of the nine central cells with class 1, number of quality-eligible 3×3 cells, and whether experimental screening thresholds \`>=7/9 land cells and >=6/9 quality-clean cells\` pass **on that one date only**.
- Probe \`/MCD12Q1/bands\` to see if annual IGBP landcover is available through the same service. If not, declare not verified and use a supported alternative NASA source later; **do not invent LC_Type1 class 2 evergreen forest**.
- Output a machine-readable \`site_prescreen.json\` and raw NASA subset archives as workflow artifacts.
- **No** Sen slope, p, global vegetation trend, claim of stable natural forest, adjustment for Terra orbit drift or physical attribution is made in the site selection phase.

**Single-date screening cannot prove 95% historical land classification, 20 valid years or habitat stability.** Those are later acceptance gates requiring 2000–2025 MOD13Q1 QA and MCD12Q1 product history, ideally a region/polygon with a declared target ecology.

## Critical scientific corrections to Gemini's recommendations

1. **Río Banano coordinates are candidates, not verified evergreen forest**: site names/elevations and protected-area membership need independent GIS and NASA landcover verification.
2. **The exact MERRA-2 cell claim for Hitoy is inconsistent**: latitude 9.671 is outside the stated [9.75,10.25] range.
3. **Grid vs output:** inside a nominal native MERRA grid box does not guarantee identical NASA POWER monthly JSON; compare original queries rather than reuse a cached climate series blindly.
4. **Native resolution:** 250 m is nominal MODIS resolution, while the native sinusoidal cell size in ORNL is approx 231.656 m. A 3×3 extraction covers about 0.695 km width in the source grid; this does not imply 9 independent ground samples.
5. **Area API:** the documented \`kmAboveBelow\` and \`kmLeftRight\` are integer kilometres. The proposed decimal 0.5 km radius is **not documented as reliable**; 1 km typically yields a 9×9 response.
6. **Contradictory spatial criteria:** The report simultaneously requests \`>=7/9\` unequivocal land pixels and \`0%\` shoreline class across a 3×3. These are distinct policies; EXP-003C records actual classes and uses the less ambiguous >=7 land + >=6 quality-clean diagnostic for a provisional 3×3 *terrestrial* center—not a scientific trend eligibility guarantee.
7. **Arbitrary thresholds:** >=95% historical class 1, >=20 valid years, >=8 valid composites per year, <=300 m altitude difference, >=7/9 land and >=6/9 clean are proposed project *screening parameters*, not universal NASA validation standards.
8. **QA mask:** original Gemini site script does **not** check \`pixel_reliability\` while claiming comprehensive QA; EXP-003C uses both QA layers.
9. **IGBP mismatch:** one \`MCD12Q1\` 500 m class is not ground truth for every MOD13Q1 250 m neighboring pixel. Use multiple years, QA and spatial footprints, not a single class label.
10. **Ecological purity:** protected status/IGBP evergreen forest alone does not prove "pure response to climate"; land-use and other drivers can affect vegetation.
11. **The original coastal observation remains archived unchanged.** Any inland site becomes a **new separately versioned sample**, not a retroactive repair of Limón's historical MODIS series.

## Decision gate

Do not promote inland source coordinates to the NASA MODIS public Explorer until (a) actual NASA QA screening succeeds; (b) an ecologically meaningful natural-forest/agroforestry category is independently verified; (c) seasonal coverage across long records and product versions is documented; and (d) Terra/Aqua sensitivity and significance assumptions are validated. Current public Explorer remains two connected NASA POWER variables.

## Primary source URLs

- NASA ORNL API parameters and max ten dates: https://modis.ornl.gov/data/modis_webservice.html
- NASA MOD13Q1 DetailedQA guide: https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf
- NASA MCD12Q1 landcover IGBP 500m guide: https://lpdaac.usgs.gov/documents/1409/MCD12_User_Guide_V61.pdf
- NASA POWER provider model context: https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/
- Prior real MODIS source QA: https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740917213

## Actual first-run evidence and transient NASA HTTP issue

[First EXP-003C source acquisition run #43742780167](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43742780167) passed **8 synthetic tests** and acquired actual MOD13Q1 `A2023001` 9×9 response windows for the **four predeclared Caribbean sites**. Their central 3×3 source window results were:

| Site | Land-class-1 pixels / 9 | NASA QA-clean NDVI/EVI pixels / 9 | Interpretation |
| --- | ---: | ---: | --- |
| Limón original | **0/9** | **0/9** | Explicit negative shoreline control. |
| Río Banano candidate | **9/9** | **9/9** | Supports **single-composite terrestrial QA eligibility**, no ecological classification yet. |
| Beverley candidate | **9/9** | **9/9** | Supports **single-composite terrestrial QA eligibility**. |
| Hitoy candidate | **9/9** | **9/9** | Supports **single-composite terrestrial QA eligibility**, but its latitude lies outside the report's nominal MERRA-2 cell. |

The **fifth, optional Liberia reference** returned NASA **HTTP 504 Gateway Timeout** even after retry. This made the first workflow's terminal status `failure`, **despite the successful four actual-source Caribbean site observations**. Their original NASA data and `site_prescreen.json` were still uploaded as a workflow artifact. Since Liberia already has a separate 69-record validated land QA archive in [EXP-003B](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740917213), the follow-up workflow intentionally **reuses that prior independent reference** rather than re-querying Liberia and making coastal science depend on a redundant 504-sensitive request.

**The observed 9/9 result is not 95% historic land cover, confirmed evergreen forest, 20 valid years, a measured environmental trend, or NASA POWER climate-series identity.** Every sample remains a predeclared candidate until independently verified.
