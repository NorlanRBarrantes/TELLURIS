# EXP-008 — NASA GIBS imagery and MODIS science visualization on the 3D Earth

**Project Uriel / TELLURIS · NASA Space Apps Challenge 2026**  
**Date:** 2026-11-15 · **Status:** implemented on GitHub `main` and source-probed, **public BanaHosting release and real-browser WebGL validation pending**.

## Goal

Replace the earlier schematic, geography-only 3D sphere with an interactive NASA-source-aware globe. Preserve the critical distinction between **one-day mapped satellite visualization** and **multidecadal numerical trends** calculated separately by NASA POWER.

## Original NASA GIBS layers

| UI layer | Exact NASA GIBS WMS name | Temporal meaning | Format | Numerical constraint |
| --- | --- | --- | --- | --- |
| NASA Blue Marble | `BlueMarble_NextGeneration` | Reference composite, no selected observation date | JPEG | Not quantitative observations |
| Terra true color | `MODIS_Terra_CorrectedReflectance_TrueColor` | Selected MODIS observation date | JPEG | Image/color is not a trend |
| Terra daytime LST | `MODIS_Terra_L3_Land_Surface_Temp_Daily_Day` | Selected MODIS date, daytime land surface | Transparent PNG overlay | Source product in K, nominal 1 km native spatial support, but global WMS texture is heavily downsampled; no numeric temperature extraction from rendered colors |

All images are retrieved directly from NASA's original **GIBS WMS geographic EPSG:4326 service**, not generated photographs, fictional gridded values, or a simulated time series. The requests use **WMS 1.1.1** and longitude-first `BBOX=-180,-90,180,90`, avoiding a common WMS 1.3 EPSG:4326 axis-order mismatch.

- Documented WMS endpoint: `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi`.
- The `TIME` field is supplied only for dated MODIS layers and is validated before construction.
- The official MODIS LST legend-family asset is `https://gibs.earthdata.nasa.gov/legends/MODIS_Land_Surface_Temp_H.png`. The exact product palette should still be reviewed in NASA Worldview before numerical interpretation.
- Third-party OpenGL renderer: Three.js r170 (MIT) via pinned CDN; vector outlines: Natural Earth (public domain).
- For scientific outputs, `website/public/assets/science.js` continues to obtain **real NASA POWER**, including its independent support, original units, temporal aggregation and source provenance.

## Verification performed with actual NASA service

[**NASA GIBS live WMS probe #43767077396**](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43767077396), run November 15, 2026, requested all three exact layers with `WIDTH=512`, `HEIGHT=256`. The worker obtained:

| Layer | Response | MIME | Bytes | CORS |
| --- | --- | --- | ---: | --- |
| BlueMarble_NextGeneration | HTTP 200 | image/jpeg | 21,013 | `*` |
| MODIS_Terra_CorrectedReflectance_TrueColor (2024-07-15) | HTTP 200 | image/jpeg | 43,118 | `*` |
| MODIS_Terra_L3_Land_Surface_Temp_Daily_Day (2024-07-15) | HTTP 200 | image/png | 33,316 | `*` |

Image signatures were verified from original responses, **not** merely by successful HTTP status. This validates original NASA imagery access and CORS at probe time; it does **not** verify Three.js rendering, expected colors, performance, legend alignment or mobile browser behavior.

## Interaction and source transparency

- Cinematic yet lightweight geography: NASA surface maps, atmospheric rim, lighting, coastline/graticule, decorative stars (explicitly nonobservational), and Costa Rican research markers.
- Mouse/touch drag rotation; wheel, button and keyboard zoom; home to Costa Rica; opt-in automatic rotation with reduced-motion support.
- Click a marker or the Earth sphere to populate the existing location/coordinate inputs; the investigator explicitly requests NASA POWER with the current science controls. No automatic false data generation on click.
- ES/EN controls, NASA map provenance, dated/source metadata, NASA MODIS LST legend, raw source links and clear unavailable-image fallback.
- On missing GIBS, jsDelivr or WebGL: the numerical explorer and accessible location controls must remain usable. Loaded image success must not be inferred from the presence of a colored sphere.

## Scientific restrictions

1. The MODIS **land surface temperature** map is not NASA POWER `T2M` **air temperature at 2 m**. They measure different constructs and have different spatial/temporal supports.
2. A daily screenshot is not a trend. The map does **not** visualise estimated Theil–Sen slopes, MK p-values, statistically significant grid cells or climate anomalies.
3. WMS imagery is color rendered and globally resampled, not a machine-readable MODIS original science granule. The renderer must not turn RGB into a numeric result or claim data homogeneity.
4. NASA GIBS WMS is a third-party network dependency; CORS/CDN/service availability can vary. Do not disguise missing imagery as valid data.
5. NASA imagery provided by NASA GIBS (part of ESDIS) must be attributed; TELLURIS remains an independent project **without NASA endorsement**.

## Deployment and release acceptance

- GitHub site tests validate source JSON/JS modules, date/layer allowlisting, WMS axis order, UV alignment, and bilingual UI. Record the *latest* passing Actions URL in `docs/VALIDATION.md`.
- The website is static and the GitHub connector does not automatically deploy to the user-owned BanaHosting server.
- On BanaHosting: `git fetch origin main`, `git pull --ff-only origin main`; **check** with `scripts/deploy-bana-static.sh --check`; only after green CI deploy with `--deploy`. The existing script performs backup and HTTPS byte comparisons without deleting unrelated public assets.
- Final visual gate: open ES/EN with fresh cache; confirm NASA Blue Marble texture is aligned to geographic markers; request truecolor and LST for 2024-07-15, confirm the displayed NASA legend, rotate/zoom/choose Liberia/Limón and custom coordinates, verify source link; inspect mobile and reduced-motion browsers, network outage fallbacks and that the existing POWER chart/report still works.
- Only after witnessed validation may `docs/VALIDATION.md` mark **public NASA-globe browser tested**.

## NASA references

- [GIBS overview and access mechanisms](https://nasa-gibs.github.io/gibs-api-docs/access-basics/)
- [Official WMS Blue Marble GetMap example](https://nasa-gibs.github.io/gibs-api-docs/python-usage/)
- [NASA GIBS visualization catalog](https://nasa-gibs.github.io/gibs-api-docs/available-visualizations/)
- [NASA Worldview](https://worldview.earthdata.nasa.gov/)
- [NASA GIBS MODIS legend directory](https://gibs.earthdata.nasa.gov/legends/)
- [EXP-007 agreed research product stages](EXP-007-FIVE-PILLARS.md)

## EXP-008 UV georegistration correction — 2026-11-15

**Observed defect:** the BanaHosting operator supplied a production screenshot where the Liberia/Limón coordinate markers were plotted over West Africa while the selected coordinates remained (approximately 10.63°, -85.44°). The geometric marker, coastline and mouse picking share the TELLURIS geo-vector convention, so the error was isolated to the NASA WMS equirectangular texture transform.

**Actual source:** [Three.js r170 SphereGeometry source](https://github.com/mrdoob/three.js/blob/r170/src/geometries/SphereGeometry.js) builds `x=-r*cos(phi)*sin(theta)`, `z=r*sin(phi)*sin(theta)` and `u=phi/(2*pi)`. Our geographic `globePoint` builds `x=r*cos(lat)*sin(lon)`, `z=r*cos(lat)*cos(lon)`. They imply `sphereU=(longitude+90)/360 mod 1`. NASA GIBS plate carrée raster implies `NASA_U=(longitude+180)/360 mod 1`.

**Correction:** replace prior `texture.repeat.x=-1; texture.offset.x=.5` with `texture.repeat.set(1,1); texture.offset.set(0.25,0)`, keeping `RepeatWrapping`. This aligns Greenwich at 0°, Liberia at -85.44°, Limón at -83.03° and other anchor meridians. It applies consistently to Blue Marble, MODIS true color, and the transparent MODIS surface-temperature overlay. The earlier suggestion to reset offset to zero would still leave a 90° mismatch and is *not* adopted.

**Regression protection:** a pure-function map-UV projection test checks direct NASA vs Three U correspondence at explicit longitudes; runtime source checks enforce the same transformation and reject negative repeat. The bilingual HTML bumps `globe.js` to `?v=exp008-uvfix-20261115`, and that module imports a versioned layer registry to bypass stale browser caches.

**Validation status:** GitHub tests are required to pass again. The mathematical alignment is source-derived, but the final geography-on-image match in BanaHosting WebGL remains pending a new user screenshot; do not claim visual verification prematurely.
