# TELLURIS — formal 2026 scope and scientific product contract

**Decision date:** November 14, 2026 (Costa Rica).  
**Status:** ACCEPTED product direction; individual capabilities carry their own verified/planned status.  
**Team:** Project Uriel. **Challenge:** NASA Space Apps 2026, *Be An Earth System Trend Detective!*  
**Official brief:** https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/

## Product definition

TELLURIS is a **guided, global, multi-variable, multi-source Earth-system trend investigation tool**. It helps a learner choose an Earth-science variable, define a meaningful geographic support and period, retrieve NASA mission or Earth-model time series, visualize change, quantify a trend, assess statistical evidence and report methodological limitations in plain language and in a reproducible evidence record.

**The problem is not to demonstrate a predetermined climate dipole or to prove an assumed cause.** Liberia–Limón is the team's first reproducible case study, not the platform's scientific boundary. Contrasting places, international examples, seasons and multiple missions become tools to *test hypotheses*, including failed and inconclusive cases.

## Authoritative challenge contract

NASA explicitly requires:
1. Select meaningful Earth-science variables observed by missions or produced by models.
2. Acquire the relevant measurements/model fields for a geographic area.
3. Generate and visualize sufficiently long time series.
4. Estimate the rate of change and test whether the trend is statistically significant.

NASA additionally suggests—but does not make mandatory—clear variable definitions; high-school/university/public audience; guided question-driven discovery; demonstrative examples; optional AI suggestions grounded in regions/news/research; daily or monthly data; exploring seasonality and complex trends without requiring complex modeling; retaining interesting non-significant findings; optional hydrology visualizations from CUAHSI; and exploring the Resources tab. **Every suggestion is explicitly tracked** in [NASA-RECOMMENDATIONS-MATRIX.md](NASA-RECOMMENDATIONS-MATRIX.md), with no untracked dismissal.

## Scientific capability families

- Atmosphere: near-surface temperature, humidity, wind, radiation, pressure, ozone/NO2 or vertical profiles.
- Land/vegetation: NDVI/EVI, land-surface temperature, albedo, productivity, burned area.
- Water cycle: precipitation, evapotranspiration, surface/subsurface runoff, soil moisture, terrestrial water storage.
- Inland waters: **SWOT river reach water level/width/slope and estimated discharge (m³/s)**. GLDAS runoff is NOT measured river discharge.
- Ocean: sea-surface temperature and sea-level anomalies.

Each family will be presented as a **discoverable catalog**, including entries not yet connected; a disabled/coming-soon variable must never appear executable. See [VARIABLE-CATALOG.md](VARIABLE-CATALOG.md).

## Implementation stages — not all features must be finished simultaneously

### P0: challenge-complete, scientifically honest application
- Working, accessible, Spanish-first ES/EN investigation journey: **question → variable with simple definition → location/footprint → time window → retrieved source → plot → trend/rate + units → significance interpretation + uncertainty/assumption disclosure → reproducible evidence/export**.
- At least two meaningful selectable, real NASA variables (T2M and PRECTOTCORR already work). Add further **POWER** variables through one verified, metadata-driven source adapter rather than inventing availability.
- Complete, scientifically appropriate significance decision process. When the method's assumptions fail or cannot be established, state **"insufficient evidence for validated significance"** instead of interpreting an exploratory p-value as final.
- Visible variable-specific units, temporal rules, missingness, grid resolution/measurement support, NASA provider/version, data time span and source link.
- At least two inspectable NASA-backed example investigations (one may show a non-significant or contradictory outcome). Do not present synthetic values as observations.
- Public deploy and end-user browser verification; keep all scientific computations inspectable and tests reproducible.

### P1: breadth and mission demonstration
- Expand the verified **POWER** variable list, prioritized RH2M, WS10M, ALLSKY_SFC_SW_DWN; candidates such as QV2M, EVPTRNS and GWETROOT depend on API/community/coverage checks.
- Add a **second distinct NASA source** with a working adapter and quality handling: choose between GLDAS runoff/soil moisture, MODIS NDVI through AppEEARS, IMERG precipitation, or another source based on real access feasibility. River discharge via SWOT is a strong *hydrology showcase* but its short record changes the scientific inference.
- Two-location comparison, paired differences on common years, JJA and other seasonal breakdowns; separate seasonality from trend.
- Guided learner-facing definitions; research-question presets; significance caveat explained without jargon; catalog filtering by atmosphere/land/water/ocean.
- One international investigation after source verification, not chosen to guarantee a desired slope sign.

### P2: research extensions rather than submission blockers
- Additional satellite missions (AIRS, OMI, GRACE-FO, SWOT, marine altimetry), area/polygon aggregation, complex nonlinear methods, optional AI literature-guided variable suggestions, interactive 3D globe, optional hardware.
- Where P2 features are not delivered before the competition deadline, record them as **tracked future research**, not as implemented features.

## Quality rules

- Metadata-validated variable-specific processing. Temperature means, precipitation/evaporation rates and energy-flux data require **different unit-aware aggregation**.
- A small grid-cell or single SWOT reach must not be described as a whole city/country/basin. SWOT estimated discharge is not direct measurement at a fixed terrestrial stream gauge; its 2022-present record does not create a multidecadal series.
- Contrast a second dataset at matched temporal/spatial support; product agreement does not prove causal attribution, and source divergence does not automatically identify an artifact.
- Non-significance is a valid finding, **not** proof of no change. Low p-values do not establish a common physical driver. Avoid selection bias and multiple-testing overclaim when scanning variables/locations.
- A dataset's appearance in the NASA challenge Resources tab means it warrants evaluation, not that it is a mandatory backend integration or automatically licensed for bulk redistribution.
- Never insert source-filling shortcuts (for example \`value > -900\`) or use Hamed–Rao based solely on a single lag-1 cutoff; evaluate the actual test assumptions and reference implementation first.

## Status as of this decision

**Implemented and verified:** NASA POWER MERRA2 monthly JSON retrieval for Liberia and Limón (1985–2025), annual T2M/PRECTOTCORR aggregation, exploratory Theil–Sen and original MK, browser graphs/export, Python and JavaScript synthetic QA, Spanish-first source code. User screenshots additionally indicate live Explorer pages and NASA source-mode data work at their deployed site.

**Incomplete:** Fully validated statistical inference, source-aware guided variable discovery, breadth beyond the original two connected variables, multi-mission connectors and user-verifiable dynamic research report. The language update requires hosting refresh verification after GitHub commits.

**Priority:** Close mandatory challenge gaps before implementing every suggested satellite mission. NASA's own challenge states that basic linear trends are an excellent starting point; the research extensions are intentionally retained rather than discarded.

**Decision references:** [NASA recommendation traceability](NASA-RECOMMENDATIONS-MATRIX.md), [scientific source catalog](VARIABLE-CATALOG.md), [EXP-002 research protocol](BENCHMARK-PLAN.md), [NASA resource index](NASA-CHALLENGE-RESOURCES.md), [statistical methodology](SCIENTIFIC-METHODOLOGY.md).
