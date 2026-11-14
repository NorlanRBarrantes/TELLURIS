# Costa Rica: Pacific–Caribbean climate contrast

**Status:** Proposed research case, **not** a measured finding or completed implementation.

## Motivation

The NASA 2026 challenge notes that an Earth-system variable can show different tendencies across locations, even when related climate processes affect both. Costa Rica is an educationally useful test bed because its Pacific and Caribbean sides have contrasting seasonal rainfall regimes and complex interactions involving the Caribbean Low-Level Jet (CLLJ), ITCZ and ENSO.

Hidalgo, Durán-Quesada, Amador & Alfaro (2015) discuss connections between the CLLJ, the position of the tropical precipitation belt and Central American rainfall. That literature provides a **scientific motivation**, not a numerical trend result for TELLURIS.

## Primary investigation questions

1. What are the observed/reanalysis-based temperature and precipitation time series at two explicitly identified NASA POWER point samples (initial location labels: Liberia and Limón)?
2. Are the estimated multi-year trends statistically distinguishable from random variation under a justified test?
3. What is the magnitude, direction and uncertainty of each estimated trend?
4. Does any perceived contrast persist when applying the same period, data completeness rules and method to both points?

**Do not presuppose an opposite-sign or significant long-term trend.** ENSO-associated short-term or seasonal opposite rainfall anomalies are not equivalent to multi-decadal trends.

## Scope and geographic precision

Initial candidate cities are labels to help users find the points, **not** claims that POWER measures those cities with station-level precision. Define and disclose exact selected latitude/longitude, provider grid characteristics and distinct effective samples after the first real API responses. A point sampling comparison does not quantify the full Pacific or Caribbean watershed. Regional conclusions require a separately specified spatial aggregation and assessment of representativeness.

## Proposed first study protocol

- Provider: NASA POWER historical monthly point API; candidate parameters T2M and PRECTOTCORR.
- Span: select a shared, **complete** multi-decade period from the provider (for example, 1985–2025, subject to actual completeness).
- Transform: validate units; build day-weighted annual temperature means and annual precipitation totals from valid monthly precipitation rates where metadata calls for it.
- Quality controls: inspect missing values, sentinel codes, month alignment, leap years, response metadata, and duplicate grid samples.
- Statistics: calculate effect size per decade and an independently tested Mann–Kendall or other justified baseline; diagnose serial dependence; add seasonal procedures only when supported.
- Presentation: plot the separate time series and distinguish actual multi-decade trends from descriptive seasonal differences.
- Evidence: report for each point dataset, coordinates, time period, valid sample count, slope, uncertainty, test, p-value, caveats and reproducible retrieval.
- Comparison: report slopes descriptively at first; a difference of significance statuses or point estimates does **not** itself prove the slopes differ statistically.

## Falsifiable outcomes

The paired analysis may find different signs, the same sign, uncertain patterns, or differences too small to interpret reliably. Any of those outcomes are valid if the evidence supports them. Do not select locations or time spans after inspecting results solely to manufacture statistical significance.

## Limitations

- POWER meteorology uses modeled/reanalysis gridded data, not direct local rain-gauge readings.
- Complex terrain can vary within a coarse grid cell; interpret location labels with caution.
- ENSO and seasonal changes must not be called causal explanations of a long-term trend without a separate attribution study.
- A result calculated from annual data does not automatically establish a statistically robust seasonal trend (and vice versa).

## Scientific basis

- NASA challenge: https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/
- NASA POWER monthly API: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- NASA POWER data resolution: https://power.larc.nasa.gov/docs/services/
- Hidalgo, H. G., Durán-Quesada, A. M., Amador, J. A., & Alfaro, E. J. (2015). *The Caribbean Low-Level Jet, the Inter-Tropical Convergence Zone and the precipitation patterns in the Intra-Americas Sea: A proposed dynamical mechanism.* Geografiska Annaler: Series A, Physical Geography. https://doi.org/10.1111/geoa.12085

No results should be added here until a verified computation is linked from docs/VALIDATION.md.
