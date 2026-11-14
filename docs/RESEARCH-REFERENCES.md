# Research references and verified corrections

**Last reviewed:** 2026-11-14. This is a curated scientific and implementation reference for TELLURIS, not a dump of generated research text.

## Challenge scope

NASA Space Apps 2026 — Be An Earth System Trend Detective!  
https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

The published challenge calls for choosing NASA variables, obtaining regional data, visualizing a long-enough historical time series, estimating the rate of change and testing significance. It notes that detecting linear trends is a valid starting point; sophisticated climate analyses are beyond its required minimum.

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

## Scope of the external research review

A long team-supplied exploratory report suggested a paired Costa Rican investigation, pyMannKendall extensions, and an ESP32 LCD console. Only scientifically supported context and appropriately scoped proposals have been retained in public documentation. No original text, numeric results or device implementation are represented as completed TELLURIS work.

**Current result status:** Design/research only. NASA API execution and statistical validation remain pending.
