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

## Provenance fields required in each analysis

Dataset / collection; NASA source; variable code and human-readable name; units; temporal resolution; date range requested and actually analyzed; spatial selector and effective spatial resolution; retrieval timestamp; data processing algorithm and version; missing-data flags; statistical test; number of valid observations; output and limitations.

## External libraries and assets

Before NASA submission, list every non-original dataset, library, image, icon, basemap, font, and model with its canonical source URL, author/provider, and applicable license or attribution. NASA's legal terms require appropriate credit for third-party material: https://www.spaceappschallenge.org/legal/

**As of initialization:** no actual data download, external asset incorporation, or scientific result has been verified.
