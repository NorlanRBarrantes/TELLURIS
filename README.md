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
