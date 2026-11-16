# TELLURIS — An evidence-first case for the 2026 NASA Space Apps judges

**Project:** TELLURIS · Project Uriel  
**Challenge:** [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)  
**Case:** Compare source-gridded air-temperature and rainfall records near Liberia and Limón, Costa Rica, 1985–2025, while rejecting unsupported climate and satellite-pixel conclusions.  
**Date:** 2026-11-15 (Costa Rica).  
**Evidence level:** Real NASA records and independent numerical cross-checks, **not** a validated causal climate study or a proven societal outcome.

## The problem — not a shortage of graphs

NASA's Earth observing and modeling systems make many scientific variables available, but non-specialists struggle to choose a meaningful variable, retrieve an appropriate observation, compare like with like, calculate its evolution, and decide whether apparent trends justify a scientific conclusion.

A chart or a small p-value alone can mislead: autocorrelation, inhomogeneous upstream products, incomplete calendars, spatial representativeness, changing observation instruments, and wrong land/water pixels can invalidate an attractive interpretation. An overly technical interface also makes these issues hard to notice.

**Our research question:** Can a person move from a plain-language Earth-system question to a transparent and scientifically cautious evidence record using real NASA observations, without conflating a visually striking trend with causal proof?

**Primary audiences:** students, educators, citizen-science investigators, early-career researchers and data-literate public users. Practitioner/public-policy decisions require additional external validation; no field deployment or measured impact on a user population has yet been demonstrated.

## The actual NASA case — two grid samples, four series

- Dataset: **NASA POWER** point monthly API with MERRA-2 source information, version **v2.10.0**, 1985–2025. Coordinates requested: Liberia **10.63, -85.44**; Limón **9.99, -83.03**. NASA reports source-grid values, **not** thermometers or rain gauges located exactly at these coordinates.
- Input: 41 fully observed calendar years for **T2M air temperature** and **PRECTOTCORR precipitation** at each requested model sample. The source-native monthly precipitation unit is mm/day, aggregated by actual days per month to mm/year. Annual `YYYY13` summaries were not double-counted.
- Independent source verification: [original NASA response run #43656774519](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43656774519); [archived annual source-derived sample](../website/public/telluris/explore/data/exp001-annual.json); [full protocol and SHA-256 fingerprints](EXPERIMENT-001.md).
- Independent numerical check: SciPy reaggregation of original source months and `theilslopes` replicated the four exploratory slopes. Additional independent SciPy inference comparisons appear in [EXP-005](EXP-005-SIGNIFICANCE.md).

| Source-gridded sample | T2M Theil–Sen slope per decade | T2M original Mann–Kendall p (provisional) | PRECTOTCORR slope per decade |
| --- | ---: | ---: | ---: |
| Liberia | **−0.113 °C** | **0.085708** | **+434.85 mm/year per decade** |
| Limón | **+0.168 °C** | **0.000000176** | **+918.77 mm/year per decade** |

The **original** 95% rank-based Sen slope intervals under independence assumptions are approximately **[−0.228, +0.008] °C/decade** for Liberia temperature and **[+0.109, +0.234] °C/decade** for Limón. For Liberia, the interval spans zero; for Limón, the unadjusted result is suggestive, but climate-data homogeneity and serial dependence have **not** been fully established. Do **not** label Limón's slope a final statistically validated physical climate finding. Neither interval establishes mechanism or causation.

**Critical negative result:** Precipitation estimates are extraordinarily large, with markedly different early/late means. These may reflect upstream product/gauge-network inhomogeneity and must be tested against independent sources (e.g., properly acquired NASA GPM IMERG and gauge data). Do not say Costa Rica has become wetter by those amounts as a validated climate truth. This uncertainty is a reason for further investigation, not a result to hide.

**A second, independent NASA QA example (not public product integration):** The original Limón 250 m MOD13Q1 vegetation-point audit counted **67 coastal/shoreline** land/water flags and **2 shallow-ocean** flags across 69 sampled composite records, and **0 unequivocal land** flags. This makes the original pixel unsuitable as an unambiguous terrestrial-vegetation point. We predeclared alternatives before examining their NDVI slopes. A single 2023 check gave the provisional Río Banano/Fila Matama candidate **9/9** unequivocal-land central QA cells and a MCD12Q1 **2023** broadleaf evergreen classification. Neither this one-date/one-year screen nor the candidate label validates a multi-decade forest trend or protected-area boundary. [MODIS prescreen](EXP-003C-SPATIAL-PRESCREEN.md) · [independent land-cover source](EXP-003D-IGBP.md).

## What the working MVP actually does

1. **Choose and locate:** guided ES/EN questions, configurable source coordinates, four research scopes and **18 real NASA POWER parameters** enabled via their correct RE/AG source communities. The archived 41-year example covers **only two** of these variables; the other sixteen rely on a real NASA live request/import and must never be filled with fictional archive records.
2. **Show change transparently:** annual source-derived time series, Theil–Sen descriptive trend per decade, same-physical-unit comparisons, paired common-calendar-year A−B differences, gaps and source metadata.
3. **Test with appropriate caution:** original Mann–Kendall p, provisional Sen confidence intervals, lag-1 and block sensitivity diagnostics in the advanced Explorer; do not claim source/independence validation that has not happened. Circular wind direction does not receive a linear trend.
4. **Turn evidence into comprehension:** EXP-013 shows the selected variable's latest annual value, descriptive slope, annual coverage, and matched-year difference above an advanced source matrix. The deterministic ES/EN explanation presents hypotheses to test, conditional outlooks and short/long-term checks — **not** verified cause, local risk forecast or policy instructions.
5. **Trace and reproduce:** scientific source URL, sample period, units, JSON/CSV/printable report, educational glossary, MODIS/GIBS visual layers and separately labeled USGS/NASA EONET event contexts.

**Generative AI:** not operational. A voluntary request UI and separately staged private PHP adapter exist but require server setup/security, external model credentials, privacy and cost controls. Do not pitch the current MVP as “AI-powered” or claim generated advice is scientifically verified.

**GitHub QA as of EXP-013:** [137/137 source tests passed](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43797114489); [ES/EN desktop/mobile Chromium local acceptance passed](https://github.com/NorlanRBarrantes/TELLURIS/actions/runs/43797114547). These are engineering checks, not proof of source physical truth or live BanaHosting release.

## Why it matters, and what is still only *potential* impact

**Demonstrated capability:** TELLURIS converts authentic NASA model-grid records into accessible, reusable, source-attributed comparisons. It can also expose data-quality failures and disclose that apparent trends are inconclusive. The MODIS negative screening result is an authentic documented example of a bad research-site choice being caught rather than concealed.

**Plausible future benefits (not measured):** increase environmental evidence literacy; make Earth-science investigations more accessible in Spanish and English; enable students, educators and local researchers to examine climate and water hypotheses; reduce unsupported interpretations and help frame independent validation before any policy, agriculture, heat or water-management decision.

**Not demonstrated:** faster decisions in a controlled study, stakeholder adoption, improved climate outcomes, verified causal mechanisms, a validated regional climate dipole, accurate hazard prediction, or end-to-end live scientific results for all 49 research catalog topics. No estimated impact percentage or number of beneficiaries should be invented.

## Reproducible judge demonstration — 60–90 seconds live

1. **Problem (10 s):** “NASA has immense Earth data. A visual trend is not necessarily a reliable conclusion. TELLURIS helps investigate the difference.”
2. **What/where (10–15 s):** Open the bilingual Explorer, choose **one variable / two locations**, Liberia and Limón, 1985–2025, and select **T2M**.
3. **Real input (10–15 s):** Use **verified NASA archive** if the external API is slow. Show 41 observed annual values at each point, the exact original data-source URL and time range.
4. **How much (15 s):** Show the descriptive signed slopes for the two model-grid samples and open the advanced investigation to inspect the unadjusted inferential tests and source-data limitations. Do not assert opposing **validated climate changes**.
5. **Why trust it (15 s):** Explain that the project also rejected an unsuitable coast/ocean MODIS vegetation pixel and did not hide extraordinary precipitation estimates without independent validation.
6. **Impact (10 s):** Show the selected-variable KPI and explanation: “We turn NASA observations into evidence people can examine, question, reproduce and improve.”
7. **Final warning:** The free-form AI request is optional and **not active**; use the deterministic explanation. The public domain must be checked after actual cPanel deployment. Submit through the NASA Project tab, not merely by publishing GitHub.

## Answers to likely judge questions

**“What did you solve?”** A guided, auditable path from NASA Earth observations to location/time-aligned trends, numerical estimates and explicitly bounded statistical evidence.

**“How do you know your data are real?”** We linked original NASA POWER responses with SHA-256 fingerprints, archived source-derived observations and checked independent calculations with SciPy. We also documented a *failed* MODIS pixel suitability test.

**“Did you prove climate change in Liberia or Limón?”** No. We measured exploratory slopes in NASA model/grid products; physical product consistency, serial dependence and independent climatological validation remain open. The project deliberately distinguishes suggestive from established evidence.

**“What makes it more than a dashboard?”** It performs source-aware acquisition, type-specific aggregation, pairwise matched-year comparison, statistics, QA, uncertainty disclosure, educational interpretation and reproducible export. Some source families remain an explicit roadmap.

**“Where is the social impact?”** Accessible scientific literacy and evidence-informed research are the intended pathways; usability studies, real adoption and measured outcomes are future validation work. We do not claim unobserved impact.

**“Does AI decide what is true?”** No. The analytical core is deterministic. Future generative AI may articulate bounded hypotheses but cannot replace numerical/statistical validation.

## What judges should verify vs what they should not assume

| Dimension | Current evidence | State |
| --- | --- | --- |
| Problem and NASA challenge alignment | Official NASA challenge + functional web source | **Supported** |
| Real NASA case | Original EXP-001 NASA POWER 1985–2025 + hash/run | **Supported for two variables/two points** |
| Numerical reproducibility | SciPy source comparisons + automated suites | **Supported at stated precision** |
| Significance/cause | Exploratory tests, unverified temporal/product assumptions | **Not established as a physical climate claim** |
| Data-quality audit | Original MODIS land/water QA and predeclared candidate study | **Demonstrated as separate experimental evidence** |
| Live browser deployment | GitHub static test and local Chromium; operator must check domain | **Not yet independently verified for latest commit** |
| Generative LLM | Private endpoint candidate and frontend opt-in | **Not enabled** |
| Societal impact | Target audience and plausible learning/research value | **Proposed, not measured** |

## 30-second English narrative (optional voiceover, no unsupported findings)

> “Earth is changing. But a trend is not automatically a discovery. TELLURIS turns real NASA observations into transparent investigations: choose a variable, compare locations, measure change and question significance. In Costa Rica, forty-one years of model data revealed contrasting temperature estimates — and raised important questions about data quality. We even caught a satellite pixel unsuitable for vegetation analysis. Because better decisions begin with better evidence. TELLURIS. Investigate Earth, responsibly.”

### Grounded references

- [Official 2026 NASA challenge](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)
- [EXP-001 source acquisition, aggregation and QA](EXPERIMENT-001.md)
- [EXP-005 significance qualifications and SciPy checks](EXP-005-SIGNIFICANCE.md)
- [EXP-003C/D MODIS source-quality case](EXP-003C-SPATIAL-PRESCREEN.md)
- [EXP-013 readable evidence and optional AI gate](EXP-013-EVIDENCE-DECISIONS-AI.md)
- [Full team catalog / future work](FUTURE-VERSIONS-ROADMAP.md)
- [Current NASA submission checklist](SUBMISSION.md)
