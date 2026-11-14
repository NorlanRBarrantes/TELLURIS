# Research references and verified corrections

**Last reviewed:** 2026-11-14. This is a curated scientific and implementation reference for TELLURIS, not a dump of generated research text.

## Challenge scope

NASA Space Apps 2026 — Be An Earth System Trend Detective!  
https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

The published challenge calls for choosing NASA variables, obtaining regional data, visualizing a long-enough historical time series, estimating the rate of change and testing significance. It notes that detecting linear trends is a valid starting point; sophisticated climate analyses are beyond its required minimum.

For the complete curated list of resources supplied in the challenge's **Resources** tab, see [Official challenge resource catalog](NASA-CHALLENGE-RESOURCES.md). The items there are references, not implemented integrations.

## NASA POWER documentation

- Monthly API and parameter limit: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- API services and spatial resolution: https://power.larc.nasa.gov/docs/services/
- Hydrology units and methods: https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/
- POWER methodology: https://power.larc.nasa.gov/docs/methodology/

**Corrections to the team-supplied research brief:**

1. Monthly point requests permit up to **20** parameters in one submission; the brief's '10 maximum' should not be repeated.
2. POWER meteorological parameters use a coarse spatial source grid (approximately 0.5° × 0.625°). Arbitrarily precise coordinates do not imply equally precise meteorological measurements.
3. Aggregated precipitation typically has units of **mm/day**. Check actual response metadata and convert to annual totals with calendar-aware day weighting when needed.
4. Historical MERRA-2 meteorology begins in 1981. Do not claim this source can establish a 1944 observation.

## Statistics

- Hussain, M. et al. (2019), *pyMannKendall: a python package for non parametric Mann Kendall family of trend tests,* Journal of Open Source Software, 4(39), 1556. https://doi.org/10.21105/joss.01556
- Package source and method definitions: https://github.com/mmhs013/pyMannKendall

The package contains original/seasonal tests, serial-dependence modifications, and Sen slope estimators. Their assumptions and slope time units differ. The package may be used as a **development-time validation reference**, not assumed to be installed on shared production hosting.

## Costa Rican climate context

- Hidalgo, H. G., Durán-Quesada, A. M., Amador, J. A., & Alfaro, E. J. (2015), *The Caribbean Low-Level Jet, the Inter-Tropical Convergence Zone and the precipitation patterns in the Intra-Americas Sea: A proposed dynamical mechanism.* https://doi.org/10.1111/geoa.12085
- Article abstract hosted by the Inter-American Institute for Global Change Research: https://www.iai.int/es/article/detail/the-caribbean-low-level-jet-the-inter-tropical-convergence-zona-and-the-precipitation-patterns-in-the-intra-americas-seaa-proposed-dynamical-mechanism

The article motivates comparing climate regimes but is **not evidence of a significant opposite long-term trend in TELLURIS**.

## Judging claims and event caution

A **2025** San José local event page listed weights of 30% impact, 20% creativity, 20% feasibility, 20% prototype/MVP, and 10% presentation: https://www.spaceappschallenge.org/2025/local-events/san-jose/?tab=details

These numbers cannot be presented as confirmed **2026 global** evaluation weights. The 2026 Space Apps materials describe five core criteria: impact, creativity, validity, relevance, and presentation. Follow the official 2026 local and global rules and submission portal.

The research brief's named individual judge affiliations, claim that most competing teams fail, historical coefficients and alleged exact climate outcomes have **not** been independently verified for this project. They are omitted from the public product narrative.

## Follow-up AI report audit — 2026-11-14

A second team-supplied Gemini-assisted technical report recommended a browser-based statistical engine, NASA POWER/IMERG comparisons, an ENSO lens, Hamed–Rao/seasonal MK/Pettitt tests, and an ESP32 display. The verified methodological and NASA-source context has been selectively promoted to [Scientific guardrails](SCIENTIFIC-GUARDRAILS.md); unsupported measured outcomes and speed guarantees have **not** been adopted.

- The NASA challenge explicitly regards **basic linear trend analysis as a valid start**; sophisticated corrections are optional, subject to scientific assumptions: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/
- POWER MERRA-2 meteorology and monthly API scope: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- GPM IMERG V07B records including TRMM-era January 1998: https://gpm.nasa.gov/data/directory
- pyMannKendall methods and their seasonality/serial-correlation assumptions: https://github.com/mmhs013/pyMannKendall
- NOAA ONI moving historical baselines: https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/ONI_change.shtml


## Team-supplied EXP-001 Gemini script review — 2026-11-14

The submitted report included proposed NASA POWER monthly URLs, a Python script and a GPM IMERG V07 monthly collection description. It clearly acknowledged inability to download source JSON and compute actual trends. We retained the NASA source references and adapted the script into [EXP-001](EXPERIMENT-001.md), requiring real metadata, independent per-variable completeness, transparent statistical limitations and tests. The **monthly GPM IMERG precipitation field is in mm/hr**, which must not be confused with POWER's PRECTOTCORR mm/day (verify within actual collection metadata). GPM reference: https://doi.org/10.5067/GPM/IMERG/3B-MONTH/07

## Scope of the external research review

A long team-supplied exploratory report suggested a paired Costa Rican investigation, pyMannKendall extensions, and an ESP32 LCD console. Only scientifically supported context and appropriately scoped proposals have been retained in public documentation. No original text, numeric results or device implementation are represented as completed TELLURIS work.

**Current result status:** Design/research only. NASA API execution and statistical validation remain pending.
