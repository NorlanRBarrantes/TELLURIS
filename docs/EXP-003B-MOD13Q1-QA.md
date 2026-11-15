# EXP-003B — Terra orbit drift, detailed MODIS QA and seasonal sampling

**Date:** 2026-11-15 (Costa Rica)  
**Sources:** Project Uriel team's forwarded Gemini audit (source preserved in user-supplied project conversation), NASA MOD13Q1/LP DAAC documentation, live ORNL NASA original data archived from [EXP-003 run #43738048688](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43738048688).  
**Status:** EXPERIMENTAL METHODOLOGY QA IMPLEMENTED AND TESTED; NO VALIDATED NDVI/EVI CLIMATE TREND.

## What this audit actually evaluates

Source observations are 16-day MODIS Terra \`MOD13Q1\` 250 m land pixels, queried as **a single 1×1 source cell** at Liberia (10.63 N, -85.44 W) and Limón (9.99 N, -83.03 W), for the complete requested years 2023–2025. They are not whole-city or national landcover values. NASA ORNL DAAC delivered **69** 16-day composite records for each sample, including NDVI, EVI, summary reliability, detailed VI Quality and solar zenith angle. The original response batches are retained in the earlier workflow artifact.

### Original summary QA (already executed)

| Variable count | Liberia | Limón |
| --- | ---: | ---: |
| Original composites | 69 | 69 |
| Reliability 0 — good | 24 | 16 |
| Reliability 1 — marginal | 27 | 10 |
| Reliability 3 — cloudy | 18 | 41 |
| Reliability -1 — missing | 0 | 2 |
| Baseline eligible annual NDVI/EVI medians, 12 valid and >=2 per quarter | **3/3 years** | **0/3 years** |

Those numbers arise from real NASA source records; the original QA masks reliability 0/1 but cannot alone establish science-grade seasonal representativeness.

### Detailed experimental QA (executed)

[EXP-003B GitHub Actions](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43740806990) downloaded the **same** original MODIS archive; it did not regenerate or replace observations. Twelve deterministic tests passed and source-specific QA comparison ran to completion.

| Quality screening | Liberia | Limón |
| --- | ---: | ---: |
| Composites accepted by summary 0/1 | **51/69** | **26/69** |
| Accepted by proposed strict flag mask | **44/69** | **0/69** |
| Eligible years with strict mask and 12 valid, 2 each quarter | **2/3** | **0/3** |
| Eligible years with strict mask and 8 valid, 3 quarters | **3/3** | **0/3** |

**Critical geographic finding:** All 69 Limón source composite observations were rejected by the rule \`land_water != 1\` (*not unambiguous land*) even though many otherwise passed summary QA. This is **not** proof that MODIS cannot observe Limón: we chose a point near the Caribbean coastline and must determine the actual pixel land/water QA class and geographic suitability. An additional audit report records the NASA class distribution explicitly. The strict all-land-only rule is our **candidate methodology**, not a NASA mandate for all applications; class 2 (coastline) may contain vegetated land and requires a clear policy rather than being silently treated as a missing measurement.

**Rejection counts overlap**; cloud, shadow, aerosol and coast can all be flagged for the same composite. They must not be added as if they were mutually exclusive.

### NASA MOD13Q1 QA bit decoder implemented

Python module: [analysis/audit_mod13q1_methodology.py](../analysis/audit_mod13q1_methodology.py). Tests: [tests/test_exp003_audit.py](../tests/test_exp003_audit.py).

- Bits 0–1: MODLAND VI quality (0 good, 1 produced but check QA, 2 likely cloudy, 3 missing).
- Bits 2–5: VI Usefulness — decoded but **not used as a universal cutoff**; known bit assignment inconsistencies require product/version awareness.
- Bits 6–7: aerosol, with 3 high.
- Bit 8: adjacent cloud; bit 10: mixed cloud.
- Bits 11–13: land/water source-pixel class. The experimental mask currently requires **1 = unambiguously land**; this is particularly restrictive at coasts.
- Bit 14: possible snow/ice; bit 15: possible shadow.
- Bit 9: atmosphere BRDF correction indicator, recorded, **not** proof that solar geometry has been normalized away.

Accepting \`pixel_reliability == 0\` does **not bypass** the detailed flag checks. A source with missing/invalid detail or quality contradictory to summary is excluded by the strict test. Source NDVI/EVI stored valid range is **inclusive [-2000,10000]**, scale \`0.0001\`, missing \`-3000\`.

### Orbital drift and seasonality: verification gates

NASA MODIS Land Team states that Terra's last orbit-maintenance maneuver maintaining its 10:30 a.m. local time was **February 27, 2020**, followed by orbit drift and the 2022 constellation exit to a lower ~694 km altitude; view/solar geometry and spatial sampling can change. Neither an NDVI increase nor an EVI decrease follows necessarily from this: effects depend on canopy and view conditions. **No independent drift correction has been scientifically justified** in our three-year pilot.

The audit extracts original \`250m_16_days_sun_zenith_angle\` with native factor \`0.01\` degrees and reports descriptive annual SZA medians for strictly eligible composite samples. It does **not** subtract an arbitrary SZA regression coefficient from VI time series. Such a regression risks conflating seasonal phenology, time and solar geometry.

The audit also contrasts:
1. Original summary QA with >=12 eligible composites/year and >=2 per calendar quarter.
2. Detailed strict QA with **the same** >=12/2 threshold.
3. Detailed strict QA with an **experimental** >=8/year and observations in >=3 quarters.
4. A **cycle-of-year anomaly diagnostic** based on matching 16-day composite slots and a proposed minimum **five distinct baseline years per slot**.

**A 2023–2025 archive contains only three years and cannot establish a five-year slot climatology**. No annual anomaly or trend is asserted from this experimental comparison. The 8/3 rule is **not scientifically proven to eliminate phenological sampling bias**; it must be evaluated against missingness patterns and independent products.

### What we did NOT adopt from Gemini

- No categorical claim that the original 12/2 rule is "incorrect" for all climates; it is a screening decision with quantifiable selection effects.
- No universal claim that NDVI becomes artificially positive and EVI artificially negative after 2020.
- No automatic Hamed–Rao significance test: correcting serial dependence demands validated hypotheses, enough years and suitable tests.
- No automatic \`VI = VI - b(SZA - median SZA)\` adjustment. Phenology, site, season and orbital geometry are confounded in a naive regression.
- No unexecuted claim of cross-sensor Terra/Aqua/VIIRS agreement: the supplied Gemini script describes the test but does not actually retrieve those independent products.
- No false claim that an anomaly by 16-day cycle removes *all* cloud-driven MNAR bias. It can reduce systematic seasonal aliasing, but missingness may remain informative.
- No final time-series significance, long-term trend, causal attribution or new publicly connected NASA variable from a 3-year QA pilot.

### Next scientific gate

**Validate the actual Limón land/water QA codes and choose an inland, land-verified Caribbean point or explicitly create a well-defined vegetated coastal region/polygon.** Keep the original Limón sample for provenance and avoid retrospectively moving an analysis to obtain a desired trend.

Then fetch enough MODIS calendar years to build a stable cycle climatology (ideally 2000–2025 for Terra with explicit before/after-drift sensitivity) and compare against Aqua MODIS for overlapping years using validated QA and spatial support. Evaluate all year-coverage thresholds **before** deciding whether a trend is statistically significant.

### Primary references

- NASA [MODIS Land Team orbital drift](https://modis-land.gsfc.nasa.gov/news.html).
- NASA [MOD13Q1 V6.1 product](https://doi.org/10.5067/MODIS/MOD13Q1.061).
- NASA [MOD13 vegetation index product suite](https://modis-land.gsfc.nasa.gov/vi.html).
- NASA [MOD13 Collection 6.1 User Guide](https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf).
- NASA [MOD13Q1 filespec / DetailedQA bit definitions](https://ladsweb.modaps.eosdis.nasa.gov/filespec/MODIS/6/MOD13Q1).
- NASA [MODIS Land QA and orbit drift known issue](https://landweb.modaps.eosdis.nasa.gov/displayissue?id=1254).
