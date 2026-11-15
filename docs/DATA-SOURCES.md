# Data sources, provenance and attribution

## Primary candidate: NASA POWER

- Provider: NASA Prediction Of Worldwide Energy Resources (POWER), NASA Langley Research Center.
- Home: https://power.larc.nasa.gov/
- Monthly API reference: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/
- Intended initial access: monthly point time series, JSON.
- Candidate fields: **T2M** (air temperature at 2 m) and **PRECTOTCORR** (precipitation, corrected).
- Source lineage: meteorological POWER parameters use NASA MERRA-2; the documented historical meteorological availability begins in 1981 and extends through the previous year.

### Reference request structure (not yet validated end-to-end)

https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=T2M,PRECTOTCORR&community=AG&longitude=-84.08&latitude=9.93&format=JSON&start=2001&end=2025

This is a **request example**, not evidence that a given API response or result was successfully retrieved. NASA POWER's monthly endpoint documents calendar-year start/end arguments and JSON responses. Confirm support for the chosen community/variables, actual units, fill values, and returned metadata in the retrieved response before implementation.

### Important processing choices

- Record the exact request URL/parameters, retrieval timestamp, provider, data version when available, latitude and longitude.
- Preserve source units and metadata. Temperature monthly values and precipitation monthly values require different annual aggregation procedures.
- **Do not blindly sum monthly precipitation values:** inspect the product's returned units and metadata. If values represent rates (e.g., mm/day), convert using the number of days represented by each observation before calculating annual totals.
- Annual temperature series: compute day-weighted or otherwise scientifically justified annual means, explicitly documenting the method.
- Exclude sentinel/fill values and flag missing or incomplete months. Do not silently fill gaps.
- Do not interpret a single point time series as a whole-province measurement.
- Cite spatial resolution and distinguish reanalysis/model-based estimates from in-situ ground observations.
- No fabricated or hand-adjusted scientific readings.

### API constraints and operations

NASA's documented monthly API allows up to 20 parameters per single-point request, while regional requests are limited to one parameter. Respect API limits, validate inputs, and cache successful responses. Never imply that two geospatially different points represent a national average.

### Additional verification from NASA documentation (2026-11-14 review)

- The monthly API documentation states **up to 20** parameters per point request (not 10); regional submissions are limited to one parameter.
- NASA POWER's meteorological source resolution is approximately **0.5° × 0.625°**; two nearby requested coordinates may resolve to the same grid cell. Record the effective data grid rather than implying urban/station precision.
- NASA's hydrology methodology describes aggregate-product precipitation in **mm/day**; annual totals must use the correct calendar-month day count and valid-data policy, unless actual response metadata explicitly indicates another unit.
- POWER is an analysis-ready data service drawing on models/reanalysis and other sources; avoid labeling all outputs as direct satellite measurements or local weather-station observations.
- NASA POWER monthly endpoint and methodology, accessed for the November 14 research review: https://power.larc.nasa.gov/docs/services/api/temporal/monthly/ ; https://power.larc.nasa.gov/docs/services/ ; https://power.larc.nasa.gov/docs/methodology/data/sources_hydrology/


## Source selection: NASA POWER vs. challenge-listed resources (review 2026-11-14)

The official challenge **does not require use of a particular listed website**. It requests scientific mission/model variables, geographic time series, rate-of-change estimates and statistical significance testing. NASA POWER was proposed because its documented temporal API returns ready-to-process point observations in JSON/CSV with parameter/date/coordinate selection. Its meteorological fields derive from NASA models including MERRA-2, which the challenge mentions.

**This is an engineering rationale, not a finding that POWER is more scientifically valid than the challenge-listed tools.**

| NASA source/tool | Strength for TELLURIS | Integration / science concern | Planned use |
| --- | --- | --- | --- |
| [NASA POWER](https://power.larc.nasa.gov/docs/services/api/temporal/monthly/) | Straightforward temporal REST API; long meteorological records; analysis-ready responses | Coarse conventional meteorology grid; verify exact variables, temporal semantics, metadata and units | **Candidate P0 primary provider**, subject to real-response tests |
| [Giovanni](https://giovanni.gsfc.nasa.gov/) | Broad NASA atmospheric/hydrologic catalog, regional plots and time series | Browser analysis workflows are not equivalent to a guaranteed lightweight public REST interface for arbitrary frontend use | **Research and independent inspection**; evaluate export formats |
| [Hydrology Time Series / GES DISC](https://disc.gsfc.nasa.gov/information/tools?title=Hydrology%20Time%20Series) | Hydrology-focused series and datasets (e.g., GLDAS in GES DISC) | Check supported collections, authentication, delivery workflow and API access | **Alternative / cross-check** for hydrology |
| [AppEEARS](https://appeears.earthdatacloud.nasa.gov/) | MODIS/land data extraction, point/polygon requests, quality flags, programmatic API | Earthdata Login and asynchronous task/extract workflow; must validate product access and usable latency | **Candidate post-MVP provider** for satellite vegetation |
| [NOAA CDO](https://www.ncei.noaa.gov/cdo-web/) | Historical station-based climate observations | Coverage must be verified; not itself a replacement for NASA mission/model data | **External reference only** |

**Updated POWER capability:** [POWER methodology](https://power.larc.nasa.gov/docs/methodology/) also lists higher-resolution datasets such as GPM IMERG precipitation (~0.1°) and SMAP L4 soil moisture (~9 km). These are **not automatically interchangeable** with conventional MERRA-2 meteorological variables; investigate parameter aliases, time availability, units, and extraction endpoints before claiming integration.

**Working rule:** Demonstrate a valid end-to-end scientific result before integrating more sources. If a first-party challenge-listed tool delivers materially better spatial coverage or reproducibility for the chosen investigation without jeopardizing the hackathon deadline, reconsider the primary provider. A broad dataset catalog without tested calculations does not meet the challenge.

Additional programmatic-access reference: NASA [AppEEARS Data Resources](https://github.com/nasa/AppEEARS-Data-Resources) (Earthdata authentication required). For the full official resource catalog see [NASA challenge resources](NASA-CHALLENGE-RESOURCES.md).

## Candidate follow-on datasets (not integrated)

| Source | Possible use | Status |
| --- | --- | --- |
| NASA GPM IMERG | Satellite precipitation trend validation | Research candidate |
| MODIS vegetation products | NDVI/vegetation trends | Research candidate |
| NASA GES DISC | MERRA-2 / GLDAS data access | Research candidate |
| NASA Giovanni | Independent exploration of geophysical time series | Research tool candidate |

References:
- https://gpm.nasa.gov/data/imerg
- https://search.earthdata.nasa.gov/
- https://disc.gsfc.nasa.gov/
- https://giovanni.earthdata.nasa.gov/

### GPM IMERG V07B — verified research alternative, not integrated

NASA's [GPM precipitation data directory](https://gpm.nasa.gov/data/directory) describes IMERG V07B as a multi-satellite rainfall-estimate product on an approximately 0.1° (10 km) grid and indicates that reprocessing includes **January 1998 onward**. Periods, runs (Early/Late/Final), latency, product units and redistribution/citation requirements vary. The 2000 starting year asserted in the external report is not an unconditional product limit. The specific collection, retrieval protocol and aligned POWER comparison remain to be tested.

**Source interpretation:** Satellite precipitation estimates may incorporate gauge corrections or multisensor blending, so avoid claiming they are a single sensor's unmodified direct observation. For a cross-source comparison, reconcile period, variable definition, unit conversions, sampling footprint and missing values before claiming a match or discrepancy.


### EXP-001 source integration protocol (not yet executed on NASA readings)

The [EXP-001 Python investigation](EXPERIMENT-001.md) constructs specific monthly NASA POWER API requests for Liberia and Limón for the tentative 1985–2025 historical window. It retains original JSON responses and source metadata, excludes optional YYYY13 annual keys, rejects unexpected source units and uses a leap-year-aware aggregation method. **Only synthetic unit tests have passed; no actual POWER response or scientific result has been validated.**

## Provenance fields required in each analysis

Dataset / collection; NASA source; variable code and human-readable name; units; temporal resolution; date range requested and actually analyzed; spatial selector and effective spatial resolution; retrieval timestamp; data processing algorithm and version; missing-data flags; statistical test; number of valid observations; output and limitations.

## External libraries and assets

Before NASA submission, list every non-original dataset, library, image, icon, basemap, font, and model with its canonical source URL, author/provider, and applicable license or attribution. NASA's legal terms require appropriate credit for third-party material: https://www.spaceappschallenge.org/legal/

**As of initialization:** no actual data download, external asset incorporation, or scientific result has been verified.


## Verified acquisition — EXP-001 (2026-11-15 UTC)

[Actions run #43656774519](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43656774519) obtained original NASA POWER monthly-point JSON using API version 2.10.0. Both Costa Rica points contain 41 complete years (1985–2025), original variables T2M (C) and PRECTOTCORR (mm/day), MERRA2 provider and -999 fill metadata. Raw source SHA-256: Liberia `2630001674b075e90a5a0d17edbc22370e8feb43a7df4e6230ab28958a27fd8b`; Limón `5c202f4d083412a53755a5900b4423ceebd1040efe496838377af93aa6299a19`. Original JSON is stored as a 30-day Actions artifact; derived rounded annual data is committed at [the Explorer's versioned sample](../website/public/telluris/explore/data/exp001-annual.json).

**Interpretation restriction:** Large annual rainfall-rate changes require checks for potential product inhomogeneity and independent comparison against IMERG/station observations. Authentic NASA-model data are not automatically equivalent to in-situ measurements or validated physical trends. See [EXP-001](EXPERIMENT-001.md).
