# EXP-003D — NASA MCD12Q1 land-cover verification of MODIS sites

**Date:** 2026-11-15 (Costa Rica).  
**Method:** **one** annual 2023 NASA MODIS MCD12Q1 \`LC_Type1\` IGBP 500 m cell at each **predeclared** coordinate; a distinct source from the MOD13Q1 250 m 16-day VI QA.  
**Execution status:** COMPLETE, NASA data source success. Source original JSON retained.  
**Evidence:** [GitHub Actions #43743662878](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43743662878) — **8/8 deterministic tests passed**, original NASA source calls returned landcover classes.

## 2023 per-coordinate NASA classification

| Predeclared site | Lat, lon | Source IGBP LC_Type1 (2023) | MOD13Q1 central 3×3 QA check (one 16-day composite) |
| --- | --- | --- | --- |
| Original Limón | (9.9900, -83.0300) | **13 — Urban/built-up** | 0/9 unambiguous land, 0/9 strict-quality VI |
| Candidate A — Río Banano/Fila Matama | (9.8850, -83.1350) | **2 — Evergreen broadleaf forest** | 9/9 unambiguous land, 9/9 strict-quality VI |
| Candidate B — Beverley/Matina | (9.9650, -83.1150) | **8 — Woody savannas** | 9/9 unambiguous land, 9/9 strict-quality VI |
| Candidate C — Hitoy Cerere | (9.6710, -83.0240) | **2 — Evergreen broadleaf forest** | 9/9 unambiguous land, 9/9 strict-quality VI |

**Important scientific interpretation:** The *same coordinate* can be classified as a shoreline in a MOD13Q1 **250 m** source cell, and urban/built-up in the MCD12Q1 **500 m** land-cover cell, without this constituting a provider contradiction. The two datasets use different spatial supports and algorithms. Do not state that the 500 m urban label is ground-survey truth for all nearby pixels.

### Decision following the prescreen (without examining slopes)

**Priority 1 for a separate longer vegetation pilot: candidate A, (9.8850, -83.1350)**, labeled Río Banano/Fila Matama **provisionally**. It satisfied the fixed one-date 3×3 land/quality thresholds, is classified as evergreen broadleaf forest in one 2023 MCD12Q1 500 m cell, and lies inside the *nominal* MERRA-2 grid box near the original Limón location. This selection is based on **predeclared geographic/source quality criteria**, not NDVI/EVI magnitude or direction.

**Secondary choices:** Candidate C also has class 2 and 9/9 MOD13Q1 cells, but its latitude 9.671 lies **outside** the nominal 9.75–10.25 N MERRA cell asserted in the Gemini draft, so it belongs to an independently sourced climate comparison. Candidate B has IGBP class 8 in 2023; it could support a separate wooded-savanna/land-use investigation but is not identical to a mature evergreen-forest reference.

### What NASA has NOT established yet

- No official confirmation of the draft's place-name association, SINAC protected reserve boundaries, high-quality topographic elevation or individual local land-cover history.
- No evidence that 2023 class 2 remained unchanged from 2001 to 2024/2025. Annual landcover stabilization, classification uncertainty and collection lineage need evaluation.
- No evidence that the 2023 1-date QA sample reflects the quality and seasonal coverage of the **full 2000–2025 MOD13Q1 series**. A time series, QA and tests for orbital drift still need to be acquired.
- No evidence that the per-coordinate NASA POWER API will return *identical* T2M/PRECTOTCORR values at the new point even when it is in a nominal MERRA-2 grid box. Compare API headers/actual 2023 samples.
- No statistically validated NDVI/EVI trend, no causal effect of precipitation and no satellite mission connection in the **public Explorer**. This is a spatial suitability test, not the final environmental investigation.

### Reproducible methods

- [EXP-003C](EXP-003C-SPATIAL-PRESCREEN.md): 9 Python tests and original MOD13Q1 \`A2023001\` quality data for four Caribbean points, 9×9 source and center 3×3 pixel QA.
- [EXP-003D land-cover script](../analysis/exp003d_igbp_screen.py): calls the official NASA ORNL \`/MCD12Q1/subset\` with \`band=LC_Type1\`, \`startDate=A2023001\`, \`endDate=A2023001\`, radius zero, and validates exactly one original class.
- [Eight IGBP regression tests](../tests/test_exp003d_igbp_screen.py): ensure class 2 is not mistaken for proof of **stable** forest, and class 8, 12, 13, 14, 17 and fill 255 have distinct interpretations.
- [Source archive](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43743662878): original HTTP JSON and checksum per site in workflow artifact \`exp003d-original-modis-igbp-landcover\`.

### Official definitions

- [MCD12Q1 Collection 6.1 land-cover guide](https://lpdaac.usgs.gov/documents/1409/MCD12_User_Guide_V61.pdf) — 500 m, annual IGBP land-cover classes.
- [NASA ORNL TESViS global subsets REST API](https://modis.ornl.gov/data/modis_webservice.html) — site-specific source retrieval and parameters.
- [MOD13Q1 C6.1 VI Quality guide](https://lpdaac.usgs.gov/documents/621/MOD13_User_Guide_V61.pdf) — 16-day 250 m vegetation QA and land-water bit definitions.

**Next:** pre-register candidate A as *vegetation pilot* and retrieve 2000–2025 original MOD13Q1 NDVI/EVI + DetailedQA + Sun Zenith data. Evaluate sample completeness and Terra orbital drift; confirm independent land-use history and NASA POWER source footprint. A long series is not a guarantee that Mann–Kendall significance assumptions hold.
