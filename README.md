# TELLURIS

**Earth System Trend Intelligence**  
*A Project Uriel initiative for the NASA Space Apps Challenge 2026.*

> Discover what is changing on Earth, where it is changing, how much it is changing, and whether the observed trend is statistically significant.

**Project status:** NASA POWER time series for Liberia/Limón (1985–2025) retrieved from the real service; EXP-001 independently recalculated exploratory slopes. A dependency-free browser TELLURIS Explorer 0.1 and archived real-data sample are implemented. Full statistical inference and public BanaHosting deployment remain unverified.

## Challenge

TELLURIS responds to **[Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)**, an advanced Earth Science / Software challenge in the 2026 NASA Space Apps Challenge.

The formally approved mission is a **guided, multi-variable, multi-source Earth-system trend explorer**, covering atmosphere, land/vegetation, inland water, rivers and oceans. The initial NASA-backed research cases are in Costa Rica; neither a predetermined climate dipole nor a single climate variable defines the product.

## Intended experience

1. Ask a plain-language research question, then select a scientifically defined NASA variable and appropriate location/footprint.
2. Retrieve a time series from a documented NASA dataset.
3. Explore the series and the estimated magnitude of change.
4. Inspect an appropriate statistical significance test and its limitations.
5. Compare locations and export a traceable evidence report.

The first exploratory single-location interface is implemented in [TELLURIS Explorer 0.1](website/public/telluris/explore/index.html). Multi-region comparisons and validated inferential reporting remain future milestones.

## Science first

The initial candidate data provider is [NASA POWER](https://power.larc.nasa.gov/), with surface air temperature and precipitation as candidate variables. Every published result must expose its source, period, location, unit, processing choices, missing-data handling, statistical method, and interpretation. TELLURIS will not equate statistical significance with causation.

## Documentation

- [Post-submission roadmap — all 49 scientific topics and 10 proposed indicators, with source-validation gates](docs/FUTURE-VERSIONS-ROADMAP.md)
- [External Afterglow reference review — evidence limits, accessible-science ideas, and future UX tests](docs/EXTERNAL-REFERENCE-AFTERGLOW.md)

- [Formal 2026 product scope and stage gates](docs/SCOPE-2026.md)
- [EXP-004 staged release plan: 18 verified live parameters and all 22 requested Earth domains](docs/RELEASE-STAGES-EXP004.md)
- [Every NASA recommendation and official resource tracked](docs/NASA-RECOMMENDATIONS-MATRIX.md)
- [Expanded Earth-science variable catalog — including river discharge](docs/VARIABLE-CATALOG.md)
- [Team-contributed 49-variable inventory + 10 derived indicators](docs/TEAM-CATALOG-2026-11-15.md)
- [EXP-003 MODIS NDVI/EVI independent NASA-source validation and experimental adapter](docs/EXP-003-VEGETATION.md)
- [EXP-003B MODIS detailed QA/orbital-geometry sensitivity on real source data](docs/EXP-003B-MOD13Q1-QA.md)
- [Scientific review of team inventory and integration status](docs/TEAM-CATALOG-REVIEW.md)
- [Challenge interpretation](docs/CHALLENGE.md)
- [Product vision, scope and acceptance criteria](docs/PRODUCT.md)
- [NASA data sources and provenance](docs/DATA-SOURCES.md)
- [Scientific methodology](docs/SCIENTIFIC-METHODOLOGY.md)
- [Costa Rica climate contrast research case](docs/CASE-STUDY-COSTA-RICA.md)
- [Research sources and evidence](docs/RESEARCH-REFERENCES.md)
- [EXP-001 real NASA POWER acquisition, code and scientific cautions](docs/EXPERIMENT-001.md)
- [Static browser Explorer MVP, Spanish-first bilingual routes and hosting](website/README.md)
- [EXP-002 seasonal, cross-region and global validation plan](docs/BENCHMARK-PLAN.md)
- [Scientific guardrails and data-quality controls](docs/SCIENTIFIC-GUARDRAILS.md)
- [Technical architecture](docs/ARCHITECTURE.md)
- [Deployment constraints](docs/DEPLOYMENT.md)
- [Architecture decision records](docs/DECISIONS.md)
- [Verification and reproducibility](docs/VALIDATION.md)
- [NASA submission checklist and AI disclosure](docs/SUBMISSION.md)
- [Development and commit conventions](CONTRIBUTING.md)

## Links

- **Web explorer source (production upload pending):** https://projecturiel.earth/telluris/explore/
- **Earlier app-hostname alternative:** https://telluris.lynxglobals.net/
- **Source repository:** https://github.com/NorlanRBarrantes/TELLURIS
- **Team:** Project Uriel
- **Challenge:** NASA Space Apps Challenge 2026, November 14–15, 2026

The actual public Explorer 0.1 deployment is **not yet verified**. GitHub commits do not automatically update BanaHosting.

## Attribution and independence

This is an independent hackathon project. It is **not endorsed by, affiliated with, or an official product of NASA**. NASA datasets, documentation, and other third-party assets must be individually credited in [data sources](docs/DATA-SOURCES.md) and the final project submission. No NASA logo or branding is implied.

## License

Original source code and project documentation are intended to be released under the [MIT License](LICENSE), subject to their individual attribution requirements. Third-party datasets and assets retain their respective terms.

---

**Project Uriel · TELLURIS · 2026**


## Experimental 3D / evidence interaction

The Explorer has a NASA GIBS geographic globe with dated MODIS Terra true-color and daytime land-surface-temperature visualization options (EXP-008, implemented in GitHub, production browser QA pending), deterministic evidence question responses and a descriptive Liberia/Limón archive comparison. Browser CDN and NASA GIBS access are required for textured WebGL imagery; no climate trend statistics are inferred from the image colors. This is **not** generative AI or validated climate statistical inference. See [feature status and roadmap](docs/FEATURES-3D-EVIDENCE-AI.md). GitHub commits do not automatically publish to BanaHosting.

- [EXP-003C — spatial QA pre-screen of predeclared Caribbean MODIS candidates](docs/EXP-003C-SPATIAL-PRESCREEN.md)

- [EXP-003D — verified 2023 NASA land-cover classes at the predeclared Caribbean locations](docs/EXP-003D-IGBP.md)

- [EXP-005 — Statistical significance, Sen confidence intervals and reproducible scientific reports](docs/EXP-005-SIGNIFICANCE.md)

- [EXP-006 — NASA GPM IMERG Final V07 scientific cross-product precipitation comparator](docs/EXP-006-IMERG-CROSS-VALIDATION.md)

## EXP-007 — five-pillar extension (November 15, 2026)

See the [A–E scientific expansion specification](docs/EXP-007-FIVE-PILLARS.md). **Initial code delivered for C and E:** an ES/EN monthly and calendar-quarter descriptive period comparison on complete-year NASA POWER live/original monthly input (not available for annual-only archive), plus an EXP-005 evidence-grounded print-ready report in HTML (browser Print → Save as PDF). These additions still require CI and BanaHosting/browser validation. **A** remains gated on real IMERG granules; **B** now has NASA GIBS source-tested imagery and requires public browser rendering/geo-registration QA (see EXP-008); **D** on a secure server-side LLM proxy and provider credentials. Do not imply any of these blockers are solved.

- [EXP-008 — NASA GIBS scientific-layer globe with live original-map response checks](docs/EXP-008-NASA-GIBS-GLOBE.md)

## EXP-009 — Multivariable Earth Systems Observatory

TELLURIS now has a **GitHub-implemented, bilingual four-mode investigation lab**: one variable/one location, one variable/two locations, all 18 NASA POWER source-verified parameters/one location and all 18/two locations. The globe is full-width and includes source-aware geographic hover coordinates. EXP-010 removed wind/rain animation and automatic spinning so scientific imagery remains prominent. Results show NASA-original unit-aware slopes, same-variable regional charts, matched-calendar-year differences and five **predeclared noncausal first-difference correlations** for hypothesis generation. An accessible, deterministic explanation panel and scientific glossary make assumptions clear. **This is not an LLM**, and no source values, wind fields or climate significance are fabricated.

[EXP-009 methodology, source evidence, limitations and release gates](docs/EXP-009-OBSERVATORY.md) · [Original 2023 NASA 36-series grouped query proof](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43771373529) · [104 passing Node tests and local site CI](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43772430934).

**Release boundary:** This feature is committed and source/CI verified, but it is **not assumed deployed** at https://projecturiel.earth until BanaHosting deployment and hands-on ES/EN browser validation are witnessed. The official NASA submission and original source evidence take priority over an untested late-stage release.

## EXP-010 — TELLURIS-first presentation and simplified research UX

**TELLURIS is now the product shown at the root website:** Spanish `/` and English `/en/`. The five-part guided page presents the research problem, transparent NASA methodology, four comparison modes, 18 connected NASA POWER parameters, uncertainty and the link to the real Explorer. Project Uriel's story, technical experience and independent participation are moved to `/about/` and `/en/about/`. The earlier `/telluris/` route remains a canonicalized compatible copy of the product landing.

Explorer UX changes: removed decorative wind/rain effects and automatic globe rotation, redundant research-question chips and repeated comparison widgets; kept direct NASA GIBS layers, manual globe, geographic coordinate hover and four distinct modes. Advanced inference, NASA source uploads and evidence exports remain available through explicit disclosure sections. In two-site mode, Zone B excludes Zone A's preset, even if A is custom coordinates equivalent to that preset; identical coordinates are rejected before any NASA query.

[Full EXP-010 decision and scientific boundaries](docs/EXP-010-JUDGE-JOURNEY.md) · [117 passing original/source/UI Node tests](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43784411416) · [real Chromium ES/EN desktop/mobile check](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43784411387). An incremental live production deployment and original GIBS-in-browser source imagery check remain separate from these GitHub Actions validations.

## EXP-011 — Six-slide TELLURIS introduction and independent earthquake/event observations

The canonical Spanish and English homepages are now **six horizontally navigable presentation slides**, not a vertical landing journey. The panels are 00 TELLURIS, 01 problem, 02 methodology, 03 capabilities, 04 rigor, 05 explore. Users navigate by click, keyboard, swipe or direct URL fragment; no autoplay is used. Content scrolls *inside the active slide only* when a small display cannot fit the full statement.

The research Explorer now offers a separate **Earthquake & Natural Events** investigation for the active Zone A: genuine **USGS FDSN** seismic events (epicenters, depth, magnitude and thresholded occurrence counts), and **NASA EONET** curated natural events (wildfires, volcanoes, floods, severe storms, landslides). Both are event catalogs, not the original 18 NASA POWER climate series. **Four USGS seismic research candidates** C31–C34 have a source-connected *partial* implementation. Four other research topics have links to related EONET reports while remaining **not connected to the underlying physical variable** (e.g., reported wildfire events do not equal MODIS hot-spot pixels).

[EXP-011 complete scientific and UX scope](docs/EXP-011-SLIDES-EVENTS.md) · [original six-source API QA](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43787577130). Source tests do not substitute for published-browser CORS and NASA GIBS visual validation. The BanaHosting public rollout is manual and pending.

## EXP-012 — One coherent visual identity and shorter entry to the laboratory

The six-slide judge introduction, NASA Explorer, 49-topic research catalog and Project Uriel About pages now share the same **minimal navy, white, cyan and restrained violet** graphic system, following the user-supplied presentation references without adding gratuitous visual effects. The Project Uriel crest in the header was derived from the image the team supplied and optimized as a transparent 128×106 PNG. TELLURIS remains the product-first heading and identity.

Slide **00** offers a **Skip presentation → last slide** action; it does **not** go straight to the laboratory. The final slide alone retains the primary **Open Explorer** CTA. Source data, original GIBS layers, numerical methodology and scientific limits are unchanged.

[EXP-012 visual identity specification](docs/EXP-012-VISUAL-IDENTITY.md) · [browser acceptance](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43792630373) · [source QA](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43792857775).
