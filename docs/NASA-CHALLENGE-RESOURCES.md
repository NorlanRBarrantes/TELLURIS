# Official 2026 NASA Space Apps challenge resource catalog

**Challenge:** [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)  
**Compiled:** 2026-11-14 from the team's copy of the official *Resources* tab; selected landing pages cross-checked.  
**Status:** Reference catalog, **not** an integration list or a claim that the contents of linked studies were individually reviewed.

## Purpose and selection criteria

The challenge calls for **(1)** selecting Earth science variables, **(2)** acquiring geographically relevant historical data, **(3)** visualizing a time series, and **(4)** quantifying change and testing its significance. NASA explicitly allows a basic linear-trend analysis and suggests daily/monthly time steps as a practical starting point. The goal of this catalog is to retain relevant source links while keeping the first TELLURIS implementation small and scientifically verifiable.

## NASA Data & Resources (as listed on the challenge page)

| Resource | What it offers according to the challenge | Possible TELLURIS role | Triage |
| --- | --- | --- | --- |
| [Giovanni](https://giovanni.gsfc.nasa.gov/) | Earth-science variable menus, time-series visualization and downloads | Independent visual comparison and variable discovery | **High — research/verification** |
| [Hydrology Time Series (GES DISC)](https://disc.gsfc.nasa.gov/information/tools?title=Hydrology%20Time%20Series) | Hydrological data time-series tool | Evaluate rainfall/hydrology extensions | **Medium — explore later** |
| [AppEEARS](https://appeears.earthdatacloud.nasa.gov/) | Geospatial data access, extraction/transform and time series | Future MODIS/land surface analysis; investigate workflow and access requirements before committing | **Medium — future extension** |
| [Time-Series Analysis of Remotely-Sensed SeaWiFS Chlorophyll in River-Influenced Coastal Regions](https://ntrs.nasa.gov/api/citations/20090042747/downloads/20090042747.pdf) | Example research paper on remote-sensing time series and significance | Methodology/background reading for coastal-variable extensions | **Reference only — paper not yet reviewed** |

## Additional U.S. government source listed by the challenge

| Resource | Possible TELLURIS role | Triage |
| --- | --- | --- |
| [NOAA/NCEI Climate Data Online (CDO)](https://www.ncei.noaa.gov/cdo-web/) | Historical station observations as an independent context/validation source, **not a substitute for the NASA-source requirement**. NOAA's [CDO API v2](https://www.ncei.noaa.gov/cdo-web/webservices/v2) requires a token and station/date coverage must be checked. | **Medium — reference/validation** |

## Space agency partner and other external resources listed by NASA

| Resource | Purpose described in the challenge | Triage |
| --- | --- | --- |
| [KNMI Climate Explorer](https://climexp.knmi.nl/) | Explore, analyze, download and visualize climate series and trends; KNMI asks users to cite its platform | **High — independent scientific reference** |
| [Statistical test methods to detect trends in time series data](https://medium.com/@snp.kriss/statistical-test-methods-to-detect-trends-in-time-series-data-b361a0ec530b) | Third-party introductory article | **Background only — verify against statistical literature** |
| [A Comprehensive Guide to Statistical Significance](https://www.statsig.com/perspectives/a-comprehensive-guide-to-statistical-significance) | Third-party statistical guide | **Background only — not the authoritative basis for implementation** |
| [CSA RADARSAT Constellation Mission data](https://donnees-data.asc-csa.gc.ca/en/dataset/rcm) | Radar observations for marine, disaster and ecosystem monitoring | **Future scope — outside P0** |
| [GEO.ca](http://geo.ca/) | Canadian open geospatial information | **Future scope — regional relevance only** |
| [CSA SWOT mission](https://www.asc-csa.gc.ca/eng/satellites/swot/) | Mission information about changing surface-water elevations | **Future scope — hydrology research** |
| [CSA Monitoring and protecting our ecosystems from space](https://www.asc-csa.gc.ca/eng/satellites/everyday-lives/monitoring-and-protecting-our-ecosystems-from-space.asp) | Overview of satellite monitoring of ecosystems | **Background/inspiration** |
| [CSA Synthetic Aperture Radar Python Tutorial](https://github.com/asc-csa/Synthetic_Aperture_Radar_Tutorial) | Access and analyze SAR imagery with Python/QGIS | **Future scope — not relevant to current POWER-based MVP** |

These links are **provided as starting points**, not an assertion that each service, API, dataset, or account entitlement was tested. In particular, the GES DISC tool and AppEEARS interfaces may be browser-driven and require separate workflow verification.

## Recommended use in TELLURIS

1. **Implementation source:** Continue with [NASA POWER](https://power.larc.nasa.gov/) monthly T2M and PRECTOTCORR as already scoped in [data sources](DATA-SOURCES.md); verify actual API responses, units, period and provenance.
2. **Scientific cross-check:** Use NASA Giovanni to examine similar time series and KNMI Climate Explorer to understand independent presentation/method choices. Be explicit when datasets differ; two tools are not automatically directly comparable.
3. **Station-data context:** Explore NOAA CDO only if matching stations and sufficiently complete observations are available for the selected Costa Rica examples; attribution and station-vs-grid differences must be disclosed.
4. **Later extensions:** Consider AppEEARS/MODIS for land vegetation or SWOT/GPM/hydrology only after the core single-point trend workflow is validated.
5. **Methods:** Base algorithms and inference on documented statistical methodology and reproducible tests, not solely on popular articles or AI-generated guidance.

## Challenge notes useful to product design

- **Required:** variable choice, geographic data, longitudinal visualization, slope/rate and a significance test.
- **Suggested, optional:** accessible variable definitions, guided variable discovery, interactive walk-through examples, and AI help for discovering potentially relevant variables.
- **Pragmatic guidance:** daily or monthly observations are suitable; seasonal cycles and serial dependence can complicate tests. A statistically insignificant trend may still be of interest, and the interface must report it accurately.
- **Not required:** nonlinear/advanced models, global trend mosaics, autonomous alerts, satellite image processing, an AI model, or physical monitoring hardware.

## Attribution, governance, and non-endorsement

The challenge's resource list includes links **outside NASA and outside the U.S. Government**. NASA's posted notice states that inclusion is not an endorsement and NASA is not responsible for those sites' content. TELLURIS must comply with each external site's data-use, citation, licensing, access and redistributions terms. **Do not assume that a link being listed by NASA licenses the content or authorizes automated bulk extraction.**

Where material is actually incorporated into TELLURIS, record dataset collection/version, resource URL, provider, retrieval date, specific license/terms, processing and attribution in [DATA-SOURCES.md](DATA-SOURCES.md) and [AI-USE.md](AI-USE.md) if applicable.

## Source and review status

- Primary scope and resource list: the team's supplied excerpts from the official NASA challenge Details and Resources tabs, 2026-11-14.
- Cross-checked landing pages: [Giovanni](https://giovanni.gsfc.nasa.gov/), [KNMI Climate Explorer](https://climexp.knmi.nl/), [NOAA CDO](https://www.ncei.noaa.gov/cdo-web/), [NOAA CDO API documentation](https://www.ncei.noaa.gov/cdo-web/webservices/v2).
- Other linked services and the SeaWiFS paper are **indexed as NASA-listed resources, not independently analyzed**.
- No NASA service integration or scientific findings have been validated as a result of this catalog update.

## November 14 scope policy update

No official suggestion or Resources-tab reference is dropped from TELLURIS. Its implementation status and acceptance evidence are now listed in [NASA-RECOMMENDATIONS-MATRIX.md](NASA-RECOMMENDATIONS-MATRIX.md); mission-backed variable opportunities and the river-runoff/discharge distinction appear in [VARIABLE-CATALOG.md](VARIABLE-CATALOG.md). Some 2026 sources (e.g. SWOT RiverSP) have short records and require a separate scientific workflow instead of reusing 1985–2025 climatology assumptions. Research/use evaluation is **not the same** as mandatory technical integration or endorsement.
