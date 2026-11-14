# TELLURIS

**Earth System Trend Intelligence**  
*A Project Uriel initiative for the NASA Space Apps Challenge 2026.*

> Discover what is changing on Earth, where it is changing, how much it is changing, and whether the observed trend is statistically significant.

**Project status:** Initial documentation and research. Features, analyses, and production deployment are not yet verified.

## Challenge

TELLURIS responds to **[Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)**, an advanced Earth Science / Software challenge in the 2026 NASA Space Apps Challenge.

The planned application will make historical Earth-system observations understandable, transparent, and reproducible. The initial research focus is Costa Rica; the intended analytical workflow is location-independent.

## Intended experience

1. Choose a geographic location and a scientific variable.
2. Retrieve a time series from a documented NASA dataset.
3. Explore the series and the estimated magnitude of change.
4. Inspect an appropriate statistical significance test and its limitations.
5. Compare locations and export a traceable evidence report.

These are **product goals, not statements of implemented functionality**.

## Science first

The initial candidate data provider is [NASA POWER](https://power.larc.nasa.gov/), with surface air temperature and precipitation as candidate variables. Every published result must expose its source, period, location, unit, processing choices, missing-data handling, statistical method, and interpretation. TELLURIS will not equate statistical significance with causation.

## Documentation

- [Challenge interpretation](docs/CHALLENGE.md)
- [Product vision, scope and acceptance criteria](docs/PRODUCT.md)
- [NASA data sources and provenance](docs/DATA-SOURCES.md)
- [Scientific methodology](docs/SCIENTIFIC-METHODOLOGY.md)
- [Costa Rica climate contrast research case](docs/CASE-STUDY-COSTA-RICA.md)
- [Research sources and evidence](docs/RESEARCH-REFERENCES.md)
- [Scientific guardrails and data-quality controls](docs/SCIENTIFIC-GUARDRAILS.md)
- [Technical architecture](docs/ARCHITECTURE.md)
- [Deployment constraints](docs/DEPLOYMENT.md)
- [Architecture decision records](docs/DECISIONS.md)
- [Verification and reproducibility](docs/VALIDATION.md)
- [NASA submission checklist and AI disclosure](docs/SUBMISSION.md)
- [Development and commit conventions](CONTRIBUTING.md)

## Links

- **Application (planned):** https://telluris.lynxglobals.net/
- **Source repository:** https://github.com/NorlanRBarrantes/TELLURIS
- **Team:** Project Uriel
- **Challenge:** NASA Space Apps Challenge 2026, November 14–15, 2026

The domain and shared hosting provider have been selected; availability and deployment are **not yet verified**.

## Attribution and independence

This is an independent hackathon project. It is **not endorsed by, affiliated with, or an official product of NASA**. NASA datasets, documentation, and other third-party assets must be individually credited in [data sources](docs/DATA-SOURCES.md) and the final project submission. No NASA logo or branding is implied.

## License

Original source code and project documentation are intended to be released under the [MIT License](LICENSE), subject to their individual attribution requirements. Third-party datasets and assets retain their respective terms.

---

**Project Uriel · TELLURIS · 2026**
