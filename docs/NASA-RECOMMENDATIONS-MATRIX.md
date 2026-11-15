# NASA challenge requirements and recommendations — full traceability

**Challenge:** https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/  
**Scope decision:** [SCOPE-2026.md](SCOPE-2026.md).  
**Date:** 2026-11-14, Costa Rica.  
**Rule:** *Every recommendation and consideration in the supplied official challenge description is captured here*, not all are mandatory and none is silently discarded. "Planned" and "research" are **not implemented**.

| ID | NASA brief requirement/recommendation | Obligation | TELLURIS outcome | Status / evidence |
| --- | --- | --- | --- | --- |
| NASA-01 | Find variables from missions and/or Earth-system models | Required | Source-aware domain catalog of NASA variables | Two POWER variables live; more cataloged |
| NASA-02 | Acquire the variable for a selected geographic location/region | Required | NASA POWER API and source footprint; mission-specific adapters later | Implemented for POWER point |
| NASA-03 | Generate/visualize a long-enough time series | Required | Annual graph from monthly data, selectable dates, missingness checks | Implemented for EXP-001 |
| NASA-04 | Quantify direction and rate of change over time | Required | Theil–Sen trend and units/decade, optional OLS baseline | Exploratory engine implemented |
| NASA-05 | Assess statistical significance with a justified test (t, MK or CI) | Required | Validated inference when assumptions allow; otherwise "not established" | **Gap: original MK p remains exploratory** |
| NASA-06 | Land, atmosphere, oceans, and levels aloft | Context/examples | Discoverable atmosphere/vegetation/water/ocean families, and future atmospheric profiles | Catalog design; specialized adapters research |
| NASA-07 | Examples MODIS, OMI, AIRS, GPM | Mentioned instruments/models | Concrete variable/product candidates for each | MODIS/GPM cataloged; OMI/AIRS research |
| NASA-08 | Examples MERRA-2 and GLDAS | Mentioned models | POWER MERRA-2 plus planned GLDAS hydrology adapter | MERRA-2 acquired; GLDAS research |
| NASA-09 | Variables beyond air temperature/rain: evaporation, river flow | Scientific examples | GLDAS evap/runoff, SWOT reach discharge, MODIS evapotranspiration | Cataloged; no streamflow adapter yet |
| NASA-10 | Different regions may show opposite trends under one process | Scientific possibility | Paired comparison as falsifiable experiment, never predetermined | EXP-002 proposed |
| NASA-11 | Audience: high-school, university, interested public | Optional recommendation | Educational and technical explanation modes; bilingual site | Translation implemented in GitHub; content design pending |
| NASA-12 | Simple definitions of each selected variable | Optional recommendation | Variable encyclopedia: what, units, source, temporal/spatial scope, limits | Catalog documented; UI explanations planned |
| NASA-13 | Guided short questions about what/where | Optional recommendation | Question-first "detective" wizard, leading directly to a plotted analysis | Planned P0/P1, intro question draft exists |
| NASA-14 | Couple of working demonstration examples | Optional recommendation | Liberia, Limón, plus contrasted global/river/vegetation sample | Liberia/Limón real input; richer guided examples pending |
| NASA-15 | AI for discovering promising variables from region, news, papers | Optional recommendation | AI-assisted variable discovery constrained to source/version/citations, with deterministic science engine | Research P2, no fabricated suggestions |
| NASA-16 | Daily/monthly data easier than high-frequency inputs | Practical advice | Monthly-first adapter; daily where justified and feasible | Monthly POWER implemented |
| NASA-17 | An interesting trend may be statistically non-significant | Scientific guidance | Display effect size and "insufficient evidence" without hiding it | Caution in current UI; refine explanation |
| NASA-18 | Longer records may change statistical power | Scientific guidance | Clear time-span selector and n support, never cherry-pick significance | Years selector implemented; warnings to expand |
| NASA-19 | Seasonal cycles can mask trends; remove/adjust carefully | Optional advanced science | Annual vs JJA, monthly climatology, season-aware diagnostics | EXP-002 proposed; not executed |
| NASA-20 | Nonlinear trends sometimes exist | Optional advanced science | Period sensitivity/quality flags; explore change-points after baseline | Research; not a requirement to deliver advanced modeling |
| NASA-21 | Basic linear trends are a great starting point | Explicit pragmatic guidance | Robust linear Sen plus interpretable linear baseline, with validated inference | Sen implemented; inferential gate pending |
| NASA-22 | CUAHSI public hydrology visualization tools | Optional recommendation | Evaluate [HydroClient](https://data.cuahsi.org/) and [Data Series Viewer](https://apps.hydroshare.org/apps/timeseries-viewer/) for actual river-gauge comparisons | Sources documented; not integrated |
| NASA-23 | Resources tab links may expand; use cited resources | Optional recommendation | Preserve **all** 13 challenge-listed items with role, citations, source status, and access/licensing checks | [NASA-CHALLENGE-RESOURCES.md](NASA-CHALLENGE-RESOURCES.md); complete index |
| NASA-24 | Interconnected changes and physical-process context | Scientific motivation | Hypothesis and physical-driver discussion distinct from statistical inference | Case-study notes only; no causal attribution |
| NASA-25 | Educational science communication of geographic and statistical results | Implied user need | Reproducible bilingual evidence report with definitions, provenance, evidence, caveats | Partially shown, dynamic report planned |

## NASA Resources tab — every link preserved (13 items)

Resource names below are recorded for research and traceability. They are **not automatically mandatory integrations**. Review source data licenses, credentials and maturity per source:

1. [NASA Giovanni](https://giovanni.gsfc.nasa.gov/) — explore fields, maps and time series; source comparison.
2. [GES DISC Hydrology Time Series](https://disc.gsfc.nasa.gov/information/tools?title=Hydrology%20Time%20Series) — investigate hydrology/GLDAS and export.
3. [NASA AppEEARS](https://appeears.earthdatacloud.nasa.gov/) — extract remote-sensing time series/QA for MODIS/VIIRS.
4. [NASA SeaWiFS coastal chlorophyll statistical analysis paper](https://ntrs.nasa.gov/api/citations/20090042747/downloads/20090042747.pdf) — investigate ocean-trend methodology.
5. [NOAA Climate Data Online](https://www.ncei.noaa.gov/cdo-web/) — station comparisons and climate validation.
6. [KNMI Climate Explorer](https://climexp.knmi.nl/) — independent climate-series/statistical exploration.
7. [Introductory time-series statistics article](https://medium.com/@snp.kriss/statistical-test-methods-to-detect-trends-in-time-series-data-b361a0ec530b) — education, confirm techniques in primary literature.
8. [Introductory statistical significance guide](https://www.statsig.com/perspectives/a-comprehensive-guide-to-statistical-significance) — education, not method authority.
9. [CSA RADARSAT data](https://donnees-data.asc-csa.gc.ca/en/dataset/rcm) — partner agency remote sensing; access restrictions may apply.
10. [GEO.ca](https://geo.ca/) — Canadian geospatial context and data.
11. [CSA SWOT mission](https://www.asc-csa.gc.ca/eng/satellites/swot/) — river/lake surface-water mission context, supplement NASA PO.DAAC.
12. [CSA ecosystem monitoring](https://www.asc-csa.gc.ca/eng/satellites/everyday-lives/monitoring-and-protecting-our-ecosystems-from-space.asp) — land/ecosystem use cases.
13. [CSA SAR tutorial](https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial) — Python workflows for radar; research only.

**External recommendation not in this 13-link list:** [CUAHSI HydroClient](https://data.cuahsi.org/) is mentioned in the challenge's Potential Considerations and explicitly tracked as NASA-22.

## Validation guardrails

- A source being recommended does not establish that a specific dataset is downloadable or its scientific assumptions are met.
- "Caudal de río" must not be mislabeled GLDAS runoff; use true gauges as reference or explicitly labeled SWOT estimated discharge.
- Report variable temporal availability, sample resolution, units, data type (measured, modeled, estimated), study geography and provenance independently.
- For river discharge/short satellite records, report when statistically meaningful long-term trend inference is unsupported.
- For AI, articles and optional method choices, never make results obligatory or pretend the literature precomputed our exact point/time series.

**Next action:** Convert the data catalog into an expandable UI wizard; implement additional POWER parameters with unit-aware normalizers; integrate a second mission with verified extraction. See [SCOPE-2026.md](SCOPE-2026.md).
